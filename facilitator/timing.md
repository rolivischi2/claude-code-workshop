# Zeitplan (2,5 h, ein Facilitator)

Roland führt allein durch den Nachmittag. Darum gilt: **Input kurz, Übungen klar, Demos vorbereitet.**
Während der Übungen geht Roland durch den Raum. Die Übungsblätter sind so geschrieben, dass sie
ohne Erklärung funktionieren.

| Zeit | Min | Block | Inhalt | Format | Übung |
|------|-----|-------|--------|--------|-------|
| 0:00 | 10 | Einstieg | Anatomie der Harness (Konzeptlandkarte), Ziele, Setup-Check, `/model sonnet` | Input + Slash-Commands | 00 |
| 0:10 | 35 | **A – Kontext und Skills** | Kontext als Budget, `CLAUDE.md`, Progressive Disclosure | 5' Input, 2 Übungen | 01 (15'), 02 (15') |
| 0:45 | 40 | **B – Steuerung** | Plan Mode, Permissions, Hooks, `/rewind` | 5' Input, 3 Übungen | 03 (15'), 04 (15'), 05 (5') |
| 1:25 | 10 | Pause (App für 06 läuft bereits, gestartet am Ende von 05) | | | |
| 1:35 | 20 | **C – Browser über MCP** | MCP-Prinzip, Playwright-MCP, Claude prüft sich selbst | 3' Input, 1 Übung | 06 (17') |
| 1:55 | 20 | **R – Agentic Search vs. RAG** | Visualisierung `praesentation/`, echte Zahlen auf der NCTS-Dokumentation | Demo | – |
| 2:15 | 7 | **D – Skalieren** | Reviewer-Subagent, zwei Worktree-Sessions parallel. Nur der Facilitator, live am geteilten Bildschirm | Live-Demo | – |
| 2:22 | 8 | Abschluss | Modell- und Aufwandswahl (`/model`, `/effort`), erste Teamregeln, nächste Schritte | Input + Diskussion | – |
| 2:30 | | Ende | | | |

## Bilder zu den Inputs

Die Folien aus `praesentation/` ersetzen Erklärzeit:

| Zeit | Folien (Kürzel wie im Sprechskript) | Schätzfrage (Handzeichen) |
|------|--------------------------------------|--------------------------|
| 0:00 | Start 1 Ablauf · Start 2 Überblick | – |
| 0:10 | A1 Kontext | Startbelegung aus Übung 00 |
| 0:45 | B1 Leitplanken | allow im Projekt gegen deny beim User |
| vor Übung 05 | B5 Rewind (rund 1 Minute, aus dem Input von B) | – |
| 1:35 | C1 MCP | – |
| 1:55 | R1 bis R10 (Korpus bis Fazit, neu mit R8 «Test») | BM25, Vektor, Turns des Agents, grösseres Modell |
| 2:15 | D1 Skalieren · D2 Demo · Live-Demo · D3 Ablauf | – |
| 2:22 | Schluss 1 Rückblick | – |

Zu jeder Übung gibt es eine eigene Folie (Start 3, A2 bis A4, B2 bis B4, B6, C2) mit Uhr (`z`), dazu B7 Pause.

**Noch nicht gestoppt:** R8 «Test» (rund 1 Minute) liegt im 20-Minuten-Budget von R, das schon vorher keine
Reserve hatte. D1 und D3 liegen im 7-Minuten-Budget von D, das für die Live-Demo allein geplant gewesen ist.

Eine Schätzfrage kostet rund 30 Sekunden. `g` schaltet alle aus.

## Pro Übung: Aufwand

Gemessen bei einem Dry-Run mit einem **Pro-Konto auf Sonnet**. Die Spalten «Turns» und «Nutzung»
werden beim Dry-Run ausgefüllt. Alles über 8 Turns muss vereinfacht werden.

| Übung | Zeitbudget | Turns (Dry-Run) | Nutzung 5h-Fenster (Dry-Run) | Bemerkung |
|-------|-----------|-----------------|------------------------------|-----------|
| 00 Setup-Check | 5' | zu messen | zu messen | nur Slash-Commands |
| 01 Kontext und CLAUDE.md | 15' | zu messen | zu messen | 2 Feature-Prompts + `/init` |
| 02 Skills | 15' | zu messen | zu messen | Skill bauen + 1 Feature-Prompt |
| 03 Plan Mode | 15' | zu messen | zu messen | grösste Code-Übung |
| 04 Permissions und Hooks | 15' | zu messen | zu messen | Hooks aus der Vorlage, kaum Iteration |
| 05 Rewind | 5' | – | – | keine Modellnutzung |
| 06 Browser über MCP | 17' | zu messen | zu messen | Browser-Snapshots sind teuer |

Ziel: Alle Übungen zusammen brauchen **deutlich weniger als ein 5-Stunden-Fenster** eines Pro-Kontos.

## Puffer

Kandidaten zum Kürzen, falls die Zeit davonläuft (in dieser Reihenfolge):

1. 05 als 2-Minuten-Demo am Beamer statt Übung.
2. 02: Skill aus `solution/02` übernehmen (`git checkout solution/02 -- .claude/skills`), nur den automatischen Aufruf testen.
3. R: Schätzfragen mit `g` ausschalten und R2 (Chunking) überspringen. Demo R hat mit den Folien «Vektor-DB» und «Test» keine Reserve mehr.
4. D: D1 «Skalieren» nur kurz zeigen oder D3 «Ablauf» weglassen, die Live-Demo trägt allein.
5. 03: Plan nur kritisieren und als Spec ablegen, Umsetzung mit `scripts/reset-exercise.sh 04` überspringen.

Zeit übrig? Im Abschluss die Frage «Welche MCP-Server würdet ihr im Projekt anbinden, und welche
davon sehen fremde Inhalte?» (Lethal Trifecta: private Daten, fremde Inhalte, Weg nach aussen).
