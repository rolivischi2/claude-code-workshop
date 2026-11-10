# Masterplan – Claude Code Workshop (2,5 h, ein Facilitator)

Das zentrale Dokument für den Nachmittag: **Rahmen, Entscheide, Ablauf, Inhalte, Repo-Struktur
und Stand**. Details stehen in den verlinkten Dokumenten. Bei Widersprüchen gilt das Detaildokument.

| Detail | Dokument |
|--------|----------|
| Zeitplan, Aufwand pro Übung, Kürzungsreserve | [timing.md](timing.md) |
| Blöcke im Detail, Vorbereitungs-Checkliste | [ablauf.md](ablauf.md) |
| Exakte Abläufe der Demos R und D | [demo-scripts.md](demo-scripts.md) |
| Sprechskript zum Proben: beide Decks Schritt für Schritt, häufige Fragen, Glossar | [sprechskript.md](sprechskript.md) |
| Animierte Schemata für die Inputs | [konzepte/README.md](konzepte/README.md) |
| Präparierte Fehler, Seed-Daten, Rezepte | [seeded-issues.md](seeded-issues.md) |
| Plan B für Technik, Netz, Abo | [fallback.md](fallback.md), [troubleshooting.md](troubleshooting.md) |
| Für Teilnehmende | [README.md](../README.md), [SETUP.md](../SETUP.md), [.claude/README.md](../.claude/README.md) |

---

## 1. Rahmen

| | |
|---|---|
| Dauer | 2,5 Stunden, ein Nachmittag |
| Facilitator | Roland, allein (keine Übergaben) |
| Publikum | kennt Agentic Engineering und das Konzept einer Harness. **Konzepte vor Werkzeug.** |
| Abo der Teilnehmenden | Claude Pro (20 $). Sonnet durchgehend, **höchstens 8 Turns pro Übung** |
| Projektkontext | Schweizer Zoll-Transitverfahren (NCTS): Übungs-App **und** RAG-Demo teilen dieselbe Domäne |
| Muster pro Block | Problem → Konzept → Umsetzung in Claude Code → Übung im CLI |

## 2. Entscheide (2026-11-07)

| Thema | Entscheid |
|-------|-----------|
| Inhalt behalten | **A** Kontext und Skills · **B** Plan Mode, Permissions, Hooks, Rewind · **C** nur Browser über MCP · **R** RAG-Experiment als vorbereitete, animierte Demo · **D** sehr kurze Demo Subagents und Worktrees |
| Gestrichen | Feedback-Loops (in 06 enthalten), Vertrauensgrenzen (ein Satz in R), Remote Control, Team-Plugin |
| Übungs-Stack | Spring Boot 3 (Java 21) + Angular bleiben |
| Domäne der App | synthetische NCTS-Transit-App (Zollstellen, Sicherheiten, Transitanmeldungen) |
| Repo | an Ort und Stelle umgebaut. Tagesversion archiviert unter `archive/fullday-v1` und `archive/fullday-v1-main`, alte 33 Refs gelöscht |
| RAG-Korpus | öffentliche BAZG-Dokumentation, von Claude zusammengestellt, **geladen, nicht committet** |
| RAG-Fragen | Entwurf von Claude, fachliche Prüfung durch Roland über eine Review-Seite |
| Setup | ohne Python/uv: nur Git, JDK 21, Node, Claude Code. Devcontainer als Plan B |
| Grundsätze | Ehrliches RAG-Ergebnis (nicht nachtunen, nachdem gemessen wurde) · Hooks als Node-`.mjs` in Exec-Form · Doku Deutsch, Schweizer Schreibweise (kein ß) |

## 3. Ablauf (150')

