# Sprechskript – Folie für Folie

Zum Proben. Das Skript folgt der Präsentation in ihrer Reihenfolge: 7 Abschnitte, 36 Folien.
Für jede Folie: Ziel, dann pro Tastendruck **was erscheint** und **was du sagst**, der Übergang und die Fragen,
die am ehesten kommen. Die Sätze sind Vorschläge in deiner Tonlage, keine Texte zum Ablesen.
Jede Überschrift nennt die Zeit auf der Workshop-Uhr (0:00 = Beginn) und das Budget der Folie. Alle Folien auf einer Seite:
[laufzettel.md](laufzettel.md). Die Zeiten sind gerechnet. Die Modellzeiten stammen aus den Probeläufen vom [14.11.](dry-run-2026-11-14.md) und [15.11.](dry-run-2026-11-15.md), die Lesezeit der Menschen ist nicht gemessen.
Am Schluss steht ein Glossar mit Definitionen in einem Satz.

Die Präsentation: `praesentation/index.html` (lokal) bzw. die gehostete Seite.

| Abschnitt | Wann | Folien (Kürzel im Skript) |
|-----------|------|---------------------------|
| ▶ Start | 0:00 | Start 1 Ablauf · Start 2 Überblick · Start 3 Setup · Start 4 Übung 00 |
| A Kontext | 0:10 | A1 Kontext · A2 Übung 01 A · A3 Übung 01 B · A4 Übung 02 · A5 Teamfrage |
| B Steuerung | 0:41 | B1 Leitplanken · B2 Übung 03 · B3 Übung 04 A · B4 Übung 04 B · B5 Rewind · B6 Demo 05 · B7 Teamfrage · B8 Pause (1:21) |
| C MCP | 1:31 | C1 MCP · C2 Übung 06 · C3 Teamfrage |
| R Suche | 1:54 | R1 Korpus · R2 Chunking · R3 BM25 · R4 Vektor-DB · R5 Vektorsuche · R6 Hybrid · R7 Agent · R8 Test · R9 Messung · R10 Fazit · R11 Teamfrage |
| D Skalieren | 2:17 | D1 Skalieren · D2 Demo · (Live-Demo im eigenen Terminal) · D3 Ablauf |
| ■ Schluss | 2:24 | Schluss 1 Rückblick · Schluss 2 Ausblick |

Das Kürzel ist der Abschnitt plus die Nummer der Folie im Abschnitt. Die Nummer ist zugleich die Zifferntaste:
In Abschnitt B springt `5` zur Folie Rewind. R10 und R11 haben keine Zifferntaste, dorthin mit `→` oder `o`.

**Regieanweisungen im Skript** (alles, was du tust und nicht sagst):

- **TUN:** eine Handlung von dir: Fenster wechseln, Befehl tippen, etwas prüfen.
- **WÄHRENDDESSEN:** was du erledigst, während die Leute an einer Übung arbeiten.
- **WEITER:** die Taste zur nächsten Folie und was vorher erledigt sein muss.
- Fenster stehen in eckigen Klammern: **[Folien]**, **[T1]** bis **[T5]**, **[Editor]**. Was das ist, steht unter «Vorbereitung».
- In der Spalte «Taste» steht jeder Tastendruck einzeln. Eine Schätzfrage braucht zwei: einmal `→` zeigt die Frage, einmal `→` die Antwort.

**Tasten:** `→` nächster Schritt · `←` zurück · Shift+`→` nächster Abschnitt · Ziffer = Folie im Abschnitt · `o` Übersicht · `f` Vollbild ·
`r` Animation nochmals · `g` Schätzfragen aus/ein · `?` Hilfe. Auf Übungsfolien, Teamfragen und in der Pause `z` Uhr starten/anhalten, `x` Uhr zurücksetzen.
Im Abschnitt R zusätzlich `q` Frage wählen und `t` (Chunking umschalten).
Ist eine Folie fertig, führt `→` zur nächsten Folie, auch über die Grenze eines Abschnitts hinweg. Shift+`→` brauchst du nur zum Überspringen.

**Übungsfolien:** Jede hat drei Schritte: Ziel und Aufgabe, dann die Schritte, dann Prompts und Prüfung.
Mit `→` durchgehen, das Ziel in einem Satz sagen, dann `z` für die Uhr. Die Folie bleibt während der Übung stehen.
Die Uhr wird in den letzten zwei Minuten rot.

Auf jeder Übungsfolie ab Übung 02 steht oben rechts der Befehl für alle, die vorher nicht fertig geworden sind
(`scripts/reset-exercise.sh NN`). Unten steht eine **Zusatzaufgabe** für jene, die früh fertig sind. Freiwillige
Prompts sind mit «optional» markiert. Sag beides beim ersten Mal an, danach reicht ein Fingerzeig.

**Teamfrage:** Am Ende der Blöcke A, B, C und R steht eine Folie mit einer Frage ans Team, je 3 Minuten mit Uhr.
Zwei, drei Beispiele aus den Projekten sammeln, nicht lösen. Meldet sich niemand, hilft eines der drei Stichworte
auf der Folie. Läuft die Zeit davon, fällt zuerst die Teamfrage von R weg.

**Schätzfrage:** `→` zeigt die Frage, du lässt per Handzeichen abstimmen («Wer ist für A?»), `→` zeigt die Antwort,
`→` fährt weiter. Rund 30 Sekunden. Nicht kommentieren, wer falsch gelegen hat, sondern gleich die Erklärung zeigen.
Schätzfragen gibt es auf A1, B1, R3, R5, R7 und R9.

---

# Vorbereitung

## Fenster (im Skript immer mit diesen Namen)

| Name | Was | Wofür |
|------|-----|-------|
| **[Folien]** | Browser mit der Präsentation im Vollbild: https://claude-code-workshop-black.vercel.app oder lokal `praesentation/index.html` | der ganze Nachmittag |
| **[T1]** | Terminal im Klon `demo-05`, darin die Claude-Session von Übung 04 | Demo 05 (B6): `/rewind` |
| **[T5]** | zweites Terminal im Klon `demo-05`, ohne Claude, direkt neben [T1] | Demo 05 (B6): die Git-Befehle |
| **[T2]** | Terminal links im Klon `demo-d` | Demo D, Teil 1 und Teil 2 links |
| **[T3]** | Terminal rechts im Klon `demo-d` | Demo D, Teil 2 rechts |
| **[T4]** | drittes Terminal im Klon `demo-d` | Demo D: `git worktree list` |
| **[Editor]** | dieses Skript (`facilitator/sprechskript.md`) im Editor, bei D2 unter «Die drei Prompts zum Kopieren» | daraus kopierst du die drei Prompts von Demo D |

Dieses Skript und der [Laufzettel](laufzettel.md) liegen ausgedruckt oder auf einem zweiten Gerät neben dir, nicht auf dem Beamer.

## Am Vortag

1. Im Workshop-Repo `git pull`.
2. **Klon für Demo 05** anlegen, im Ordner neben dem Workshop-Repo:
   ```bash
   git clone https://github.com/rolivischi2/claude-code-workshop ../demo-05
   cd ../demo-05 && scripts/reset-exercise.sh 04 && scripts/setup.sh
   claude
   ```
   In dieser Session Übung 04 nach Blatt durchspielen: Schritte 1 bis 9 mit den Prompts 1 bis 4. Kein `/clear`, **nicht** committen.
   Kontrolle: `ls .claude/hooks` zeigt zwei Dateien, `git status --short` zeigt Änderungen. Dann `/exit`.
3. **Klon für Demo D** anlegen:
   ```bash
   git clone --branch solution/final https://github.com/rolivischi2/claude-code-workshop ../demo-d
   (cd ../demo-d && scripts/setup.sh)
   ```
4. `/usage` auf dem eigenen Konto prüfen: Es muss für Demo D reichen (ein Review und zwei parallele Sessions).

**Nach jeder Probe neu vorbereiten.** Beide Demos lassen sich pro Klon nur einmal zeigen: Der Rewind kürzt den Verlauf,
und Demo D legt Worktrees und Branches an. Nach einer Probe die Ordner `demo-05` und `demo-d` löschen und die Schritte 2 und 3 wiederholen.

## 30 Minuten vor Beginn, in dieser Reihenfolge

1. Benachrichtigungen ausschalten («Nicht stören»). Schrift im Terminal und im Browser gross stellen.
2. **[T1]** öffnen: `cd ../demo-05 && claude -c`. Der Verlauf von Übung 04 erscheint. Nichts tippen, Fenster offen lassen.
   Daneben **[T5]** öffnen: `cd ../demo-05`, sonst nichts. Dort tippst du in der Demo die Git-Befehle.
3. **[T2]**, **[T3]**, **[T4]** öffnen, in jedem `cd ../demo-d`. [T2] und [T3] nebeneinander legen. Noch kein `claude` starten.
4. **[Editor]** öffnen: `facilitator/sprechskript.md`, nach «Die drei Prompts zum Kopieren» suchen (steht bei D2).
5. **[Folien]** öffnen. `f` für Vollbild. Mit `o` die Übersicht öffnen, im Abschnitt R «BM25» wählen, Enter:
   Auf der Folie darf nirgends «Beispieldaten» stehen. Dann `Home`: Die Folie «Ablauf» steht.
6. Beamer prüfen: Die Folie ist ganz sichtbar, die Fusszeile mit den Tasten ist lesbar.
7. Fensterwechsel einmal üben: mit Cmd+Tab (Windows: Alt+Tab) von [Folien] zu [T1] und zurück. Im Skript steht dafür immer «Cmd+Tab». Danach reagiert [Folien] wieder auf `→`.

## Wenn etwas klemmt

| Was passiert | Was du tust |
|--------------|-------------|
| Die Folie reagiert nicht auf Tasten | Einmal mit der Maus in die Folie klicken. Der Fokus ist nach einem Fensterwechsel noch im anderen Fenster. |
| Du weisst nicht mehr, wo du bist | `o` öffnet die Übersicht. Mit `↑` `↓` die Folie wählen, Enter. |
| Zu weit gedrückt | `←` geht einen Schritt zurück. |
| Uhr läuft falsch | `x` setzt sie zurück, `z` startet sie neu. |
| Im Abschnitt R steht die falsche Frage | `q`, mit `↑` `↓` die Frage wählen, Enter. Die Folie beginnt wieder beim ersten Schritt. |
| Eine Schätzfrage erscheint, die du nicht willst | Zweimal `→`, ohne abzustimmen. `g` schaltet alle Schätzfragen aus. |
| Alles ist verstellt | Seite neu laden (Cmd+R, Windows: F5). Die Folie bleibt dieselbe, Uhren und Schätzfragen beginnen neu. Danach wieder `f`. |

## Wenn die Zeit knapp wird

Kontrollpunkte auf der Workshop-Uhr: **0:10** Block A · **0:41** Block B · **1:21** Pause · **1:31** Block C · **1:54** Block R · **2:17** Block D · **2:24** Schluss.
Bist du an einem Kontrollpunkt hinten, kürzt du in dieser Reihenfolge:

1. R11 weglassen, die Frage im Schluss stellen (3 Minuten).
2. Eine weitere Teamfrage weglassen (je 3 Minuten), die von B zuletzt.
3. In R die Schätzfragen mit `g` ausschalten (je rund 30 Sekunden) und R2 überspringen.
4. D1 nur kurz zeigen oder D3 weglassen.
5. Übung 03: Plan nur kritisieren und ablegen, Umsetzung mit `scripts/reset-exercise.sh 04` überspringen.

---

# ▶ Start (0:00, 10 Minuten)

## Start 1 · Ablauf · 0:00–0:01 (1 Min)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Titel und Zeitplan des Nachmittags, pro Block die Übungen | «Zweieinhalb Stunden, eine Pause. Das Muster ist immer gleich: kurzer Input, dann macht ihr es selbst im Terminal. Die Übungsblätter liegen im Repo unter `exercises/`, und jede Übung steht auch hier auf dem Beamer. Am Ende jedes Blocks frage ich euch nach einem Beispiel aus euren Projekten.» |

