# Laufzettel – alle 36 Folien auf einer Seite

Zum Proben und zum Mitlaufen am Workshop. Die Zeit ist die Workshop-Uhr (0:00 = Beginn). Ausführlich, mit Text pro
Tastendruck und häufigen Fragen: [sprechskript.md](sprechskript.md). Die Zeiten sind gerechnet, nicht gestoppt.
Beim Proben die Spalte «Ist» ausfüllen.

Kontrollpunkte: **0:10** Block A · **0:41** Block B · **1:21** Pause · **1:31** Block C · **1:54** Block R · **2:17** Block D · **2:24** Schluss.

| Folie | Start | Min | Was passiert | Der Satz, der ankommen muss | Ist |
|-------|-------|-----|--------------|-----------------------------|-----|
| Start 1 Ablauf | 0:00 | 1 | Zeitplan zeigen | Kurzer Input, dann macht ihr es selbst. | |
| Start 2 Überblick | 0:01 | 3 | Schleife und drei Bänder, 5 Schritte | Das Modell schlägt vor, die Harness führt aus. | |
| Start 3 Setup | 0:04 | 1 | Repo-Adresse, `reset-exercise` | Wer nicht fertig wird, holt sich den Startstand der nächsten Übung. | |
| Start 4 Übung 00 | 0:05 | 5 | Übung: vier Slash-Commands | Zahl aus `/context` notieren. Unten steht «auto mode». | |
| **A1 Kontext** | **0:10** | 5 | Balken, 1 Schätzfrage | Jeder Turn schickt alles Bisherige wieder mit. | |
| A2 Übung 01 A | 0:15 | 7 | Übung: Endpoint ohne CLAUDE.md | Ein Prompt, keine Nachbesserung. Es zählt die erste Antwort. | |
| A3 Übung 01 B | 0:22 | 8 | Übung: derselbe Prompt mit CLAUDE.md | Die CLAUDE.md bringt, was nicht im Code steht (meist die Tests). | |
| A4 Übung 02 | 0:30 | 8 | Übung: fertigen Skill übernehmen | Die `description` entscheidet, ob Claude den Skill findet. | |
| A5 Teamfrage | 0:38 | 3 | Frage, Uhr | Welche Regel aus eurem Projekt müsste in die CLAUDE.md? | |
| **B1 Leitplanken** | **0:41** | 4 | Sechs Tore, 1 Schätzfrage | deny vor ask vor allow, in jedem Modus. Auch im auto mode. | |
| B2 Übung 03 | 0:45 | 15 | Übung: Plan Mode | Im Plan korrigieren ist billig, im Code teuer. | |
| B3 Übung 04 A | 1:00 | 6 | Übung: deny und ask, einmal Shift+Tab zu default | Eine Regel ist eine Garantie, eine Bitte nicht. | |
| B4 Übung 04 B | 1:06 | 9 | Übung: zwei Hooks | Ein Hook läuft ausserhalb des Modells und kostet keine Tokens. | |
| B5 Rewind | 1:15 | 1 | Zeitleiste mit Checkpoints | Erfasst ist nur, was über Edit und Write geändert worden ist. | |
| B6 Demo 05 | 1:16 | 2 | Du zeigst `/rewind` im Terminal | Der Schutz-Hook ist weg, der kopierte Formatier-Hook nicht. Eingabefeld leeren. | |
| B7 Teamfrage | 1:18 | 3 | Frage, Uhr | Welche Datei oder welcher Befehl braucht eine Deny-Regel oder einen Hook? | |
| **B8 Pause** | **1:21** | 10 | App starten lassen, dann Uhr | Zuerst die zwei Befehle tippen, dann Pause. | |
| **C1 MCP** | **1:31** | 3 | Stecker-Bild, zwei Merksätze | Ein Agent, der sein Ergebnis sieht, braucht weniger Kontrolle. | |
| C2 Übung 06 | 1:34 | 17 | Übung: Playwright-MCP, Bug im Browser | Server ausdrücklich zulassen. Das Browserfenster muss aufgehen. | |
| C3 Teamfrage | 1:51 | 3 | Frage, Uhr | Welches System per MCP, und sieht Claude dort fremde Inhalte? | |
| **R1 Korpus** | **1:54** | 1½ | 16 Dokumente, 3 Sprachen, zwei Wege | Zwei Wege zur Antwort: Index (RAG) oder der Agent sucht selbst. | |
| R2 Chunking | 1:55½ | 1½ | Dokument wird zu Chunks, `t` | Gesucht wird in Stücken, nicht in Dokumenten. | |
| R3 BM25 | 1:57 | 2½ | Stichwortsuche, 1 Schätzfrage, `q` S2 → E1 | Findet Bezeichner (NT044), aber kein Synonym (GBP). | |
| R4 Vektor-DB | 1:59½ | 2 | Zahlen pro Chunk | Gespeichert und verglichen werden Zahlen pro Chunk. | |
| R5 Vektorsuche | 2:01½ | 4 | Karte, 1 Schätzfrage, `q` S2, E1, C3 | Findet Bedeutung und Sprachwechsel, verfehlt den Bezeichner. | |
| R6 Hybrid | 2:05½ | 2 | Beide Listen zusammen, `q` S2 → E1 | Die Fehler überlappen kaum, darum hilft die Kombination. | |
| R7 Agent | 2:07½ | 2½ | Ein Punkt pro Turn, 1 Schätzfrage, `q` C3 oder M3 | Kein Index, dafür mehrere Turns. | |
| R8 Test | 2:10 | 1 | Was gemessen wird | 25 Fragen, vor der Messung festgelegt, nicht nachgetunt. | |
| R9 Messung | 2:11 | 2 | Punkte, 1 Schätzfrage | Hybrid 0.92. Mit anderem Modell ist der Vorteil weg: am eigenen Korpus messen. | |
| R10 Fazit | 2:13 | 1 | Vier Kernaussagen | Für Code im Repo reicht die Suche des Agenten fast immer. | |
| R11 Teamfrage | 2:14 | 3 | Frage, Uhr. Fällt als erste weg | Wo sucht ihr in Doku, würde Textsuche reichen? | |
| **D1 Skalieren** | **2:17** | 1½ | Subagent-Balken, Worktrees | Ein Subagent schützt den Kontext, ein Worktree die Dateien. | |
| D2 Demo | 2:18½ | 4 | Live im Terminal: Reviewer, zwei Worktrees | `/context` vorher und nachher: Zurück kommt nur der Bericht. | |
| D3 Ablauf | 2:22½ | 1½ | Demo als Animation | Zusammengeführt wird mit normalem Git. | |
| **Schluss 1 Rückblick** | **2:24** | 5 | Karte, `/model`, `/effort`, Teamregeln | Jedes Teil habt ihr heute selbst in der Hand gehabt. | |
| Schluss 2 Ausblick | 2:29 | 1 | Vier Karten | Remote Control und Cloud gibt es, hier steht, wo ihr nachlest. | |

