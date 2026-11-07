"""Paths, embedding models and index variants shared by fetch, convert, indexer, MCP server and eval."""

import os
from dataclasses import dataclass
from pathlib import Path

RAG_ROOT = Path(__file__).resolve().parent.parent
CACHE_DIR = RAG_ROOT / ".cache"
SOURCES_FILE = RAG_ROOT / "sources.yaml"
SOURCES_DIR = CACHE_DIR / "sources"  # downloaded PDFs (BAZG, not committed)
# Converted Markdown with front matter; override with RAG_CORPUS_DIR to index another corpus.
CORPUS_DIR = Path(os.environ.get("RAG_CORPUS_DIR", CACHE_DIR / "corpus"))
DATA_DIR = RAG_ROOT / ".data"
MODEL_CACHE_DIR = CACHE_DIR / "fastembed"


@dataclass(frozen=True)
class EmbeddingModel:
    key: str  # short name used on the command line and in variant names
    name: str  # fastembed model name
    dim: int
    max_tokens: int  # everything beyond is silently cut off
    query_prefix: str = ""
    passage_prefix: str = ""


MODELS = {
    m.key: m
    for m in [
        # Small multilingual model (ONNX, ~220 MB), reads at most 128 word pieces per text.
        EmbeddingModel("MiniLM", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
                       384, 128),
        # Much larger multilingual model (~2.2 GB). Trained with "query: " / "passage: " prefixes;
        # leaving them out measurably hurts retrieval.
        EmbeddingModel("e5-large", "intfloat/multilingual-e5-large", 1024, 512,
                       query_prefix="query: ", passage_prefix="passage: "),
    ]
}


@dataclass(frozen=True)
class Variant:
    name: str  # e.g. "heading+MiniLM"
    chunking: str  # "heading" | "fixed"
    model: EmbeddingModel

    @property
    def db_path(self) -> Path:
        return DATA_DIR / f"index-{self.chunking}-{self.model.key.lower()}.db"


def variant(chunking: str, model_key: str) -> Variant:
    model = MODELS[model_key]
    return Variant(f"{chunking}+{model.key}", chunking, model)


# Every variant measured in the README. `uv run index --all` builds all of them.
VARIANTS = {v.name: v for v in [
    variant("fixed", "MiniLM"),
    variant("heading", "MiniLM"),
    variant("heading", "e5-large"),
]}
# The configuration used by `uv run search`, the MCP server and the visualisation.
# Override with RAG_VARIANT, e.g. RAG_VARIANT=heading+e5-large.
MAIN_VARIANT = VARIANTS[os.environ.get("RAG_VARIANT", "heading+MiniLM")]
DB_PATH = MAIN_VARIANT.db_path

DEFAULT_CHUNK_SIZE = 400  # characters
DEFAULT_OVERLAP = 50  # characters