**TUN vorher:** [Folien] ist im Vollbild auf der Folie «Ablauf». Uhrzeit des Beginns auf den Laufzettel schreiben: Das ist 0:00.

**WEITER:** `→` zu Start 2.

## Start 2 · Überblick · 0:01–0:04 (3 Min)

**Ziel:** Alle haben dasselbe Bild im Kopf: ein Modell in einer Schleife. Jede Übung bekommt einen Platz.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Prompt → Modell → Tool-Aufruf → Ergebnis | «Ihr kennt Agentic Engineering. Heute schauen wir, wie Claude Code das konkret baut. Der Kern ist klein: Ihr gebt einen Prompt. Das Modell entscheidet, was der nächste Schritt ist. Meistens ist das ein Tool-Aufruf: eine Datei lesen, etwas editieren, einen Befehl ausführen.» |
| `→` | Schleife leuchtet reihum auf, «Antwort» erscheint | «Das Ergebnis geht zurück ans Modell, und es entscheidet wieder. Das wiederholt sich, bis das Modell findet, es sei fertig. Das ist der Agentic Loop. Wichtig: Das Modell *schlägt vor*, die Harness *führt aus*. Alles, was wir heute steuern, hängt an diesem Unterschied.» |
| `→` | Band «Kontext» | «Das Modell sieht nur, was im Kontext steht: den System-Prompt, eure CLAUDE.md, die Beschreibungen der Skills, den Verlauf und alles, was Tools zurückgeben. Block A dreht sich darum: Übung 01 und 02.» |
| `→` | Band «Steuerung» | «Autonomie braucht Leitplanken. Plan Mode, Permissions, Hooks und Rewind sitzen *um* die Schleife herum. Das ist Block B, Übungen 03 und 04. Rewind zeige ich als Demo.» |
| `→` | Band «Erweitern und skalieren» | «Und am Schluss machen wir die Schleife grösser: neue Werkzeuge über MCP, Wissen ausserhalb des Repos, mehrere Agenten gleichzeitig. Diese Karte seht ihr am Ende nochmals.» |

**Übergang:** «Bevor wir loslegen: kurz das Setup, dann Übung 00. Vier Slash-Commands, fünf Minuten. Notiert euch die Zahl aus `/context`, die brauchen wir gleich.»

**WEITER:** Nach dem Band «Erweitern und skalieren» `→` zu Start 3.

**Häufige Fragen**

- *Was genau ist eine Harness?* Die Software um das Modell: Sie führt die Schleife, stellt Werkzeuge bereit, verwaltet den Kontext und setzt Regeln durch. Das Modell allein kann nur Text erzeugen.
- *Worin unterscheidet sich das von einem Chat?* Im Chat antwortet das Modell einmal. Hier handelt es in mehreren Schritten und sieht die Folgen seiner Schritte.
- *Wer entscheidet, wann Schluss ist?* Das Modell: Es antwortet ohne weiteren Tool-Aufruf. Ihr könnt jederzeit mit Esc unterbrechen.
- *Ist das bei anderen Coding-Agenten gleich?* Das Grundmuster ja. Unterschiede liegen bei Werkzeugen, Kontextverwaltung und Steuerung.

## Start 3 · Setup · 0:04–0:05 (1 Min)

**Ziel:** Alle wissen, wo das Repo liegt und wie sie später zu einem sauberen Stand kommen.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Adresse des Repos, die vier Befehle, Voraussetzungen, Hinweis auf `reset-exercise` | «Das Setup habt ihr mit der Mail erledigt. Fehlt bei jemandem etwas: Hier steht die Adresse, der Rest steht in `SETUP.md`. Und merkt euch den Befehl unten. Wer bei einer Übung nicht fertig wird, holt sich damit den Startstand der nächsten. Eure Änderungen gehen dabei nicht verloren.» |

Wer das Setup nicht gemacht hat, macht es jetzt nebenher und steigt bei Übung 01 ein. Nicht darauf warten.

**WEITER:** `→` zu Start 4 (Übung 00).

## Start 4 · Übung 00 – Setup-Check · 0:05–0:10 (5 Min)

**Ziel der Übung:** Alle arbeiten mit dem richtigen Login und mit Sonnet. Alle kennen die eigene Startbelegung des Kontexts.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Nur Slash-Commands. Wichtig ist die Zahl aus `/context`. Schreibt sie auf. Und schaut unter das Eingabefeld: Dort steht auto mode. Claude Code startet seit Kurzem so. Ein Klassifizierer prüft jede Aktion, darum fragt Claude selten nach. Was das heisst, schauen wir in Block B an.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Prüfen, ob alle auf Sonnet sind und ob jemand mit dem Login hängt. Beim allerersten Start fragt Claude Code, ob man dem Ordner vertraut. Im Probelauf ist «No, exit» vorausgewählt gewesen: Wer nur Enter drückt, ist wieder draussen. Steht bei jemandem unten nicht «auto mode»: Shift+Tab drücken, bis «auto mode on» erscheint, oder neu starten mit `claude --permission-mode auto`. Erscheint der Modus nie, bleibt die Person im manual mode. Die Übungen gehen auch so, Claude fragt dann öfter nach.

**Abholen nach der Übung:** Nichts. Die Zahl aus `/context` kommt gleich in der Schätzfrage von A1.

**WEITER:** Wenn die Uhr rot ist oder alle fertig sind: «Zahl notiert? Dann weiter.» `→` zu A1. Eine laufende Uhr musst du nicht anhalten.

---

# A Kontext (0:10, 31 Minuten)

## A1 · Kontext · 0:10–0:15 (5 Min)

**Ziel:** Kontext kostet in jedem Turn. Darum lohnt sich, was erst bei Bedarf geladen wird.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | leerer Balken «Kontextfenster» | «Dieser Balken ist das Arbeitsgedächtnis des Modells. Was nicht drin ist, weiss es nicht. Was drin ist, bezahlt ihr.» |
| `→` | **Schätzfrage:** «Wie viel Kontext ist in Übung 00 belegt gewesen …?» mit drei Antworten | Frage vorlesen. «Hand hoch für A. Für B. Für C.» |
| `→` | Hinweis: «Eure Zahl aus /context» (keine Antwort ist markiert) | «Schaut auf eure Notiz.» Zwei, drei Zahlen zurufen lassen. In den Probeläufen sind es rund 40k Tokens gewesen, davon 32k Werkzeuge des Systems. Wer Konnektoren im claude.ai-Konto hat, liegt höher. |
| `→` | dunkle Segmente: System-Prompt, CLAUDE.md, Beschreibungen | «Das ist belegt, bevor ihr ein Wort tippt: System-Prompt und Werkzeuge, eure CLAUDE.md, die Beschreibungen der Skills, die Namen der MCP-Tools. Das Bild ist ein Schema, eure echte Zahl ist die aus `/context`.» |
| `→` | Turn 1: kleines graues, grosses ockerfarbenes Segment | «Erster Turn. Euer Prompt ist winzig. Gross ist, was Claude dafür *liest*: Dateien, Suchergebnisse, Testausgaben. Tool-Ergebnisse sind fast immer der grösste Posten.» |
| `→` | Balken wächst, darunter «Turn 1/2/3 sendet» | «Und jetzt der Punkt, den viele unterschätzen: Jeder Turn schickt *alles Bisherige* wieder mit. Der Prompt-Cache macht den unveränderten Anfang billiger, aber nicht kleiner. Darum der Token-Tipp auf den Blättern: Kritik in einem Prompt sammeln statt in fünf.» |
| `→` | Verlauf schrumpft zu «Zusammenfassung» | «`/compact` ersetzt den Verlauf durch eine Zusammenfassung. `/clear` leert ihn ganz. Faustregel: Neue Aufgabe, neuer Kontext.» |
| `→` | blaues Segment «Skill-Inhalt» schiebt sich hinein | «Und das ist die Idee hinter Skills: Progressive Disclosure. Immer geladen ist nur die Beschreibung, ein, zwei Sätze. Der eigentliche Text kommt erst, wenn die Aufgabe dazu passt. Dann bleibt er im Kontext. In Übung 02 baut ihr genau das.» |

**Übergang:** «Übung 01: dasselbe Feature einmal ohne und einmal mit CLAUDE.md. Achtet darauf, was sich am Ergebnis ändert, nicht nur an der Zahl.»

**WEITER:** Nach dem blauen Segment «Skill-Inhalt» `→` zu A2.

**Häufige Fragen**

- *Was ist ein Token?* Ein Textstück, mit dem das Modell rechnet. Grob drei bis vier Zeichen, auf Deutsch eher weniger Text pro Token als auf Englisch.
- *Wie gross ist das Kontextfenster?* Das hängt vom Modell ab. `/context` zeigt für eure Session Grösse und Belegung.
- *Was ist der Prompt-Cache?* Der unveränderte Anfang einer Anfrage wird beim Anbieter zwischengespeichert und beim nächsten Turn zu einem tieferen Preis gelesen. Er verkleinert den Kontext nicht.
- *Was passiert, wenn der Kontext voll ist?* Claude Code fasst kurz vor der Grenze automatisch zusammen (Auto-Compact). Dabei können Details verloren gehen. Besser selbst `/compact` oder `/clear` setzen.
- *Was gehört in die CLAUDE.md?* Was in *jedem* Turn gelten soll: Build- und Testbefehle, Konventionen, Stolperfallen. Kurz halten: Sie wird immer mitgeschickt.
- *Wann CLAUDE.md, wann Skill?* Immer gültig und kurz: CLAUDE.md. Nur für bestimmte Aufgaben und länger: Skill.
- *Woher weiss Claude, wann ein Skill passt?* Aus der `description` im Kopf der `SKILL.md`. Darum ist dieser eine Satz das Wichtigste am Skill.

## A2 · Übung 01 A – ohne CLAUDE.md · 0:15–0:22 (7 Min)

**Ziel der Übung:** Sehen, was Kontext kostet. Und sehen, was Claude ohne Projektregeln baut.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ein Feature-Prompt, keine Nachbesserung. Es zählt die erste Antwort, die brauchen wir für den Vergleich.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Wer nachbessert, bremsen: Der Vergleich mit Teil B funktioniert nur mit der ersten Antwort.

**Abholen nach der Übung:** Noch nichts. Direkt weiter zu Teil B.

**WEITER:** Ist die Uhr abgelaufen: «Änderungen verworfen? Der Befehl steht in Schritt 4.» Dann `→` zu A3.

## A3 · Übung 01 B – mit CLAUDE.md · 0:22–0:30 (8 Min)

**Ziel der Übung:** Derselbe Prompt, diesmal mit Teamkonventionen in der CLAUDE.md.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Derselbe Prompt wie eben. Der einzige Unterschied ist die CLAUDE.md. Achtet auf das Ergebnis, nicht nur auf die Zahl.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Der sichere Unterschied sind die Tests: Ohne CLAUDE.md fehlen sie, mit ihr entstehen Service-Test und MockMvc-Test. Beim Mapping ist es offen. Im Probelauf ist **kein** `GuaranteeMapper` entstanden: Claude hat sich ausdrücklich am bestehenden `GuaranteeService` orientiert. Nicht versprechen, sondern fragen.

**Abholen nach der Übung:** «Was ist bei euch anders gewesen als in Teil A?» Zwei, drei Stimmen. Dann: «Bei wem gibt es einen Mapper, bei wem nicht?» Die Pointe: Eine Regel in der CLAUDE.md konkurriert mit den Mustern im Code. Soll sie gewinnen, muss sie das sagen.

**WEITER:** Vor dem Wechsel sagen: «Committet die CLAUDE.md, der Befehl steht im Blatt.» Dann `→` zu A4.

## A4 · Übung 02 – Skills · 0:30–0:38 (8 Min)

