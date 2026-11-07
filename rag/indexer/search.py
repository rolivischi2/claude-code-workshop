"""Lexical (BM25), vector and hybrid search over the index."""

import sqlite3
from dataclasses import dataclass
from typing import Literal

from indexer import store
from indexer.config import MAIN_VARIANT, Variant
from indexer.embeddings import embed

Mode = Literal["bm25", "vector", "hybrid"]
# Each retriever contributes its top 2*k before fusion. Deeper lists sound better but hurt:
# a weak retriever's mid-ranked noise then appears in both lists and outvotes the other's top hit.
CANDIDATES_PER_K = 2
RRF_K = 60


@dataclass(frozen=True)
class SearchResult:
    doc_id: str
    heading_path: str
    lang: str
    text: str
    score: float


def reciprocal_rank_fusion(
    rankings: list[list[int]], k: int = RRF_K
) -> list[tuple[int, float]]:
    """Fuses several rankings of chunk ids into one, best first.

    Each ranking is a list of chunk ids ordered best-first (e.g. one from BM25, one from vectors).
    Reciprocal rank fusion only looks at *positions*, never at the raw scores, because BM25
    scores and cosine similarities live on completely different scales.

    Returns (chunk_id, fused_score) pairs sorted by fused_score descending.

    score(chunk) = sum over rankings of 1 / (k + rank), rank starting at 1. A chunk found by only
    one retriever still scores (that is the point of hybrid search). k=60 dampens the gap between
    rank 1 and rank 2, so agreement between retrievers outweighs a single top hit.
    Ties are broken by the best single rank, then by chunk id, so results are reproducible.
    """
    scores: dict[int, float] = {}
    best_rank: dict[int, int] = {}
    for ranking in rankings:
        for rank, chunk_id in enumerate(ranking, start=1):
            scores[chunk_id] = scores.get(chunk_id, 0.0) + 1.0 / (k + rank)
            best_rank[chunk_id] = min(rank, best_rank.get(chunk_id, rank))
    ordered = sorted(scores, key=lambda c: (-scores[c], best_rank[c], c))
    return [(chunk_id, scores[chunk_id]) for chunk_id in ordered]


def ranked_ids(conn: sqlite3.Connection, query: str, mode: Mode, k: int,
               variant: Variant = MAIN_VARIANT, query_vector=None) -> list[tuple[int, float]]:
    """(chunk_id, score) pairs, best first. `query_vector` skips re-embedding the query."""
    if mode == "bm25":
        return store.bm25_ids(conn, query, k)
    if query_vector is None:
        query_vector = embed([query], variant.model, kind="query")[0]
    if mode == "vector":
        return store.vector_ids(conn, query_vector, k)
    if mode == "hybrid":
        depth = CANDIDATES_PER_K * k
        lexical = [i for i, _ in store.bm25_ids(conn, query, depth)]
        semantic = [i for i, _ in store.vector_ids(conn, query_vector, depth)]
        return reciprocal_rank_fusion([lexical, semantic])[:k]
    raise ValueError(f"unknown mode: {mode}")


def search(query: str, mode: Mode = "hybrid", k: int = 5,
           variant: Variant = MAIN_VARIANT) -> list[SearchResult]:
    with store.connect(variant.db_path) as conn:
        ranked = ranked_ids(conn, query, mode, k, variant)
        chunks = store.load_chunks(conn, [i for i, _ in ranked])
    return [
        SearchResult(*chunks[row_id], score=round(score, 4))
        for row_id, score in ranked
        if row_id in chunks
    ]
