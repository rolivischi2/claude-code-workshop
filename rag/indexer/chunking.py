"""Splits documents into chunks for indexing."""

import re
from dataclasses import dataclass

from indexer.corpus import Document


@dataclass(frozen=True)
class Chunk:
    doc_id: str
    index: int  # position of the chunk within its document
    heading_path: str  # e.g. "Rollback > Ablauf"; empty if unknown
    lang: str
    text: str  # the text that gets embedded and indexed


HEADING = re.compile(r"^(#{1,3})\s+(.+?)\s*$")
MIN_SECTION = 80  # characters; shorter sections are merged into the next one


def split_sections(body: str) -> list[tuple[str, str]]:
    """Splits markdown into (heading_path, section_text) pairs along #, ## and ### headings.

    heading_path joins the enclosing headings, e.g. "Rollback einer Produktivsetzung > Ablauf".
    section_text is the text below the heading (without the heading line itself).
    """
    sections: list[tuple[str, str]] = []
    path: list[str] = []
    lines: list[str] = []

    def flush() -> None:
        text = "\n".join(lines).strip()
        if text:
            sections.append((" > ".join(path), text))
        lines.clear()

    for line in body.splitlines():
        match = HEADING.match(line)
        if match:
            flush()
            level = len(match.group(1))
            path[:] = path[: level - 1] + [match.group(2)]
        else:
            lines.append(line)
    flush()
    return sections


def _split_oversized(unit: str, chunk_size: int) -> list[str]:
    if len(unit) <= chunk_size:
        return [unit]
    parts: list[str] = []
    for line in (l for l in unit.split("\n") if l.strip()):
        while len(line) > chunk_size:
            cut = line.rfind(" ", 0, chunk_size)
            cut = cut if cut > chunk_size // 2 else chunk_size
            parts.append(line[:cut])
            line = line[cut:].lstrip()
        parts.append(line)
    return parts


def split_long_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Splits text that is longer than chunk_size at paragraph or sentence boundaries,
    carrying `overlap` characters of context from the previous piece."""
    if len(text) <= chunk_size:
        return [text]
    units = [u for u in re.split(r"(?<=[.!?])\s+|\n\s*\n", text) if u.strip()]
    # Real documents have units without any sentence end (long lists, table rows): cut those
    # at line breaks first, then at word boundaries, so no chunk grows far beyond chunk_size.
    units = [piece for u in units for piece in _split_oversized(u, chunk_size)]
    pieces: list[str] = []
    current = ""
    for unit in units:
        if current and len(current) + len(unit) + 1 > chunk_size:
            pieces.append(current.strip())
            tail = current[-overlap:] if overlap else ""
            current = tail[tail.find(" ") + 1 :] if " " in tail else ""  # start at a word boundary
        current = f"{current} {unit}" if current else unit
    if current.strip():
        pieces.append(current.strip())
    return pieces


def chunk_fixed(doc: Document, chunk_size: int, overlap: int) -> list[Chunk]:
    """Naive fixed-size split: cuts every `chunk_size` characters, ignoring structure.

    Kept as the baseline variant ("fixed+MiniLM") to measure what heading-aware chunking brings.
    """
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")
    text = doc.body
    chunks = []
    step = chunk_size - overlap
    for i, start in enumerate(range(0, max(len(text) - overlap, 1), step)):
        piece = text[start : start + chunk_size].strip()
        if piece:
            chunks.append(Chunk(doc.id, len(chunks), "", doc.lang, piece))
    return chunks


def fixed_spans(text: str, chunk_size: int, overlap: int) -> list[tuple[int, int]]:
    """Character spans that chunk_fixed cuts out of `text` (used by the visualisation)."""
    step = chunk_size - overlap
    return [(s, min(s + chunk_size, len(text))) for s in range(0, max(len(text) - overlap, 1), step)]


def chunk_document(doc: Document, chunk_size: int, overlap: int) -> list[Chunk]:
    """Heading-aware chunking: a chunk never mixes two sections.

    - Each section is split further only if it exceeds chunk_size (at paragraph/sentence borders).
    - Sections shorter than MIN_SECTION characters (one-line intros) are merged into the next
      section, so they do not become tiny, context-free chunks.
    - The heading path is prepended to the chunk text ("contextual chunk header"): a chunk like
      "Entscheid innert 15 Minuten" otherwise never says that it is about a rollback.
    """
    merged: list[tuple[str, str]] = []
    carry = ""
    for heading_path, text in split_sections(doc.body):
        text = f"{carry}\n\n{text}".strip() if carry else text
        if len(text) < MIN_SECTION:
            carry = text
            continue
        merged.append((heading_path, text))
        carry = ""
    if carry:  # short trailing section: attach to the previous one
        if merged:
            last_path, last_text = merged.pop()
            merged.append((last_path, f"{last_text}\n\n{carry}"))
        else:
            merged.append(("", carry))

    chunks: list[Chunk] = []
    for heading_path, text in merged:
        header = heading_path or doc.title
        for piece in split_long_text(text, chunk_size, overlap):
            chunks.append(Chunk(doc.id, len(chunks), heading_path, doc.lang, f"{header}\n{piece}"))
    return chunks


CHUNKERS = {"heading": chunk_document, "fixed": chunk_fixed}
