# RAG-Experiment: Agentic Search vs. Retrieval (BAZG-Transitdokumente)

> Demo für die Moderation. Teilnehmende führen sie nicht selbst aus; gezeigt wird die
> Visualisierung im Abschnitt «Suche» der Präsentation (`../praesentation/`) mit den hier gemessenen Daten.

## Worum es geht

Claude Code findet Wissen standardmässig **agentisch**: Es formuliert Suchbegriffe, greppt,
liest Dateien und sucht nach. RAG (Retrieval-Augmented Generation) gilt oft als die «bessere»
Lösung. Dieses Experiment prüft das **mit Zahlen statt mit Behauptungen**, und zwar an echten,
öffentlichen Dokumenten des BAZG zum Transitverfahren (gVV/NCTS, nationale Durchfuhr, Passar):
Wann hilft Embedding-Retrieval, wann reicht lexikalische Suche, was bringt die Kombination, und
was kostet die agentische Suche im Vergleich?

## Die Fragen, die das Experiment beantworten soll

1. **Wo ist lexikalische Suche (BM25) stark und wo blind?**
   Erwartung: stark bei exakten Bezeichnern (`NT044`, `XU`, `16 15 048 049`), blind bei
   Synonymen («Fakturen in britischen Pfund» vs. «Rechnungen in GBP») und anderen Sprachen.
2. **Wo ist Vektorsuche stark und wo blind?**
   Erwartung: stark bei Bedeutung und Sprachwechsel, unsicher bei reinen Codes.
3. **Ist Hybrid (beides kombiniert) automatisch besser?**
4. **Wie viel machen Chunking und die Wahl des Embedding-Modells aus?**
5. **Was kostet die agentische Suche dagegen?**

## Versuchsaufbau

| Baustein | Umsetzung |
|----------|-----------|
| Korpus | 16 öffentliche PDFs des BAZG (267 Seiten): 13 deutsch, 2 französisch, 1 italienisch (`sources.yaml`) |
| Aufbereitung | PDF → Markdown mit `pymupdf4llm`, danach Kopf-/Fusszeilen, Seitenzahlen und Inhaltsverzeichnisse entfernt, Überschriftenebenen aus der Ziffer abgeleitet («4.2.1 Titel» → `###`), Tabellen zeilenweise (`indexer/pdf.py`) |
| Fragen | 25 Fragen auf Deutsch mit erwarteten Dokumenten, in 4 Kategorien (`eval/questions.yaml`, Entwurf, fachliche Prüfung ausstehend) |
| Lexikalisch | BM25 über SQLite FTS5 |
| Semantisch | lokale, mehrsprachige Embedding-Modelle via `fastembed`, Vektoren in `sqlite-vec` |
| Hybrid | Reciprocal Rank Fusion (zählt nur Ränge, nicht Scores; k=60, je 2×k Kandidaten) |
| Messung | Recall@5 (sind die erwarteten Dokumente unter den Top 5?) und MRR (wie weit oben?) pro Kategorie |
| Agentisch | echte Läufe von `claude -p` (Sonnet) mit nur Grep/Glob/Read im Korpusverzeichnis (`eval/record_agent.py`) |
| Agent-Anbindung (optional) | MCP-Server mit `search_docs` und `get_doc` (`mcp_server/`) |

Alles ausser dem Download der PDFs und Modelle läuft **lokal und offline**: kein externer
Embedding-Dienst, kein Datenbankserver, kein Docker.

### Gemessene Varianten

| Variante | Chunking | Embedding-Modell |
|----------|----------|------------------|
| `fixed+MiniLM` | feste Länge (400 Zeichen, 50 Überlappung), ohne Rücksicht auf Struktur | `paraphrase-multilingual-MiniLM-L12-v2` (~220 MB, liest max. 128 Wortteile) |
| `heading+MiniLM` (**Hauptvariante**) | entlang der Überschriften, Überschriftenpfad als Kontext vor jedem Chunk | dito |
| `heading+e5-large` | dito | `intfloat/multilingual-e5-large` (~2.2 GB, 512 Wortteile, mit «query: »/«passage: »-Präfix) |

Die Hauptvariante speist `uv run search`, den MCP-Server und die Visualisierung
(änderbar mit `RAG_VARIANT=heading+e5-large`).

### Die vier Fragekategorien