**Ziel der Übung:** Einen fertigen Skill «Neuer REST-Endpoint nach Teamstandard» übernehmen und prüfen, ob Claude ihn von sich aus lädt.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Den Skill bekommt ihr fertig, mit einem Git-Befehl. Lest ihn, vor allem den einen Satz in der `description`. Dann startet ihr Claude neu und verlangt den Endpoint, ohne den Skill zu erwähnen.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp, Zusatzaufgabe | «Oben rechts steht der Befehl für alle, die in Übung 01 nicht fertig geworden sind. Wer früh fertig ist: Unten steht die Zusatzaufgabe, den Skill selbst bauen. Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Häufigster Hänger: Claude nicht neu gestartet, dann kennt die Session den Skill nicht. Acht Minuten sind knapp, weil die Tests laufen müssen. Wer nach sechs Minuten noch auf Maven wartet, soll nur den `Skill`-Aufruf im Verlauf suchen.

**Abholen nach der Übung:** «Bei wem hat Claude den Skill von selbst geladen? Woran habt ihr es gesehen?»

**WEITER:** `→` zu A5 (Teamfrage).

## A5 · Teamfrage · 0:38–0:41 (3 Min)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welche Regel aus eurem Projekt müsste in die CLAUDE.md, weil Claude sie nicht aus dem Code ablesen kann?» |
| `z` | Die Uhr läuft | Zwei, drei Antworten sammeln, jeweils nur nachfragen: «Steht das heute irgendwo geschrieben?» |

**Wenn niemand etwas sagt:** eigenes Beispiel nennen (in der Übungs-App: «Antworten immer als DTO über einen Mapper»), dann nochmals fragen.

**WEITER:** Bei 0:41 `→` zu B1. Kontrollpunkt auf dem Laufzettel: Bist du mehr als 5 Minuten hinten, fällt später R11 weg.

---

# B Steuerung (0:41, 40 Minuten, danach Pause)

## B1 · Leitplanken · 0:41–0:45 (4 Min)

**Ziel:** Jeder Tool-Aufruf läuft durch dieselben Tore. Eine Regel ist eine Garantie, eine Anweisung in der CLAUDE.md nur eine Bitte.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | sechs Tore in einer Reihe | «Ihr erinnert euch: Das Modell schlägt vor, die Harness führt aus. Dazwischen liegen diese Tore, in dieser Reihenfolge. Ihr habt es gemerkt: Claude hat euch bisher kaum etwas gefragt. Das ist der auto mode. Ein zweites Modell prüft jede Aktion und hält nur an, wenn etwas über euren Auftrag hinausgeht. Eure eigenen Regeln gelten trotzdem, in jedem Modus.» |
| `→` | `Edit FristFormatter.java` läuft grün durch | «Ein harmloser Edit. Der PreToolUse-Hook hat nichts dagegen, keine deny-Regel, keine ask-Regel, erlaubt. Das Tool läuft. Und danach formatiert der PostToolUse-Hook genau diese eine Datei. Das kostet keinen einzigen Token.» |
| `→` | **Schätzfrage:** allow im Projekt, deny beim User | Frage vorlesen. «Hand hoch für A. Für B.» |
| `→` | Antwort B ist markiert | «deny. Geprüft wird immer deny, dann ask, dann allow, über alle Ebenen hinweg.» |
| `→` | `Read .env` bleibt rot bei deny stehen | «Darum ist deny die verlässlichste Regel, die ihr habt. In Übung 04 sperrt ihr damit `.env` und `git push`.» |
| `→` | `Edit src/generated/…` bleibt beim Hook stehen | «Für alles, was sich nicht als Muster schreiben lässt, gibt es Hooks: ein Skript von euch. Endet es mit Exit-Code 2, ist der Aufruf blockiert, und die Begründung geht zurück an Claude. Die Regeln werden dann gar nicht mehr gefragt.» |
| `→` | `rm -r scratch/wegwerf` hält bei ask | «Und ask heisst: Claude hält an und fragt euch, auch im auto mode. Für alles, was selten und heikel ist. Noch etwas zum Eingabefeld: Nach einer Antwort steht dort oft ein grauer Vorschlag für den nächsten Prompt. Das ist nur ein Vorschlag. Nach einer verweigerten Aktion nicht übernehmen.» |

**Übergang:** «Übung 03 zuerst: Plan Mode. Da lernt ihr die billigste Leitplanke überhaupt, nämlich erst denken lassen, dann schreiben lassen. Rewind, das Netz darunter, zeige ich euch nach Übung 04.»

**WEITER:** Nach `rm -r scratch/wegwerf` `→` zu B2.

**Häufige Fragen**

- *Welche Permission-Modi gibt es?* auto (Start, ein Klassifizierer prüft jede Aktion), manual mode (fragt nach, früher default), acceptEdits (Datei-Edits ohne Rückfrage), plan (nur lesen und planen), dazu dontAsk und bypassPermissions. Shift+Tab geht von auto zu manual mode, dann acceptEdits, dann plan, am Schluss wieder auto.
- *Wie stelle ich den Startmodus ein?* Mit `permissions.defaultMode` in den Settings oder mit `claude --permission-mode`. `auto` in den Projekt-Settings wird ignoriert, ein Repo kann den Modus also nicht lockern.
- *Wie schalte ich die grauen Vorschläge aus?* In `/config` «Prompt suggestions» ausschalten. Übernommen wird ein Vorschlag mit Tab oder Pfeil rechts, dann Enter.
- *Kann ein Hook eine deny-Regel aushebeln?* Nein. Deny- und ask-Regeln werden auch dann noch geprüft, wenn ein Hook «erlauben» zurückgibt.
- *Was passiert bei einem anderen Exit-Code als 2?* Der Aufruf läuft weiter, die erste Zeile von stderr erscheint als Hinweis. Nur 2 blockiert.
- *Ist deny eine Sicherheitsgrenze?* Nein, eine Leitplanke. Ein Skript, das die Datei selbst öffnet, kommt daran vorbei. Für harte Grenzen gibt es die Bash-Sandbox und Managed Settings.
- *Welche Settings-Datei gewinnt?* Von oben nach unten: Managed, Kommandozeile, `settings.local.json`, `settings.json` im Projekt, User. Listen wie `permissions.allow` werden zusammengeführt.
- *Warum Hooks als Node-Skript?* Dieselbe Konfiguration läuft auf macOS und Windows, weil keine Shell dazwischen ist.

## B2 · Übung 03 – Plan Mode · 0:45–1:00 (15 Min)

**Ziel der Übung:** Ein Feature zuerst planen lassen, den Plan kritisch prüfen und erst dann umsetzen.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Erst planen lassen, dann den Plan kritisieren, dann umsetzen. In den Plan Mode kommt ihr mit Shift+Tab, vom auto mode aus dreimal. Sammelt eure Kritik in einem Prompt: Jeder Turn schickt den ganzen Kontext nochmals.» |
| `→` | Schritte | Schritte kurz vorlesen. Zu Schritt 4 dazusagen: «Prompt 2 und 3 gebt ihr im Freigabedialog ein, über die dritte Option: Tell Claude what to change.» |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Das ist die grösste Code-Übung (in den Probeläufen 2 bis 3 Minuten Modellzeit allein für die Umsetzung, dazu das Planen und zwei Dialoge). Wer in Zeitnot kommt: Plan kritisieren und ablegen genügt, die Umsetzung lässt sich mit `scripts/reset-exercise.sh 04` überspringen. Der erste Plan ist oft schon gut. Dann sollen sie einen Punkt suchen, den sie anders wollen, und ihn mit Prompt 2 verlangen. Beim Freigeben heissen die Optionen «Yes, and use auto mode», «Yes, manually approve edits» und «Tell Claude what to change». Prompt 2 und 3 gehen über die dritte Option. Bei Prompt 3 zeigt Claude den Freigabedialog erneut, manchmal mit einer Rückfrage davor, ob es den Plan Mode verlassen darf. Oft fragt Claude schon vor dem ersten Plan nach dem Grenzwert am Referenzbetrag: Die Leute sollen wählen, was sie für richtig halten.

**WÄHRENDDESSEN:** Bei 0:57 (Uhr zeigt noch 3 Minuten) laut sagen: «Wer noch plant: Plan ablegen lassen, die Umsetzung überspringt ihr mit dem Befehl oben rechts auf der nächsten Folie.»

**Abholen nach der Übung:** «Was habt ihr am Plan geändert, bevor Code entstanden ist?» Und: «Wer hat den Fehler bei genau 500 Franken gefunden?»

**WEITER:** Bei 1:00 `→` zu B3, auch wenn einzelne noch nicht fertig sind.

## B3 · Übung 04 A – Permissions · 1:00–1:06 (6 Min)

**Ziel der Übung:** Festlegen, was Claude in diesem Projekt nie darf und wo es nachfragen muss.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ihr schreibt deny- und ask-Regeln und probiert aus, ob sie halten. Dann drückt ihr einmal Shift+Tab, vom auto mode zum manual mode. Dort fragt Claude vor jeder Änderung nach. So seht ihr beides: die Rückfragen des Modus und eure Regeln. Ein verweigerter Aufruf kostet fast nichts.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Bei wem eine Regel nicht greift: Schreibweise des Musters und die Settings-Datei prüfen. Bei Prompt 1 versucht Claude den Umweg über `cat` oft gar nicht und lehnt selbst ab. Das ist in Ordnung, die Regel hätte ihn blockiert. Kommt bei Prompt 2 keine Rückfrage zu `rm`: Liegt die Datei `notiz.txt` im Ordner? Ohne sie nimmt Claude `rmdir`, und die Regel greift nicht.

**Abholen nach der Übung:** Noch nichts. Direkt weiter zu Teil B.

**WEITER:** Bei 1:06 `→` zu B4.

## B4 · Übung 04 B – Hooks · 1:06–1:15 (9 Min)

**Ziel der Übung:** Zwei Hooks einbinden: Einer formatiert nach jedem Edit die geänderte Datei, einer blockiert Edits an generiertem Code.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Zwei Hooks aus der Vorlage. Der eine formatiert, der andere blockiert. Beide laufen ausserhalb des Modells und kosten keine Tokens.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Die Hooks kommen aus der Vorlage, hier wird kaum iteriert. Geprüft wird nur, ob `FristFormatter` aus der Liste von Spotless verschwunden ist. Andere Dateien in der Liste stammen aus Übung 02 und 03, bevor es den Hook gab. Prompt 5 (der Test des blockierenden Hooks) ist freiwillig. Wer auch damit fertig ist, kann Übung 05 selbst durchspielen (Zusatzaufgabe).

**WÄHRENDDESSEN:** Wenn die Uhr noch 3 Minuten zeigt, zurück an den Laptop. [Folien] nicht anfassen. Mit Cmd+Tab zu **[T1]** und prüfen: Die Session von Übung 04 ist offen, das Eingabefeld ist leer. Ist [T1] geschlossen: `cd ../demo-05 && claude -c`. **[T5]** daneben steht im Ordner `demo-05`. Dann mit Cmd+Tab zurück zu [Folien].

**Abholen nach der Übung:** «Wer hat Prompt 5 gemacht? Was hat Claude getan, nachdem der Hook blockiert hat?»

**WEITER:** Bei 1:15 `→` zu B5.

## B5 · Rewind · 1:15–1:16 (1 Min)

**Ziel:** Alle wissen vor der Demo, was ein Checkpoint ist und was `/rewind` zurücksetzt.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Zeitleiste: vier Prompts, vor jedem ein Checkpoint | «Die letzte Leitplanke ist ein Netz. Vor jedem Prompt legt Claude Code einen Checkpoint an: den Stand der Dateien und des Verlaufs.» |
| `→` | Prompt 4 wird rot, «Tests rot» | «Prompt 4 ist schiefgegangen.» |
| `→` | Checkpoint 4 wird grün, Prompt 4 ist durchgestrichen | «Mit `/rewind` oder zweimal Esc wählt ihr den Checkpoint vor Prompt 4.» |
| `→` | drei Karten mit den Menüpunkten | «Dann fragt Claude Code, was zurückgeht: Code und Verlauf, nur der Verlauf oder nur der Code. Ich nehme gleich den ersten Punkt.» |
| `→` | Hinweis zu den Grenzen | «Erfasst wird nur, was über Edit und Write geändert worden ist. Was ein Bash-Befehl geändert hat, bleibt. Darum ersetzt Rewind Git nicht.» |

