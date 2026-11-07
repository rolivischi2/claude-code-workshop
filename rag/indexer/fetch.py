"""`uv run fetch`: downloads the source PDFs listed in rag/sources.yaml into rag/.cache/sources/.

- Skips files that already exist (and match the recorded sha256).
- Verifies the sha256 from sources.yaml; an empty sha256 is filled in after the first download
  (`--update-hashes` also overwrites mismatching ones, e.g. when the BAZG publishes a new version).
- Honours HTTPS_PROXY / HTTP_PROXY / NO_PROXY (urllib reads them from the environment).
"""

import argparse
import hashlib
import sys
import urllib.request
from pathlib import Path

import yaml

from indexer.config import SOURCES_DIR, SOURCES_FILE

USER_AGENT = "workshop-rag-fetch/1.0"


def load_sources(path: Path = SOURCES_FILE) -> list[dict]:
    sources = yaml.safe_load(path.read_text(encoding="utf-8"))["sources"]
    ids = [s["id"] for s in sources]
    duplicates = {i for i in ids if ids.count(i) > 1}
    if duplicates:
        raise ValueError(f"duplicate source ids: {sorted(duplicates)}")
    return sources


def pdf_path(source: dict) -> Path:
    return SOURCES_DIR / f"{source['id']}.pdf"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def download(url: str, target: Path) -> None:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:  # proxies from env
        data = response.read()
        ctype = response.headers.get("Content-Type", "")
    if not data.startswith(b"%PDF"):
        raise ValueError(f"not a PDF (Content-Type {ctype!r}); the link probably moved")
    tmp = target.with_suffix(".part")
    tmp.write_bytes(data)
    tmp.replace(target)


def record_hashes(hashes: dict[str, str], path: Path = SOURCES_FILE) -> None:
    """Writes sha256 values into sources.yaml in place (keeps comments and order)."""
    lines = path.read_text(encoding="utf-8").splitlines(keepends=True)
    current = None
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("- id:"):
            current = stripped.split(":", 1)[1].strip()
        elif stripped.startswith("sha256:") and current in hashes:
            indent = line[: len(line) - len(line.lstrip())]
            lines[i] = f'{indent}sha256: "{hashes[current]}"\n'
    path.write_text("".join(lines), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Download the BAZG source PDFs.")
    parser.add_argument("--only", nargs="*", help="source ids to fetch (default: all)")
    parser.add_argument("--update-hashes", action="store_true",
                        help="accept and record new sha256 values for changed files")
    args = parser.parse_args()

    SOURCES_DIR.mkdir(parents=True, exist_ok=True)
    sources = [s for s in load_sources() if not args.only or s["id"] in args.only]
    new_hashes: dict[str, str] = {}
    failed = []
    for s in sources:
        target = pdf_path(s)
        expected = (s.get("sha256") or "").strip()
        status = "cached"
        if not target.exists() or (expected and sha256(target) != expected and args.update_hashes):
            try:
                download(s["url"], target)
                status = "downloaded"
            except Exception as exc:  # report and continue with the other sources
                print(f"FAIL  {s['id']}: {exc}")
                failed.append(s["id"])
                continue
        actual = sha256(target)
        if not expected or (actual != expected and args.update_hashes):
            new_hashes[s["id"]] = actual
        elif actual != expected:
            print(f"FAIL  {s['id']}: sha256 mismatch (file changed upstream?). "
                  f"Delete {target.name} or run with --update-hashes.")
            failed.append(s["id"])
            continue
        print(f"ok    {s['id']:<44} {status:<10} {target.stat().st_size / 1024:>7.0f} kB")
    if new_hashes:
        record_hashes(new_hashes)
        print(f"recorded sha256 for {len(new_hashes)} source(s) in {SOURCES_FILE.name}")
    if failed:
        sys.exit(f"{len(failed)} source(s) failed: {', '.join(failed)}")
