"""`uv run convert`: turns the downloaded PDFs into Markdown files with front matter.

Input:  rag/.cache/sources/<id>.pdf   (from `uv run fetch`)
Output: rag/.cache/corpus/<id>.md     (read by `uv run index` via corpus.load_corpus)

pymupdf4llm does the heavy lifting (text, headings from font sizes, tables). The rest of this
module removes the noise that would otherwise end up in every chunk, and makes the headings
usable for the heading-aware chunker:

- page headers/footers (lines repeated on many pages) and page numbers ("12/71")
- tables of contents (dot leaders "Allgemeines ........ 13")
- markdown tables: one paragraph per row, so the chunker can split long tables between rows
- headings: levels from the section number ("4.2.1 Titel" -> ###), because pymupdf4llm gives
  almost every heading in these PDFs the same level; unnumbered sub-headings hang below the
  current numbered section; numbered lines that pymupdf4llm missed are promoted to headings
"""

import argparse
import re
import sys
from collections import Counter
from pathlib import Path

import yaml

from indexer.config import CORPUS_DIR, SOURCES_DIR
from indexer.fetch import load_sources, pdf_path

PAGE_NUMBER = re.compile(r"^(?:Seite\s+|Page\s+|Pagina\s+)?\d{1,3}\s*(?:/|von|de|di|sur)\s*\d{1,3}$", re.I)
BARE_NUMBER = re.compile(r"^\d{1,3}$")
DOT_LEADER = re.compile(r"(?:\.\s?){6,}|…{2,}|_{6,}")
MD_HEADING = re.compile(r"^(#{1,6})\s+(.*)$")
NUMBERED = re.compile(r"^(\d{1,2}(?:\.\d{1,2}){0,4})\.?\s+(\S.*)$")
# Lines pymupdf4llm did not mark as headings but which are clearly section titles: "4.2.1 Titel"
# (at least two number levels, short, starts with a capital, no full stop at the end).
PROMOTE = re.compile(r"^(\d{1,2}(?:\.\d{1,2}){1,3})\s+([A-ZÄÖÜ«„].{2,90})$")
TABLE_SEPARATOR = re.compile(r"^\|?\s*:?-{3,}")
HEADER_SHARE = 0.3  # a line on >= 30 % of the pages (and >= 3 pages) is a running header/footer


def plain(text: str) -> str:
    """Removes markdown emphasis and line-break tags from a piece of text."""
    text = re.sub(r"(\w)-<br>(\w)", r"\1\2", text)  # hyphenated word split across lines
    text = text.replace("<br>", " ")
    text = re.sub(r"<sup>.*?</sup>", "", text)  # footnote markers
    text = re.sub(r"</?[a-z]+>", "", text)  # <u>, <i>, ... from underlined/linked text
    text = text.replace("**", "")
    text = re.sub(r"(?<!\w)_(.+?)_(?!\w)", r"\1", text)
    return " ".join(text.split())


def header_key(line: str) -> str:
    return re.sub(r"[#*_\s]+", " ", line).strip().lower()


def find_running_lines(pages: list[str]) -> set[str]:
    """Lines (normalised) that repeat on many pages: running headers and footers."""
    if len(pages) < 3:
        return set()
    counts = Counter()
    for page in pages:
        keys = {header_key(l) for l in page.splitlines() if l.strip() and not l.startswith("|")}
        counts.update(k for k in keys if len(k) < 120)
    threshold = max(3, HEADER_SHARE * len(pages))
    return {k for k, n in counts.items() if n >= threshold}


def convert_table(rows: list[str]) -> list[str]:
    """One paragraph per table row: 'NT015 | Warenanmeldung Durchfuhr | Déclaration ...'."""
    out = []
    for row in rows:
        if TABLE_SEPARATOR.match(row.strip("| ")) or set(row) <= set("|-: "):
            continue
        cells = [plain(c) for c in row.strip().strip("|").split("|")]
        cells = [c for c in cells if c]
        if cells and not PAGE_NUMBER.match(" ".join(cells)):
            out.extend([" | ".join(cells), ""])
    return out


