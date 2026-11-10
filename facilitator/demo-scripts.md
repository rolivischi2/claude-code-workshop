# Demo-Skripte

Exakte Abläufe, erwartete Ergebnisse und Plan B für die zwei Demos (R und D).
Vor jeder Demo: Terminal- bzw. Browser-Schrift gross, Benachrichtigungen aus.

---

## Demo R – Agentic Search vs. RAG auf der NCTS-Dokumentation (20')

**Vorbereitung (am Vortag, braucht Netz):**

```bash
cd rag
uv run fetch && uv run convert      # BAZG-PDFs laden und nach Markdown wandeln (rag/.cache/)
uv run index --all && uv run eval   # alle Varianten indexieren und messen
uv run export-viz                   # schreibt rag/viz/data.js (nicht committet: enthält BAZG-Textauszüge)
```

`uv run record-agent` nur, wenn die Agent-Läufe neu aufgenommen werden sollen (kostet echte
Nutzung, 4 kurze Läufe mit Sonnet). Die aufgenommenen Läufe liegen in `rag/.cache/agent-runs.json`.

Dann `rag/viz/index.html` im Browser öffnen (funktioniert offline über `file://`).
Erscheint oben das Badge «Beispieldaten», fehlt `data.js`: `uv run export-viz` erneut.

Die Folien sind **englisch** beschriftet, gesprochen wird deutsch.

**Steuerung:** ←/→ Szene bzw. Animationsschritt, 1–9 springen, `q` Fragenauswahl, `r` Animation wiederholen.

**Tipp-Runden:** In den Szenen 3, 5, 7 und 8 erscheint vor der Auflösung eine Frage ans Publikum
(Handzeichen). `→` löst auf, nochmals `→` fährt weiter. Die richtige Antwort wird aus `data.js`
berechnet. Bei Zeitnot schaltet `g` alle Tipp-Runden aus (rund 30 Sekunden pro Runde).

Das ausformulierte Skript mit Sätzen pro Schritt, häufigen Fragen und Glossar steht in [sprechskript.md](sprechskript.md).

### Ablauf

| Min | Szene | Was zeigen | Satz |
|-----|-------|------------|------|
| 0–1½ | 1 Corpus | 16 BAZG-Dokumente, 267 Seiten, de/fr/it. Dann die zwei Wege: Index bauen oder selbst suchen | «Echte Projektdoku. Wie findet ein Agent darin die richtige Stelle?» |
| 1½–3 | 2 Chunking | fester Schnitt vs. Überschriftenpfad | «Was ein Chunk ist, bestimmt, was gefunden werden kann.» |
| 3–5½ | 3 BM25 | **S2** «Währungsangabe … britischen Pfund». **Tipp-Runde:** Findet BM25 es? Auflösung: **nichts** | «Das Dokument sagt GBP, nie Pfund. Lexikalische Suche ist blind für Synonyme.» |
| 5½–7½ | 4 Vector DB | **S2**: Text → Embedding-Modell → 384 Zahlen. Tabelle mit einer Zeile pro Chunk, die Frage als weitere Zeile, Ähnlichkeit pro Zeile, Zeilen sortieren sich. Echte Zahlen aus dem Index | «Eine Vektor-Datenbank ist eine Tabelle mit Zahlen. Suchen heisst: Zahlen vergleichen, keine Wörter.» |
| 7½–10 | 5 Vector | **S2** trifft sofort (Tipp-Runde). Dann **E1** «Was bedeutet NT044?»: Vektor findet den Code nicht einmal in den Top 10 | «Vektoren verstehen Bedeutung, aber nicht Bezeichner.» |
| 10–11½ | 5 Vector | **C3** Militärtransporte: Antwort steht nur im italienischen Dokument. BM25 verfehlt, Vektor trifft | «Mehrsprachige Embeddings überspringen die Sprachgrenze.» |
| 11½–13½ | 6 Hybrid | **S2/C3**: Fusion hält den Vektor-Treffer auf Rang 1. **E1**: Fusion **schadet**, das Rauschen der Vektoren drückt den BM25-Treffer von Rang 1 auf Rang 2. **M3**: Hybrid bringt das richtige Dokument auf Rang 1 | «Fusion gleicht blinde Flecken aus, im Schnitt. Im Einzelfall kann sie einen sicheren Treffer verwässern.» |
| 13½–16½ | 7 Agent | **Tipp-Runde:** Wie viele Turns? Aufgezeichnete Läufe: 3–4 Turns, 21–36k Tokens, alle 4 richtig. Claude übersetzt selbst (`Militär\|militaire\|militare`) | «Kein Index, keine Embeddings, trotzdem richtig. Der Preis sind Turns und Tokens pro Frage.» |
| 16½–19 | 8 Results | Jede Frage ein Punkt: Reihe BM25, Reihe Vektor, Reihe Hybrid. **Tipp-Runde** zum grösseren Modell, dann drei Karten mit den Varianten. `d` zeigt die Detail-Diagramme für Nachfragen | siehe unten |
| 19–20 | 9 Takeaways | vier Kernaussagen | |

### Gemessene Zahlen (Recall@5, in Klammern MRR, 25 Fragen, k=5)

