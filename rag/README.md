# RAG-Experiment: Agentic Search vs. Retrieval

## Worum es geht

Claude Code findet Wissen standardmässig **agentisch**: Es formuliert Suchbegriffe, greppt,
liest Dateien und sucht nach. RAG (Retrieval-Augmented Generation) gilt oft als die «bessere»
Lösung. Dieses Experiment prüft das **mit Zahlen statt mit Behauptungen**: Wann hilft
Embedding-Retrieval wirklich, wann reicht lexikalische Suche, und wann schadet die Kombination?

## Die Fragen, die das Experiment beantworten soll

1. **Wo ist lexikalische Suche (BM25) stark und wo blind?**
   Erwartung: stark bei exakten Bezeichnern (`RR-5031`, `rr.notify.batch-size`), blind bei
   Synonymen («Doppelbelegung» vs. «Buchungskonflikt») und anderen Sprachen.
2. **Wo ist Vektorsuche stark und wo blind?**
   Erwartung: stark bei Bedeutung und Sprachwechsel, unsicher bei Bezeichnern, die sich nur in
   Ziffern unterscheiden.
3. **Ist Hybrid (beides kombiniert) automatisch besser?**
   Das ist die spannendste Frage, und die Antwort ist hier **nein**. Liefert ein Retriever nur
   falsche Treffer, stimmen diese in der Fusion mit und verdrängen den richtigen Treffer des anderen.
4. **Wie viel macht Chunking aus?**
   Ein naives Zerschneiden nach fester Länge gegenüber Zerlegen entlang der Überschriften, mit
   dem Überschriftenpfad als Kontext.
5. **Was kostet die agentische Suche dagegen?**
   Mehr Turns und Kontext, dafür kein Index und die Fähigkeit, selbst umzuformulieren und zu übersetzen.

## Versuchsaufbau

| Baustein | Umsetzung |
|----------|-----------|
| Korpus | 70 synthetische Handbuch-Seiten zur «Raumreservation», ~50 % Deutsch, ~30 % Französisch, ~20 % Englisch (`corpus/`) |
| Fragen | 25 Fragen auf Deutsch mit erwarteten Dokumenten, in 4 Kategorien (`eval/questions.yaml`) |
| Lexikalisch | BM25 über SQLite FTS5 |
| Semantisch | lokales, mehrsprachiges Embedding-Modell (`paraphrase-multilingual-MiniLM-L12-v2`), Vektoren in `sqlite-vec` |
| Hybrid | Reciprocal Rank Fusion (zählt nur Ränge, nicht Scores) |
| Messung | Recall@5 (ist das richtige Dokument unter den Top 5?) und MRR (wie weit oben?) pro Kategorie |
| Agent-Anbindung | MCP-Server mit `search_docs` und `get_doc` (`mcp_server/`) |

Alles läuft **lokal und offline**: kein externer Embedding-Dienst, keine Datenbank, kein Docker.

### Die vier Fragekategorien

| Kategorie | Beispiel | Was sie prüft |
|-----------|----------|---------------|
| `synonym` | «Was passiert bei einer Doppelbelegung?» (Dokument sagt «Buchungskonflikt») | Bedeutung statt Wortgleichheit |
| `cross-lingual` | «Wie oft wird die Datenbank gesichert?» (Antwort nur auf Französisch) | Sprachgrenzen |
| `exact-identifier` | «Was bedeutet RR-5031?» | exakte Bezeichner |
| `multi-doc` | «Wie funktioniert die Warteliste und ist sie schon eingeschaltet?» | Antwort verteilt auf mehrere Dokumente |

Der Korpus ist **absichtlich so gebaut**, dass die Unterschiede sichtbar werden: Die
Zieldokumente vermeiden die Wörter der Frage, ähnlich klingende Ablenkdokumente enthalten sie.

## Was das Experiment zeigen soll (Kernaussagen)

1. **Jeder Retriever hat einen blinden Fleck, genau dort, wo der andere stark ist.**
   «Doppelbelegung»: BM25 findet nichts, Vektoren treffen. «RR-5031»: BM25 trifft, Vektoren
   liefern einen ähnlich aussehenden, falschen Fehlercode-Katalog.
2. **Hybrid ist kein Automatismus.** Bei Fragen, die ein Retriever nicht beantworten kann, bringt
   er Rauschen in die Fusion. Hybrid lohnt sich, wenn viele Anfragen exakte Bezeichner enthalten.
   Wer RAG einführt, sollte das am eigenen Korpus messen.
3. **Chunking ist eine Stellschraube mit Wirkung.** Besseres Chunking bringt die richtige Stelle
   weiter nach oben (MRR) und hebt Hybrid deutlich.
4. **Für Code im Repo reicht Claudes agentische Suche fast immer.** RAG lohnt sich bei grossen,
   mehrsprachigen Wissensbeständen ausserhalb des Repos, z.B. Handbücher, Wikis, Tickets.
5. **Retrieval-Ergebnisse sind nicht vertrauenswürdige Inhalte.** Ein präpariertes Dokument im
   Korpus (siehe Übung 10) landet genauso in den Treffern wie jedes andere.

## Grenzen

- 25 Fragen sind eine kleine Stichprobe. Eine Frage entspricht 0.04 Recall. Unterschiede unter ~0.1 nicht überinterpretieren.
- Ein kleines Embedding-Modell (sieht ca. 128 Wortteile pro Chunk). Grössere Modelle verschieben die Zahlen, nicht aber die grundsätzlichen Muster.
- Der Korpus ist synthetisch und auf Kontraste ausgelegt, also kein Abbild eines echten Wikis.

## Selbst ausprobieren

```bash
cd rag
uv run index                                  # Chunking + Embeddings + Index (wenige Sekunden)
uv run search "Doppelbelegung" --mode bm25    # lexikalisch
uv run search "Doppelbelegung" --mode vector  # semantisch
uv run eval                                   # Tabelle: alle Modi, alle Kategorien
uv run eval --details                         # welche Fragen daneben lagen
```

Die Übung dazu: [exercises/11-rag](../exercises/11-rag/README.md).
