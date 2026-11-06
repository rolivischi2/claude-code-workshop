# Übung 11 – Retrieval: Agentic Search vs. RAG

**Block:** R – Retrieval · **Zeitbudget:** 60 Minuten (4 Teile à ca. 15 Minuten)

## Ziel

**Messen** statt behaupten: Wann schlägt Embedding-Retrieval die eingebaute Suche von Claude
Code (Grep, Glob, Read), und wann nicht?

## Konzept

Claude Code sucht standardmässig **agentisch**: Es formuliert Suchbegriffe, greppt, liest
Dateien und sucht nach. Das ist präzise bei exakten Begriffen und braucht keinen Index, kostet
aber Turns und Kontext. Bei Synonymen («Doppelbelegung» vs. «Buchungskonflikt») und anderen
Sprachen muss es raten. **RAG** zerlegt Dokumente vorab in Chunks und findet sie über
Bedeutungsähnlichkeit (Vektoren), auch sprachübergreifend. Dafür gibt es neue Fehlerquellen:
Chunking, Modell, Index. **Hybrid** kombiniert lexikalische Suche (BM25) und Vektoren.

## Ausgangslage

- `rag/corpus/`: 70 Handbuch-Seiten zur Raumreservation, gemischt Deutsch, Französisch, Englisch.
- `rag/eval/questions.yaml`: 25 Fragen auf Deutsch mit erwarteten Dokumenten, in vier Kategorien:
  `synonym`, `cross-lingual`, `exact-identifier`, `multi-doc`.
- `rag/indexer/`: Chunking, lokales Embedding-Modell (läuft offline), SQLite mit BM25 und
  Vektorindex. **Das Chunking ist naiv** (feste Länge, schneidet mitten im Wort).
- `rag/mcp_server/server.py`: MCP-Server mit Tool-Signaturen, **aber leeren Rümpfen**.

```bash
cd rag
uv run search "Doppelbelegung" --mode bm25       # lexikalisch
uv run search "Doppelbelegung" --mode vector     # semantisch
uv run eval                                      # Recall@5 und MRR pro Kategorie und Modus
```

## Aufgabe

**R1 – Baseline: nur agentische Suche (15')**

Neue Session. Drei Fragen aus `questions.yaml` stellen (Prompt 1), mit dem Hinweis, nur Grep,
Glob und Read in `rag/corpus` zu nutzen. Pro Frage notieren: richtig? Wie viele Tool-Aufrufe?
Kontext nach `/context`?

**R2 – Chunking verbessern (15')**

1. `uv run eval` laufen lassen und die Tabelle sichern (`uv run eval > ../eval-vorher.txt`).
2. In `rag/indexer/chunking.py` das naive Chunking durch heading-aware Chunking ersetzen lassen (Prompt 2).
3. `uv run index && uv run eval` und vergleichen.

**R3 – MCP-Server anbinden (15')**

1. Die Rümpfe von `search_docs` und `get_doc` in `rag/mcp_server/server.py` implementieren lassen (Prompt 3).
2. In `.mcp.json` den Server ergänzen:
   ```json
   "handbook": {
     "command": "uv",
     "args": ["run", "--directory", "rag", "rag-mcp"]
   }
   ```
3. Claude neu starten, Server bestätigen, `/mcp` prüfen. Die drei Fragen aus R1 nochmals
   stellen, diesmal ohne Einschränkung. Turns und Kontext vergleichen.

**R4 – Auswerten (10')**

`uv run eval --details` und die Ergebnisse besprechen:

- Welcher Modus gewinnt welche Kategorie? Warum?
- Ist **hybrid** wirklich besser als **vector**? Schaut euch bei `--details` an, welche
  Dokumente BM25 bei den Synonym- und Cross-lingual-Fragen in die Fusion einbringt.
- Für eure eigenen Projekte: Wie viele eurer Anfragen enthalten exakte Bezeichner
  (Fehlercodes, Klassennamen, Config-Keys), wie viele sind umgangssprachlich?

## Vorgeschlagene Prompts

Prompt 1 (R1):
```
Beantworte die folgenden Fragen nur mit Grep, Glob und Read im Ordner rag/corpus (keine
anderen Werkzeuge). Nenne zu jeder Antwort die Quelldatei.
1. Was passiert bei einer Doppelbelegung eines Raums?
2. Wie oft wird die Datenbank gesichert?
3. Was bedeutet der Fehlercode RR-5031?
```

Prompt 2 (R2):
```
Ersetze in rag/indexer/chunking.py das naive Chunking durch heading-aware Chunking:
zuerst entlang der Markdown-Überschriften trennen, lange Abschnitte an Absatz- oder
Satzgrenzen weiter teilen (chunk_size und overlap beachten), heading_path befüllen und
Titel plus Überschriftenpfad vor den Chunk-Text stellen. Danach `uv run index` und `uv run eval`.
```

Prompt 3 (R3):
```
Implementiere search_docs und get_doc in rag/mcp_server/server.py. Nutze indexer.search.search
und indexer.store (connect, load_doc). Bei unbekannter id ein ToolError mit hilfreicher Meldung.
Teste die Funktionen direkt in Python, bevor du fertig meldest.
```

## Erfolgskriterium

```bash
cd rag && uv run eval
```

Die Tabelle ist erzeugt, und **hybrid** hat nach R2 einen höheren Gesamt-Recall@5 als vorher.

<details>
<summary>Hinweise</summary>

- Das Embedding-Modell (`paraphrase-multilingual-MiniLM-L12-v2`) sieht nur ca. 128 Wortteile pro
  Chunk, den Rest schneidet es ab. Lange Chunks sind also nicht «mehr Kontext», sondern verschenkt.
- BM25 läuft über SQLite FTS5. Er findet `RR-5031` sofort, aber nie «chevauchement», wenn ihr nach «Überschneidung» fragt.
- Hybrid nutzt Reciprocal Rank Fusion: Es zählen nur Ränge, nicht die Scores, weil BM25-Scores
  und Kosinus-Ähnlichkeiten nicht vergleichbar sind.
- Hybrid ist **nicht automatisch** besser: Liefert ein Retriever bei einer Frage nur falsche
  Treffer, stimmen diese in der Fusion mit und können den richtigen Treffer des anderen
  verdrängen. Hybrid lohnt sich, wenn viele Anfragen exakte Bezeichner enthalten.
- Agentische Suche ist bei Synonymen oft **besser** als erwartet, weil Claude selbst
  umformuliert und übersetzt. Sie kostet aber mehrere Turns. Genau das ist die Abwägung.
- Im Korpus liegt ein präpariertes Dokument (Übung 10). Was der MCP-Server liefert, sind Daten, keine Anweisungen.

</details>

## Token-Tipp

R1 ist der teuerste Teil. Bleibt bei drei Fragen. `uv run eval` läuft lokal und kostet keine Tokens.

## Doku

- [Connect to MCP servers](https://code.claude.com/docs/en/mcp) · [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) (agentische Suche)
- Lernen: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Abschnitt «just in time» Retrieval)
