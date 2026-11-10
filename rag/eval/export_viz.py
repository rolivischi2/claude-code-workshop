"""`uv run export-viz`: writes rag/viz/data.js for the facilitator visualisation.

Shape: window.DATA = {meta, docs, chunks, chunkingDemo, questions, eval, agent}, as read by
rag/viz/viz.js. Uses the main index variant (config.MAIN_VARIANT), the eval results
of all measured variants (rag/.data/eval-results.json from `uv run eval`) and, if present, the
recorded agent runs (rag/.cache/agent-runs.json from `uv run record-agent`).

data.js contains excerpts of the BAZG documents and is therefore NOT committed (.gitignore).
"""

import json
import random
import re
import sys
import unicodedata
from collections import Counter
from datetime import datetime, timezone

import numpy as np

from eval.evaluate import RESULTS, load_questions
from eval.record_agent import describe_input
from indexer import store
from indexer.chunking import chunk_document, fixed_spans
from indexer.config import (CACHE_DIR, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP, MAIN_VARIANT,
                            RAG_ROOT)
from indexer.corpus import Document, load_corpus
from indexer.embeddings import embed
from indexer.search import CANDIDATES_PER_K, RRF_K, reciprocal_rank_fusion

OUTPUT = RAG_ROOT / "viz" / "data.js"
AGENT_RUNS = CACHE_DIR / "agent-runs.json"
TOP = 10  # ranking depth shown per mode
VECTOR_HEAD = 16  # how many of the embedding numbers are exported for display
K = 5  # recall@k used by the eval
BACKGROUND_SAMPLE = 300  # random extra chunks for the map background
SEED = 42
TEXT_CHARS = 400
# Illustrative section for the chunking scene: starts at this heading, at most DEMO_CHARS long.
DEMO_DOC = "r-14-01-gvv-de"
DEMO_HEADING = "# 5 Durchfuhrfrist"
DEMO_CHARS = 2600


def fold(text: str) -> str:
    """Lower case without diacritics, like the FTS5 tokenizer (unicode61 remove_diacritics 2)."""
    decomposed = unicodedata.normalize("NFKD", text.lower())
    return "".join(c for c in decomposed if not unicodedata.combining(c))


def display_text(text: str, heading: str, title: str) -> str:
    """Chunk text without the contextual header line the heading chunker prepends."""
    first, _, rest = text.partition("\n")
    if rest and first in (heading, title):
        text = rest
    return " ".join(text.split())[:TEXT_CHARS]


def pca_2d(vectors: np.ndarray):
    """Returns (project, coords): a projection function and the scaled 2D coordinates of `vectors`.

    PCA via SVD on the centred vectors; both axes scaled by the largest absolute value so the
    corpus fills [-1, 1]. Queries are projected with the same mean, components and scale.
    """
    mean = vectors.mean(axis=0)
    _, _, vt = np.linalg.svd(vectors - mean, full_matrices=False)
    components = vt[:2]
    raw = (vectors - mean) @ components.T
    scale = np.abs(raw).max(axis=0)

    def project(v: np.ndarray) -> np.ndarray:
        return np.clip(((v - mean) @ components.T) / scale, -1.0, 1.0)

    return project, raw / scale


def rankings(conn, question: str, query_vector) -> dict:
    """Top-TOP lists of all three modes. Hybrid fuses exactly the lists the eval fuses at k=K."""
    terms = store.query_terms(question)
    bm25 = store.bm25_ids(conn, question, TOP)
    vector = store.vector_ids(conn, query_vector, TOP)
    depth = CANDIDATES_PER_K * K
    lexical = [i for i, _ in store.bm25_ids(conn, question, depth)]
    semantic = [i for i, _ in store.vector_ids(conn, query_vector, depth)]
    hybrid = reciprocal_rank_fusion([lexical, semantic], RRF_K)[:TOP]
    return {"terms": terms, "bm25": bm25, "vector": vector, "hybrid": hybrid,
            "lexical": lexical, "semantic": semantic}