## Wo die Zeit eng ist

- **Start 2** hat fünf Schritte in drei Minuten. Pro Schritt zwei Sätze, nicht mehr.
- **A4** (8 Minuten): Im Probelauf hat das Modell 45 Sekunden gebraucht. Eng wird es durch Lesen und Neustart.
- **B2** (15 Minuten): rund 3 Minuten Modellzeit. Wer bei 0:57 noch plant, legt den Plan ab und überspringt die Umsetzung.
- **Block R** hat keine Reserve. `g` schaltet die Schätzfragen aus (je rund 30 Sekunden), R2 lässt sich überspringen.
- **D2**: Die Live-Demo darf höchstens 4 Minuten dauern, sonst geht die Zeit vom Schluss ab.

## Kürzen, in dieser Reihenfolge

Wie in [timing.md](timing.md), Abschnitt «Puffer»:

1. R11 weglassen, die Frage im Schluss stellen (3 Minuten).
2. Eine weitere Teamfrage weglassen (je 3 Minuten), die von B zuletzt.
3. In R die Schätzfragen mit `g` ausschalten und R2 überspringen.
4. D1 nur kurz zeigen oder D3 weglassen.
5. Übung 03: Plan nur kritisieren und ablegen, Umsetzung mit `scripts/reset-exercise.sh 04` überspringen.
