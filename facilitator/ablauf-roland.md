# Ablauf aus Sicht Roland – Übergaben und eigene Segmente

Ergänzt [timing.md](timing.md) (Gesamtplan) und [demo-scripts.md](demo-scripts.md) (exakte Prompts).
Hier steht, **wann** Roland übernimmt, **was** in seinen Segmenten passiert und **wie** übergeben wird.

## 1. Von der Originalstruktur zum Tagesplan

Die erste Fassung («Claude Code – konzeptionelle Einführung», Teamnachmittag, 2,5 h) hatte
15 Konzepte. Der Workshop-Tag übernimmt sie alle und ergänzt einen eigenen Retrieval-Block.
**Ab Konzept 11 verschiebt sich deshalb die Nummerierung um eins.**

| Original (Nachmittag) | Konzept | Übung im Repo | Lead im Tagesplan |
|-----------------------|---------|---------------|-------------------|
| Einstieg 10' | Anatomie der Harness | 00 | Manager |
| A – Kontext 30' | 1 Context Engineering | 01 | Manager |
| | 2 Persistentes Wissen | 02 | Manager, **Roland Demo** |
| | 3 Progressive Disclosure | 03 | Manager |
| B – Steuerung & Sicherheit 30' | 4 Planen vs. Ausführen | 04 | Co / Manager |
| | 5 Autonomiestufen | 05 | Co / Manager |
| | 6 Deterministisch (Hooks) | 06 | Co / Manager |
| | 7 Reversibilität | 07 | Co / Manager |
| C – Erweitern & Verifizieren 30' | 8 Feedback-Loops | 08 | Co |
| | 9 MCP | 09 | Co |
| | 10 Vertrauensgrenzen | 10 | **Roland** |
| *(neu)* | Agentic Search vs. RAG | **11** | **Roland** |
| D – Skalieren 25' | 11 Delegation (Subagents) | **12** | **Roland** |
| | 12 Parallelisierung | **13** | **Roland** |
| | 13 Entkopplung (Remote Control) | **14** | **Roland** (über Mittag) |
| | 14 Paketierung (Plugin) | **15** | **Roland** (Capstone) |
| Abschluss 15' | 15 Modell- und Aufwandswahl | – (Abschluss) | Manager |

Was der ganze Tag gegenüber dem Nachmittag ändert: Jedes Konzept bekommt eine echte
Übung statt einer Kurzdemo. «Paketierung» ist nicht mehr nur Ausblick, sondern Capstone.

## 2. Übergaben auf einen Blick