| Kategorie | Beispiel | Was sie prüft |
|-----------|----------|---------------|
| `synonym` | «Welche Währungsangabe gilt für Fakturen in britischen Pfund?» (Dokument: «Währungscode für Rechnungen in GBP») | Bedeutung statt Wortgleichheit |
| `cross-lingual` | «Wer muss das Zollformular für Militärtransporte … unterschreiben?» (Antwort nur im italienischen R-14-04, «modulo NATO 302») | Sprachgrenzen |
| `exact-identifier` | «Was bedeutet die Meldung NT044?» | exakte Bezeichner |
| `multi-doc` | «Was ändert sich mit NCTS Phase 5 beim Layout des VBD und bei der Tarifnummer?» | Antwort verteilt auf mehrere Dokumente |

Die französischen und italienischen Dokumente sind **nur** in dieser Sprache im Korpus (die
deutsche Fassung fehlt absichtlich), sonst gäbe es keine echten sprachübergreifenden Fragen.

## Ergebnisse (Stand November 2026)

Recall@5 über alle 25 Fragen, MRR in Klammern:

| Variante | BM25 | Vektor | Hybrid |
|----------|------|--------|--------|
| `fixed+MiniLM` | 0.76 (0.75) | 0.70 (0.64) | 0.86 (0.75) |
| `heading+MiniLM` | 0.76 (0.73) | 0.76 (0.75) | **0.92** (0.78) |
| `heading+e5-large` | 0.76 (0.73) | 0.86 (0.79) | 0.86 (0.75) |

Recall@5 pro Kategorie (BM25 / Vektor / Hybrid):

| Variante | synonym (7) | cross-lingual (6) | exact-identifier (7) | multi-doc (5) |
|----------|-------------|-------------------|----------------------|---------------|
| `fixed+MiniLM` | 0.86 / 0.71 / 1.00 | 0.33 / 0.67 / 0.67 | 1.00 / 0.71 / 1.00 | 0.80 / 0.70 / 0.70 |
| `heading+MiniLM` | 0.86 / 0.71 / 1.00 | 0.33 / 0.83 / 0.83 | 1.00 / 0.71 / 1.00 | 0.80 / 0.80 / 0.80 |
| `heading+e5-large` | 0.86 / 1.00 / 1.00 | 0.33 / 0.50 / 0.50 | 1.00 / 1.00 / 1.00 | 0.80 / 0.90 / 0.90 |

Die Fragen wurden vor der ersten Messung geschrieben und danach nicht mehr angepasst; Parameter
(Chunkgrösse, RRF, Kandidatentiefe) sind dieselben wie im früheren synthetischen Experiment.

### Was die Zahlen zeigen

1. **Jeder Retriever hat einen blinden Fleck, genau dort, wo der andere stark ist.** BM25 findet
   bei «Fakturen in britischen Pfund» gar nichts und scheitert an fast allen fremdsprachigen
   Antworten (0.33, Treffer nur dank «NATO 302» oder «CN»). MiniLM-Vektoren verfehlen dafür reine
   Codes wie `NT044` oder `XU` und landen bei ähnlich aussehenden Tabellen.
2. **Auf diesem echten Korpus gewinnt Hybrid mit MiniLM deutlich (0.92 gegenüber 0.76).** Weil
   sich die Fehler der beiden Retriever kaum überschneiden, rettet die Fusion beide Arten von
   Fragen. Das ist anders als beim früheren synthetischen Korpus, wo Hybrid nur gleichauf mit
   Vektoren lag: Ob Hybrid hilft, hängt vom Korpus und den Fragen ab und muss gemessen werden.
3. **Ein grösseres Modell ist nicht überall besser.** e5-large (10× grösser) löst alle Synonym-
   und Code-Fragen, aber nur die Hälfte der sprachübergreifenden; das kleine MiniLM (auf
   mehrsprachige Paraphrasen trainiert) schafft dort 0.83. Mit e5 bringt Hybrid nichts mehr
   (0.86 wie Vektor allein, MRR sogar etwas tiefer): BM25 steuert dann vor allem Rauschen bei.
4. **Chunking wirkt, aber im kleinen Bereich.** Überschriften-Chunking statt fester Länge hebt
   Vektor von 0.70 auf 0.76 und Hybrid von 0.86 auf 0.92, also je eine bis zwei Fragen.