| Variante | BM25 | Vektor | Hybrid |
|----------|------|--------|--------|
| fester Schnitt + MiniLM | 0.76 (0.75) | 0.70 (0.64) | 0.86 (0.75) |
| **Überschriften + MiniLM** (Hauptvariante) | 0.76 (0.73) | 0.76 (0.75) | **0.92** (0.78) |
| Überschriften + e5-large | 0.76 (0.73) | 0.86 (0.79) | 0.86 (0.75) |

Pro Kategorie (Hauptvariante, BM25 / Vektor / Hybrid): Synonym .86 / .71 / 1.00 ·
Sprachwechsel .33 / .83 / .83 · Bezeichner 1.00 / .71 / 1.00 · Mehrere Dokumente .80 / .80 / .80.

### Wie die Zahlen zu lesen sind (Kernbotschaft)

- **Jeder Retriever hat einen blinden Fleck.** BM25 scheitert an Synonymen und fast allen
  französischen/italienischen Antworten, MiniLM an reinen Codes wie NT044.
- **Hier gewinnt Hybrid klar (0.92 vs. 0.76),** weil die Fehler fast disjunkt sind.
- **Aber nicht automatisch:** Mit dem 10-mal grösseren Modell e5-large bringt Hybrid nichts
  mehr. Das grosse Modell ist besser bei Synonymen und Codes, aber **schlechter** beim
  Sprachwechsel (0.50 statt 0.83). Grösser ist nicht einfach besser. **Am eigenen Korpus messen.**
- **Chunking** bringt hier 1–2 Fragen. Das liegt im Rauschen von 25 Fragen. Ehrlich sagen.
- **Agentic Search** hat alle vier Showcase-Fragen richtig beantwortet. Bei 16 Dokumenten
  reicht das. RAG lohnt sich, wenn der Korpus so gross wird, dass Grep zu viele Treffer liefert,
  oder wenn viele Leute dieselben Fragen stellen (Index einmal bauen, jede Frage billig).
- **Retrieval-Ergebnisse sind fremde Inhalte.** Was in einem Dokument steht, landet im Kontext
  des Agents, auch eine versteckte Anweisung. Darum gelten Permissions (Übung 04) auch hier.

### Falls jemand fragt

- Die Fragen wurden **vor** der ersten Messung geschrieben, Parameter wie im alten Experiment, nicht nachgetunt.
- BM25 auf Synonymen (0.86) ist geschönt: Gezählt wird auf Dokumentebene, und die grosse R-14-01 trifft fast immer irgendwie.
- 25 Fragen: Eine Frage entspricht 0.04. Unterschiede unter 0.1 nicht überinterpretieren.
- Quellen und Lizenzfrage: `rag/sources.yaml` (offizielle BAZG-PDFs, werden geladen, nicht ins Repo kopiert).

**Plan B:** Browser streikt → `uv run search "Welche Währungsangabe gilt für Fakturen in britischen Pfund?" --mode bm25`
und `--mode vector` im Terminal, dann `uv run eval`.

---

## Demo D – Subagents und parallele Sessions (7')

**Vorbereitung:** Klon auf `solution/final` (enthält `.claude/agents/reviewer.md` und
`"worktree": {"baseRef": "head"}`). Zwei Terminals nebeneinander, beide im Klon.

```bash
git clone --branch solution/final . ../demo-d
```

Auf dem Beamer läuft dazu Szene 5 «Skalieren» aus `facilitator/konzepte/` (Tipp-Runde: Wie stark
wächst der Hauptkontext?).

### Teil 1 – Reviewer-Subagent (3'), alle machen mit

Die Teilnehmenden folgen dem Blatt [exercises/demo-d-reviewer](../exercises/demo-d-reviewer/README.md):
Vorlage nach `.claude/agents/` kopieren, `claude` neu starten, denselben Prompt absetzen.
Bei Zeitnot nur am Beamer zeigen.

1. `claude`, dann `/context` und die Zahl zeigen.
2. Prompt:
   ```
   Nutze den reviewer-Subagent, um die Änderungen seit start/03 unter app/backend/src zu reviewen
   (git diff start/03 -- app/backend/src). Fasse sein Ergebnis in 5 Zeilen zusammen.
   ```
3. Wieder `/context`: Der Hauptkontext ist kaum gewachsen, obwohl der Subagent den ganzen Diff gelesen hat.

**Satz:** «Ein Subagent liest viel und gibt wenig zurück. Und er läuft auf Haiku: billiger.»

### Teil 2 – Zwei Sessions in Worktrees (4')

1. Links `claude -w office-search`, rechts `claude -w declaration-csv`.
2. Links: `Füge GET /api/offices?query=... hinzu (Suche im Namen, ohne Gross-/Kleinschreibung), mit Tests.`
   Rechts: `Füge GET /api/declarations/export.csv hinzu (MRN, Route, Betrag, Status), mit Tests.`
3. Während beide arbeiten: drittes Terminal, `git worktree list` und `git branch`.
4. Nicht abwarten. Ende: «Jede Session hat ihr eigenes Arbeitsverzeichnis, keine gegenseitigen Edits. Zusammenführen ist normales Git.»

**Plan B:** Dauert zu lange → Sessions abbrechen, `git worktree list` zeigen genügt.