def chunking_demo(docs: dict[str, Document]) -> dict:
    doc = docs[DEMO_DOC]
    start = doc.body.index(DEMO_HEADING)
    text = doc.body[start:start + DEMO_CHARS]
    if len(text) == DEMO_CHARS:  # end at a paragraph boundary, not mid-sentence
        text = text[: text.rfind("\n\n")].rstrip()
    demo_doc = Document(doc.id, doc.title, doc.lang, doc.tags, doc.path, text)

    # Map chunk pieces back to character offsets in `text` (whitespace-insensitive search).
    norm_chars, index_map = [], []
    for i, c in enumerate(text):
        if c.isspace():
            if norm_chars and norm_chars[-1] == " ":
                continue
            c = " "
        norm_chars.append(c)
        index_map.append(i)
    norm = "".join(norm_chars)

    heading_spans, pos = [], 0
    for chunk in chunk_document(demo_doc, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP):
        piece = " ".join(chunk.text.partition("\n")[2].split())
        found = norm.find(piece, max(pos - DEFAULT_OVERLAP - 5, 0))
        if found < 0:
            continue
        pos = found + len(piece)
        heading_spans.append({"start": index_map[found],
                              "end": index_map[min(pos, len(index_map)) - 1] + 1,
                              "heading": chunk.heading_path})
    return {
        "doc": doc.id,
        "text": text,
        "fixed": [{"start": s, "end": e} for s, e in fixed_spans(text, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP)],
        "heading": heading_spans,
    }


def agent_entries(questions: dict[str, dict]) -> list[dict]:
    if not AGENT_RUNS.exists():
        return []
    runs = json.loads(AGENT_RUNS.read_text(encoding="utf-8"))
    entries = []
    for run in runs.get("runs", []):
        if run.get("error"):
            continue
        entries.append({
            "question": run["question_id"],
            "model": run.get("model", ""),
            "turns": run.get("turns", 0),
            "input_tokens": run.get("input_tokens", 0),
            "output_tokens": run.get("output_tokens", 0),
            "duration_s": round(run.get("duration_s", 0)),
            "found_expected": run.get("found_expected", False),
            "answer": (run.get("answer") or "")[:400],
            "steps": [
                {"n": s["n"], "tool": s["tool"],
                 "input": describe_input(s["tool"], s["raw_input"]) if "raw_input" in s else s["input"],
                 "result_chars": s.get("result_chars", 0),
                 "context_tokens": s.get("context_tokens", 0)}
                for s in run.get("steps", [])
            ],
        })
    known = set(questions)
    return [e for e in entries if e["question"] in known]


