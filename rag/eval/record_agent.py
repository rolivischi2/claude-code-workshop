"""`uv run record-agent`: records real Claude Code runs (agentic search) for the showcase questions.

For each question with `showcase: true` in questions.yaml it runs

    claude -p "<question + instruction>" --output-format stream-json --verbose --model sonnet
           --max-turns 12 --allowedTools "Grep Glob Read"

with cwd = rag/.cache/corpus (the converted Markdown), so Claude can only grep and read the corpus,
and saves the parsed stream to rag/.cache/agent-runs.json (read by `uv run export-viz`).

Extra flags keep the run comparable and free of personal setup: only the three tools exist
(--tools), no MCP servers (--strict-mcp-config), no user settings/plugins/hooks
(--setting-sources project,local), no skills (--disable-slash-commands), no saved session.

Each run costs real usage. Existing runs are kept; use --force to record them again.
"""

import argparse
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path

from eval.evaluate import load_questions
from indexer.config import CACHE_DIR, CORPUS_DIR

OUTPUT = CACHE_DIR / "agent-runs.json"
MODEL = "sonnet"
MAX_TURNS = 12
TOOLS = ["Grep", "Glob", "Read"]
INSTRUCTION = (
    "Beantworte die Frage ausschliesslich anhand der Markdown-Dateien im aktuellen Verzeichnis "
    "(Publikationen des BAZG zum Transitverfahren, teils auf Französisch oder Italienisch). "
    "Antworte kurz auf Deutsch und nenne für jede Aussage den Dateinamen als Quelle."
)


def command(question: str) -> list[str]:
    return [
        "claude", "-p", f"{question}\n\n{INSTRUCTION}",
        "--output-format", "stream-json", "--verbose",
        "--model", MODEL,
        "--max-turns", str(MAX_TURNS),
        "--allowedTools", " ".join(TOOLS),
        "--tools", ",".join(TOOLS),
        "--strict-mcp-config",
        "--setting-sources", "project,local",
        "--disable-slash-commands",
        "--no-session-persistence",
    ]


def describe_input(tool: str, data: dict) -> str:
    """Short, readable tool input for the visualisation, e.g. 'pattern: Plombe  glob: *.md'."""
    keys = {"Grep": ["pattern", "path", "glob", "output_mode", "-i"],
            "Glob": ["pattern", "path"],
            "Read": ["file_path", "offset", "limit"]}.get(tool, list(data))
    parts = []
    for key in keys:
        if key in data and data[key] not in (None, ""):
            value = data[key]
            if key in ("file_path", "path"):  # no absolute paths (they contain the user name)
                path = Path(str(value))
                value = path.relative_to(CORPUS_DIR).as_posix() if path.is_relative_to(CORPUS_DIR) else path.name
                value = value if value != "." else "./"
            parts.append(f"{key}: {value}")
    return "  ".join(parts)[:200]


def result_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(c.get("text", "") for c in content if isinstance(c, dict))
    return ""


