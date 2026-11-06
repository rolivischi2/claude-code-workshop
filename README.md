# Claude Code Workshop – Übungsrepo

Ein Tag, ein Muster: **Problem → Konzept → Umsetzung in Claude Code → Übung im CLI**.

Ihr kennt Agentic Engineering und das Konzept einer Agent Harness bereits. Darum stehen heute
die **Konzepte** im Vordergrund. Wer ein Konzept verstanden hat, kann es auch auf andere
Harnesses übertragen. Claude Code ist das Werkzeug, an dem wir es üben.

> **Zuerst:** [SETUP.md](SETUP.md) durcharbeiten und `scripts/check-setup` grün bekommen.

## Ziele

Am Ende des Tages könnt ihr:

- den Kontext einer Session bewusst verwalten und Projektwissen dauerhaft ablegen,
- Claude mit Plan Mode, Permissions und Hooks steuern und absichern,
- Claude seine Arbeit selbst prüfen lassen (Tests, Browser) und mit MCP erweitern,
- einschätzen, wann eingebaute Suche reicht und wann Retrieval (RAG) etwas bringt,
- Arbeit auf Subagents und parallele Sessions verteilen,
- euer Setup als Team-Plugin paketieren.

## Ablauf

| Zeit  | Block | Übungen |
|-------|-------|---------|
| 09:00 | Einstieg: Anatomie der Harness + Setup-Check | [00](exercises/00-setup-check/) |
| 09:30 | **A – Kontext** | [01](exercises/01-kontext/) · [02](exercises/02-persistentes-wissen/) · [03](exercises/03-progressive-disclosure/) |
| 10:45 | Pause | |
| 11:00 | **B – Steuerung & Sicherheit** | [04](exercises/04-planen-vs-ausfuehren/) · [05](exercises/05-permissions/) · [06](exercises/06-hooks/) · [07](exercises/07-reversibilitaet/) |
| 12:15 | Mittag (mit Live-Demo Remote Control) | [14](exercises/14-remote-control/) |
| 13:15 | **C – Verifizieren & Erweitern** | [08](exercises/08-feedback-loops/) · [09](exercises/09-mcp/) · [10](exercises/10-vertrauensgrenzen/) |
| 14:30 | Pause | |
| 14:45 | **R – Retrieval: Agentic Search vs. RAG** | [11](exercises/11-rag/) |
| 15:45 | **D – Skalieren** | [12](exercises/12-subagents/) · [13](exercises/13-parallelisierung/) |
| 16:20 | **Capstone: Team-Plugin** | [15](exercises/15-team-plugin/) |
| 16:45 | Abschluss: Modell- und Aufwandswahl, Teamregeln, nächste Schritte | |

## Was ist in diesem Repo?

```
app/backend/    Spring Boot 3 (Java 21): Räume und Reservationen, H2, Tests mit JUnit/MockMvc
app/frontend/   Angular: Raumliste, Raumdetail, Reservationsformular, Playwright-Smoke-Test
rag/            Handbuch-Korpus (de/fr/en), Indexer, MCP-Server, Evaluation (Übung 11)
exercises/      Ein Ordner pro Übung mit Aufgabe, Prompts und Erfolgskriterium
scripts/        setup, check-setup, reset-exercise (je .sh und .ps1)
.claude/        Absichtlich fast leer: ihr baut es in den Übungen auf
```

Die Demo-App «Raumreservation» ist klein gehalten (Backend und Frontend je unter 1500 Zeilen).
Das ist Absicht: Jede Datei, die Claude liest, kostet Kontext und damit Nutzung eures Pro-Abos.

Alle Daten sind **synthetisch**. Die `.env` enthält nur Fake-Werte. Schützt sie in Übung 05
trotzdem so, als wären sie echt.

## So arbeitet ihr mit dem Repo

Die Übungen bauen aufeinander auf. Ihr arbeitet einfach weiter auf eurem Stand.

| Referenz | Bedeutung |
|----------|-----------|
| `main` | Startzustand des Tages (= `start/00`), solange ihr nicht selbst darauf committet |
| `start/NN` (Git-Tag) | Stand **vor** Übung NN, inklusive aller Lösungen davor |
| `solution/NN` (Branch) | Referenzlösung von Übung NN |
| `solution/final` | Alles zusammen: komplettes `.claude/`-Setup und Team-Plugin |

**Abgehängt?** Kein Problem, so springt ihr zum Start einer Übung:

```bash
scripts/reset-exercise.sh 08        # macOS / Linux / Git Bash
powershell -ExecutionPolicy Bypass -File scripts\reset-exercise.ps1 08   # Windows
```

Eure bisherigen Änderungen werden dabei nicht gelöscht, sondern mit `git stash` gesichert.
Lösung anschauen: `git diff start/08 solution/08`.

## Sparsam mit dem Pro-Abo

Das Pro-Abo hat ein rollendes 5-Stunden-Fenster und ein Wochenlimit. Ein paar Gewohnheiten
helfen über den Tag:

- **Sonnet** als Standardmodell (`/model`), Opus nur wenn wirklich nötig.
- Eine Übung = eine Session. Danach `/clear`, statt alten Kontext mitzuschleppen.
- Gezielt mit `@datei` referenzieren statt «lies das ganze Projekt».
- Jede Übung hat einen **Token-Tipp** und ist in höchstens etwa 10 Turns lösbar.
- Limit erreicht? Mit dem Nachbarn pairen und mit `reset-exercise` auf den nächsten Stand springen.

## Weiterführend

- [Claude Code Dokumentation](https://code.claude.com/docs/en/overview) · [What's new](https://code.claude.com/docs/en/whats-new/index)
- [Anthropic Academy – alle Kurse](https://www.anthropic.com/learn)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic Engineering Blog)