5. **Die agentische Suche war bei diesem Korpus mühelos.** Claude Code (Sonnet, nur Grep/Glob/Read)
   hat alle vier Showcase-Fragen richtig beantwortet und die erwarteten Dateien zitiert, mit 2–3
   Tool-Aufrufen, 3–4 Turns, 21 000–36 000 Input-Tokens (inkl. Cache) und 5–10 Sekunden. Es
   übersetzt Suchbegriffe selbst (`Militär|militaire|militare`, `pfund|GBP|livre`) und braucht
   keinen Index. Bei 16 Dateien ist das leicht; bei Tausenden Dokumenten steigen Turns und Kontext.

Fazit für die Praxis: **Für Code und überschaubare Dokumentmengen reicht Claudes agentische Suche
fast immer.** RAG lohnt sich bei grossen, mehrsprachigen Wissensbeständen ausserhalb des Repos;
dann am eigenen Korpus messen, welche Kombination aus Chunking, Modell und Hybrid trägt.
**Retrieval-Ergebnisse bleiben nicht vertrauenswürdige Inhalte**: Was im Korpus steht, landet
ungeprüft in den Treffern.

## Grenzen

- 25 Fragen sind eine kleine Stichprobe. Eine Frage entspricht 0.04 Recall. Unterschiede unter ~0.1 nicht überinterpretieren.
- Die Fragen und erwarteten Dokumente sind ein Entwurf ohne fachliche Prüfung durch eine Zollfachperson.
- Gemessen wird auf Dokumentebene. Die Richtlinie R-14-01 stellt rund einen Drittel aller Chunks; wer irgendeinen Chunk daraus trifft, gilt bei Fragen zu R-14-01 als richtig, auch wenn der Abschnitt nicht passt. Das schont vor allem BM25 bei den Synonym-Fragen (0.86).
- MiniLM sieht nur ca. 128 Wortteile pro Chunk; der vorangestellte Überschriftenpfad verbraucht davon einen Teil.
- Die PDF-Konvertierung ist heuristisch: Tabellen (vor allem die 109 Seiten Datenanforderungen) und Formulare werden zu teils holprigem Text.
- Die agentischen Läufe sind Einzelläufe (je einer pro Showcase-Frage) und damit Anekdoten, keine Statistik.

## Selbst ausprobieren (Moderation)

```bash
cd rag
uv run fetch                   # PDFs laden (rag/.cache/sources/, sha256 geprüft)
uv run convert                 # PDF -> Markdown (rag/.cache/corpus/), ca. 20 s
uv run index                   # Hauptvariante heading+MiniLM, ca. 10 s
uv run index --all             # alle Varianten; e5-large lädt einmalig ~2.2 GB und rechnet ~1 min
uv run eval                    # Tabellen für alle gebauten Varianten -> rag/.data/eval-results.json
uv run eval --details          # welche Fragen daneben lagen
uv run search "Fakturen in britischen Pfund" --mode bm25     # lexikalisch: kein Treffer
uv run search "Fakturen in britischen Pfund" --mode vector   # semantisch: Treffer
uv run record-agent            # echte Claude-Code-Läufe für die Showcase-Fragen (kostet Nutzung)
uv run export-viz              # praesentation/data.js für die Visualisierung
```

Danach `../praesentation/index.html` im Browser öffnen (funktioniert offline über `file://`), Abschnitt «Suche».

## Urheberrecht und was nicht ins Repo gehört

Die PDFs, das daraus erzeugte Markdown und die Indizes enthalten Texte des BAZG. Sie werden lokal
erzeugt und sind per `.gitignore` ausgeschlossen (`rag/.cache/`, `rag/.data/`). Im Repo liegen die
Quellenliste mit Links und Prüfsummen, die Fragen, der Code und `praesentation/data.js`.

**`praesentation/data.js` ist seit dem 2026-11-10 bewusst im Repo** (Entscheid Roland), damit die
gehostete Präsentation die echten Daten zeigt. Die Datei enthält kurze Auszüge (je rund 400 Zeichen)
aus den öffentlichen BAZG-Publikationen, die in `sources.yaml` verlinkt sind.

Ändert das BAZG ein PDF, meldet `uv run fetch` eine abweichende Prüfsumme;
`uv run fetch --update-hashes` übernimmt die neue Fassung (Fragen danach neu prüfen).
