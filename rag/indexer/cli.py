"""Command line entry points: `uv run index` and `uv run search`."""

import argparse
import sys
import time

from indexer import store
from indexer.chunking import chunk_document
from indexer.config import DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, EMBEDDING_MODEL
from indexer.corpus import load_corpus


def index_main() -> None:
    parser = argparse.ArgumentParser(description="Chunk, embed and index the corpus.")
    parser.add_argument("--chunk-size", type=int, default=DEFAULT_CHUNK_SIZE, help="characters")
    parser.add_argument("--overlap", type=int, default=DEFAULT_OVERLAP, help="characters")
    parser.add_argument("--download-only", action="store_true", help="only fetch the model")
    args = parser.parse_args()

    from indexer.embeddings import download_model, embed

    if args.download_only:
        download_model()
        print(f"model ready: {EMBEDDING_MODEL}")
        return

    started = time.monotonic()
    docs = load_corpus()
    chunks = [c for d in docs for c in chunk_document(d, args.chunk_size, args.overlap)]
    vectors = embed([c.text for c in chunks])
    store.build(
        docs,
        chunks,
        vectors,
        {"chunk_size": args.chunk_size, "overlap": args.overlap, "model": EMBEDDING_MODEL},
    )
    avg = sum(len(c.text) for c in chunks) / max(len(chunks), 1)
    print(
        f"indexed {len(docs)} docs -> {len(chunks)} chunks "
        f"(avg {avg:.0f} chars) in {time.monotonic() - started:.1f}s"
    )


def search_main() -> None:
    parser = argparse.ArgumentParser(description="Search the indexed corpus.")
    parser.add_argument("query")
    parser.add_argument("--mode", choices=["bm25", "vector", "hybrid"], default="hybrid")
    parser.add_argument("-k", type=int, default=5)
    args = parser.parse_args()

    from indexer.search import search

    if not store.DB_PATH.exists():
        sys.exit("No index found. Run `uv run index` first.")
    for rank, r in enumerate(search(args.query, args.mode, args.k), start=1):
        heading = f" > {r.heading_path}" if r.heading_path else ""
        snippet = " ".join(r.text.split())[:160]
        print(f"{rank}. [{r.score:.3f}] {r.doc_id}{heading} ({r.lang})\n   {snippet}")