**WEITER:** `→` zu B6 (Demo 05).

**Häufige Fragen**

- *Was erfasst ein Checkpoint nicht?* Dateien, die nur per Bash, von einem Subagent oder von aussen geändert worden sind. Darum ersetzt Rewind Git nicht.
- *Wie lange bleiben Checkpoints?* Sie gehören zur Session und überleben ein `claude -c`. Laut Doku werden die letzten 100 behalten.

## B6 · Demo 05 – Rewind · 1:16–1:18 (2 Min, du zeigst es)

**Ziel:** Alle haben `/rewind` einmal gesehen. Wer will, macht es mit dem Übungsblatt selbst.

**Vorbereitung:** **[T1]** ist offen (siehe «Vorbereitung»): der Klon `demo-05` mit der Session, in der Übung 04 durchgespielt ist. Geprüft hast du das während Übung 04 B.

| Schritt | Wo | Du tust | Du sagst |
|---------|----|---------|----------|
| 1 | [Folien] | (Folie steht) Ziel und Aufgabe | «Das zeige ich euch, ihr müsst nichts tippen. Wer es selbst machen will: Das Blatt zu Übung 05.» |
| 2 | [Folien] | `→` `→` bis die Schritte und der Commit-Befehl stehen. `z` startet die Uhr (2 Minuten). | «Das sind die fünf Schritte, die ich jetzt mache.» |
| 3 | **[T5]** | Cmd+Tab zu den Terminals. In [T5] tippen: `git add -A && git commit -m "Add formatting and protection hooks"`, Enter. | «Zuerst sichere ich den Stand von Übung 04 mit einem Commit.» |
| 4 | **[T1]** | In [T1] klicken. `/rewind` tippen, Enter. Eine Liste der bisherigen Prompts erscheint. | «Das sind die Checkpoints: einer vor jedem Prompt.» |
| 5 | [T1] | Mit den Pfeiltasten den Eintrag wählen, dessen Text der **Prompt 3** aus Übung 04 ist (er lässt den Schutz-Hook bauen). Enter. | «Ich gehe zurück vor Prompt 3.» |
| 6 | [T1] | «Restore code and conversation» wählen, Enter. | «Code und Verlauf.» |
| 7 | [T1] | Im Eingabefeld steht wieder Prompt 3. **Nicht Enter drücken.** Die Löschtaste halten, bis das Feld leer ist. | «Der alte Prompt steht wieder da. Ich lösche ihn, sonst läuft er nochmals.» |
| 8 | **[T5]** | In [T5] klicken. `git status`, Enter. Dann `git diff --stat`, Enter. | «Der Schutz-Hook ist weg, weil Claude ihn geschrieben hat. Der Formatier-Hook ist noch da, den habe ich mit `cp` kopiert. Den kennt kein Checkpoint.» |
| 9 | [T5] | `git restore .`, Enter. Dann `git status --short`, Enter: Die Ausgabe ist leer. | «Und mit Git komme ich wieder nach vorne. Checkpoints sind das Undo der Session, Git ist das Netz des Teams.» |
| 10 | [Folien] | Cmd+Tab zurück zu [Folien]. | |

Erwartete Ausgabe in Schritt 8: `deleted: .claude/hooks/protect-generated.mjs` und `modified: …/FristFormatter.java`, sonst nichts.

**Wenn die Demo hängt:** nach 2 Minuten abbrechen. Cmd+Tab zu [Folien], `5` springt zu B5. Mit `→` nochmals durch die Zeitleiste gehen und den Ablauf daran erzählen. Danach `7` für B7.

**WEITER:** In [Folien] `→` zu B7 (Teamfrage).

## B7 · Teamfrage · 1:18–1:21 (3 Min)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welche Datei oder welcher Befehl in eurem Projekt braucht eine Deny-Regel oder einen Hook?» |
| `z` | Die Uhr läuft | Nachfragen: «Reicht dort eine Rückfrage, oder muss es verboten sein?» Ein Aufhänger aus den Probeläufen: Claude schlägt nach einer verweigerten Aktion selbst vor, den Befehl mit `!` von Hand auszuführen. Die Regel gilt für Claude, nicht für den Menschen. |

**WEITER:** Bei 1:21 `→` zu B8 (Pause).

## B8 · Pause · 1:21–1:31 (10 Min)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Uhr mit 10 Minuten, die zwei Befehle zum Starten der App | «Bevor ihr aufsteht: Startet die App in zwei weiteren Terminals, die Befehle stehen hier. Sie fährt während der Pause hoch, Übung 06 braucht sie. Und wer in Übung 04 zum manual mode gewechselt hat, kann mit Shift+Tab zurück in den auto mode.» **TUN:** Warten, bis die meisten getippt haben. |
| `z` | Die Uhr läuft (10 Minuten) | «Zehn Minuten Pause.» |

**WÄHRENDDESSEN (in der Pause):**

1. [Folien] stehen lassen, die Uhr läuft für alle sichtbar.
2. **[T2]**, **[T3]**, **[T4]** prüfen: Alle drei stehen im Ordner `demo-d` (`pwd`). Kein `claude` läuft.
3. **[Editor]** prüfen: `sprechskript.md` ist offen bei «Die drei Prompts zum Kopieren».
4. Laufzettel: Ist-Zeit eintragen. Bist du mehr als 5 Minuten hinten, R11 streichen.
5. Zwei Minuten vor Ende durch den Raum: Bei wem zeigt `http://localhost:4200` die App noch nicht?

**WEITER:** Ist die Uhr abgelaufen und sind die Leute zurück: `→` zu C1.

---

# C MCP (1:31, 23 Minuten)

## C1 · MCP · 1:31–1:34 (3 Min)

**Ziel:** MCP ist ein Stecker, kein Produkt. Und: Ein Agent, der sein Ergebnis sieht, braucht weniger Kontrolle.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | links Claude Code, rechts Browser mit der App | «Bis jetzt hat Claude Dateien gelesen und Befehle ausgeführt. Eure App im Browser sieht es nicht.» |
| `→` | MCP-Stecker, Playwright-Server, gestrichelt weitere Server | «MCP, das Model Context Protocol, ist ein offener Standard: eine Steckdose für Werkzeuge. Claude Code kennt nur das Protokoll. Dahinter kann ein Browser hängen, ein Ticket-System, eine Datenbank. In Übung 06 ist es Playwright, lokal gestartet, eingetragen in `.mcp.json`, damit das ganze Team denselben Server hat.» |
| `→` | Feedback-Loop leuchtet reihum | «Das eigentlich Neue ist aber das hier. Claude ändert Code, schaut im Browser nach, sieht den Fehler selbst, korrigiert und sichert das Ergebnis mit einem Test. Ein Agent, der seine Arbeit prüfen kann, braucht weniger Kontrolle durch euch.» |
| `→` | zwei Merksätze: Kontext, Vertrauen | «Zwei Dinge zum Mitnehmen. Erstens Kontext: Beim Start laden nur die Namen der Tools, die Beschreibungen erst bei Bedarf. Zweitens Vertrauen: Was ein Server zurückgibt, ist fremder Inhalt. Eine Webseite kann Text enthalten, der wie eine Anweisung aussieht.» |

**Übergang:** «Übung 06. Die App habt ihr vor der Pause gestartet. Der Fehler: Das Formular schluckt eine Ablehnung des Backends.»

**WEITER:** Nach den zwei Merksätzen `→` zu C2.

**Häufige Fragen**

- *Wer hat MCP erfunden?* Anthropic hat es Ende 2024 als offenen Standard veröffentlicht. Inzwischen unterstützen es viele Werkzeuge und Anbieter.
- *stdio oder HTTP?* stdio für lokale Prozesse wie hier, HTTP für entfernte Dienste. SSE gilt als veraltet.
- *Welche Scopes gibt es?* Lokal (nur ich, nur dieses Projekt), Projekt (`.mcp.json`, im Repo geteilt), User (ich, alle Projekte).
- *Warum muss ich den Server bestätigen?* Weil ein geklontes Repo sonst beliebige Programme auf eurem Rechner starten könnte.
- *Brauche ich MCP, wenn es ein CLI gibt?* Oft nicht. Ein gutes CLI über Bash reicht häufig und kostet weniger Kontext. MCP lohnt sich bei strukturierten Daten, Anmeldung und geteilten Diensten.
- *Warum `node` statt `npx` in der Vorlage?* Es nutzt das bereits installierte Paket, funktioniert offline und auf Windows ohne Umweg.

## C2 · Übung 06 – Browser über MCP · 1:34–1:51 (17 Min)

**Ziel der Übung:** Den Playwright-MCP-Server einbinden. Claude reproduziert einen Frontend-Fehler selbst im Browser, behebt ihn und prüft das Ergebnis.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ihr tragt den Server in `.mcp.json` ein, startet Claude neu und lasst den Server zu. Lest den Dialog, drückt nicht einfach Enter. Der Server steuert euren installierten Chrome. Wer nur Edge hat, ergänzt die zwei Wörter, die auf der Folie stehen. Dann ein Prompt: reproduzieren, beheben, im Browser prüfen, Test ergänzen.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | Sagen: «Los.» |
| `z` | Die Uhr läuft | **TUN:** Die Folie bleibt stehen, keine Taste mehr drücken. Durch den Raum gehen. |

**Im Raum:** Häufigste Hänger: Claude nicht neu gestartet, Server nicht zugelassen (`/mcp` muss `playwright` als verbunden zeigen; im Probelauf ist im Dialog «Continue without using this MCP server» vorausgewählt gewesen), App läuft nicht, weder Chrome noch Edge installiert (auf Linux hilft `--executable-path` mit dem Pfad zu Chromium, siehe Blatt). Ohne Browser weicht Claude auf einen e2e-Test aus: Die Tests werden grün, aber das Browserfenster ist nie aufgegangen. Darauf achten. Browser-Snapshots sind gross: genaue Anweisungen sparen Klick-Runden.

**WÄHRENDDESSEN:** In den ersten 5 Minuten durch den Raum und bei jedem Platz auf zwei Dinge schauen: `/mcp` zeigt `playwright` als verbunden, und ein Browserfenster ist aufgegangen. Wenn die Uhr noch 5 Minuten zeigt, laut sagen: «Wer noch keinen Browser gesehen hat, meldet sich jetzt.»

**Abholen nach der Übung:** «Hat Claude den Fehler selbst gesehen? Woran habt ihr das gemerkt?»

**WEITER:** Bei 1:51 `→` zu C3 (Teamfrage).

## C3 · Teamfrage · 1:51–1:54 (3 Min)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welches System würdet ihr per MCP anbinden? Und sieht Claude dort fremde Inhalte?» |
| `z` | Die Uhr läuft | Bei jeder Antwort die zweite Hälfte nachfragen: «Wer schreibt die Texte, die Claude dort liest?» |

**WEITER:** Bei 1:54 sagen: «Ab jetzt schaut ihr zu.» Dann `→` zu R1. Ab hier bleibst du bis D2 am Laptop.

---

# R Suche: Agentic Search vs. RAG (1:54, 23 Minuten mit Teamfrage)

**Roter Faden:** Echte Dokumentation, zwei Wege zur Antwort. Erst zeigen, wo jede Suche blind ist, dann messen,
dann den Agenten ohne Index dagegenstellen. Die Zahlen sind ehrlich gemessen und nicht nachgetunt.

**Die vier Fragen** (mit `q` wählen):

| Kürzel | Frage | Was sie zeigt |
|--------|-------|---------------|
| **S2** | Welche Währungsangabe gilt für Fakturen in britischen Pfund? | Synonym: Das Dokument sagt «GBP» und «Währungscode». BM25 findet nichts, Vektor Rang 1 |
| **E1** | Was bedeutet die Meldung NT044? | Bezeichner: BM25 Rang 1, Vektor nicht in den Top 10, Hybrid Rang 2 |
| **C3** | Wer muss das Zollformular für Militärtransporte ausfüllen …? | Sprachwechsel: Antwort nur im italienischen Dokument. BM25 nichts, Vektor Rang 1 |
| **M3** | Was ändert sich mit NCTS Phase 5 beim Layout … und bei der Tarifnummer? | Zwei Dokumente: BM25 findet beide in den Top 5, Vektor und Hybrid nur eines, der Agent findet beide |