| Zeit | Min | Block | Format | Übung / Demo |
|------|-----|-------|--------|--------------|
| 0:00 | 10 | Einstieg: Anatomie der Harness (Szene «Landkarte»), `/model sonnet` | Input + Slash-Commands | 00 (5') |
| 0:10 | 35 | **A – Kontext und Skills** | 5' Input, Hands-on | 01 (15'), 02 (15') |
| 0:45 | 40 | **B – Steuerung** | 5' Input, Hands-on | 03 (15'), 04 (15'), 05 (5') |
| 1:25 | 10 | Pause (App für 06 läuft schon: letzter Schritt von 05) | | |
| 1:35 | 20 | **C – Browser über MCP** | 3' Input, Hands-on | 06 (17') |
| 1:55 | 20 | **R – Agentic Search vs. RAG** auf der NCTS-Doku | Demo | `rag/viz/` |
| 2:15 | 7 | **D – Skalieren**: Subagent (alle machen mit) + zwei Worktree-Sessions | Mitmach-Demo | `exercises/demo-d-reviewer`, `solution/final` |
| 2:22 | 8 | Abschluss: Szene «Rückblick», `/model`, `/effort`, Teamregeln, nächste Schritte | Input + Diskussion | |

Kürzungsreserve in dieser Reihenfolge: 05 als Demo → 02 Skill aus `solution/02` übernehmen →
R ohne Tipp-Runden (`g`) und ohne Chunking-Szene → D nur am Beamer → 03 nur planen, Umsetzung per `reset-exercise.sh 04` überspringen.

Zu jedem Input gibt es eine animierte Szene in `facilitator/konzepte/` (Landkarte, Kontext, Leitplanken, MCP,
Skalieren, Rückblick). Sie ersetzen Erklärzeit, die Inputs werden nicht länger. Publikum einbeziehen:
**Tipp-Runden** (erst per Handzeichen raten, dann auflösen) in den Konzept-Szenen und in Demo R.

## 4. Übungen (Hands-on, `exercises/`)

| Nr | Ordner | Block | Ziel | Aufgabe / Ergebnis |
|----|--------|-------|------|--------------------|
| 00 | `00-setup-check` | Einstieg | Funktionierende Umgebung, Login, sparsames Modell | `/status`, `/model sonnet`, `/usage`, `/context` |
| 01 | `01-kontext-und-claude-md` | A | Was Kontext kostet, was eine `CLAUDE.md` ändert | `GET /api/guarantees/{grn}` zuerst ohne, dann mit `CLAUDE.md` (`/init` + Konventionen). Mit Konventionen entsteht ein Mapper |
| 02 | `02-skills` | A | Progressive Disclosure: Skill wird von selbst geladen | Skill `rest-endpoint` bauen, damit `GET /api/guarantees/{grn}/balance` |
| 03 | `03-plan-mode` | B | Planen, Plan kritisieren, dann ausführen | Feature «Abgabenbetrag korrigieren»: `PUT /api/declarations/{mrn}/amount`. Plan-Kritik deckt den Off-by-one in `exceedsReferenceAmount` auf. Spec in `docs/specs/betrag-korrigieren.md` |
| 04 | `04-permissions-und-hooks` | B | Grenzen und Garantien | deny `.env`/`git push`, ask `rm` · PostToolUse-Hook formatiert die geänderte Datei (Vorlage `vorlage/format-edited-file.mjs`) · PreToolUse-Hook schützt `src/generated/api-types.ts` |
| 05 | `05-rewind` | B | Reversibilität | `/rewind` zurück und wieder vor, mit Git vergleichen |
| 06 | `06-browser-mcp` | C | Claude prüft sich selbst im Browser | Playwright-MCP (aus `node_modules`, `--isolated`), verschluckter TR-4091-Fehler im Formular reproduzieren, beheben, mit e2e-Test absichern |

Jedes Blatt hat dieselbe Struktur: Ziel · Konzept · Aufgabe · Vorgeschlagene Prompts ·
Erfolgskriterium · Hinweise · Token-Tipp · Doku. Jede Übung hat eine `LOESUNG.md` auf ihrem `solution/NN`.

## 5. Übungs-App (synthetisch)

```
app/backend/   com.example.transit: office/ · guarantee/ · declaration/ · common/   (H2, data.sql relativ zu CURRENT_DATE)
app/frontend/  Angular zoneless: Zollstellen, Detail, Formular «Transitanmeldung erfassen», Playwright-e2e
```