def parse_stream(lines: list[str]) -> dict:
    """Turns the stream-json events into turns, tool steps, token usage and the final answer."""
    model, answer, final = "", "", {}
    usage_by_message: dict[str, dict] = {}
    steps: list[dict] = []
    pending: dict[str, dict] = {}  # tool_use_id -> step
    for line in lines:
        try:
            event = json.loads(line)
        except json.JSONDecodeError:
            continue
        kind = event.get("type")
        if kind == "system" and event.get("subtype") == "init":
            model = event.get("model", model)
        elif kind == "assistant":
            message = event.get("message", {})
            usage = message.get("usage") or {}
            context = (usage.get("input_tokens", 0) + usage.get("cache_creation_input_tokens", 0)
                       + usage.get("cache_read_input_tokens", 0))
            usage_by_message[message.get("id", str(len(usage_by_message)))] = {
                "context_tokens": context, "output_tokens": usage.get("output_tokens", 0)}
            model = message.get("model", model)
            for block in message.get("content", []):
                if block.get("type") == "tool_use":
                    step = {"n": len(steps) + 1, "tool": block.get("name", ""),
                            "input": describe_input(block.get("name", ""), block.get("input", {})),
                            "raw_input": block.get("input", {}), "result_chars": 0,
                            "context_tokens": context}
                    steps.append(step)
                    pending[block.get("id", "")] = step
                elif block.get("type") == "text" and block.get("text", "").strip():
                    answer = block["text"]
        elif kind == "user":
            for block in event.get("message", {}).get("content", []):
                if isinstance(block, dict) and block.get("type") == "tool_result":
                    step = pending.get(block.get("tool_use_id", ""))
                    if step is not None:
                        step["result_chars"] = len(result_text(block.get("content")))
                        step["is_error"] = bool(block.get("is_error"))
        elif kind == "result":
            final = event
    usage = final.get("usage") or {}
    return {
        "model": model,
        "turns": final.get("num_turns", len(usage_by_message)),
        "input_tokens": (usage.get("input_tokens", 0) + usage.get("cache_creation_input_tokens", 0)
                         + usage.get("cache_read_input_tokens", 0)),
        "output_tokens": usage.get("output_tokens", 0),
        "cost_usd": final.get("total_cost_usd"),
        "duration_s": final.get("duration_ms", 0) / 1000,
        "stop": final.get("subtype", "missing"),
        "answer": final.get("result") or answer,
        "per_message_usage": list(usage_by_message.values()),
        "steps": steps,
    }


def run_question(q: dict) -> dict:
    started = time.monotonic()
    proc = subprocess.run(command(q["question"]), cwd=CORPUS_DIR, capture_output=True, text=True,
                          timeout=900)
    run = {"question_id": q["id"], "question": q["question"], "expected": q["expected"]}
    lines = proc.stdout.splitlines()
    if proc.returncode != 0 and not lines:
        run["error"] = (proc.stderr or f"exit code {proc.returncode}").strip()[:2000]
        return run
    run.update(parse_stream(lines))
    if not run["duration_s"]:
        run["duration_s"] = time.monotonic() - started
    answer = run["answer"] or ""
    run["cited_docs"] = sorted({d for d in q["expected"] if d in answer})
    run["found_expected"] = all(d in answer for d in q["expected"])
    if proc.returncode != 0:
        run["exit_code"] = proc.returncode
        run["stderr"] = proc.stderr.strip()[:2000]
    return run


def main() -> None:
    parser = argparse.ArgumentParser(description="Record Claude Code runs for the showcase questions.")
    parser.add_argument("--only", nargs="*", help="question ids (default: all showcase questions)")
    parser.add_argument("--force", action="store_true", help="record again even if a run exists")
    args = parser.parse_args()

    if shutil.which("claude") is None:
        sys.exit("`claude` not found on PATH. Install Claude Code and log in first.")
    if not any(CORPUS_DIR.glob("*.md")):
        sys.exit(f"No corpus in {CORPUS_DIR}. Run `uv run fetch` and `uv run convert` first.")
    questions = [q for q in load_questions()
                 if (q["id"] in args.only if args.only else q["showcase"])]
    if not questions:
        sys.exit("No questions selected (mark some with `showcase: true` in questions.yaml).")

    existing = json.loads(OUTPUT.read_text(encoding="utf-8")) if OUTPUT.exists() else {"runs": []}
    runs = {r["question_id"]: r for r in existing.get("runs", [])}
    for q in questions:
        if q["id"] in runs and not runs[q["id"]].get("error") and not args.force:
            print(f"skip  {q['id']} (already recorded; --force to repeat)")
            continue
        print(f"run   {q['id']}: {q['question']}", flush=True)
        run = run_question(q)
        runs[q["id"]] = run
        OUTPUT.write_text(json.dumps({"runs": list(runs.values())}, indent=1, ensure_ascii=False),
                          encoding="utf-8")
        if run.get("error"):
            print(f"FAIL  {q['id']}: {run['error'][:300]}")
        else:
            print(f"done  {q['id']}: {run['turns']} turns, {len(run['steps'])} tool calls, "
                  f"{run['input_tokens']} in / {run['output_tokens']} out tokens, "
                  f"{run['duration_s']:.0f}s, expected docs cited: {run['found_expected']}")
    print(f"written {OUTPUT}")