Auf einem geraden Durchgang zeigt die Präsentation nur **S2**. Die anderen drei Fragen sieht das Publikum
nur, wenn du mit `q` wechselst (vorgesehen auf R3, R5, R6 und R7).

**Frage wechseln, Taste für Taste.** `q` öffnet die Liste. Oben stehen die vier Fragen in dieser Reihenfolge:
S2, C3, E1, M3. Markiert ist die aktuelle. Mit `↓` oder `↑` wählen, Enter übernimmt.

| Von | Nach | Tasten |
|-----|------|--------|
| S2 | E1 | `q` `↓` `↓` Enter |
| E1 | S2 | `q` `↑` `↑` Enter |
| E1 | C3 | `q` `↑` Enter |
| C3 | E1 | `q` `↓` Enter |

Drei Dinge, die du wissen musst:

- Nach dem Wechsel beginnt die Folie wieder beim ersten Schritt. Du drückst `→`, bis das Ergebnis steht.
- **Die gewählte Frage bleibt auf den nächsten Folien bestehen.** Darum steht im Skript bei jeder Folie, welche Frage beim Ankommen aktiv ist.
- Auf R3 und R5 erscheint die Schätzfrage für jede neue Frage nochmals. Kurz in den Raum fragen («Und hier?») oder ohne Abstimmen zweimal `→` drücken.

**Der Weg durch R in einer Zeile:** R3 mit S2, dann E1 · R4 zurück zu S2 · R5 mit S2, dann E1, dann C3 · R6 mit C3, dann E1 · R7 mit C3.

**Zeit:** Der Abschnitt hat keine Reserve. Die Folie R8 «Test» ist neu dazugekommen und noch nicht gestoppt.
Bei Zeitnot: `g` schaltet die Schätzfragen aus, R2 lässt sich überspringen.

## R1 · Korpus · 1:54–1:55½ (1½ Min)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | 16 Kacheln, «16 Dokumente», «267 Seiten» | «Bis jetzt hat Claude im Code gesucht. Was, wenn das Wissen woanders steht? Das hier ist echte Dokumentation des BAZG zum Transitverfahren: 16 Dokumente, 267 Seiten. Dieselbe Domäne wie eure Übungs-App.» |
| `→` | deutsche Kacheln verblassen, «3 Sprachen» | «Und sie ist mehrsprachig. Zwei Dokumente gibt es nur auf Französisch, eines nur auf Italienisch. Das wird gleich wichtig.» |
| `→` | «Chunks im Index», zwei Wege: «Weg 1: RAG», «Weg 2: Der Agent sucht selbst» | «Wie findet ein Agent darin die richtige Stelle? Zwei Wege. Entweder wir bauen vorher einen Index und schlagen bei jeder Frage nach: Das ist RAG. Oder der Agent sucht selbst, mit Grep und Read, so wie im Code. Wir schauen uns beide an und messen.» |

**WEITER:** `→` zu R2. Bei Zeitnot R2 überspringen: `3` springt direkt zu R3.

**Fragen:** *Warum nicht einfach alles in den Kontext?* 267 Seiten bei jedem Turn mitzuschicken ist teuer und macht Antworten ungenauer. · *Sind die Dokumente im Repo?* Nein, sie werden von der BAZG-Seite geladen, die Liste steht in `rag/sources.yaml`.

## R2 · Chunking · 1:55½–1:57 (1½ Min)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | ein Abschnitt aus R-14-01 als Fliesstext | «Ein Index findet keine Dokumente, sondern Stücke davon: Chunks. Also müssen wir schneiden.» |
| `→` | Schnitte nach fester Länge, rot wo mitten im Wort | «Die einfache Art: alle 400 Zeichen, mit etwas Überlappung. Seht ihr die roten Stellen? Der Schnitt geht mitten durch Wörter und Sätze.» |
| `→` | Schnitte an Überschriften, Pfad davor | «Die bessere Art: an den Überschriften entlang. Jeder Chunk bekommt seinen Überschriftenpfad vorangestellt, so weiss er, wo er herkommt.» (`t` wechselt hin und her.) |

**Satz:** «Was ein Chunk ist, bestimmt, was gefunden werden kann.»

**WEITER:** `→` zu R3. Die aktive Frage ist S2.

**Fragen:** *Wie gross soll ein Chunk sein?* Gross genug für einen vollständigen Gedanken, klein genug, dass fünf davon in den Kontext passen. · *Wozu Überlappung?* Damit ein Satz an der Schnittkante in mindestens einem Chunk ganz bleibt. · *Bringt das besseres Chunking etwas?* Hier ein bis zwei Fragen von 25. Das ist im Rauschen. Sag das so.

## R3 · BM25 · 1:57–1:59½ (2½ Min), Fragen S2, dann E1

**Ziel:** Alle verstehen die drei Schritte der Stichwortsuche und sehen, warum sie bei S2 nichts findet.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht, Frage S2) | Frage, darunter ihre Wörter. Füllwörter durchgestrichen, Suchbegriffe ocker | «Erste Suche: BM25, die klassische Stichwortsuche. Schritt eins: Die Frage wird zerlegt. Alles klein geschrieben, Füllwörter wie ‹welche› und ‹für› fallen weg. Übrig bleiben vier Suchbegriffe: Währungsangabe, Fakturen, britischen, Pfund.» |
| `→` | unter jedem Suchbegriff: «in N Chunks» und ein Gewichtsbalken. Bei S2 überall rot «in keinem Chunk» | «Schritt zwei: Für jeden Begriff wird gezählt, in wie vielen der 1206 Chunks er vorkommt. Ein seltenes Wort sagt viel über einen Chunk aus und bekommt ein hohes Gewicht. Ein Wort, das überall steht, bekommt fast keines. Und hier sehen wir schon das Problem: Keiner der vier Begriffe kommt im Korpus überhaupt vor.» |
| `→` | **Schätzfrage:** Findet BM25 das richtige Dokument? | Frage vorlesen. «Hand hoch für Ja. Für Nein.» |
| `→` | Antwort «Nein» ist markiert | «Nein. Kein einziger Treffer.» |
| `→` | Rangliste (bei S2 leer), Text zu Schritt 3 | «Schritt drei: Jeder Chunk bekommt einen Score. Für jeden Suchbegriff, der im Chunk steht, wird sein Gewicht addiert, verstärkt durch die Häufigkeit im Chunk. Zwei Korrekturen: Das zehnte Vorkommen zählt weniger als das erste, und lange Chunks werden abgewertet, weil sie zufällig mehr Wörter enthalten.» |
| `→` | rotes Ergebnis, Kasten «Was ist BM25?» | «Das richtige Dokument sagt ‹Rechnungen in GBP› und ‹Währungscode›. Kein Wort der Frage steht darin. BM25 vergleicht Zeichenfolgen, keine Bedeutung.» |
| `q` `↓` `↓` Enter | Frage **E1** «Was bedeutet die Meldung NT044?», erster Schritt | «Die Gegenprobe: eine Frage mit einem Code.» |
| `→` | «meldung» in 31 Chunks, «nt044» in 3 Chunks | «‹Meldung› steht in 31 Chunks, das Gewicht ist klein. ‹NT044› steht in genau 3, das Gewicht ist gross.» |
| `→` `→` | Schätzfrage erscheint nochmals, Antwort «Ja» | «Und hier? Findet BM25 es?» Kurz Hände, dann auflösen. |
| `→` `→` | Rangliste, dann grünes Ergebnis: Treffer auf Rang 1 | «Die Tabellenzeile mit NT044 landet auf Rang 1. Seltene, exakte Zeichenfolgen sind die Stärke von BM25.» |

**WEITER:** `→` zu R4. Achtung: Dort ist noch **E1** aktiv. Zuerst zurück zu S2 (steht dort als erste Zeile).

**Satz:** «BM25 findet, was wörtlich dasteht. Synonyme und andere Sprachen findet es nicht.»

**Fragen**

- *Wofür steht BM25?* «Best Matching 25». Eine Bewertungsformel aus den Neunzigerjahren, bis heute Standard in Lucene, Elasticsearch und SQLite FTS5.
- *Wie berechnet sich das Gewicht genau?* Über die inverse Dokumenthäufigkeit (IDF): Logarithmus aus dem Verhältnis von allen Chunks zu den Chunks mit diesem Begriff. Der Balken auf der Folie zeigt diesen Wert.
- *Warum zählen Wiederholungen immer weniger?* Die Formel hat eine Sättigung (Parameter k1): Ein Begriff, der zehnmal vorkommt, ist nicht zehnmal so relevant.
- *Warum werden lange Chunks abgewertet?* Ein langer Text enthält zufällig mehr Suchbegriffe. Die Formel teilt darum durch die Länge im Verhältnis zum Durchschnitt (Parameter b).
- *Müssen alle Suchbegriffe vorkommen?* Nein. Die Abfrage ist eine ODER-Verknüpfung. Ein Chunk mit nur einem Begriff erscheint, mit entsprechend tiefem Score.
- *Was ist mit Wortformen wie «Meldung» und «Meldungen»?* Hier gibt es kein Stemming. Der Tokenizer vereinheitlicht nur Gross- und Kleinschreibung und Umlaute. «Meldungen» wäre ein anderer Begriff.
- *Kann man Synonyme nicht hinterlegen?* Doch, aber die Liste muss jemand pflegen, pro Fachgebiet und Sprache.
- *Woher kommen die Füllwörter?* Aus einer festen Stoppwortliste in `rag/indexer/store.py`.
- *Sind die Zahlen echt?* Ja. Die Chunk-Zahlen stammen aus dem Index, die Scores aus SQLite FTS5.

## R4 · Vektor-DB · 1:59½–2:01½ (2 Min), Frage S2

**Ziel:** Bevor die Karte kommt, sehen alle, was eigentlich gespeichert und verglichen wird: Zahlen pro Chunk.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| `q` `↑` `↑` Enter | **TUN zuerst:** zurück zur Frage **S2**. Oben steht wieder die Pfund-Frage. | (nichts sagen) |
| (Folie steht, Frage S2) | Chunk → «Embedding-Modell» → Zahlenstreifen | «Bevor wir suchen, müssen wir verstehen, was im Index liegt. Ein Embedding-Modell macht aus einem Text eine feste Liste von 384 Zahlen. Ähnliche Bedeutung ergibt ähnliche Zahlen. Das ist ein kleines, eigenes Modell, es läuft hier auf dem Laptop. Mit Claude hat es nichts zu tun.» |
| `→` | Tabelle: eine Zeile pro Chunk, mit Zahlenstreifen | «Und das ist schon die ganze Vektor-Datenbank: eine Tabelle. Pro Chunk eine Zeile, mit dem Text und seinen 384 Zahlen. Die Streifen zeigen die ersten sechzehn davon. Bei uns sind es 1206 Zeilen in einer einzigen SQLite-Datei.» |
| `→` | blaue Zeile «die Frage» | «Die Frage geht durch dasselbe Modell und wird ebenfalls zu 384 Zahlen.» |
| `→` | Spalte «Ähnlichkeit zur Frage» füllt sich, Zeilen sortieren sich | «Suchen heisst jetzt: die Zahlen der Frage mit jeder Zeile vergleichen und nach Ähnlichkeit sortieren. Die obersten Zeilen sind die ‹nächsten Nachbarn›. Kein einziges Wort ist verglichen worden.» |
| `→` | drei Merkkästen | «Darum findet ‹Pfund› das Dokument mit ‹GBP›. Und darum geht ein Code wie NT044 verloren. Eine spezielle Datenbank braucht es erst bei Millionen von Zeilen: Dann hilft ein Index, der nicht jede Zeile prüfen muss.» |

**Übergang:** «Eine Tabelle mit 384 Spalten kann niemand lesen. Darum zeichnen wir sie jetzt als Karte.»