| Endpoint | Zweck |
|----------|-------|
| `GET/POST /api/offices`, `GET /api/offices/{code}` | Zollstellen (Rolle Abgang, Bestimmung oder beides) |
| `GET /api/guarantees` | Sicherheiten (GRN, Referenzbetrag, offen) |
| `GET /api/declarations[?office=]`, `GET /api/declarations/{mrn}`, `POST /api/declarations` | Transitanmeldungen |
| `POST /api/declarations/{mrn}/arrival` | Ankunft melden (TR-4092, wenn nicht `OPEN`) |

Fehlercodes `TR-<Status><n>`: 4000–4004, 4091 (Sicherheit reicht nicht), 4092, 4093.

**Präparierte Stellen** (Details in [seeded-issues.md](seeded-issues.md)):

| # | Stelle | Gebraucht in |
|---|--------|--------------|
| 1 | `exceedsReferenceAmount` mit `>= 0` statt `> 0` | 03 |
| 2 | `@Disabled` Test `allowsDeclarationUpToReferenceAmount` | 03 |
| 3 | `FristFormatter.java` unformatiert (einziger Spotless-Treffer) | 04 |
| 4 | `declaration-form.ts` verschluckt Backend-Fehler | 06 |
| 5 | `src/generated/api-types.ts` «generiert», geschützt | 04 |
| 6 | `GuaranteeService` baut DTO ohne Mapper | 01 |

Rezept: Genève-Routes → Basel, Sicherheit G3 (noch 500 verfügbar): Betrag **600** → TR-4091,
Betrag **500** → fälschlich abgelehnt (Fehler 1).

## 6. Git-Kette

```
main = start/00 ─▶ solution/00 = start/01 ─▶ solution/01 = start/02 ─▶ … ─▶ solution/06 ─▶ solution/final
```

| Referenz | Inhalt |
|----------|--------|
| `main` | Startzustand (= `start/00`) |
| `start/NN` (Tag) | Stand vor Übung NN = `solution/NN-1` |
| `solution/NN` (Branch) | Referenzlösung inkl. `exercises/NN-*/LOESUNG.md` |
| `solution/final` | + `.claude/agents/reviewer.md` (Haiku) und `"worktree": {"baseRef": "head"}` für Demo D |
| `archive/fullday-v1`, `archive/fullday-v1-main` | Tagesversion (16 Übungen, drei Facilitators) |

Was jede Lösung hinzufügt:
01 `CLAUDE.md` · 02 Skill + `GuaranteeBalance*` · 03 `updateAmount`, Bugfix, Spec ·
04 `.claude/settings.json` + zwei Hooks, `FristFormatter` formatiert · 05 – ·
06 `.mcp.json`, `server-error-message.ts`, e2e-Test `declaration-guarantee-exceeded.spec.ts`.

Werkzeuge: `scripts/reset-exercise.sh NN` (sichert per `git stash`, springt auf `start/NN`) ·
`scripts/verify-all.sh [--e2e]` (prüft jede Referenz: Backend, Settings, Spotless, Frontend, e2e).

## 7. Setup für Teilnehmende

- **Variante A (lokal):** Git, JDK 21, Node, Claude Code → `scripts/setup.sh` bzw. `.ps1` →
  `scripts/check-setup.sh` grün. Playwright-Chromium kommt über `npm ci` + `npx playwright install chromium`.
- **Variante B (gesperrter Laptop):** `.devcontainer/devcontainer.json` (Java 21 + Node, installiert
  Claude Code, führt `setup.sh` aus, installiert Chrome für Playwright). Codespaces oder lokales Docker.
- Setup ist Hausaufgabe. Frist: 2 Tage vorher `check-setup` grün.

## 8. Demo R – Agentic Search vs. RAG (`rag/`, nur Facilitator)

**Korpus:** 16 BAZG-PDFs (267 Seiten; 13 de, 2 fr, 1 it), Liste in `rag/sources.yaml`, geladen nach
`rag/.cache/` (nicht im Repo). Kern: R-14-01 gVV, R-14-10, R-14-01 Anhänge, R-10-TP,
Sicherheitsformulare, NCTS-Phase-5-Informationen, dazu R-14-03 (fr), R-14-04 NATO 302 (it), Merkblatt ZVE (fr).

