"""Local embedding models (no external API). Downloaded once into rag/.cache/fastembed."""

from functools import lru_cache
from typing import Literal

import numpy as np

from indexer.config import MAIN_VARIANT, MODEL_CACHE_DIR, EmbeddingModel


@lru_cache(maxsize=2)
def _model(name: str):
    from fastembed import TextEmbedding  # slow import, load only when needed

    try:  # already downloaded: never touch the network (works offline / behind proxies)
        return TextEmbedding(model_name=name, cache_dir=str(MODEL_CACHE_DIR), local_files_only=True)
    except Exception:
        return TextEmbedding(model_name=name, cache_dir=str(MODEL_CACHE_DIR))


def embed(texts: list[str], model: EmbeddingModel = MAIN_VARIANT.model,
          kind: Literal["query", "passage"] = "passage") -> np.ndarray:
    """Returns L2-normalised float32 vectors, one row per text.

    `kind` selects the model's prefix (e5: "query: " for search queries, "passage: " for chunks).
    """
    prefix = model.query_prefix if kind == "query" else model.passage_prefix
    vectors = np.array(
        list(_model(model.name).embed([prefix + t for t in texts], batch_size=32)),
        dtype=np.float32,
    )
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    return vectors / np.maximum(norms, 1e-12)


def download_model(model: EmbeddingModel = MAIN_VARIANT.model) -> None:
    """Forces the model download (used by setup so the demo runs offline)."""
    embed(["warm-up"], model)
