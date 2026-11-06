"""Paths and model settings shared by indexer, MCP server and eval."""

from pathlib import Path

RAG_ROOT = Path(__file__).resolve().parent.parent
CORPUS_DIR = RAG_ROOT / "corpus"
DATA_DIR = RAG_ROOT / ".data"
DB_PATH = DATA_DIR / "index.db"
MODEL_CACHE_DIR = RAG_ROOT / ".cache" / "fastembed"

# Small multilingual model (ONNX, ~220 MB). It reads at most 128 word pieces per text:
# anything beyond that is silently cut off - keep that in mind when choosing a chunk size.
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
EMBEDDING_DIM = 384

DEFAULT_CHUNK_SIZE = 400  # characters
DEFAULT_OVERLAP = 50  # characters
