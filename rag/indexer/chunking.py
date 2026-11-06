"""Splits documents into chunks for indexing."""

from dataclasses import dataclass

from indexer.corpus import Document


@dataclass(frozen=True)
class Chunk:
    doc_id: str
    index: int  # position of the chunk within its document
    heading_path: str  # e.g. "Rollback > Ablauf"; empty if unknown
    lang: str
    text: str  # the text that gets embedded and indexed


def chunk_document(doc: Document, chunk_size: int, overlap: int) -> list[Chunk]:
    """Naive fixed-size split: cuts every `chunk_size` characters, ignoring structure.

    TODO (exercise 11, R2): replace with a heading-aware chunker:
    - split along markdown headings (#, ##, ###) first, so a chunk never mixes sections
    - only split long sections further, respecting chunk_size and overlap
    - fill heading_path (e.g. "Rollback > Ablauf") for every chunk
    Then re-index and compare `uv run eval` before and after.
    """
    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size")
    text = doc.body
    chunks = []
    step = chunk_size - overlap
    for i, start in enumerate(range(0, max(len(text) - overlap, 1), step)):
        piece = text[start : start + chunk_size].strip()
        if piece:
            chunks.append(Chunk(doc.id, i, "", doc.lang, piece))
    return chunks
