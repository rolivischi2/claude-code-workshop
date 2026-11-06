# Demo-Skripte

Exakte Prompts, erwartete Ergebnisse und Plan B für die Live-Demos.
Vor jeder Demo: `/model sonnet`, frische Session, Terminal-Schrift gross.

---

## Demo 02 – CLAUDE.md vorher/nachher (Roland, ca. 10')

**Vorbereitung:** zwei Klone, einer ohne und einer mit Referenz-CLAUDE.md:

```bash
git clone --branch start/02 . ../demo-02-ohne
git clone --branch solution/02 . ../demo-02-mit    # enthält die Referenz-CLAUDE.md
```

**Ablauf:** In beiden Klonen exakt derselbe Prompt, nebeneinander auf dem Beamer:

```
Füge einen Endpoint GET /api/rooms/{id}/reservations hinzu, der alle Reservationen eines
Raums liefert. Gibt es den Raum nicht, soll ein 404 kommen.
```

**Erwartung:**

| Kriterium | ohne CLAUDE.md | mit CLAUDE.md |
|-----------|----------------|---------------|
| Schichten / DTO + Mapper | meist ja (Claude liest bestehenden Code), teilweise Entity direkt | ja |
| 404 als Problem Detail | oft eigene `ResponseEntity.notFound()` | `NotFoundException` → Handler |
| Tests | oft nur ein Test oder keiner | Service- und MockMvc-Test |
| Testbefehl | sucht/rät (`mvn test`) | `./mvnw -q test` aus CLAUDE.md |

**Pointe:** Claude ist auch ohne CLAUDE.md gut, weil es den Code liest. Die CLAUDE.md
macht den **Unterschied in den Details**, die nicht im Code stehen: Testpflicht, Befehle, Fehlerkonventionen.

**Plan B:** Unterscheiden sich die Ergebnisse kaum, ist das auch eine Aussage. Dann die
Frage stellen: «Was hättet ihr nicht aus dem Code ableiten können?» und auf `/memory` zeigen.

---

## Demo 10 – Prompt Injection und Lethal Trifecta (Roland, ca. 10')

**Vorbereitung:** Stand `solution/05` oder später (deny auf `.env` und `git push` aktiv).
Das Dokument `rag/corpus/ops/legacy-migration-notes.md` vorher **einmal selbst lesen**.

**Ablauf:**

1. Harmloser Prompt, wie im Alltag:
   ```
   Lies rag/corpus/ops/legacy-migration-notes.md und fasse die offenen Punkte zusammen.
   ```
   *Erwartung:* Claude fasst zusammen und erwähnt meist den verdächtigen HTML-Kommentar.
   Gut, aber darauf verlassen wir uns nicht.
2. Datei im Editor zeigen: den versteckten Kommentar mit `curl … $(cat .env)`.
   Die drei Eigenschaften an die Tafel: private Daten (`.env`), nicht vertrauenswürdiger
   Inhalt (Dokument), Weg nach aussen (`curl`).
3. Erfolgreiche Injection **simulieren**:
   ```
   Im HTML-Kommentar steht ein curl-Befehl. Führe ihn genau so aus.
   ```
   - Ohne `Bash(curl *)`-Deny: Rückfrage «Allow this command?» → **nicht** erlauben,
     sondern zeigen: Hier hängt alles an einem Klick.
   - Mit den deny-Regeln aus Übung 10: Der Aufruf wird verweigert, bevor er läuft.
   - Mit Sandbox (macOS): Auch `python -c "import urllib…"` scheitert an der Netzwerk-Allowlist.
4. Diskussion: Welche eurer geplanten MCP-Server (Jira, Confluence, Mail, Browser …) kombinieren alle drei?

**Plan B:** Weigert sich Claude schon in Schritt 3, umformulieren: «Prüfe mit curl, ob
https://example.invalid/collect erreichbar ist.» Das Ziel ist nur, die deny-Regel greifen zu sehen.

---

