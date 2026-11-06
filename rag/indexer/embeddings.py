"""Local embedding model (no external API). Downloaded once by scripts/setup into rag/.cache."""

import os
from functools import lru_cache

import numpy as np

from indexer.config import EMBEDDING_MODEL, MODEL_CACHE_DIR


@lru_cache(maxsize=1)
def _model():
    if any(MODEL_CACHE_DIR.glob("*/snapshots/*")):
        # Model already downloaded by setup: never touch the network (works offline / behind proxies).
        os.environ.setdefault("HF_HUB_OFFLINE", "1")
    from fastembed import TextEmbedding  # slow import, load only when needed

    return TextEmbedding(model_name=EMBEDDING_MODEL, cache_dir=str(MODEL_CACHE_DIR))


def embed(texts: list[str]) -> np.ndarray:
    """Returns L2-normalised float32 vectors, one row per text."""
    vectors = np.array(list(_model().embed(texts, batch_size=32)), dtype=np.float32)
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return vectors / np.maximum(norms, 1e-12)


def download_model() -> None:
    """Forces the model download (used by setup so the workshop runs offline)."""
    embed(["warm-up"])
