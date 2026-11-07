"""Command line entry points: `uv run index` and `uv run search`."""

import argparse
import sys
import time

from indexer import store
from indexer.chunking import CHUNKERS
from indexer.config import (CORPUS_DIR, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, MAIN_VARIANT, MODELS,
                            VARIANTS, Variant, variant)
from indexer.corpus import load_corpus


def build_index(v: Variant, chunk_size: int, overlap: int) -> None:
    from indexer.embeddings import embed

    started = time.monotonic()
    docs = load_corpus()
    chunker = CHUNKERS[v.chunking]
    chunks = [c for d in docs for c in chunker(d, chunk_size, overlap)]
    vectors = embed([c.text for c in chunks], v.model, kind="passage")
    store.build(
        docs,
        chunks,
        vectors,
        {"variant": v.name, "chunking": v.chunking, "chunk_size": chunk_size, "overlap": overlap,
         "model": v.model.name},
        v.db_path,
    )
    avg = sum(len(c.text) for c in chunks) / max(len(chunks), 1)
    print(
        f"[{v.name}] indexed {len(docs)} docs -> {len(chunks)} chunks "
        f"(avg {avg:.0f} chars) in {time.monotonic() - started:.1f}s -> {v.db_path.name}"
    )


def resolve_variant(name: str | None, chunking: str | None, model: str | None) -> Variant:
    if name:
        if name not in VARIANTS:
            sys.exit(f"unknown variant {name!r}; known: {', '.join(VARIANTS)}")
        return VARIANTS[name]
    if chunking or model:
        return variant(chunking or MAIN_VARIANT.chunking, model or MAIN_VARIANT.model.key)
    return MAIN_VARIANT


def index_main() -> None:
    parser = argparse.ArgumentParser(description="Chunk, embed and index the corpus.")
    parser.add_argument("--variant", help=f"one of: {', '.join(VARIANTS)} (default: {MAIN_VARIANT.name})")
    parser.add_argument("--chunking", choices=sorted(CHUNKERS))
    parser.add_argument("--model", choices=sorted(MODELS), help="embedding model")
    parser.add_argument("--all", action="store_true", help="build every variant (for `uv run eval`)")
    parser.add_argument("--chunk-size", type=int, default=DEFAULT_CHUNK_SIZE, help="characters")
    parser.add_argument("--overlap", type=int, default=DEFAULT_OVERLAP, help="characters")
    parser.add_argument("--download-only", action="store_true", help="only fetch the model(s)")
    args = parser.parse_args()

    targets = list(VARIANTS.values()) if args.all else [
        resolve_variant(args.variant, args.chunking, args.model)]
    if args.download_only:
        from indexer.embeddings import download_model

        for m in {v.model for v in targets}:
            download_model(m)
            print(f"model ready: {m.name}")
        return
    if not any(CORPUS_DIR.glob("*.md")):
        sys.exit(f"No corpus in {CORPUS_DIR}. Run `uv run fetch` and `uv run convert` first.")
    for v in targets:
        build_index(v, args.chunk_size, args.overlap)


def search_main() -> None:
    parser = argparse.ArgumentParser(description="Search the indexed corpus.")
    parser.add_argument("query")
    parser.add_argument("--mode", choices=["bm25", "vector", "hybrid"], default="hybrid")
    parser.add_argument("--variant", help=f"default: {MAIN_VARIANT.name}")
    parser.add_argument("-k", type=int, default=5)
    args = parser.parse_args()

    from indexer.search import search

    v = resolve_variant(args.variant, None, None)
    if not v.db_path.exists():
        sys.exit(f"No index {v.db_path.name}. Run `uv run index --variant {v.name}` first.")
    for rank, r in enumerate(search(args.query, args.mode, args.k, v), start=1):
        heading = f" > {r.heading_path}" if r.heading_path else ""
        snippet = " ".join(r.text.split())[:160]
        print(f"{rank}. [{r.score:.3f}] {r.doc_id}{heading} ({r.lang})\n   {snippet}")