| Zeit | Wer hat das Wort | Übergabe | Übergabe-Satz (Vorschlag) |
|------|------------------|----------|---------------------------|
| 09:00 | Manager | – | – |
| ~09:55 | Manager → **Roland** | Demo 02 (10') | Manager: «Wie viel macht eine CLAUDE.md wirklich aus? Roland zeigt es live.» |
| ~10:05 | **Roland** → Manager | Teilnehmende machen 02 selbst | Roland: «Jetzt ihr: zuerst ohne, dann mit. Achtet auf die Checkliste.» |
| 11:00 | Co / Manager | Block B | – |
| ~12:10 | Co → **Roland** | Remote-Control-Start (5') | Co: «Bevor wir essen: Roland gibt Claude eine Aufgabe mit in die Pause.» |
| 13:15 | **Roland** (5') → Co | Ergebnis Remote Control, dann Block C | Roland: «Das lief, während wir assen. Wie ein Agent sich selbst prüft, zeigt euch jetzt …» |
| ~14:05 | Co → **Roland** | Übung 10 (25') | Co: «Wir haben dem Agent Browser und Tests gegeben. Was, wenn er dem Falschen vertraut?» |
| 14:30 | **Roland** | Pause | – |
| 14:45 | **Roland** | Block R (60') | – |
| 15:45 | **Roland** | Block D (35') | – |
| 16:20 | **Roland** | Capstone (25') | – |
| 16:45 | **Roland** → Manager | Abschluss | Roland: «Ihr habt jetzt ein Team-Setup in einem Plugin. Welche Regeln braucht ihr dafür im Alltag?» |

Co-Facilitator: Während Roland vorne steht, geht der Co durch den Raum (Setup-Probleme, Limits, Abgehängte → `reset-exercise`).

## 3. Vorbereitung (Roland)

**Eine Woche vorher**

- [ ] Remote Control im Firmennetz testen: `claude --remote-control`, Verbindung vom Handy (Org-Policy, Firewall).
- [ ] Alle Demos einmal komplett durchspielen (Pro-Konto, Sonnet), Turns in `timing.md` eintragen.
- [ ] `scripts/verify-all.sh` grün.
- [ ] Setup-Mail an Teilnehmende mit Link auf `SETUP.md` (Frist: 2 Tage vorher `check-setup` grün).

**Am Vortag**

- [ ] Demo-Klone anlegen: `../demo-02-ohne` (`start/02`), `../demo-02-mit` (`solution/02`), `../demo-rc` (`start/13`).
- [ ] USB-Stick mit `rag/.cache/fastembed` (~240 MB) und gepacktem Repo inkl. `node_modules` als Plan B.
- [ ] Handy: Claude-App eingeloggt, Ladegerät.

**Am Morgen**

- [ ] Terminal-Schrift gross, zwei Terminals nebeneinander, Benachrichtigungen aus.
- [ ] `/usage` auf dem eigenen Konto prüfen: Für Demos genug Reserve bis 17:00?

## 4. Segmente im Detail

### 4.1 Demo 02 – CLAUDE.md vorher/nachher (09:55–10:05)

| Min | Was | Material |
|-----|-----|----------|
| 0–2 | Frage ins Publikum: «Was weiss Claude über unser Projekt, wenn es startet?» | – |
| 2–7 | Gleicher Prompt in `demo-02-ohne` und `demo-02-mit`, nebeneinander | demo-scripts.md, Demo 02 |
| 7–10 | Unterschiede an der Checkliste zeigen, `CLAUDE.md` kurz durchscrollen | exercises/02 Checkliste |

Botschaft: Die CLAUDE.md macht den Unterschied in den Details, die nicht im Code stehen.

### 4.2 Remote Control über Mittag (12:10–12:15 und 13:15–13:20)

- 12:10: Aufgabe starten (Prompt in demo-scripts.md, Demo 14), QR-Code zeigen. Wer will, verbindet das eigene Handy.
- Über Mittag: 1–2 Rückfragen vom Handy beantworten.
- 13:15: Verlauf und Ergebnis am Beamer, eine Freigabe vom Handy zeigen. Dann Übergabe an Co.

### 4.3 Übung 10 – Vertrauensgrenzen (14:05–14:30)

| Min | Was |
|-----|-----|
| 0–5 | Konzept: Lethal Trifecta an der Tafel (private Daten, fremde Inhalte, Weg nach aussen) |
| 5–15 | Demo mit dem präparierten Dokument (demo-scripts.md, Demo 10) |
| 15–20 | Teilnehmende ergänzen deny-Regeln, Test-Prompt (exercises/10, Teil B) |
| 20–25 | Diskussion: Welche geplanten MCP-Server kombinieren alle drei? Ergebnisse für den Abschluss notieren |

### 4.4 Block R – Agentic Search vs. RAG (14:45–15:45)

| Min | Was | Wer |
|-----|-----|-----|
| 0–10 | Einstieg: zwei Suchen, je BM25 und Vektor («Doppelbelegung», «RR-5031»), jeder Retriever hat einen blinden Fleck | Roland, Demo 11 |
| 10–25 | R1: drei Fragen nur mit Grep/Glob/Read | alle |
| 25–40 | R2: Chunking verbessern, `uv run eval` vorher/nachher | alle |
| 40–50 | R3: MCP-Server anbinden, Fragen wiederholen | alle |
| 50–60 | R4: Tabelle am Beamer, Diskussion | Roland |

Kernbotschaft für R4 (Zahlen in demo-scripts.md):
- BM25 gewinnt bei Bezeichnern, Vektoren bei Synonymen und Sprachwechsel.
- Besseres Chunking hebt Hybrid von 0.56 auf 0.70.
- **Hybrid ist hier nicht besser als reine Vektorsuche.** Ein schwacher Retriever überstimmt in
  der Fusion den guten. Hybrid lohnt sich bei Bezeichner-lastigen Anfragen.
- Für Code im Repo reicht Claudes agentische Suche fast immer. RAG lohnt sich bei grossen,
  mehrsprachigen Korpora ausserhalb des Repos.

Zeitnot? R1 als Demo am Beamer statt selbst (spart 10').

### 4.5 Block D – Skalieren (15:45–16:20)

| Min | Was |
|-----|-----|
| 0–5 | Konzept: Kontextisolation (Orchestrator-Worker), Isolation im Dateisystem (Worktrees) |
| 5–20 | Übung 12: Reviewer-Subagent (Haiku), `/context` vorher/nachher |
| 20–35 | Übung 13: Demo mit zwei Worktrees am Beamer, Teilnehmende wahlweise mit (demo-scripts.md, Demo 13) |

Wichtig vor 13: `"worktree": {"baseRef": "head"}` ansagen, sonst fehlen die Übungen des Tages im Worktree.

### 4.6 Capstone – Team-Plugin (16:20–16:45)

| Min | Was |
|-----|-----|
| 0–3 | Was wir heute gebaut haben: Skill, Settings, Hooks, Reviewer, MCP. Wie kommt das zum Team? |
| 3–15 | Plugin bündeln lassen, `claude plugin validate` |
| 15–22 | Frischer Klon, Installation mit `--scope local`, Hook-Test |
| 22–25 | Übergabe an Manager (Satz in Abschnitt 2) |

## 5. Falls doch im Nachmittagsformat (2,5 h)

Wird der Workshop doch als Nachmittag durchgeführt, gilt die Originalstruktur. Rolands Teil
schrumpft dann auf Block D (25'):

- 11 Delegation: Reviewer-Subagent als Demo (5')
- 12 Parallelisierung: Worktree-Demo (8')
- 13 Entkopplung: Remote Control live mit dem Handy (5')
- 14 Paketierung: nur Ausblick, Plugin aus `solution/final` zeigen (5')

Der RAG-Block entfällt, oder er wird als eigene Folgesession angeboten (60', Übung 11 unverändert).
