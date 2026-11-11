# Zeitplan (2,5 h, ein Facilitator)

Roland führt allein durch den Nachmittag. Darum gilt: **Input kurz, Übungen klar, Demos vorbereitet.**
Während der Übungen geht Roland durch den Raum. Die Übungsblätter sind so geschrieben, dass sie
ohne Erklärung funktionieren.

| Zeit | Min | Block | Inhalt | Format | Übung |
|------|-----|-------|--------|--------|-------|
| 0:00 | 10 | Einstieg | Anatomie der Harness (Konzeptlandkarte), Ziele, Folie «Setup», `/model sonnet` | Input + Slash-Commands | 00 (5') |
| 0:10 | 31 | **A – Kontext und Skills** | Kontext als Budget, `CLAUDE.md`, Progressive Disclosure | 5' Input, 2 Übungen, 3' Teamfrage | 01 (15'), 02 (8') |
| 0:41 | 40 | **B – Steuerung** | Plan Mode, Permissions, Hooks, `/rewind` | 5' Input, 2 Übungen, 2' Demo, 3' Teamfrage | 03 (15'), 04 (15'), 05 als Demo |
| 1:21 | 10 | Pause (App für 06 vorher starten, Befehle auf der Pausenfolie) | | | |
| 1:31 | 23 | **C – Browser über MCP** | MCP-Prinzip, Playwright-MCP, Claude prüft sich selbst | 3' Input, 1 Übung, 3' Teamfrage | 06 (17') |
| 1:54 | 23 | **R – Agentic Search vs. RAG** | Visualisierung `praesentation/`, echte Zahlen auf der NCTS-Dokumentation | 20' Demo, 3' Teamfrage | – |
| 2:17 | 7 | **D – Skalieren** | Reviewer-Subagent, zwei Worktree-Sessions parallel. Nur der Facilitator, live am geteilten Bildschirm | Live-Demo | – |
| 2:24 | 6 | Abschluss | Rückblick, Modell- und Aufwandswahl (`/model`, `/effort`), erste Teamregeln, Ausblick (1') | Input | – |
| 2:30 | | Ende | | | |

Stand 2026-11-11, nach dem Feedback zur Präsentation: Übung 02 übernimmt den fertigen Skill (15' → 8'), Übung 05
ist eine Demo am Beamer (5' → 2'). Die gewonnenen 10 Minuten gehen an vier Teamfragen (je 3'), der Abschluss gibt
2 Minuten ab. **Dieser Plan ist gerechnet, nicht gestoppt.** Er hat keine Reserve.

## Bilder zu den Inputs

Die Folien aus `praesentation/` ersetzen Erklärzeit:

| Zeit | Folien (Kürzel wie im Sprechskript) | Schätzfrage (Handzeichen) |
|------|--------------------------------------|--------------------------|
| 0:00 | Start 1 Ablauf · Start 2 Überblick · Start 3 Setup | – |
| 0:10 | A1 Kontext | Startbelegung aus Übung 00 |
| 0:38 | A5 Teamfrage | – |
| 0:41 | B1 Leitplanken | allow im Projekt gegen deny beim User |
| nach Übung 04 | B5 Rewind (rund 1 Minute) · B6 Demo 05 (2 Minuten) · B7 Teamfrage | – |
| 1:31 | C1 MCP, nach Übung 06 C3 Teamfrage | – |
| 1:54 | R1 bis R10 (Korpus bis Fazit) · R11 Teamfrage | BM25, Vektor, Turns des Agents, grösseres Modell |
| 2:17 | D1 Skalieren · D2 Demo · Live-Demo · D3 Ablauf | – |
| 2:24 | Schluss 1 Rückblick · Schluss 2 Ausblick | – |

Zu jeder Übung gibt es eine eigene Folie (Start 4, A2 bis A4, B2 bis B4, C2) mit Uhr (`z`), dazu B6 als Demo und B8 Pause.
Jede Übungsfolie ab 02 nennt den Befehl zum Einsteigen (`scripts/reset-exercise.sh NN`) und eine Zusatzaufgabe für Schnelle.

**Noch nicht gestoppt:** R8 «Test» (rund 1 Minute) liegt im 20-Minuten-Budget von R, das schon vorher keine
Reserve hatte. D1 und D3 liegen im 7-Minuten-Budget von D, das für die Live-Demo allein geplant gewesen ist.
Die Folie B5 «Rewind» (1 Minute) liegt im Input von B.

Eine Schätzfrage kostet rund 30 Sekunden. `g` schaltet alle aus.

## Pro Übung: Aufwand

Gemessen bei einem Dry-Run mit einem **Pro-Konto auf Sonnet**. Die Spalten «Turns» und «Nutzung»
werden beim Dry-Run ausgefüllt. Alles über 8 Turns muss vereinfacht werden.

| Übung | Zeitbudget | Turns (Dry-Run) | Nutzung 5h-Fenster (Dry-Run) | Bemerkung |
|-------|-----------|-----------------|------------------------------|-----------|
| 00 Setup-Check | 5' | zu messen | zu messen | nur Slash-Commands |
| 01 Kontext und CLAUDE.md | 15' | zu messen | zu messen | 2 Feature-Prompts + `/init` |
| 02 Skills | 8' | zu messen | zu messen | Skill übernehmen + 1 Feature-Prompt. Knapp, weil die Tests laufen müssen |
| 03 Plan Mode | 15' | zu messen | zu messen | grösste Code-Übung |
| 04 Permissions und Hooks | 15' | zu messen | zu messen | Hooks aus der Vorlage, kaum Iteration |
| 05 Rewind | 2' Demo | – | – | nur der Facilitator, keine Modellnutzung |
| 06 Browser über MCP | 17' | zu messen | zu messen | Browser-Snapshots sind teuer |

Ziel: Alle Übungen zusammen brauchen **deutlich weniger als ein 5-Stunden-Fenster** eines Pro-Kontos.

## Puffer

Kandidaten zum Kürzen, falls die Zeit davonläuft (in dieser Reihenfolge):

1. R11: Teamfrage von R weglassen und im Abschluss stellen (3').
2. Eine weitere Teamfrage weglassen (je 3'). Die von B zuletzt, sie führt am leichtesten zu Beispielen.
3. R: Schätzfragen mit `g` ausschalten und R2 (Chunking) überspringen. Demo R hat mit den Folien «Vektor-DB» und «Test» keine Reserve mehr.
4. D: D1 «Skalieren» nur kurz zeigen oder D3 «Ablauf» weglassen, die Live-Demo trägt allein.
5. 03: Plan nur kritisieren und als Spec ablegen, Umsetzung mit `scripts/reset-exercise.sh 04` überspringen.

Bereits ausgeschöpft (früher Reserve, jetzt der Normalfall): 05 als Demo, 02 mit übernommenem Skill.

Zeit übrig? Im Abschluss die Frage «Welche MCP-Server würdet ihr im Projekt anbinden, und welche
davon sehen fremde Inhalte?» (Lethal Trifecta: private Daten, fremde Inhalte, Weg nach aussen).