**WEITER:** Nach den drei Merkkästen `→` zu R5. Die aktive Frage ist S2.

**Fragen**

- *Was ist eine Vektor-Datenbank?* Eine Datenbank, die zu jedem Eintrag einen Zahlenvektor speichert und schnell die ähnlichsten Vektoren zu einer Anfrage findet.
- *Brauche ich dafür ein eigenes Produkt?* Bei einigen tausend Chunks nicht. SQLite mit sqlite-vec oder Postgres mit pgvector reichen. Eigene Vektor-Datenbanken lohnen sich bei sehr grossen Beständen.
- *Was heisst «nearest neighbour»?* Die Einträge, deren Vektor dem der Frage am ähnlichsten ist. Bei grossen Beständen wird das näherungsweise gesucht (ANN, approximate nearest neighbour).
- *Was bedeuten die einzelnen Zahlen?* Einzeln nichts Lesbares. Erst das Muster aller 384 Zahlen zusammen beschreibt die Bedeutung.
- *Woher kommen die Zahlen auf der Folie?* Es sind die echten ersten 16 Werte aus dem Index, die Ähnlichkeiten sind die echten Kosinus-Werte der Suche.

## R5 · Vektorsuche · 2:01½–2:05½ (4 Min), Fragen S2, E1, C3

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht, Frage S2) | Karte: jeder Punkt ein Chunk | «Dieselbe Tabelle, jetzt als Karte. Jede Zeile ist ein Punkt, und Zeilen mit ähnlichen Zahlen liegen nah beieinander. Die 384 Zahlen sind dafür auf zwei zusammengedrückt, die Abstände stimmen also nur ungefähr.» |
| `→` | die Frage fliegt als Stern ein | «Die Frage wird mit demselben Modell zu einem Punkt.» |
| `→` | **Schätzfrage:** Findet die Vektorsuche das richtige Dokument? | Frage vorlesen. «Hand hoch für Ja. Für Nein.» |
| `→` | Antwort «Ja» ist markiert | «Ja.» |
| `→` | Linien zu den nächsten Nachbarn, Ergebnisliste | «Gesucht sind die nächsten Nachbarn.» |
| `→` | Ausschnitt um die Frage, grünes Ergebnis. Grüne Ringe um alle Chunks des erwarteten Dokuments, darunter ein Satz zu Chunks und Dokumenten | «Rang 1. Dieselbe Frage, an der BM25 gescheitert ist. Das Modell weiss, dass Pfund und GBP dasselbe meinen. Zu den Ringen: Das erwartete Dokument besteht aus 8 Chunks, jeder ist ein Punkt. Zwei davon stehen in den Top 5, Rang 1 und Rang 4. Die anderen sechs handeln von etwas anderem und liegen darum weit weg. Die Suche liefert Chunks, keine Dokumente.» |
| `→` | Formel der Kosinus-Ähnlichkeit, darunter angewendet auf Zeile 112. Auf jeder Linie steht ihr Wert, die Linie zu Rang 1 ist dick | «Warum Rang 1? Für jede Zeile der Tabelle wird diese Formel gerechnet: die Zahlen der Frage mal die Zahlen des Chunks, aufsummiert, geteilt durch die Längen. Für Zeile 112 ergibt das 0.61. Das ist der höchste Wert aller 1206 Zeilen. Die anderen Linien zeigen 0.53, 0.50, 0.48.» |
| `q` `↓` `↓` Enter | Frage **E1** (NT044), Karte ohne Stern | «Und jetzt die Gegenprobe. Was bedeutet die Meldung NT044? Für die Stichwortsuche ist das ein Geschenk.» |
| `→` | Stern fliegt ein | |
| `→` `→` | Schätzfrage nochmals, Antwort «Nein» | «Und hier?» Kurz Hände, dann auflösen. |
| `→` `→` | Linien, dann rotes Ergebnis | «Die Vektorsuche findet den Code nicht einmal in den Top 10. Ziffern tragen kaum Bedeutung, NT044 und NT045 liegen fast aufeinander.» |
| `q` `↑` Enter | Frage **C3** (Militärtransporte), Karte ohne Stern | «Dritte Frage, auf Deutsch gestellt. Die Antwort steht nur im italienischen Dokument.» |
| `→` | Stern fliegt ein | |
| `→` `→` | Schätzfrage nochmals, Antwort «Ja» | Ohne Abstimmen durchdrücken oder kurz fragen. |
| `→` `→` | Linien, dann grünes Ergebnis: italienisches Dokument auf Rang 1 | «BM25 hat keine Chance, das mehrsprachige Modell springt über die Sprachgrenze.» |

**WEITER:** `→` (die Formel erscheint nochmals, nichts dazu sagen), dann `→` zu R6. Dort ist **C3** aktiv, das passt.

**Sätze:** «Vektoren verstehen Bedeutung, aber nicht Bezeichner.» · «Mehrsprachige Embeddings überspringen die Sprachgrenze.»

**Fragen**

- *Was ist ein Embedding?* Eine Liste von Zahlen, die die Bedeutung eines Textes beschreibt. Ähnliche Texte bekommen ähnliche Zahlen.
- *Warum sind nicht alle Punkte mit Ring verbunden?* Verbunden sind die fünf ähnlichsten Chunks. Ein Ring heisst nur: Dieser Chunk gehört zum erwarteten Dokument. Die Frage gilt als gefunden, sobald einer davon in den Top 5 steht.
- *Wie misst man Nähe?* Hier über die Kosinus-Distanz: den Winkel zwischen zwei Vektoren.
- *Welches Modell ist das?* `paraphrase-multilingual-MiniLM-L12-v2`, klein, mehrsprachig, läuft lokal auf dem Laptop. Es gehen keine Daten nach aussen.
- *Wie kommt die Karte zustande?* Hauptkomponentenanalyse (PCA) von 384 auf 2 Dimensionen. Abstände stimmen nur ungefähr, die Nachbarn stammen aus der echten Rangliste.
- *Wo werden die Vektoren gespeichert?* In derselben SQLite-Datei, mit der Erweiterung sqlite-vec. Eine eigene Vektor-Datenbank braucht es bei dieser Grösse nicht.
- *Hat das etwas mit dem Sprachmodell zu tun?* Nein. Embedding-Modelle sind eigene, viel kleinere Modelle. Claude kommt in diesem Teil gar nicht vor.

## R6 · Hybrid · 2:05½–2:07½ (2 Min), Fragen S2, dann E1

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht, Frage C3) | zwei Ranglisten nebeneinander | «Jede Suche hat einen blinden Fleck, und zwar dort, wo die andere stark ist. Also beide zusammen.» |
| `→` | Karten wandern in eine gemeinsame Reihenfolge, mit `1/(60+Rang)` | «Reciprocal Rank Fusion: Jede Liste vergibt Punkte nach Rang, eins durch sechzig plus Rang. Die Punkte werden addiert. Es zählt nur die Position, nicht der Score. Darum lassen sich zwei völlig verschiedene Verfahren mischen.» |
| `→` | Urteil: «Die Fusion hält den besten Rang (1)» | «Bei der Frage zu den Militärtransporten bleibt der Vektor-Treffer auf Rang 1.» |
| `q` `↓` Enter | Frage **E1** (NT044), zwei Ranglisten | «Und jetzt nochmals NT044.» |
| `→` `→` | Fusion, dann Urteil: «Die Fusion schadet» | «Hier schadet die Fusion. BM25 hat den Treffer auf Rang 1 gehabt, das Rauschen der Vektoren drückt ihn auf Rang 2.» |

**WEITER:** `→` zu R7. Achtung: Dort ist **E1** aktiv. Zuerst zu C3 wechseln (steht dort als erste Zeile).

**Satz:** «Fusion gleicht blinde Flecken aus, im Schnitt. Im Einzelfall kann sie einen sicheren Treffer verwässern.»

**Fragen:** *Warum 60?* Der Wert aus der Originalarbeit zu RRF von 2009. Er dämpft den Vorsprung der obersten Ränge und ist kaum empfindlich. · *Warum nicht die Scores addieren?* BM25-Scores und Kosinus-Werte haben verschiedene Skalen und sind nicht vergleichbar. · *Geht das besser?* Ja, etwa mit einem Reranker, der die Kandidaten nochmals bewertet. Das kostet Zeit und ein weiteres Modell.

## R7 · Agent · 2:07½–2:10 (2½ Min), Frage C3 oder M3

**Ziel:** Alle sehen den Weg von der Frage zur Antwort: ein Punkt pro Turn. Ein Turn ist eine Antwort des Modells, also ein Tool-Aufruf oder am Schluss der Text.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| `q` `↑` Enter | **TUN zuerst:** zur Frage **C3** wechseln. Oben steht die Frage zu den Militärtransporten. | (nichts sagen) |
| (Folie steht, Frage C3) | die Frage | «Jetzt der andere Weg. Kein Index, keine Embeddings. Claude Code bekommt dieselben Markdown-Dateien und drei Werkzeuge: Grep, Glob, Read. Das ist eine Aufzeichnung eines echten Laufs.» |
| `→` | **Schätzfrage:** Wie viele Turns? | Frage vorlesen. «Hand hoch für A. Für B. Für C.» |
| `→` | Antwort «3–4» ist markiert | «Vier Turns.» |
| `→` | Linie läuft zum ersten Punkt: Turn 1 mit Karte (Tool, Suchmuster, Grösse des Ergebnisses). Zähler für Turns und Kontext | «Schaut auf das Suchmuster: Militär, militaire, militare. Claude übersetzt den Suchbegriff selbst, ohne dass es jemand verlangt hat.» |
| `→` `→` | Turn 2 und Turn 3 | «Jeder Punkt ist ein Turn. Der Zähler unten zeigt, wie der Kontext wächst.» |
| `→` | grüner letzter Punkt: Turn ohne Tool-Aufruf, die Antwort. Darunter Antworttext und Vergleichstabelle RAG gegen Agent | «Gefunden, mit Quelle. Der Preis sind Turns und Tokens pro Frage. Dafür gibt es nichts zu bauen und nichts aktuell zu halten.» |

**WEITER:** `→` zu R8. Ab hier spielt die gewählte Frage keine Rolle mehr.

**Zahlen im Kopf:** alle 4 Fragen richtig · S2 3 Turns, rund 22'000 Tokens · C3 4 Turns, 31'000 · E1 3 Turns, 22'000 · M3 4 Turns, 36'000 · je 5 bis 10 Sekunden.

**Fragen:** *Skaliert das?* Bei 16 Dateien mühelos. Bei Tausenden liefert Grep zu viele Treffer, Turns und Kontext steigen. Dort beginnt der Bereich von RAG. · *Kann man beides verbinden?* Ja: Der Index wird ein Werkzeug des Agenten, zum Beispiel über MCP. Im Repo liegt dafür `rag/mcp_server/`. · *Warum zählen Tokens bei Grep?* Jedes Suchergebnis landet im Kontext und wird in den folgenden Turns wieder mitgeschickt. · *Warum 3 Turns bei nur 2 Tool-Aufrufen?* Der letzte Turn ist die Antwort selbst. Darin ruft Claude kein Tool mehr auf.

## R8 · Test · 2:10–2:11 (1 Min)

**Ziel:** Bevor die Punkte kommen, wissen alle, was gemessen wird und was die vier Gruppen sind.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | vier Kästen: 25 Fragen → erwartetes Dokument → Top 5 → Recall@5 | «Vier Fragen sind Anekdoten. Darum ein Test: 25 Fragen, vor der ersten Messung geschrieben. Zu jeder Frage steht fest, in welchem Dokument die Antwort ist. Die Suche liefert fünf Ergebnisse. Ist das Dokument dabei, ist die Frage gefunden.» |
| `→` | vier Karten: Synonym, Andere Sprache, Code oder Kennung, Mehrere Dokumente, je mit einer Beispielfrage | «Die Fragen sind in vier Gruppen geteilt. Jede Gruppe prüft eine andere Schwäche. Pro Gruppe steht eine Beispielfrage. Die Pfund-Frage kennt ihr.» (Hast du vorher mit `q` auch NT044, Militärtransporte oder das Versandbegleitdokument gezeigt, darauf verweisen.) |
| `→` | Hinweis | «Auf der nächsten Folie ist jede Frage ein Punkt. Die vier Beispielfragen sind umrandet, jede in ihrer Gruppe.» |