def main() -> None:
    v = MAIN_VARIANT
    if not v.db_path.exists():
        sys.exit(f"No index {v.db_path.name}. Run `uv run index` first.")
    if not RESULTS.exists():
        sys.exit("No eval results. Run `uv run eval` first.")
    evaluation = json.loads(RESULTS.read_text(encoding="utf-8"))
    questions = load_questions()
    docs = {d.id: d for d in load_corpus()}

    with store.connect(v.db_path) as conn:
        ids, vectors = store.all_vectors(conn)
        all_chunks = store.load_chunks(conn, ids)  # id -> (doc_id, heading, lang, text)
        project, coords = pca_2d(vectors)
        xy = {cid: coords[i] for i, cid in enumerate(ids)}
        query_vectors = embed([q["question"] for q in questions], v.model, kind="query")
        ranked = [rankings(conn, q["question"], qv) for q, qv in zip(questions, query_vectors)]

    def hit(cid: int, q: dict) -> bool:
        return all_chunks[cid][0] in q["expected"]

    out_questions, referenced, in_vector_list = [], set(), set()
    row_of = {cid: i for i, cid in enumerate(ids)}
    for q, qv, r in zip(questions, query_vectors, ranked):
        lexical_rank = {cid: i for i, cid in enumerate(r["lexical"], start=1)}
        semantic_rank = {cid: i for i, cid in enumerate(r["semantic"], start=1)}
        folded_terms = {t: fold(t) for t in r["terms"]}
        bm25 = []
        for rank, (cid, score) in enumerate(r["bm25"], start=1):
            doc_id, heading, _, text = all_chunks[cid]
            tokens = set(re.findall(r"\w+", fold(f"{heading} {text}")))
            matched = [t for t, f in folded_terms.items() if f in tokens]
            bm25.append({"rank": rank, "chunk": cid, "score": round(score, 3), "hit": hit(cid, q),
                         "matched": matched})
        vector = [{"rank": rank, "chunk": cid, "score": round(score, 4), "hit": hit(cid, q)}
                  for rank, (cid, score) in enumerate(r["vector"], start=1)]
        hybrid = [{"rank": rank, "chunk": cid, "score": round(score, 5), "hit": hit(cid, q),
                   "from": {"bm25": lexical_rank.get(cid), "vector": semantic_rank.get(cid)}}
                  for rank, (cid, score) in enumerate(r["hybrid"], start=1)]
        referenced |= {e["chunk"] for e in bm25 + vector + hybrid}
        in_vector_list |= {e["chunk"] for e in vector}
        out_questions.append({
            "id": q["id"], "category": q["category"], "text": q["question"],
            "expected_docs": q["expected"], "showcase": bool(q["showcase"]), "note": q["note_en"] or q["note"],
            "query_terms": r["terms"],
            "query_xy": [round(float(c), 4) for c in project(qv)],
            "query_v": [round(float(c), 3) for c in qv[:VECTOR_HEAD]],
            "bm25": bm25, "vector": vector, "hybrid": hybrid,
        })

    rest = sorted(set(ids) - referenced)
    sample = random.Random(SEED).sample(rest, min(BACKGROUND_SAMPLE, len(rest)))
    chunks = []
    for cid in sorted(referenced | set(sample)):
        doc_id, heading, lang, text = all_chunks[cid]
        chunks.append({"id": cid, "doc": doc_id, "heading": heading, "lang": lang,
                       "text": display_text(text, heading, docs[doc_id].title),
                       "x": round(float(xy[cid][0]), 4), "y": round(float(xy[cid][1]), 4)})
        if cid in in_vector_list:  # first numbers of the stored embedding, for the "vector database" scene
            chunks[-1]["v"] = [round(float(c), 3) for c in vectors[row_of[cid]][:VECTOR_HEAD]]

    langs = Counter(c[2] for c in all_chunks.values())
    data = {
        "meta": {
            "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "variant": v.name,
            "model": v.model.name,
            "chunking": v.chunking,
            "k": K,
            "rrf_k": RRF_K,
            "dims": int(vectors.shape[1]),
            "corpus": {"docs": len(docs), "chunks": len(ids), "langs": dict(sorted(langs.items()))},
            "note": "Rankings, map and chunks come from the main variant; eval holds all measured "
                    "variants. Map = 2D PCA of the embeddings, distances are approximate.",
        },
        "docs": [{"id": d.id, "title": d.title, "lang": d.lang, "url": d.url, "pages": d.pages}
                 for d in docs.values()],
        "chunks": chunks,
        "chunkingDemo": chunking_demo(docs),
        "questions": out_questions,
        "eval": {
            "k": evaluation["k"],
            "modes": evaluation["modes"],
            "categories": evaluation["categories"],
            "rows": evaluation["rows"],
            "variants": evaluation["variants"],
        },
        "agent": agent_entries({q["id"]: q for q in questions}),
    }
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    OUTPUT.write_text(
        "// Generated by `uv run export-viz` (rag/eval/export_viz.py). Do not edit, do not commit:\n"
        "// contains excerpts of BAZG publications.\n"
        f"window.DATA = {payload};\n",
        encoding="utf-8",
    )
    print(f"written {OUTPUT.relative_to(RAG_ROOT)}: {len(chunks)} chunks, {len(out_questions)} "
          f"questions, {len(data['agent'])} agent runs, {OUTPUT.stat().st_size / 1024:.0f} kB")