**Pipeline** (am Vortag, braucht Netz):

```bash
cd rag
uv run fetch && uv run convert && uv run index --all && uv run eval && uv run export-viz
```

PDF → Markdown (`pymupdf4llm`) → Chunking nach Überschriftenpfad (Vergleich: feste Länge) →
SQLite FTS5 (BM25) + sqlite-vec (Vektor) → Hybrid über RRF (k=60). Agent-Baseline mit
`claude -p --output-format stream-json` (`uv run record-agent`, 4 Showcase-Fragen).

**Fragen:** 25 deutsche Fragen in `rag/eval/questions.yaml`, vier Kategorien:
Synonym, Sprachwechsel, Bezeichner, mehrere Dokumente. Showcase: S2, C3, E1, M3.

**Ergebnis** (Recall@5, MRR in Klammern):

| Variante | BM25 | Vektor | Hybrid |
|----------|------|--------|--------|
| fester Schnitt + MiniLM | 0.76 | 0.70 | 0.86 |
| **Überschriften + MiniLM** (Hauptvariante) | 0.76 | 0.76 | **0.92** (0.78) |
| Überschriften + e5-large | 0.76 | 0.86 | 0.86 |

Kernbotschaften: Jeder Retriever hat einen blinden Fleck · Hybrid gewinnt hier, weil die Fehler
disjunkt sind · das grössere Modell ist beim Sprachwechsel schlechter (0.50 statt 0.83) → am eigenen
Korpus messen · Agentic Search beantwortet alle 4 Showcase-Fragen in 3–4 Turns (21–36k Tokens) ·
Retrieval-Ergebnisse sind fremde Inhalte.

**Visualisierung** `rag/viz/index.html` (statisch, offline über `file://`, lädt `data.js`,
sonst `data.sample.js` mit Badge «Beispieldaten»):

| Szene | Inhalt |
|-------|--------|
| 1 Korpus | 16 Dokumente als Kacheln (Seiten, Sprachen), dann die zwei Wege: Index oder selbst suchen |
| 2 Chunking | feste Länge vs. Überschriftenpfad (`t`) |
| 3 BM25 | Suchbegriffe leuchten auf, blinder Fleck bei Synonymen und Sprachen |
| 4 Vektor | 2D-Karte (PCA), Frage fliegt ein, Top-k-Nachbarn |
| 5 Hybrid | RRF mit `1/(k+Rang)`-Anteilen |
| 6 Agent | aufgezeichneter Lauf als Zeitleiste (Turns, Tokens) |
| 7 Messung | jede Frage ein Punkt pro Suchverfahren, dann Varianten als Karten. Detail-Diagramme mit `d` |
| 8 Fazit | vier Kernaussagen |

Tasten: ←/→ Schritt, Shift+←/→ Szene, `1`–`8`, `q` Frage, `g` Tipp-Runden aus/ein, `r` wiederholen, `f` Vollbild, `?` Hilfe.

Tipp-Runden in den Szenen 3, 4, 6 und 7. Die Auflösung wird aus `data.js` berechnet, nicht fest eingetragen.

## 9. Demo D – Skalieren (7')

Klon auf `solution/final`, zwei Terminals.

