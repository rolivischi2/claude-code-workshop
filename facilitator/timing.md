# Zeitplan (2,5 h, ein Facilitator)

Roland führt allein durch den Nachmittag. Darum gilt: **Input kurz, Übungen klar, Demos vorbereitet.**
Während der Übungen geht Roland durch den Raum. Die Übungsblätter sind so geschrieben, dass sie
ohne Erklärung funktionieren.

| Zeit | Min | Block | Inhalt | Format | Übung |
|------|-----|-------|--------|--------|-------|
| 0:00 | 10 | Einstieg | Anatomie der Harness (Konzeptlandkarte), Ziele, Setup-Check, `/model sonnet` | Input + Slash-Commands | 00 |
| 0:10 | 35 | **A – Kontext und Skills** | Kontext als Budget, `CLAUDE.md`, Progressive Disclosure | 5' Input, 2 Übungen | 01 (15'), 02 (15') |
| 0:45 | 40 | **B – Steuerung** | Plan Mode, Permissions, Hooks, `/rewind` | 5' Input, 3 Übungen | 03 (15'), 04 (15'), 05 (5') |
| 1:25 | 10 | Pause | | | |
| 1:35 | 20 | **C – Browser über MCP** | MCP-Prinzip, Playwright-MCP, Claude prüft sich selbst | 3' Input, 1 Übung | 06 (17') |
| 1:55 | 20 | **R – Agentic Search vs. RAG** | Visualisierung `rag/viz/`, echte Zahlen auf der NCTS-Dokumentation | Demo | – |
| 2:15 | 7 | **D – Skalieren** | Reviewer-Subagent, zwei Worktree-Sessions parallel | Demo | – |
| 2:22 | 8 | Abschluss | Modell- und Aufwandswahl (`/model`, `/effort`), erste Teamregeln, nächste Schritte | Input + Diskussion | – |
| 2:30 | | Ende | | | |

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
3. R: Szene 1 (Chunking) überspringen, direkt mit einer Showcase-Frage starten.
4. 03: Plan nur kritisieren und als Spec ablegen, Umsetzung mit `scripts/reset-exercise.sh 04` überspringen.

Zeit übrig? Im Abschluss die Frage «Welche MCP-Server würdet ihr im Projekt anbinden, und welche
davon sehen fremde Inhalte?» (Lethal Trifecta: private Daten, fremde Inhalte, Weg nach aussen).