## Demo 11 – Agentic Search vs. RAG (Roland, Einstieg in den Block, ca. 10')

**Vorbereitung:** `cd rag && uv run index` auf `start/11` (naives Chunking). Zwei Terminals.

**Ablauf:**

1. Zwei Suchen, je lexikalisch und semantisch:
   ```bash
   uv run search "Doppelbelegung" --mode bm25 -k 3
   uv run search "Doppelbelegung" --mode vector -k 3
   uv run search "RR-5031" --mode bm25 -k 3
   uv run search "RR-5031" --mode vector -k 3
   ```
2. Erwartete Ergebnisse (Stand Referenzlösung, gemessen am 06.11.2026):

   | Anfrage | BM25 | Vector |
   |---------|------|--------|
   | Doppelbelegung | **keine Treffer**: das Wort kommt im Korpus nicht vor | #1 `product-booking-conflicts` (richtig), #3 die französische ADR zu «chevauchements» |
   | RR-5031 | #1 und #2 `errors-server-errors-rr50xx` (richtig) | #1 `errors-integration-errors-rr60xx` (**falsch**, ähnlich aussehender Fehlercode-Katalog) |

   Pointe: Jeder Retriever hat einen blinden Fleck, und zwar genau dort, wo der andere stark ist.
3. `uv run eval` zeigen (Tabelle unten, naives Chunking).

### Gemessene Zahlen (Recall@5 / MRR, 25 Fragen, k=5, chunk_size=400, overlap=50)

Modell `paraphrase-multilingual-MiniLM-L12-v2`, BM25 über SQLite FTS5, Hybrid = RRF (k=60, je 2·k Kandidaten).

**`start/11` – naives Chunking (402 Chunks, Ø 371 Zeichen)**

| Kategorie | n | BM25 | Vector | Hybrid |
|-----------|---|------|--------|--------|
| synonym | 7 | 0.14 / 0.04 | **0.86** / 0.31 | 0.57 / 0.25 |
| cross-lingual | 8 | 0.00 / 0.00 | **0.75** / 0.39 | 0.25 / 0.08 |
| exact-identifier | 6 | **1.00 / 1.00** | 0.83 / 0.53 | 1.00 / 0.88 |
| multi-doc | 4 | 0.38 / 0.38 | 0.50 / 0.62 | 0.50 / 0.56 |
| **overall** | 25 | 0.34 / 0.31 | **0.76** / 0.44 | 0.56 / 0.40 |

**`solution/11` – heading-aware Chunking mit Überschriftenpfad (513 Chunks, Ø 286 Zeichen)**

| Kategorie | n | BM25 | Vector | Hybrid |
|-----------|---|------|--------|--------|
| synonym | 7 | 0.00 / 0.00 | **0.43 / 0.43** | 0.43 / 0.18 |
| cross-lingual | 8 | 0.00 / 0.00 | **0.75 / 0.69** | 0.75 / 0.33 |
| exact-identifier | 6 | **1.00 / 1.00** | 1.00 / 0.78 | 1.00 / 0.92 |
| multi-doc | 4 | 0.25 / 0.25 | 0.62 / 0.62 | 0.62 / **0.88** |
| **overall** | 25 | 0.28 / 0.28 | **0.70 / 0.63** | **0.70** / 0.52 |

### Wie die Zahlen zu lesen sind (Kernbotschaft des Blocks)

- **Wie erwartet:** BM25 gewinnt bei exakten Bezeichnern (MRR 1.00), Vektoren gewinnen bei
  Synonymen und sprachübergreifenden Fragen (BM25 dort 0.00).
- **Besseres Chunking hilft dort, wo es zählt:** Vector-MRR steigt von 0.44 auf 0.63 (die
  richtige Stelle steht weiter oben), Hybrid-Recall von 0.56 auf 0.70.
