"""Retrieval evaluation: `uv run eval [--mode bm25|vector|hybrid|all] [-k 5] [--details]`.

Metrics per question, computed on the *documents* behind the top-k chunks:
- recall@k: share of expected docs that appear in the top k
- MRR:      1 / rank of the first expected doc (0 if none appears)
"""

import argparse
import sys
from collections import defaultdict
from pathlib import Path

import yaml

from indexer import store
from indexer.search import search

QUESTIONS = Path(__file__).resolve().parent / "questions.yaml"
CATEGORIES = ["synonym", "cross-lingual", "exact-identifier", "multi-doc"]


def score_question(expected: list[str], retrieved_docs: list[str]) -> tuple[float, float]:
    unique = list(dict.fromkeys(retrieved_docs))
    recall = len(set(expected) & set(unique)) / len(expected)
    rr = next((1.0 / rank for rank, d in enumerate(unique, start=1) if d in expected), 0.0)
    return recall, rr


def evaluate(mode: str, k: int, questions: list[dict]) -> tuple[dict, list[tuple]]:
    per_category = defaultdict(list)
    misses = []
    for q in questions:
        docs = [r.doc_id for r in search(q["question"], mode, k)]
        recall, rr = score_question(q["expected"], docs)
        per_category[q["category"]].append((recall, rr))
        if recall < 1.0:
            misses.append((q["id"], q["question"], q["expected"], list(dict.fromkeys(docs))))
    return per_category, misses


def summarize(values: list[tuple[float, float]]) -> tuple[float, float]:
    n = max(len(values), 1)
    return sum(v[0] for v in values) / n, sum(v[1] for v in values) / n


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate retrieval quality.")
    parser.add_argument("--mode", choices=["bm25", "vector", "hybrid", "all"], default="all")
    parser.add_argument("-k", type=int, default=5)
    parser.add_argument("--details", action="store_true", help="list questions that missed")
    args = parser.parse_args()

    if not store.DB_PATH.exists():
        sys.exit("No index found. Run `uv run index` first.")
    questions = yaml.safe_load(QUESTIONS.read_text(encoding="utf-8"))["questions"]
    modes = ["bm25", "vector", "hybrid"] if args.mode == "all" else [args.mode]

    results = {}
    for mode in modes:
        try:
            results[mode] = evaluate(mode, args.k, questions)
        except NotImplementedError as exc:
            print(f"[{mode}] not available yet: {exc} is still a TODO")
    if not results:
        sys.exit(1)

    with store.connect() as conn:
        s = store.settings(conn)
    print(f"k={args.k}  chunk_size={s.get('chunk_size')}  overlap={s.get('overlap')}  "
          f"questions={len(questions)}\n")
    header = f"{'category':<17}{'n':>3}" + "".join(f"  {m + ' R@' + str(args.k):>12}{'MRR':>6}" for m in results)
    print(header)
    print("-" * len(header))
    counts = defaultdict(int)
    for q in questions:
        counts[q["category"]] += 1
    for cat in CATEGORIES + ["overall"]:
        cells = ""
        for mode, (per_category, _) in results.items():
            values = (
                [v for vs in per_category.values() for v in vs] if cat == "overall" else per_category[cat]
            )
            recall, mrr = summarize(values)
            cells += f"  {recall:>12.2f}{mrr:>6.2f}"
        n = len(questions) if cat == "overall" else counts[cat]
        if cat == "overall":
            print("-" * len(header))
        print(f"{cat:<17}{n:>3}{cells}")

    if args.details:
        for mode, (_, misses) in results.items():
            print(f"\nMisses [{mode}]:")
            for qid, question, expected, got in misses:
                print(f"  {qid} {question}\n     expected {expected}\n     got      {got}")
