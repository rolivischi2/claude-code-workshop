"""Loads the markdown corpus and its front matter."""

from dataclasses import dataclass
from pathlib import Path

import yaml

from indexer.config import CORPUS_DIR


@dataclass(frozen=True)
class Document:
    id: str
    title: str
    lang: str
    tags: list[str]
    path: str
    body: str  # markdown without front matter
    url: str = ""  # original source (PDF) of a converted document
    pages: int = 0


def parse_document(path: Path, root: Path = CORPUS_DIR) -> Document:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        raise ValueError(f"{path}: missing front matter")
    _, front, body = raw.split("---", 2)
    meta = yaml.safe_load(front)
    return Document(
        id=meta["id"],
        title=meta["title"],
        lang=meta["lang"],
        tags=list(meta.get("tags", [])),
        path=path.relative_to(root).as_posix(),
        body=body.strip(),
        url=meta.get("url", ""),
        pages=int(meta.get("pages", 0)),
    )


def load_corpus(root: Path = CORPUS_DIR) -> list[Document]:
    docs = [parse_document(p, root) for p in sorted(root.rglob("*.md"))]
    ids = [d.id for d in docs]
    duplicates = {i for i in ids if ids.count(i) > 1}
    if duplicates:
        raise ValueError(f"duplicate doc ids: {sorted(duplicates)}")
    return docs
