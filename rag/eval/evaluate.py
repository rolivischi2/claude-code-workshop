"""Retrieval evaluation: `uv run eval [--variant NAME] [--mode bm25|vector|hybrid|all] [-k 5] [--details]`.

Without --variant, every index variant that has been built (`uv run index --all`) is evaluated.
Results are also written to rag/.data/eval-results.json (read by `uv run export-viz`).

Metrics per question, computed on the *documents* behind the top-k chunks:
- recall@k: share of expected docs that appear in the top k
- MRR:      1 / rank of the first expected doc (0 if none appears)
"""

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

import yaml

from indexer import store
from indexer.config import DATA_DIR, VARIANTS, Variant
from indexer.embeddings import embed
from indexer.search import ranked_ids

QUESTIONS = Path(__file__).resolve().parent / "questions.yaml"
RESULTS = DATA_DIR / "eval-results.json"
CATEGORIES = ["synonym", "cross-lingual", "exact-identifier", "multi-doc"]
MODES = ["bm25", "vector", "hybrid"]


def load_questions(path: Path = QUESTIONS) -> list[dict]:
    """Questions with id, category, question, expected and the optional showcase/note fields."""
    questions = yaml.safe_load(path.read_text(encoding="utf-8"))["questions"]
    for q in questions:
        if q["category"] not in CATEGORIES:
            raise ValueError(f"{q['id']}: unknown category {q['category']!r}")
        q.setdefault("showcase", False)
        q.setdefault("note", "")
        q.setdefault("note_bm25", "")
        q.setdefault("note_vector", "")
    return questions


def score_question(expected: list[str], retrieved_docs: list[str]) -> tuple[float, float]:
    unique = list(dict.fromkeys(retrieved_docs))
    recall = len(set(expected) & set(unique)) / len(expected)
    rr = next((1.0 / rank for rank, d in enumerate(unique, start=1) if d in expected), 0.0)
    return recall, rr


def evaluate(variant: Variant, modes: list[str], k: int, questions: list[dict]) -> dict:
    """Returns {mode: [ {id, category, recall, rr, docs}, ... ]} for one index variant."""
    query_vectors = embed([q["question"] for q in questions], variant.model, kind="query")
    results: dict[str, list[dict]] = {m: [] for m in modes}
    with store.connect(variant.db_path) as conn:
        for q, qv in zip(questions, query_vectors):
            for mode in modes:
                ranked = ranked_ids(conn, q["question"], mode, k, variant, query_vector=qv)
                chunks = store.load_chunks(conn, [i for i, _ in ranked])
                docs = [chunks[i][0] for i, _ in ranked if i in chunks]
                recall, rr = score_question(q["expected"], docs)
                results[mode].append({"id": q["id"], "category": q["category"], "recall": recall,
                                      "rr": rr, "docs": list(dict.fromkeys(docs))})
    return results


def summarize(rows: list[dict]) -> tuple[float, float, int]:
    n = len(rows)
    if not n:
        return 0.0, 0.0, 0
    return sum(r["recall"] for r in rows) / n, sum(r["rr"] for r in rows) / n, n


def table_rows(variant_name: str, per_mode: dict) -> list[dict]:
    """One row per (mode, category) plus category "all", the shape used by the visualisation."""
    rows = []
    for mode, results in per_mode.items():
        for cat in CATEGORIES + ["all"]:
            subset = results if cat == "all" else [r for r in results if r["category"] == cat]
            recall, mrr, n = summarize(subset)
            rows.append({"variant": variant_name, "mode": mode, "category": cat,
                         "recall": round(recall, 3), "mrr": round(mrr, 3), "n": n})
    return rows


def print_table(variant: Variant, per_mode: dict, k: int, questions: list[dict]) -> None:
    with store.connect(variant.db_path) as conn:
        s = store.settings(conn)
    print(f"\n=== {variant.name}  (model {variant.model.key}, chunking {variant.chunking}, "
          f"chunk_size={s.get('chunk_size')}, overlap={s.get('overlap')}, k={k}, "
          f"questions={len(questions)})")
    header = f"{'category':<17}{'n':>3}" + "".join(f"  {m + ' R@' + str(k):>12}{'MRR':>6}" for m in per_mode)
    print(header)
    print("-" * len(header))
    for cat in CATEGORIES + ["all"]:
        cells, n = "", 0
        for results in per_mode.values():
            subset = results if cat == "all" else [r for r in results if r["category"] == cat]
            recall, mrr, n = summarize(subset)
            cells += f"  {recall:>12.2f}{mrr:>6.2f}"
        if cat == "all":
            print("-" * len(header))
        print(f"{cat:<17}{n:>3}{cells}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate retrieval quality.")
    parser.add_argument("--variant", help=f"one of: {', '.join(VARIANTS)} (default: all built)")
    parser.add_argument("--mode", choices=MODES + ["all"], default="all")
    parser.add_argument("-k", type=int, default=5)
    parser.add_argument("--details", action="store_true", help="list questions that missed")
    args = parser.parse_args()

    if args.variant and args.variant not in VARIANTS:
        sys.exit(f"unknown variant {args.variant!r}; known: {', '.join(VARIANTS)}")
    candidates = [VARIANTS[args.variant]] if args.variant else list(VARIANTS.values())
    variants = [v for v in candidates if v.db_path.exists()]
    if not variants:
        sys.exit("No index found. Run `uv run index` (or `uv run index --all`) first.")
    questions = load_questions()
    modes = MODES if args.mode == "all" else [args.mode]

    output = {"k": args.k, "modes": modes, "categories": CATEGORIES, "variants": [], "rows": [],
              "per_question": {}}
    for v in variants:
        per_mode = evaluate(v, modes, args.k, questions)
        print_table(v, per_mode, args.k, questions)
        output["variants"].append(v.name)
        output["rows"].extend(table_rows(v.name, per_mode))
        output["per_question"][v.name] = per_mode
        if args.details:
            texts = {q["id"]: q for q in questions}
            for mode, results in per_mode.items():
                misses = [r for r in results if r["recall"] < 1.0]
                print(f"\nMisses [{v.name} / {mode}]: {len(misses)}")
                for r in misses:
                    q = texts[r["id"]]
                    print(f"  {r['id']} {q['question']}\n     expected {q['expected']}\n"
                          f"     got      {r['docs']}")
    skipped = [v.name for v in candidates if not v.db_path.exists()]
    if skipped:
        print(f"\nnot built (skipped): {', '.join(skipped)}  ->  uv run index --all")
    if args.mode == "all":
        RESULTS.parent.mkdir(parents=True, exist_ok=True)
        RESULTS.write_text(json.dumps(output, indent=1, ensure_ascii=False), encoding="utf-8")
        print(f"\nwritten: {RESULTS.relative_to(RESULTS.parent.parent)}")