1. **Reviewer-Subagent (3'), alle machen mit** (Blatt `exercises/demo-d-reviewer`): `/context` → Reviewer auf `git diff start/03 -- app/backend/src` → `/context`:
   Hauptkontext kaum gewachsen, Subagent läuft auf Haiku.
2. **Worktrees (4'):** `claude -w office-search` und `claude -w declaration-csv` parallel,
   drittes Terminal `git worktree list`. Nicht abwarten.

## 10. Repo-Struktur

```
README.md, SETUP.md          für Teilnehmende
.claude/README.md            was in den Übungen in .claude/ entsteht
.devcontainer/               Variante B
app/backend/, app/frontend/  Übungs-App
exercises/00–06/             Übungsblätter (+ Vorlage in 04), demo-d-reviewer/ (Mitmach-Teil von Demo D)
scripts/                     setup, check-setup, reset-exercise (.sh/.ps1), verify-all.sh
facilitator/                 dieses Dokument + Detaildokumente (siehe oben), konzepte/ (animierte Input-Szenen)
rag/                         sources.yaml · indexer/ (fetch, pdf, chunking, store, search, embeddings)
                             eval/ (questions.yaml, evaluate, record_agent, export_viz) · mcp_server/ · viz/
```

Nicht committet (`.gitignore`): `*.pdf`, `rag/.cache/`, `rag/viz/data.js` (BAZG-Textauszüge), `.env.local`, `.claude/settings.local.json`.

## 11. Abweichungen vom ursprünglichen Plan

| Plan | Umgesetzt | Grund |
|------|-----------|-------|
| 03: «Ankunft melden» | 03: «Abgabenbetrag korrigieren» | Ankunft ist beim Umbau der App bereits entstanden. Das neue Feature muss die Sicherheitsprüfung wiederverwenden und führt so direkt zum Off-by-one |
| 02: `GET /api/offices/{code}/declarations?status=OPEN` | 02: `GET /api/guarantees/{grn}/balance`, 01: `GET /api/guarantees/{grn}` | passt zum Mapper-Vergleich in 01 und zur Prüfung in 03 |
| 6 Szenen in der Visualisierung | 8 Szenen (+ Korpus, + Fazit) | Bild für den Einstieg, Kernaussagen als eigene Schlussfolie |
| Inputs nur gesprochen, Demos R und D nur zum Zuschauen | Konzept-Szenen, Tipp-Runden, D zum Mitmachen | Review vom 2026-11-10: 35 Minuten am Stück ohne Aktivität des Publikums |
| Korpus mit Serie «Dokumentation NCTS für Zollbeteiligte» | aktuelle BAZG-Dokumente | Die Serie ist online nicht mehr verfügbar |

## 12. Stand und offene Punkte (2026-11-10)

**Erledigt**

- [x] Umbau in drei Commits auf `main` (a94999a, 3ecd27e, 4aae562), Kette neu aufgebaut, Archiv-Tags gesetzt
- [x] `scripts/verify-all.sh --e2e`: alle 15 Referenzen grün
- [x] RAG-Pipeline gelaufen, Zahlen in [demo-scripts.md](demo-scripts.md) eingetragen
- [x] Review-Seite für die RAG-Fragen veröffentlicht: https://claude.ai/artifact/QWR44kzcnrqiKga1WAGvJp

- [x] Review vom 2026-11-10 (Branch `workshop-visuals`): Konzept-Szenen, Korpus-Szene, Tipp-Runden, Demo D zum
      Mitmachen, Korrekturen an den Blättern (04 löscht nicht mehr `target`, 00 ohne `check-setup`, App-Start vor der Pause)

**Offen (Roland)**

- [ ] Konzept-Szenen und Tipp-Runden ansehen, Texte anpassen (Schlussfrage, Kernaussage 3 zum Chunking)
- [ ] Danach: Git-Kette auf den neuen `main` nachziehen (`solution/*` rebasen, `start/NN` versetzen), `verify-all.sh --e2e`
- [ ] Szene «Kontext»: schematische Breiten durch die `/context`-Werte aus dem Dry-Run ersetzen

- [ ] RAG-Fragen auf der Review-Seite prüfen (noch keine Urteile erfasst). Danach: `questions.yaml`
      anpassen, Header «Entwurf» entfernen, `uv run index --all && uv run eval && uv run export-viz`,
      Zahlen hier und in `demo-scripts.md` / `rag/README.md` nachführen
- [ ] Quellenliste `rag/sources.yaml` prüfen
- [ ] Dry-Run 00–06 mit Pro-Konto auf Sonnet, Turns und `/usage` in [timing.md](timing.md) eintragen
- [ ] `.ps1`-Skripte auf echtem Windows testen
- [ ] Devcontainer einmal bauen (Codespaces oder Docker)
- [ ] `/rewind`-Verhalten in `LOESUNG.md` von 05 und die Vorher/Nachher-Unterschiede in 01 im Dry-Run bestätigen
- [ ] Generalprobe der 150' mit Uhr