**WEITER:** `→` zu R9.

**Fragen:** *Warum zählt ihr Dokumente und nicht Chunks?* Weil vorab nur festgelegt ist, in welchem Dokument die Antwort steht. Das ist grosszügig: Ein Treffer im richtigen Dokument kann an der falschen Stelle liegen. · *Was heisst der halbe Punkt?* Die Frage erwartet zwei Dokumente, gefunden ist eines.

## R9 · Messung · 2:11–2:13 (2 Min)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Reihe BM25: 25 Punkte, nach Kategorie gruppiert, 0.76 | «Jede Frage ist ein Punkt, sortiert nach den vier Gruppen. Voll heisst: Das richtige Dokument steht in den Top 5. Schaut, wo BM25 die Lücken hat: bei den Fragen in einer anderen Sprache.» |
| `→` | Reihe Vektor, 0.76 | «Die Vektorsuche: gleiche Quote, 0.76. Aber die Lücken sind an anderen Stellen: bei den Bezeichnern und bei den Synonymen.» |
| `→` | Reihe Hybrid, 0.92 | «Und zusammen: 0.92. Hybrid gewinnt hier klar, weil die Fehler fast nicht überlappen. Die halben Punkte sind Fragen mit zwei erwarteten Dokumenten, von denen nur eines gefunden worden ist.» |
| `→` | **Schätzfrage:** anderes Embedding-Modell, Sprachwechsel | Frage vorlesen. «Hand hoch für besser. Gleich. Schlechter.» |
| `→` | Antwort «Schlechter» ist markiert | «Schlechter. Von 0.83 auf 0.50.» |
| `→` | drei Karten: Varianten im Vergleich | «Gilt das immer? Links mit dem einfachen Chunking, in der Mitte unsere Variante, rechts mit einem deutlich grösseren Modell. Rechts bringt Hybrid nichts mehr: 0.86 wie Vektor allein. Und das grosse Modell ist beim Sprachwechsel schlechter. Grösser ist nicht einfach besser. Am eigenen Korpus messen.» |

**Fragen**

- *Was ist Recall@5?* Der Anteil der erwarteten Dokumente, die unter den ersten fünf Ergebnissen stehen. 0.76 entspricht 19 von 25 Fragen (zwei halbe Punkte zählen als einer).
- *Was ist MRR?* Mean Reciprocal Rank: der Durchschnitt von eins durch den Rang des ersten Treffers. Er misst, wie weit oben der Treffer steht. Rang 1 gibt 1, Rang 2 gibt 0.5.
- *Sind 25 Fragen genug?* Für eine Richtung ja, für Feinheiten nein. Eine Frage entspricht 0.04. Unterschiede unter 0.1 nicht überinterpretieren.
- *Wer hat die Fragen geschrieben?* Claude, aus den Dokumenten, vor der ersten Messung festgelegt. Eine Zollfachperson hat sie nicht geprüft. Das ist für den Zweck in Ordnung: Wir messen die Suche, der Zoll ist nur das Beispiel. Die Parameter sind danach nicht mehr angepasst worden.
- *Warum ist BM25 bei Synonymen so gut (0.86)?* Gezählt wird auf Dokumentebene, und das grosse Dokument R-14-01 trifft fast immer irgendwo. Die Zahl ist geschönt, sag das offen.
- *Warum ist das grosse Modell schlechter?* Das wissen wir nicht sicher. Gemessen ist: Es verfehlt mehr Fragen, deren Antwort in einem anderssprachigen Dokument steht. Genau darum misst man.

**WEITER:** Nach den drei Karten `→` zu R10.

## R10 · Fazit · 2:13–2:14 (1 Min)

Die erste Kernaussage steht beim Ankommen. Dann dreimal `→`, je eine weitere. Lies sie nicht vor, sondern sag je einen Satz dazu:

1. *Jeder Retriever hat einen blinden Fleck.* «Ihr habt es an den Punkten gesehen.»
2. *Hybrid ist kein Automatismus.* «Mit dem anderen Modell ist der Vorteil weg gewesen.»
3. *Chunking verändert, was gefunden wird.* «Bei uns ein bis zwei Fragen. Das ist Rauschen, und das sage ich lieber offen.»
4. *Für Code im Repo reicht agentische Suche fast immer.* «RAG lohnt sich für grosse, mehrsprachige Wissensbestände ausserhalb des Repos, oder wenn viele Leute dieselben Fragen stellen.»

**Ein Satz zum Schluss (Vertrauensgrenze):** «Was eine Suche zurückgibt, ist fremder Inhalt und landet im Kontext des Agenten, auch eine versteckte Anweisung. Darum gelten die Permissions aus Übung 04 auch hier.»

**WEITER:** Schau auf die Uhr. Ist es 2:14 oder früher: `→` zu R11 (Teamfrage). Ist es später: Shift+`→` springt direkt zu D1, die Frage stellst du im Schluss.

**Fragen**

- *Wofür steht RAG?* Retrieval-Augmented Generation: erst passende Stellen suchen, dann dem Modell als Kontext mitgeben.
- *Und Agentic Search?* Der Agent sucht selbst, in mehreren Schritten, mit Werkzeugen wie Grep und Read, und entscheidet nach jedem Ergebnis neu.
- *Was ist die «Lethal Trifecta»?* Drei Dinge, die zusammen gefährlich sind: Zugriff auf private Daten, Kontakt mit fremden Inhalten und ein Weg nach aussen. Fehlt eines, kann eine eingeschleuste Anweisung keine Daten abziehen.
- *Wann würdest du RAG bauen?* Wenn der Bestand so gross ist, dass Grep zu viele Treffer liefert, wenn er in mehreren Sprachen vorliegt oder wenn viele Leute dieselben Fragen stellen. Dann zuerst 20 bis 30 echte Fragen sammeln und messen.

**Plan B für den ganzen Abschnitt R:** Streikt der Browser, im Terminal `uv run search "Welche Währungsangabe gilt für Fakturen in britischen Pfund?" --mode bm25`, dann `--mode vector`, dann `uv run eval`.

## R11 · Teamfrage · 2:14–2:17 (3 Min, fällt bei Zeitnot als erste weg)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Folie steht) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Wo sucht ihr heute in Dokumentation? Würde dort eine Textsuche reichen?» |
| `z` | Die Uhr läuft | Nachfragen: «Wie viele Dokumente sind das, und in welchen Sprachen?» |

**WEITER:** Bei 2:17: «Der Agent hat vorhin viel gelesen. Was, wenn ich das nicht in meinem Kontext haben will?» Dann `→` zu D1.

---

# D Skalieren (2:17, 7 Minuten)

**Ziel:** Ein Subagent schützt den Kontext, ein Worktree schützt die Dateien.

**Form:** Drei Folien und eine Live-Demo. D1 erklärt das Konzept. D2 kündigt die Demo an und bleibt stehen,
während du auf dein Terminal wechselst und den Bildschirm teilst. D3 zeigt nach der Demo als Animation,
was passiert ist. Die Teilnehmenden machen hier nichts selbst. Der Ablauf im Terminal steht Schritt für Schritt bei D2.

**Zeit:** Das Budget ist 7 Minuten und ist für die Live-Demo allein geplant gewesen (3 + 4 Minuten).
Mit D1 und D3 reicht es nur, wenn die Live-Demo bei rund 4 Minuten bleibt. Sonst geht die Zeit vom Abschluss ab.
Noch nicht gestoppt.

## D1 · Skalieren · 2:17–2:18½ (1½ Min)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Balken «Hauptsession», wenig belegt | «Das ist eine Session. Jetzt soll jemand einen grossen Diff reviewen. Liest die Hauptsession ihn selbst, steht der ganze Diff danach in ihrem Kontext.» |
| `→` | Auftrag geht nach unten, Subagent-Balken füllt sich stark | «Stattdessen geht der Auftrag an einen Subagent. Er hat ein eigenes Kontextfenster und liest alles, was er braucht.» |
| `→` | blaues Segment «Bericht» in der Hauptsession | «Zurück kommt nur der Bericht. Der Reviewer läuft auf Haiku, also günstiger. Ich zeige das gleich live mit `/context` vorher und nachher.» |
| `→` | Repo fächert sich in zwei Worktrees auf | «Zweiter Teil: zwei Sessions, zwei Features, gleichzeitig. Jede hat ihr eigenes Arbeitsverzeichnis und ihren eigenen Branch.» |
| `→` | Merksatz | «Sie überschreiben sich nicht gegenseitig. Zusammengeführt wird mit Git.» |

**WEITER:** `→` zu D2 (Folie «Demo»).

## D2 · Demo · 2:18½–2:22½ (4 Min, Folie bleibt stehen, Live-Demo)

Die Prompts tippst du nicht, du kopierst sie aus **[Editor]** (die drei Blöcke unter der Tabelle). Schau beim Start auf die Uhr: Nach 4 Minuten gehst du zurück zu [Folien], egal wie weit die Sessions sind.

| Schritt | Wo | Du tust | Du sagst |
|---------|----|---------|----------|
| 1 | [Folien] | (Folie steht) Zwei Karten: Teil 1 Reviewer-Subagent, Teil 2 zwei Sessions in Worktrees | «Jetzt zeige ich das live. Achtet in Teil 1 auf `/context` vorher und nachher, in Teil 2 darauf, wo die Dateien liegen.» |
| 2 | **[T2]** | Cmd+Tab zu [T2]. `claude` tippen, Enter. Dann `/context`, Enter. | «Eine frische Session. Merkt euch diese Zahl.» Zahl laut sagen. |
| 3 | [T2] | Aus [Editor] den Prompt von Teil 1 kopieren («Nutze den reviewer-Subagent …»), einfügen, Enter. | «Der Auftrag geht an den Reviewer. Er liest jetzt den ganzen Diff, in seinem eigenen Fenster.» Warten, bis die Zusammenfassung da ist. |
| 4 | [T2] | `/context`, Enter. | «Kaum gewachsen, obwohl der Subagent den ganzen Diff gelesen hat. Zurückgekommen ist nur der Bericht.» |
| 5 | [T2] | `/exit`, Enter. Dann `claude -w office-search`, Enter. | «Teil 2. Links eine Session in einem eigenen Worktree.» |
| 6 | **[T3]** | In [T3] klicken. `claude -w declaration-csv`, Enter. | «Rechts eine zweite, in einem anderen Worktree.» |
| 7 | [T2] | Aus [Editor] den Prompt «Links» kopieren (`Füge GET /api/offices?query=…`), in [T2] einfügen, Enter. | «Links die Suche nach Zollstellen.» |
| 8 | [T3] | Aus [Editor] den Prompt «Rechts» kopieren (`Füge GET /api/declarations/export.csv …`), in [T3] einfügen, Enter. | «Rechts der CSV-Export. Beide arbeiten jetzt gleichzeitig.» |
| 9 | **[T4]** | In [T4]: `git worktree list`, Enter. Dann `git branch`, Enter. | «Drei Arbeitsverzeichnisse, drei Branches, ein Repo. Keine Session sieht die Edits der anderen.» |
| 10 | [Folien] | **Nicht warten, bis die Sessions fertig sind.** Cmd+Tab zurück zu [Folien]. | «Die lassen wir laufen. Zusammenführen ist normales Git.» |

### Die drei Prompts zum Kopieren

Teil 1, in [T2] (Schritt 3):

```
Nutze den reviewer-Subagent, um die Änderungen seit start/03 unter app/backend/src zu reviewen (git diff start/03 -- app/backend/src). Fasse sein Ergebnis in 5 Zeilen zusammen.
```

Links, in [T2] (Schritt 7):

```
Füge GET /api/offices?query=... hinzu (Suche im Namen, ohne Gross-/Kleinschreibung), mit Tests.
```

