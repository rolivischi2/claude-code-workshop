"""Single-file index: SQLite with FTS5 (lexical/BM25) and sqlite-vec (vectors). No server, no Docker."""

import json
import re
import sqlite3
from pathlib import Path

import sqlite_vec

from indexer.chunking import Chunk
from indexer.config import DB_PATH, EMBEDDING_DIM
from indexer.corpus import Document

SCHEMA = f"""
CREATE TABLE docs (id TEXT PRIMARY KEY, title TEXT, lang TEXT, tags TEXT, path TEXT, body TEXT);
CREATE TABLE chunks (
    id INTEGER PRIMARY KEY, doc_id TEXT, chunk_index INTEGER,
    heading_path TEXT, lang TEXT, text TEXT
);
CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);
CREATE VIRTUAL TABLE chunks_fts USING fts5(
    text, heading_path, content='chunks', content_rowid='id',
    tokenize='unicode61 remove_diacritics 2'
);
CREATE VIRTUAL TABLE chunks_vec USING vec0(embedding float[{EMBEDDING_DIM}] distance_metric=cosine);
"""

# Very common words carry no signal for BM25 and only add noise to the OR query.
STOPWORDS = set(
    """der die das den dem des ein eine einer eines einem und oder wie was wer wann wo wird werden
    ist sind bei mit von für auf aus im in zu zum zur bis ab ich wir man es muss darf kann
    oft lange welche welcher welches gibt gilt hat haben soll sollen einen dürfen höchstens
    maximal schon noch viele warum steht bedeutet passiert geschieht
    le la les un une des du de et ou est sont pour par dans sur avec
    the a an and or is are of to in on for with what how when who which""".split()
)


def connect(db_path: Path = DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.enable_load_extension(True)
    sqlite_vec.load(conn)
    conn.enable_load_extension(False)
    return conn


def build(docs: list[Document], chunks: list[Chunk], vectors, settings: dict,
          db_path: Path = DB_PATH) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    db_path.unlink(missing_ok=True)
    with connect(db_path) as conn:
        conn.executescript(SCHEMA)
        conn.executemany(
            "INSERT INTO docs VALUES (?, ?, ?, ?, ?, ?)",
            [(d.id, d.title, d.lang, json.dumps(d.tags), d.path, d.body) for d in docs],
        )
        for row_id, (chunk, vector) in enumerate(zip(chunks, vectors), start=1):
            conn.execute(
                "INSERT INTO chunks VALUES (?, ?, ?, ?, ?, ?)",
                (row_id, chunk.doc_id, chunk.index, chunk.heading_path, chunk.lang, chunk.text),
            )
            conn.execute(
                "INSERT INTO chunks_vec(rowid, embedding) VALUES (?, ?)",
                (row_id, vector.tobytes()),
            )
        conn.execute("INSERT INTO chunks_fts(chunks_fts) VALUES ('rebuild')")
        conn.executemany("INSERT INTO meta VALUES (?, ?)", [(k, str(v)) for k, v in settings.items()])


def fts_query(text: str) -> str:
    """Turns free text into an FTS5 OR-query of quoted terms (quoting avoids syntax errors)."""
    terms = [t for t in re.findall(r"\w+", text.lower()) if len(t) > 1 and t not in STOPWORDS]
    return " OR ".join(f'"{t}"' for t in dict.fromkeys(terms))


def bm25_ids(conn: sqlite3.Connection, query: str, limit: int) -> list[tuple[int, float]]:
    match = fts_query(query)
    if not match:
        return []
    rows = conn.execute(
        "SELECT rowid, bm25(chunks_fts) FROM chunks_fts WHERE chunks_fts MATCH ? "
        "ORDER BY bm25(chunks_fts) LIMIT ?",
        (match, limit),
    ).fetchall()
    return [(row_id, -score) for row_id, score in rows]  # FTS5 bm25: lower is better


def vector_ids(conn: sqlite3.Connection, query_vector, limit: int) -> list[tuple[int, float]]:
    rows = conn.execute(
        "SELECT rowid, distance FROM chunks_vec WHERE embedding MATCH ? AND k = ? ORDER BY distance",
        (query_vector.tobytes(), limit),
    ).fetchall()
    return [(row_id, 1.0 - distance) for row_id, distance in rows]  # cosine similarity


def load_chunks(conn: sqlite3.Connection, row_ids: list[int]) -> dict[int, tuple]:
    if not row_ids:
        return {}
    marks = ",".join("?" * len(row_ids))
    rows = conn.execute(
        f"SELECT id, doc_id, heading_path, lang, text FROM chunks WHERE id IN ({marks})", row_ids
    ).fetchall()
    return {row[0]: row[1:] for row in rows}


def load_doc(conn: sqlite3.Connection, doc_id: str) -> dict | None:
    row = conn.execute(
        "SELECT id, title, lang, tags, path, body FROM docs WHERE id = ?", (doc_id,)
    ).fetchone()
    if row is None:
        return None
    keys = ("id", "title", "lang", "tags", "path", "body")
    doc = dict(zip(keys, row))
    doc["tags"] = json.loads(doc["tags"])
    return doc


def settings(conn: sqlite3.Connection) -> dict[str, str]:
    return dict(conn.execute("SELECT key, value FROM meta").fetchall())