def clean_lines(lines: list[str], running: set[str]) -> list[str]:
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()
        if stripped.startswith("|"):
            block = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                block.append(lines[i].strip())
                i += 1
            if sum(bool(DOT_LEADER.search(r)) for r in block) * 2 >= len(block):
                continue  # table of contents rendered as a table
            out.extend(convert_table([r for r in block if not DOT_LEADER.search(r)]))
            continue
        i += 1
        key = header_key(stripped)
        if not key:
            out.append("")
        elif key in running or PAGE_NUMBER.match(key) or BARE_NUMBER.match(key):
            continue
        elif DOT_LEADER.search(stripped):
            continue  # table of contents line
        else:
            out.append(line[: len(line) - len(line.lstrip())] + plain(stripped))
    return out


def fix_headings(lines: list[str]) -> list[str]:
    out: list[str] = []
    level = 0  # level of the current numbered section, 0 = none yet
    for line in lines:
        match = MD_HEADING.match(line)
        text = plain(match.group(2)).strip(" „“:") if match else ""
        if not match:
            promote = PROMOTE.match(plain(line))
            if promote and not plain(line).endswith((".", ";", ",")) and len(plain(line)) < 100:
                text = plain(line)
            else:
                out.append(line)
                continue
        if not text:
            continue
        numbered = NUMBERED.match(text)
        if numbered and len(text) < 160:
            level = min(numbered.group(1).count(".") + 1, 3)
            out.extend([f"{'#' * level} {text}", ""])
        elif level == 0:
            out.extend([f"# {text}", ""])  # title page / preface before section 1
        elif level < 3:
            out.extend([f"{'#' * (level + 1)} {text}", ""])
        else:
            out.extend([text, ""])  # deeper than ### : keep as plain paragraph
    return out


def to_markdown(pdf: Path) -> tuple[str, int]:
    import pymupdf4llm  # slow import

    pages = pymupdf4llm.to_markdown(str(pdf), page_chunks=True, show_progress=False)
    texts = [p["text"] for p in pages]
    running = find_running_lines(texts)
    lines = [l for t in texts for l in t.splitlines()]
    lines = fix_headings(clean_lines(lines, running))
    body = "\n".join(lines)
    body = re.sub(r"\*\*", "", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    return body + "\n", len(pages)


def write_document(source: dict, body: str, pages: int, corpus_dir: Path = CORPUS_DIR) -> Path:
    front = {
        "id": source["id"],
        "title": source["title"],
        "lang": source["lang"],
        "tags": ["bazg", "transit", *source.get("tags", [])],
        "url": source["url"],
        "pages": pages,
    }
    target = corpus_dir / f"{source['id']}.md"
    header = yaml.safe_dump(front, allow_unicode=True, sort_keys=False)
    target.write_text(f"---\n{header}---\n\n{body}", encoding="utf-8")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert the source PDFs to Markdown.")
    parser.add_argument("--only", nargs="*", help="source ids to convert (default: all)")
    args = parser.parse_args()

    CORPUS_DIR.mkdir(parents=True, exist_ok=True)
    sources = [s for s in load_sources() if not args.only or s["id"] in args.only]
    missing = [s["id"] for s in sources if not pdf_path(s).exists()]
    if missing:
        sys.exit(f"missing PDFs in {SOURCES_DIR}: {', '.join(missing)}. Run `uv run fetch` first.")
    if not args.only:  # drop stale files of sources that were removed from sources.yaml
        wanted = {f"{s['id']}.md" for s in sources}
        for old in CORPUS_DIR.glob("*.md"):
            if old.name not in wanted:
                old.unlink()
    for s in sources:
        body, pages = to_markdown(pdf_path(s))
        target = write_document(s, body, pages)
        headings = sum(1 for l in body.splitlines() if l.startswith("#"))
        print(f"ok    {s['id']:<44} {pages:>4} pages {len(body):>7} chars {headings:>4} headings")
