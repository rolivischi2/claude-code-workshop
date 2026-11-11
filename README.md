# Claude Code Workshop – Übungsrepo

Ein Nachmittag (2,5 Stunden), ein Muster: **Problem → Konzept → Umsetzung in Claude Code → Übung im CLI**.

Ihr kennt Agentic Engineering und das Konzept einer Agent Harness bereits. Darum stehen die
**Konzepte** im Vordergrund. Wer ein Konzept verstanden hat, kann es auch auf andere
Harnesses übertragen. Claude Code ist das Werkzeug, an dem wir es üben.

> **Zuerst:** [SETUP.md](SETUP.md) durcharbeiten und `scripts/check-setup` grün bekommen.

## Ziele

Am Ende des Nachmittags könnt ihr:

- den Kontext einer Session bewusst verwalten, Projektwissen in der `CLAUDE.md` ablegen und Skills bauen,
- Claude mit Plan Mode, Permissions und Hooks steuern und Fehler mit `/rewind` rückgängig machen,
- Claude über MCP einen Browser geben, damit es seine Arbeit selbst prüft,
- einschätzen, wann eingebaute Suche reicht und wann Retrieval (RAG) etwas bringt,
- grob einordnen, wofür Subagents und parallele Sessions gut sind.

**Präsentation des Nachmittags** (alle Folien, auch zu jeder Übung): https://claude-code-workshop-black.vercel.app
Lokal: `praesentation/index.html` öffnen.

## Ablauf

| Zeit | Block | Format | Übungen |
|------|-------|--------|---------|
| 0:00 | Einstieg: Anatomie der Harness, Setup-Check | Input | [00](exercises/00-setup-check/) |
| 0:10 | **A – Kontext und Skills** | Hands-on | [01](exercises/01-kontext-und-claude-md/) · [02](exercises/02-skills/) |
| 0:41 | **B – Steuerung**: Plan Mode, Permissions, Hooks, Rewind | Hands-on | [03](exercises/03-plan-mode/) · [04](exercises/04-permissions-und-hooks/) · [05](exercises/05-rewind/) als Demo, optional selbst |
| 1:21 | Pause | | |
| 1:31 | **C – Browser über MCP** | Hands-on | [06](exercises/06-browser-mcp/) |
| 1:54 | **R – Agentic Search vs. RAG** auf der NCTS-Dokumentation | Demo | |
| 2:17 | **D – Skalieren**: Subagents und parallele Sessions | Demo | |
| 2:24 | Abschluss: Modell- und Aufwandswahl, Teamregeln, Ausblick | Input | |

Am Ende der Blöcke A, B, C und R gibt es eine kurze Frage ans Team: Wo kommt das in euren Projekten vor?
Jedes Übungsblatt hat eine **Zusatzaufgabe** für alle, die früh fertig sind. Freiwillige Teile sind als «optional» markiert.

## Was ist in diesem Repo?

```
app/backend/    Spring Boot 3 (Java 21): Zollstellen, Garantien, Transitanmeldungen. H2, JUnit/MockMvc
app/frontend/   Angular: Zollstellen, Detail, Formular «Transitanmeldung erfassen», Playwright-Smoke-Test
exercises/      Ein Ordner pro Übung mit Aufgabe, Prompts und Erfolgskriterium
scripts/        setup, check-setup, reset-exercise (je .sh und .ps1)
rag/            Demo des Facilitators (Block R), für die Übungen nicht nötig
praesentation/  Die Folien des Nachmittags als statische Seite (auch gehostet, siehe oben)
facilitator/    Unterlagen für die Moderation: Masterplan, Zeitplan, Sprechskript, Demo-Abläufe, Plan B
.claude/        Absichtlich fast leer: ihr baut es in den Übungen auf
```

Die Demo-App «Transitanmeldungen» lehnt sich an das Versandverfahren NCTS an, ist aber
**stark vereinfacht und synthetisch**. Regeln, Codes und Daten sind kein Abbild der echten
NCTS-Regeln. Die App ist klein gehalten (Backend und Frontend je unter 1500 Zeilen). Das ist
Absicht: Jede Datei, die Claude liest, kostet Kontext und damit Nutzung eures Pro-Abos.

Die `.env` enthält nur Fake-Werte. Schützt sie in Übung 04 trotzdem so, als wären sie echt.

## Wer liest was?

| Ihr seid … | Dann lest … |
|------------|-------------|
| Teilnehmende | [SETUP.md](SETUP.md), dann am Nachmittag die Blätter unter [exercises/](exercises/) |
| Moderation (den Workshop selbst halten) | [facilitator/masterplan.md](facilitator/masterplan.md) als Einstieg, dann das [Sprechskript](facilitator/sprechskript.md) (Folie für Folie: was erscheint, was gesagt wird, häufige Fragen), den [Zeitplan](facilitator/timing.md) und die [Demo-Abläufe](facilitator/demo-scripts.md) |
| Neugierig auf die Folien | https://claude-code-workshop-black.vercel.app oder [praesentation/README.md](praesentation/README.md) |
| Neugierig auf das Suchexperiment (Block R) | [rag/README.md](rag/README.md) |

## So arbeitet ihr mit dem Repo

Die Übungen bauen aufeinander auf. Ihr arbeitet einfach weiter auf eurem Stand.

| Referenz | Bedeutung |
|----------|-----------|
| `main` | Startzustand (= `start/00`), solange ihr nicht selbst darauf committet |
| `start/NN` (Git-Tag) | Stand **vor** Übung NN, inklusive aller Lösungen davor |
| `origin/solution/NN` (Branch) | Referenzlösung von Übung NN |
| `origin/solution/final` | Alles zusammen, inklusive Reviewer-Subagent aus der Demo D |

**Abgehängt?** Kein Problem, so springt ihr zum Start einer Übung:

```bash
scripts/reset-exercise.sh 04        # macOS / Linux / Git Bash
powershell -ExecutionPolicy Bypass -File scripts\reset-exercise.ps1 04   # Windows
```

Eure bisherigen Änderungen werden dabei nicht gelöscht, sondern mit `git stash` gesichert.
Lösung anschauen: `git diff start/04 origin/solution/04`.

## Sparsam mit dem Pro-Abo

Alle Übungen sind mit dem Pro-Abo (20 $) machbar. Das Abo hat ein rollendes 5-Stunden-Fenster
und ein Wochenlimit. Ein paar Gewohnheiten helfen:

- **Sonnet** als Standardmodell (`/model sonnet`), Opus nur wenn wirklich nötig.
- Eine Übung = eine Session. Danach `/clear`, statt alten Kontext mitzuschleppen.
- Gezielt mit `@datei` referenzieren statt «lies das ganze Projekt».
- Jede Übung hat einen **Token-Tipp** und ist in höchstens etwa 8 Turns lösbar.
- Limit erreicht? Mit dem Nachbarn pairen und mit `reset-exercise` auf den nächsten Stand springen.

## Weiterführend

- [Claude Code Dokumentation](https://code.claude.com/docs/en/overview) · [What's new](https://code.claude.com/docs/en/whats-new/index)
- [Anthropic Academy – alle Kurse](https://www.anthropic.com/learn)
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic Engineering Blog)
- Heute nicht behandelt: [Remote Control](https://code.claude.com/docs/en/remote-control) (Session vom Handy aus weiterführen) · [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web) (Sessions in der Cloud) · [Headless](https://code.claude.com/docs/en/headless) (`claude -p` für Skripte und CI) · [Scheduled Tasks](https://code.claude.com/docs/en/routines)