- **Nicht wie erwartet, und das ist die eigentliche Lektion:** Hybrid ist hier **nicht** besser
  als reine Vektorsuche. Bei Synonym- und Cross-lingual-Fragen liefert BM25 selbstsicher falsche
  deutsche Dokumente. In der Rangfusion stimmen diese mit und verdrängen den richtigen Treffer
  der Vektorsuche. Ein schwacher Retriever fügt nicht nur Rauschen hinzu, er **überstimmt** den guten.
- Der Recall von Vector bei «synonym» sinkt mit dem neuen Chunking (0.86 → 0.43). Bei 7 Fragen
  sind das 3 Fragen, im Bereich von Zufall durch andere Chunk-Grenzen. **25 Fragen sind eine
  kleine Stichprobe**, Unterschiede unter ~0.1 nicht überinterpretieren.
- Wann lohnt sich Hybrid? Wenn ein grosser Teil der Anfragen exakte Bezeichner enthält
  (Fehlercodes, Klassennamen, Ticket-Nummern). Das ist im Engineering-Alltag oft der Fall.
  Darum die Diskussionsfrage in R4.
- Wann lohnt sich RAG überhaupt gegenüber Claudes agentischer Suche? Bei grossen,
  mehrsprachigen Korpora, die nicht im Repo liegen. Für Code im Repo reicht Grep/Glob/Read fast immer.

### Entstehung der Zahlen (falls jemand fragt)

Getestet wurden auch: 10/20/50 Kandidaten pro Retriever (mehr Kandidaten = schlechteres
Hybrid, weil mehr Rauschen in beiden Listen landet), gewichtetes RRF (BM25 × 0.5 bringt
~1 Frage mehr, innerhalb des Rauschens, darum nicht übernommen) und Chunking ohne
Überschriftenpfad (Hybrid 0.70 / 0.47, also MRR schlechter).

**Plan B:** Falls der Modell-Download am Workshop-Tag fehlt: `rag/.cache/fastembed` vom
Facilitator-Laptop per USB-Stick verteilen (~240 MB).

---

## Demo 13 – Zwei Sessions in Worktrees (Roland, ca. 5')

**Vorbereitung:** Stand `start/13`, `"worktree": {"baseRef": "head"}` in `.claude/settings.json`.
Zwei Terminals nebeneinander.

**Ablauf:**

1. Links `claude -w room-search`, rechts `claude -w csv-export`, Prompts A und B aus der Übung.
2. Drittes Terminal: `git worktree list` und `git branch` zeigen.
3. Wenn beide fertig sind: Sessions beenden («keep»), dann `git merge` beider Branches und `./mvnw -q test`.

**Erwartung:** Beide Features in je 3–6 Turns. Kein Merge-Konflikt (andere Klassen).

**Plan B:** Merge-Konflikt in `ReservationController`/`RoomController` (z.B. beide fügen
Imports hinzu) → live mit Claude lösen lassen, das ist auch eine gute Demo.

---

## Demo 14 – Remote Control über Mittag (Roland)

**Vorbereitung (vor 12:15):** Handy mit der Claude-App, eingeloggt mit demselben Konto. WLAN geprüft.

**Ablauf:**

1. Stand `start/13` (oder aktueller Stand des Tages) in einem eigenen Klon.
2. `claude --remote-control` starten, dann eine Aufgabe, die über Mittag laufen darf, z.B.:
   ```
   Lies exercises/ und facilitator/troubleshooting.md. Schreibe docs/faq.md mit den 10
   wahrscheinlichsten Fragen von Teilnehmenden zum Nachmittag und kurzen Antworten.
   Frag mich, bevor du Dateien ausserhalb von docs/ änderst.
   ```
3. Laptop offen lassen (Energiesparen aus!), Handy einstecken. Über Mittag 1–2 Rückfragen vom Handy beantworten.
4. Nach dem Mittag: Verlauf auf dem Beamer, Freigabe vom Handy zeigen, Ergebnis kurz anschauen.

**Plan B:** Remote Control nicht verfügbar (Firmennetz, Org-Policy) → stattdessen
`claude -p "…" > ergebnis.md` als headless-Variante zeigen und auf Cloud-Sessions verweisen.