Rechts, in [T3] (Schritt 8):

```
Füge GET /api/declarations/export.csv hinzu (MRN, Route, Betrag, Status), mit Tests.
```

**Wenn es hängt:** Dauert der Reviewer in Schritt 3 länger als 2 Minuten: Esc, «das Ergebnis seht ihr gleich als Bild», weiter mit Schritt 5. Startet `claude -w` nicht: nur Schritt 9 zeigen, dann zurück zu [Folien]. D3 trägt den Inhalt auch ohne Demo.

**WEITER:** In [Folien] `→` zu D3.

## D3 · Ablauf · 2:22½–2:24 (1½ Min, nach der Demo)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Linie «Hauptsession» mit dem Auftrag | «Nochmals als Bild. Die Hauptsession hat den Auftrag bekommen.» |
| `→` | Abzweigung zum Subagent, fünf Tool-Aufrufe erscheinen nacheinander | «Sie hat ihn an den Reviewer abgegeben. Er hat den Diff und die Dateien in seinem eigenen Fenster gelesen. Die Hauptsession hat gewartet.» |
| `→` | Linie zurück nach oben, «nur der Bericht» | «Zurückgekommen ist nur der Bericht. Darum ist `/context` kaum gewachsen.» |
| `→` | Zwei Branches zweigen ab, Commits erscheinen abwechselnd | «Teil 2: Beide Sessions sind vom selben Stand abgezweigt, jede in ein eigenes Verzeichnis und auf einen eigenen Branch. Sie haben gleichzeitig gearbeitet.» |
| `→` | Beide Branches laufen zurück, `git merge …` | «Das Zusammenführen habe ich nicht gezeigt, weil die Sessions noch laufen. Es ist normales Git: `git merge` oder ein Pull Request pro Branch.» |

**WEITER:** `→` zu Schluss 1.

**TUN nach dem Workshop:** In [T1], [T2] und [T3] die Sessions mit `/exit` beenden. Die Ordner `demo-05` und `demo-d` kannst du löschen.

**Häufige Fragen**

- *Sieht der Subagent meinen Verlauf?* Nein. Er startet mit seinem eigenen System-Prompt und dem Auftrag. Was er wissen muss, gehört in den Auftrag.
- *Wo liegen Subagents?* Im Projekt unter `.claude/agents/`, persönlich unter `~/.claude/agents/`. Eine Markdown-Datei mit Name, Beschreibung, erlaubten Tools und Modell.
- *Kann ein Subagent Dateien ändern?* Wenn seine Tools das erlauben. Der Reviewer hier darf nur lesen und Bash.
- *Was ist ein Git-Worktree?* Ein zweites Arbeitsverzeichnis desselben Repos auf einem anderen Branch. Git kann das seit Jahren, `claude -w` legt es unter `.claude/worktrees/` an.
- *Von welchem Stand zweigt der Worktree ab?* Standard ist der Default-Branch vom Remote. Mit `"worktree": {"baseRef": "head"}` vom aktuellen lokalen Stand.
- *Wie viele Sessions parallel sind sinnvoll?* So viele, wie ihr reviewen könnt. Der Engpass seid ihr, nicht die Agenten. Und das Kontingent wird geteilt.

---

# ■ Schluss (2:24, 6 Minuten)

## Schluss 1 · Rückblick · 2:24–2:29 (5 Min, mit Modellwahl und Teamregeln)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | Landkarte, alle Teile grün, Schleife läuft | «Das ist die Karte vom Anfang. Der Unterschied: Jedes Teil habt ihr heute selbst in der Hand gehabt. Kontext mit CLAUDE.md und Skills. Steuerung mit Plan Mode, Permissions, Hooks und Rewind. Erweitern mit MCP. Und skalieren mit Subagents und Worktrees.» |

Danach **ohne Folienwechsel**, die Karte bleibt stehen. Drei Punkte, je rund eine Minute:

1. **Modell und Aufwand:** «Sonnet ist der Standard. Mit `/model` wechselt ihr für schwierige Planung auf das grösste Modell, mit `/effort` stellt ihr ein, wie viel es nachdenkt. Subagents, die nur suchen und lesen, laufen auf Haiku.»
2. **Teamregeln:** «Womit fangt ihr morgen an? Mein Vorschlag: eine gemeinsame CLAUDE.md und eine `settings.json` mit zwei, drei deny-Regeln, beides im Repo. Dazu: Jede Änderung von Claude geht durch ein Review wie jede andere. Und klärt, welche Kunden- und Projektdaten in eine Session dürfen.» Eine Stimme aus dem Raum holen: «Welche Regel nehmt ihr mit?»
3. **Falls R11 ausgefallen ist:** hier die Frage stellen: «Wo sucht ihr heute in Dokumentation, würde dort eine Textsuche reichen?»

**WEITER:** Bei 2:29 `→` zu Schluss 2.

## Schluss 2 · Ausblick · 2:29–2:30 (1 Min)

**Ziel:** Alle wissen, dass es Remote Control und Cloud-Sessions gibt und wo sie nachlesen. Keine Demo.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Folie steht) | vier Karten: Remote Control, Claude Code on the web, `claude -p`, Scheduled Tasks, darunter ein Hinweis | «Vier Dinge, die wir heute nicht angeschaut haben. Remote Control: Ihr führt eine Session vom Handy aus weiter, sie läuft aber weiterhin auf eurem Rechner. Claude Code on the web: Die Session läuft in der Cloud von Anthropic, auf einem GitHub-Repo, und pusht einen Branch. `claude -p` ist Claude ohne Dialog, für Skripte und CI. Und Scheduled Tasks starten Cloud-Sessions nach Zeitplan. Wichtig für uns: Bei allem, was in der Cloud läuft, verlässt der Code euren Rechner. Das klärt ihr vorher im Projekt.» |

**Schlusssatz:** «Die Links stehen im README unter ‹Weiterführend›, die Folien und alle Übungen bleiben im Repo. Danke.» Das ist die letzte Folie, `→` tut nichts mehr.

**Häufige Fragen zum Ausblick** (Stand der Doku: November 2026)

- *Läuft bei Remote Control der Code in der Cloud?* Nein. Dateien, Tools und MCP-Server bleiben auf dem eigenen Rechner. Handy oder Browser sind ein Fenster in die lokale Session. Der Rechner muss an bleiben.
- *Wie starte ich Remote Control?* In der Session mit `/remote-control`, beim Start mit `claude --remote-control`.
- *Wie kommt die Cloud-Session an mein Repo?* Über die GitHub-Anbindung, eingerichtet im Browser oder mit `/web-setup`. Das Ergebnis ist ein Branch, daraus entsteht ein Pull Request.
- *Kann ich eine Cloud-Session lokal weiterführen?* Ja, `claude --teleport` holt sie ins Terminal. Das geht nur in diese Richtung.
- *Ist das im Pro-Abo enthalten?* Ja, Remote Control und Claude Code on the web brauchen den claude.ai-Login. Die Nutzung zählt zum Kontingent.

**Häufige Fragen im Abschluss**

- *Welches Modell wofür?* Sonnet als Standard. Das grösste Modell für schwierige Planung und knifflige Fehler. Haiku für Subagents, die suchen und lesen.
- *Was macht `/effort`?* Es stellt ein, wie viel das Modell nachdenkt, bevor es antwortet. Mehr Aufwand kostet mehr Kontingent und Zeit.
- *Womit sollen wir im Team anfangen?* Mit einer gemeinsamen `CLAUDE.md` und einer `settings.json` mit zwei, drei deny-Regeln. Beides committen.
- *Dürfen wir Kundendaten verwenden?* Das ist eine Frage eurer Projektregeln und der Privatsphäre-Einstellung des Kontos, nicht des Werkzeugs. Vor dem ersten Einsatz klären.

---

# Glossar (ein Satz pro Begriff)

| Begriff | Definition |
|---------|------------|
| Harness | Die Software um das Modell: Schleife, Werkzeuge, Kontextverwaltung, Regeln |
| Agentic Loop | Modell entscheidet, Tool läuft, Ergebnis geht zurück, bis das Modell fertig ist |
| Tool-Aufruf | Vorschlag des Modells, ein Werkzeug mit bestimmten Parametern auszuführen |
| Token | Textstück, mit dem das Modell rechnet, grob drei bis vier Zeichen |
| Kontextfenster | Alles, was das Modell in einem Turn sieht, mit einer festen Obergrenze |
| Turn | Eine Antwort des Modells: ein Tool-Aufruf oder am Schluss der Text |
| Prompt-Cache | Zwischenspeicher für den unveränderten Anfang einer Anfrage, senkt den Preis |
| Compaction | Verlauf wird durch eine Zusammenfassung ersetzt (`/compact` oder automatisch) |
| CLAUDE.md | Projektgedächtnis, das in jedem Turn mitgeschickt wird |
| Skill | Anleitung in `.claude/skills/`, von der zuerst nur die Beschreibung geladen ist |
| Progressive Disclosure | Erst die Kurzbeschreibung laden, den Rest nur bei Bedarf |
| Plan Mode | Modus, in dem Claude nur liest und einen Plan vorlegt |
| Permission-Regel | `deny`, `ask` oder `allow` für ein Tool-Muster, geprüft in dieser Reihenfolge |
| Hook | Eigener Befehl, den die Harness bei einem Ereignis ausführt |
| PreToolUse / PostToolUse | Hook vor bzw. nach einem Tool-Aufruf. Vorher kann er blockieren (Exit-Code 2) |
| Checkpoint | Automatischer Sicherungspunkt vor jedem Prompt, Grundlage von `/rewind` |
| MCP | Model Context Protocol: offener Standard, über den Agenten Werkzeuge ansprechen |
| MCP-Server | Programm, das Werkzeuge über MCP anbietet, lokal (stdio) oder entfernt (HTTP) |
| Feedback-Loop | Der Agent prüft sein Ergebnis selbst, etwa im Browser oder mit Tests |
| Subagent | Agent mit eigenem Kontextfenster und eigenem Modell, der nur seinen Bericht zurückgibt |
| Worktree | Zweites Arbeitsverzeichnis desselben Git-Repos auf einem eigenen Branch |
| RAG | Retrieval-Augmented Generation: erst suchen, dann die Fundstellen dem Modell mitgeben |
| Agentic Search | Der Agent sucht selbst in mehreren Schritten, ohne vorbereiteten Index |
| Korpus | Die Sammlung der Dokumente, in der gesucht wird |
| Chunk | Textstück, in das ein Dokument für den Index zerlegt wird |
| BM25 | Bewertungsformel der Stichwortsuche: häufig im Chunk, selten im Korpus |
| Embedding | Zahlenvektor, der die Bedeutung eines Textes beschreibt |
| Vektorsuche | Suche nach den Chunks, deren Embedding dem der Frage am nächsten liegt |
| Kosinus-Distanz | Mass für die Nähe zweier Vektoren über ihren Winkel |
| PCA | Verfahren, das viele Dimensionen auf wenige abbildet, hier für die 2D-Karte |
| Vektor-Datenbank | Tabelle mit einem Embedding pro Eintrag, die schnell die ähnlichsten Einträge zu einer Anfrage findet |
| Nächste Nachbarn | Die Einträge, deren Vektor dem der Frage am ähnlichsten ist |
| Hybrid-Suche | Kombination von Stichwort- und Vektorsuche |
| RRF | Reciprocal Rank Fusion: Ranglisten mischen über `1/(k+Rang)`, hier k = 60 |
| Recall@k | Anteil der erwarteten Dokumente unter den ersten k Ergebnissen |
| MRR | Mean Reciprocal Rank: Durchschnitt von 1 durch den Rang des ersten Treffers |
| Reranker | Zweites Modell, das eine Kandidatenliste nochmals sortiert (hier nicht verwendet) |
| Prompt Injection | Text in fremden Inhalten, der sich als Anweisung an den Agenten ausgibt |
| Lethal Trifecta | Private Daten, fremde Inhalte und ein Weg nach aussen, alle drei zusammen |
