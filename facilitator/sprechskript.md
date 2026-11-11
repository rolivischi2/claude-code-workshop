# Sprechskript – Folie für Folie

Zum Proben. Das Skript folgt der Präsentation in ihrer Reihenfolge: 7 Abschnitte, 36 Folien.
Für jede Folie: Ziel, dann pro Tastendruck **was erscheint** und **was du sagst**, der Übergang und die Fragen,
die am ehesten kommen. Die Sätze sind Vorschläge in deiner Tonlage, keine Texte zum Ablesen.
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

**Tasten:** `→` nächster Schritt · `←` zurück · Shift+`→` nächster Abschnitt · Ziffer = Folie im Abschnitt · `o` Übersicht · `f` Vollbild ·
`r` Animation nochmals · `g` Schätzfragen aus/ein · `?` Hilfe. Auf Übungsfolien, Teamfragen und in der Pause `z` Uhr starten/anhalten, `x` Uhr zurücksetzen.
Im Abschnitt R zusätzlich `q` Frage wählen und `t` (Chunking umschalten).

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

**Vor dem Start:** Seite offen, Vollbild, Benachrichtigungen aus. Im Abschnitt R darf unten
rechts **nicht** «Beispieldaten» stehen.

---

# ▶ Start (0:00, 10 Minuten)

## Start 1 · Ablauf (1 Minute)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Titel und Zeitplan des Nachmittags, pro Block die Übungen | «Zweieinhalb Stunden, eine Pause. Das Muster ist immer gleich: kurzer Input, dann macht ihr es selbst im Terminal. Die Übungsblätter liegen im Repo unter `exercises/`, und jede Übung steht auch hier auf dem Beamer. Am Ende jedes Blocks frage ich euch nach einem Beispiel aus euren Projekten.» |

## Start 2 · Überblick (4 Minuten)

**Ziel:** Alle haben dasselbe Bild im Kopf: ein Modell in einer Schleife. Jede Übung bekommt einen Platz.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Prompt → Modell → Tool-Aufruf → Ergebnis | «Ihr kennt Agentic Engineering. Heute schauen wir, wie Claude Code das konkret baut. Der Kern ist klein: Ihr gebt einen Prompt. Das Modell entscheidet, was der nächste Schritt ist. Meistens ist das ein Tool-Aufruf: eine Datei lesen, etwas editieren, einen Befehl ausführen.» |
| `→` | Schleife leuchtet reihum auf, «Antwort» erscheint | «Das Ergebnis geht zurück ans Modell, und es entscheidet wieder. Das wiederholt sich, bis das Modell findet, es sei fertig. Das ist der Agentic Loop. Wichtig: Das Modell *schlägt vor*, die Harness *führt aus*. Alles, was wir heute steuern, hängt an diesem Unterschied.» |
| `→` | Band «Kontext» | «Das Modell sieht nur, was im Kontext steht: den System-Prompt, eure CLAUDE.md, die Beschreibungen der Skills, den Verlauf und alles, was Tools zurückgeben. Block A dreht sich darum: Übung 01 und 02.» |
| `→` | Band «Steuerung» | «Autonomie braucht Leitplanken. Plan Mode, Permissions, Hooks und Rewind sitzen *um* die Schleife herum. Das ist Block B, Übungen 03 und 04. Rewind zeige ich als Demo.» |
| `→` | Band «Erweitern und skalieren» | «Und am Schluss machen wir die Schleife grösser: neue Werkzeuge über MCP, Wissen ausserhalb des Repos, mehrere Agenten gleichzeitig. Diese Karte seht ihr am Ende nochmals.» |

**Übergang:** «Bevor wir loslegen: kurz das Setup, dann Übung 00. Vier Slash-Commands, fünf Minuten. Notiert euch die Zahl aus `/context`, die brauchen wir gleich.»

**Häufige Fragen**

- *Was genau ist eine Harness?* Die Software um das Modell: Sie führt die Schleife, stellt Werkzeuge bereit, verwaltet den Kontext und setzt Regeln durch. Das Modell allein kann nur Text erzeugen.
- *Worin unterscheidet sich das von einem Chat?* Im Chat antwortet das Modell einmal. Hier handelt es in mehreren Schritten und sieht die Folgen seiner Schritte.
- *Wer entscheidet, wann Schluss ist?* Das Modell: Es antwortet ohne weiteren Tool-Aufruf. Ihr könnt jederzeit mit Esc unterbrechen.
- *Ist das bei anderen Coding-Agenten gleich?* Das Grundmuster ja. Unterschiede liegen bei Werkzeugen, Kontextverwaltung und Steuerung.

## Start 3 · Setup (höchstens 1 Minute)

**Ziel:** Alle wissen, wo das Repo liegt und wie sie später zu einem sauberen Stand kommen.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Adresse des Repos, die vier Befehle, Voraussetzungen, Hinweis auf `reset-exercise` | «Das Setup habt ihr mit der Mail erledigt. Fehlt bei jemandem etwas: Hier steht die Adresse, der Rest steht in `SETUP.md`. Und merkt euch den Befehl unten. Wer bei einer Übung nicht fertig wird, holt sich damit den Startstand der nächsten. Eure Änderungen gehen dabei nicht verloren.» |

Wer das Setup nicht gemacht hat, macht es jetzt nebenher und steigt bei Übung 01 ein. Nicht darauf warten.

## Start 4 · Übung 00 – Setup-Check (5 Minuten)

**Ziel der Übung:** Alle arbeiten mit dem richtigen Login und mit Sonnet. Alle kennen die eigene Startbelegung des Kontexts.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Nur Slash-Commands, das kostet keine Tokens. Wichtig ist die Zahl aus `/context`. Schreibt sie auf.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Prüfen, ob alle auf Sonnet sind und ob jemand mit dem Login hängt.

**Abholen nach der Übung:** Nichts. Die Zahl aus `/context` kommt gleich in der Schätzfrage von A1.

---

# A Kontext (0:10, 31 Minuten)

## A1 · Kontext (5 Minuten)

**Ziel:** Kontext kostet in jedem Turn. Darum lohnt sich, was erst bei Bedarf geladen wird.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | leerer Balken «Kontextfenster» | «Dieser Balken ist das Arbeitsgedächtnis des Modells. Was nicht drin ist, weiss es nicht. Was drin ist, bezahlt ihr.» |
| `→` | **Schätzfrage:** «Wie viel Kontext ist in Übung 00 belegt gewesen …?» | Abstimmen lassen. Antwort zeigen: «Schaut auf eure Notiz.» Zwei, drei Zahlen zurufen lassen. |
| `→` | dunkle Segmente: System-Prompt, CLAUDE.md, Beschreibungen | «Das ist belegt, bevor ihr ein Wort tippt: System-Prompt und Werkzeuge, eure CLAUDE.md, die Beschreibungen der Skills, die Namen der MCP-Tools. Das Bild ist ein Schema, eure echte Zahl ist die aus `/context`.» |
| `→` | Turn 1: kleines graues, grosses ockerfarbenes Segment | «Erster Turn. Euer Prompt ist winzig. Gross ist, was Claude dafür *liest*: Dateien, Suchergebnisse, Testausgaben. Tool-Ergebnisse sind fast immer der grösste Posten.» |
| `→` | Balken wächst, darunter «Turn 1/2/3 sendet» | «Und jetzt der Punkt, den viele unterschätzen: Jeder Turn schickt *alles Bisherige* wieder mit. Der Prompt-Cache macht den unveränderten Anfang billiger, aber nicht kleiner. Darum der Token-Tipp auf den Blättern: Kritik in einem Prompt sammeln statt in fünf.» |
| `→` | Verlauf schrumpft zu «Zusammenfassung» | «`/compact` ersetzt den Verlauf durch eine Zusammenfassung. `/clear` leert ihn ganz. Faustregel: Neue Aufgabe, neuer Kontext.» |
| `→` | blaues Segment «Skill-Inhalt» schiebt sich hinein | «Und das ist die Idee hinter Skills: Progressive Disclosure. Immer geladen ist nur die Beschreibung, ein, zwei Sätze. Der eigentliche Text kommt erst, wenn die Aufgabe dazu passt. Dann bleibt er im Kontext. In Übung 02 baut ihr genau das.» |

**Übergang:** «Übung 01: dasselbe Feature einmal ohne und einmal mit CLAUDE.md. Achtet darauf, was sich am Ergebnis ändert, nicht nur an der Zahl.»

**Häufige Fragen**

- *Was ist ein Token?* Ein Textstück, mit dem das Modell rechnet. Grob drei bis vier Zeichen, auf Deutsch eher weniger Text pro Token als auf Englisch.
- *Wie gross ist das Kontextfenster?* Das hängt vom Modell ab. `/context` zeigt für eure Session Grösse und Belegung.
- *Was ist der Prompt-Cache?* Der unveränderte Anfang einer Anfrage wird beim Anbieter zwischengespeichert und beim nächsten Turn zu einem tieferen Preis gelesen. Er verkleinert den Kontext nicht.
- *Was passiert, wenn der Kontext voll ist?* Claude Code fasst kurz vor der Grenze automatisch zusammen (Auto-Compact). Dabei können Details verloren gehen. Besser selbst `/compact` oder `/clear` setzen.
- *Was gehört in die CLAUDE.md?* Was in *jedem* Turn gelten soll: Build- und Testbefehle, Konventionen, Stolperfallen. Kurz halten: Sie wird immer mitgeschickt.
- *Wann CLAUDE.md, wann Skill?* Immer gültig und kurz: CLAUDE.md. Nur für bestimmte Aufgaben und länger: Skill.
- *Woher weiss Claude, wann ein Skill passt?* Aus der `description` im Kopf der `SKILL.md`. Darum ist dieser eine Satz das Wichtigste am Skill.

## A2 · Übung 01 A – ohne CLAUDE.md (7 Minuten)

**Ziel der Übung:** Sehen, was Kontext kostet. Und sehen, was Claude ohne Projektregeln baut.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ein Feature-Prompt, keine Nachbesserung. Es zählt die erste Antwort, die brauchen wir für den Vergleich.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Wer nachbessert, bremsen: Der Vergleich mit Teil B funktioniert nur mit der ersten Antwort.

**Abholen nach der Übung:** Noch nichts. Direkt weiter zu Teil B.

## A3 · Übung 01 B – mit CLAUDE.md (8 Minuten)

**Ziel der Übung:** Derselbe Prompt, diesmal mit Teamkonventionen in der CLAUDE.md.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Derselbe Prompt wie eben. Der einzige Unterschied ist die CLAUDE.md. Achtet auf das Ergebnis, nicht nur auf die Zahl.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Auf das Mapping hinweisen: Ohne CLAUDE.md kopiert Claude das Muster aus `GuaranteeService`, mit CLAUDE.md entsteht ein `GuaranteeMapper`.

**Abholen nach der Übung:** «Was ist bei euch anders gewesen als in Teil A?» Zwei, drei Stimmen.

## A4 · Übung 02 – Skills (8 Minuten)

**Ziel der Übung:** Einen fertigen Skill «Neuer REST-Endpoint nach Teamstandard» übernehmen und prüfen, ob Claude ihn von sich aus lädt.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Den Skill bekommt ihr fertig, mit einem Git-Befehl. Lest ihn, vor allem den einen Satz in der `description`. Dann startet ihr Claude neu und verlangt den Endpoint, ohne den Skill zu erwähnen.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp, Zusatzaufgabe | `z` startet die Uhr. «Wer früh fertig ist: Unten steht die Zusatzaufgabe, den Skill selbst bauen.» Durch den Raum gehen. |

**Im Raum:** Häufigster Hänger: Claude nicht neu gestartet, dann kennt die Session den Skill nicht. Acht Minuten sind knapp, weil die Tests laufen müssen. Wer nach sechs Minuten noch auf Maven wartet, soll nur den `Skill`-Aufruf im Verlauf suchen.

**Abholen nach der Übung:** «Bei wem hat Claude den Skill von selbst geladen? Woran habt ihr es gesehen?»

## A5 · Teamfrage (3 Minuten)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welche Regel aus eurem Projekt müsste in die CLAUDE.md, weil Claude sie nicht aus dem Code ablesen kann?» `z` startet die Uhr. Zwei, drei Antworten sammeln, jeweils nur nachfragen: «Steht das heute irgendwo geschrieben?» |

**Wenn niemand etwas sagt:** eigenes Beispiel nennen (in der Übungs-App: «Antworten immer als DTO über einen Mapper»), dann nochmals fragen.

---

# B Steuerung (0:41, 40 Minuten, danach Pause)

## B1 · Leitplanken (4 Minuten)

**Ziel:** Jeder Tool-Aufruf läuft durch dieselben Tore. Eine Regel ist eine Garantie, eine Anweisung in der CLAUDE.md nur eine Bitte.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | sechs Tore in einer Reihe | «Ihr erinnert euch: Das Modell schlägt vor, die Harness führt aus. Dazwischen liegen diese Tore, in dieser Reihenfolge.» |
| `→` | `Edit FristFormatter.java` läuft grün durch | «Ein harmloser Edit. Der PreToolUse-Hook hat nichts dagegen, keine deny-Regel, keine ask-Regel, erlaubt. Das Tool läuft. Und danach formatiert der PostToolUse-Hook genau diese eine Datei. Das kostet keinen einzigen Token.» |
| `→` | **Schätzfrage:** allow im Projekt, deny beim User | Abstimmen. Antwort zeigen: «deny. Geprüft wird immer deny, dann ask, dann allow, über alle Ebenen hinweg.» |
| `→` | `Read .env` bleibt rot bei deny stehen | «Darum ist deny die verlässlichste Regel, die ihr habt. In Übung 04 sperrt ihr damit `.env` und `git push`.» |
| `→` | `Edit src/generated/…` bleibt beim Hook stehen | «Für alles, was sich nicht als Muster schreiben lässt, gibt es Hooks: ein Skript von euch. Endet es mit Exit-Code 2, ist der Aufruf blockiert, und die Begründung geht zurück an Claude. Die Regeln werden dann gar nicht mehr gefragt.» |
| `→` | `rm -r scratch/wegwerf` hält bei ask | «Und ask heisst: Claude hält an und fragt euch. Für alles, was selten und heikel ist.» |

**Übergang:** «Übung 03 zuerst: Plan Mode. Da lernt ihr die billigste Leitplanke überhaupt, nämlich erst denken lassen, dann schreiben lassen. Rewind, das Netz darunter, zeige ich euch nach Übung 04.»

**Häufige Fragen**

- *Welche Permission-Modi gibt es?* default (fragt nach), acceptEdits (Datei-Edits ohne Rückfrage), plan (nur lesen und planen), auto, dontAsk und bypassPermissions. Shift+Tab schaltet durch default, acceptEdits und plan.
- *Kann ein Hook eine deny-Regel aushebeln?* Nein. Deny- und ask-Regeln werden auch dann noch geprüft, wenn ein Hook «erlauben» zurückgibt.
- *Was passiert bei einem anderen Exit-Code als 2?* Der Aufruf läuft weiter, die erste Zeile von stderr erscheint als Hinweis. Nur 2 blockiert.
- *Ist deny eine Sicherheitsgrenze?* Nein, eine Leitplanke. Ein Skript, das die Datei selbst öffnet, kommt daran vorbei. Für harte Grenzen gibt es die Bash-Sandbox und Managed Settings.
- *Welche Settings-Datei gewinnt?* Von oben nach unten: Managed, Kommandozeile, `settings.local.json`, `settings.json` im Projekt, User. Listen wie `permissions.allow` werden zusammengeführt.
- *Warum Hooks als Node-Skript?* Dieselbe Konfiguration läuft auf macOS und Windows, weil keine Shell dazwischen ist.

## B2 · Übung 03 – Plan Mode (15 Minuten)

**Ziel der Übung:** Ein Feature zuerst planen lassen, den Plan kritisch prüfen und erst dann umsetzen.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Erst planen lassen, dann den Plan kritisieren, dann umsetzen. Sammelt eure Kritik in einem Prompt: Jeder Turn schickt den ganzen Kontext nochmals.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Das ist die grösste Code-Übung. Wer in Zeitnot kommt: Plan kritisieren und ablegen genügt, die Umsetzung lässt sich mit `scripts/reset-exercise.sh 04` überspringen.

**Abholen nach der Übung:** «Was habt ihr am Plan geändert, bevor Code entstanden ist?»

## B3 · Übung 04 A – Permissions (6 Minuten)

**Ziel der Übung:** Festlegen, was Claude in diesem Projekt nie darf und wo es nachfragen muss.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ihr schreibt deny- und ask-Regeln und probiert aus, ob sie halten. Ein verweigerter Aufruf kostet fast nichts.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Bei wem eine Regel nicht greift: Schreibweise des Musters und die Settings-Datei prüfen.

**Abholen nach der Übung:** Noch nichts. Direkt weiter zu Teil B.

## B4 · Übung 04 B – Hooks (9 Minuten)

**Ziel der Übung:** Zwei Hooks einbinden: Einer formatiert nach jedem Edit die geänderte Datei, einer blockiert Edits an generiertem Code.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Zwei Hooks aus der Vorlage. Der eine formatiert, der andere blockiert. Beide laufen ausserhalb des Modells und kosten keine Tokens.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Die Hooks kommen aus der Vorlage, hier wird kaum iteriert. Prompt 5 (der Test des blockierenden Hooks) ist freiwillig. Wer auch damit fertig ist, kann Übung 05 selbst durchspielen (Zusatzaufgabe).

**Abholen nach der Übung:** «Wer hat Prompt 5 gemacht? Was hat Claude getan, nachdem der Hook blockiert hat?»

## B5 · Rewind (1 Minute)

**Ziel:** Alle wissen vor der Demo, was ein Checkpoint ist und was `/rewind` zurücksetzt.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Zeitleiste: vier Prompts, vor jedem ein Checkpoint | «Die letzte Leitplanke ist ein Netz. Vor jedem Prompt legt Claude Code einen Checkpoint an: den Stand der Dateien und des Verlaufs.» |
| `→` | Prompt 4 wird rot, «Tests rot» | «Prompt 4 ist schiefgegangen.» |
| `→` | Checkpoint 4 wird grün, Prompt 4 ist durchgestrichen | «Mit `/rewind` oder zweimal Esc wählt ihr den Checkpoint vor Prompt 4.» |
| `→` | drei Karten mit den Menüpunkten | «Dann fragt Claude Code, was zurückgeht: Code und Verlauf, nur der Verlauf oder nur der Code. Ich nehme gleich den ersten Punkt.» |
| `→` | Hinweis zu den Grenzen | «Erfasst wird nur, was über Edit und Write geändert worden ist. Was ein Bash-Befehl geändert hat, bleibt. Darum ersetzt Rewind Git nicht.» → Demo. |

**Häufige Fragen**

- *Was erfasst ein Checkpoint nicht?* Dateien, die nur per Bash, von einem Subagent oder von aussen geändert worden sind. Darum ersetzt Rewind Git nicht.
- *Wie lange bleiben Checkpoints?* Sie gehören zur Session und überleben ein `claude -c`. Laut Doku werden die letzten 100 behalten.

## B6 · Demo 05 – Rewind (2 Minuten, du zeigst es)

**Ziel:** Alle haben `/rewind` einmal gesehen. Wer will, macht es mit dem Übungsblatt selbst.

**Vorbereitung:** Du brauchst eine eigene Session, in der du Übung 04 durchgespielt hast (Prompt 3 und 4 abgesetzt, kein `/clear`). Am besten vor dem Workshop vorbereiten und mit `claude -c` wieder öffnen.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) bis zweimal `→` | Schritte und der Commit-Befehl | «Das zeige ich euch, ihr müsst nichts tippen.» Ins Terminal wechseln. `z` startet die Uhr. |
| im Terminal | | Committen. `/rewind`, den Punkt vor Prompt 3 wählen, «Restore code and conversation». Dann `git status` und `git diff --stat` zeigen: «Der Schutz-Hook ist weg, weil Claude ihn geschrieben hat. Der Formatier-Hook ist noch da, den habe ich mit `cp` kopiert.» `git restore .` holt den Stand zurück. |

**Wenn die Demo hängt:** abbrechen, die Folie B5 trägt den Inhalt.

## B7 · Teamfrage (3 Minuten)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welche Datei oder welcher Befehl in eurem Projekt braucht eine Deny-Regel oder einen Hook?» `z` startet die Uhr. Nachfragen: «Reicht dort eine Rückfrage, oder muss es verboten sein?» |

## B8 · Pause (1:21, 10 Minuten)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Uhr mit 10 Minuten, die zwei Befehle zum Starten der App | «Bevor ihr aufsteht: Startet die App in zwei weiteren Terminals, die Befehle stehen hier. Sie fährt während der Pause hoch, Übung 06 braucht sie.» Kurz warten, bis die meisten getippt haben. `z` startet die Uhr. |

---

# C MCP (1:31, 23 Minuten)

## C1 · MCP (3 Minuten)

**Ziel:** MCP ist ein Stecker, kein Produkt. Und: Ein Agent, der sein Ergebnis sieht, braucht weniger Kontrolle.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | links Claude Code, rechts Browser mit der App | «Bis jetzt hat Claude Dateien gelesen und Befehle ausgeführt. Eure App im Browser sieht es nicht.» |
| `→` | MCP-Stecker, Playwright-Server, gestrichelt weitere Server | «MCP, das Model Context Protocol, ist ein offener Standard: eine Steckdose für Werkzeuge. Claude Code kennt nur das Protokoll. Dahinter kann ein Browser hängen, ein Ticket-System, eine Datenbank. In Übung 06 ist es Playwright, lokal gestartet, eingetragen in `.mcp.json`, damit das ganze Team denselben Server hat.» |
| `→` | Feedback-Loop leuchtet reihum | «Das eigentlich Neue ist aber das hier. Claude ändert Code, schaut im Browser nach, sieht den Fehler selbst, korrigiert und sichert das Ergebnis mit einem Test. Ein Agent, der seine Arbeit prüfen kann, braucht weniger Kontrolle durch euch.» |
| `→` | zwei Merksätze: Kontext, Vertrauen | «Zwei Dinge zum Mitnehmen. Erstens Kontext: Beim Start laden nur die Namen der Tools, die Beschreibungen erst bei Bedarf. Zweitens Vertrauen: Was ein Server zurückgibt, ist fremder Inhalt. Eine Webseite kann Text enthalten, der wie eine Anweisung aussieht.» |

**Übergang:** «Übung 06. Die App habt ihr vor der Pause gestartet. Der Fehler: Das Formular schluckt eine Ablehnung des Backends.»

**Häufige Fragen**

- *Wer hat MCP erfunden?* Anthropic hat es Ende 2024 als offenen Standard veröffentlicht. Inzwischen unterstützen es viele Werkzeuge und Anbieter.
- *stdio oder HTTP?* stdio für lokale Prozesse wie hier, HTTP für entfernte Dienste. SSE gilt als veraltet.
- *Welche Scopes gibt es?* Lokal (nur ich, nur dieses Projekt), Projekt (`.mcp.json`, im Repo geteilt), User (ich, alle Projekte).
- *Warum muss ich den Server bestätigen?* Weil ein geklontes Repo sonst beliebige Programme auf eurem Rechner starten könnte.
- *Brauche ich MCP, wenn es ein CLI gibt?* Oft nicht. Ein gutes CLI über Bash reicht häufig und kostet weniger Kontext. MCP lohnt sich bei strukturierten Daten, Anmeldung und geteilten Diensten.
- *Warum `node` statt `npx` in der Vorlage?* Es nutzt das bereits installierte Paket, funktioniert offline und auf Windows ohne Umweg.

## C2 · Übung 06 – Browser über MCP (17 Minuten)

**Ziel der Übung:** Den Playwright-MCP-Server einbinden. Claude reproduziert einen Frontend-Fehler selbst im Browser, behebt ihn und prüft das Ergebnis.

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Nummer, Zeitbudget, Ziel und Aufgabe | «Ihr tragt den Server in `.mcp.json` ein, startet Claude neu und bestätigt den Server. Dann ein Prompt: reproduzieren, beheben, im Browser prüfen, Test ergänzen.» |
| `→` | Schritte | Schritte kurz vorlesen. |
| `→` | Prompts, «Fertig, wenn …», Token-Tipp | `z` startet die Uhr. Die Folie bleibt stehen. Durch den Raum gehen. |

**Im Raum:** Häufigste Hänger: Claude nicht neu gestartet, Server nicht bestätigt (`/mcp` muss `playwright` als verbunden zeigen), App läuft nicht. Browser-Snapshots sind gross: genaue Anweisungen sparen Klick-Runden.

**Abholen nach der Übung:** «Hat Claude den Fehler selbst gesehen? Woran habt ihr das gemerkt?»

## C3 · Teamfrage (3 Minuten)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Welches System würdet ihr per MCP anbinden? Und sieht Claude dort fremde Inhalte?» `z` startet die Uhr. Bei jeder Antwort die zweite Hälfte nachfragen: «Wer schreibt die Texte, die Claude dort liest?» |

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

**Zeit:** Der Abschnitt hat keine Reserve. Die Folie R8 «Test» ist neu dazugekommen und noch nicht gestoppt.
Bei Zeitnot: `g` schaltet die Schätzfragen aus, R2 lässt sich überspringen.

## R1 · Korpus (0–1½')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | 16 Kacheln, «16 Dokumente», «267 Seiten» | «Bis jetzt hat Claude im Code gesucht. Was, wenn das Wissen woanders steht? Das hier ist echte Dokumentation des BAZG zum Transitverfahren: 16 Dokumente, 267 Seiten. Dieselbe Domäne wie eure Übungs-App.» |
| `→` | deutsche Kacheln verblassen, «3 Sprachen» | «Und sie ist mehrsprachig. Zwei Dokumente gibt es nur auf Französisch, eines nur auf Italienisch. Das wird gleich wichtig.» |
| `→` | «Chunks im Index», zwei Wege: «Weg 1: RAG», «Weg 2: Der Agent sucht selbst» | «Wie findet ein Agent darin die richtige Stelle? Zwei Wege. Entweder wir bauen vorher einen Index und schlagen bei jeder Frage nach: Das ist RAG. Oder der Agent sucht selbst, mit Grep und Read, so wie im Code. Wir schauen uns beide an und messen.» |

**Fragen:** *Warum nicht einfach alles in den Kontext?* 267 Seiten bei jedem Turn mitzuschicken ist teuer und macht Antworten ungenauer. · *Sind die Dokumente im Repo?* Nein, sie werden von der BAZG-Seite geladen, die Liste steht in `rag/sources.yaml`.

## R2 · Chunking (1½–3')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | ein Abschnitt aus R-14-01 als Fliesstext | «Ein Index findet keine Dokumente, sondern Stücke davon: Chunks. Also müssen wir schneiden.» |
| `→` | Schnitte nach fester Länge, rot wo mitten im Wort | «Die einfache Art: alle 400 Zeichen, mit etwas Überlappung. Seht ihr die roten Stellen? Der Schnitt geht mitten durch Wörter und Sätze.» |
| `→` | Schnitte an Überschriften, Pfad davor | «Die bessere Art: an den Überschriften entlang. Jeder Chunk bekommt seinen Überschriftenpfad vorangestellt, so weiss er, wo er herkommt.» (`t` wechselt hin und her.) |

**Satz:** «Was ein Chunk ist, bestimmt, was gefunden werden kann.»

**Fragen:** *Wie gross soll ein Chunk sein?* Gross genug für einen vollständigen Gedanken, klein genug, dass fünf davon in den Kontext passen. · *Wozu Überlappung?* Damit ein Satz an der Schnittkante in mindestens einem Chunk ganz bleibt. · *Bringt das besseres Chunking etwas?* Hier ein bis zwei Fragen von 25. Das ist im Rauschen. Sag das so.

## R3 · BM25 (3–5½'), Fragen S2, dann E1

**Ziel:** Alle verstehen die drei Schritte der Stichwortsuche und sehen, warum sie bei S2 nichts findet.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Frage, darunter ihre Wörter. Füllwörter durchgestrichen, Suchbegriffe ocker | «Erste Suche: BM25, die klassische Stichwortsuche. Schritt eins: Die Frage wird zerlegt. Alles klein geschrieben, Füllwörter wie ‹welche› und ‹für› fallen weg. Übrig bleiben vier Suchbegriffe: Währungsangabe, Fakturen, britischen, Pfund.» |
| `→` | unter jedem Suchbegriff: «in N Chunks» und ein Gewichtsbalken. Bei S2 überall rot «in keinem Chunk» | «Schritt zwei: Für jeden Begriff wird gezählt, in wie vielen der 1206 Chunks er vorkommt. Ein seltenes Wort sagt viel über einen Chunk aus und bekommt ein hohes Gewicht. Ein Wort, das überall steht, bekommt fast keines. Und hier sehen wir schon das Problem: Keiner der vier Begriffe kommt im Korpus überhaupt vor.» |
| `→` | **Schätzfrage:** Findet BM25 das richtige Dokument? | Abstimmen. Antwort zeigen: «Nein. Kein einziger Treffer.» |
| `→` | Rangliste (bei S2 leer), Text zu Schritt 3 | «Schritt drei: Jeder Chunk bekommt einen Score. Für jeden Suchbegriff, der im Chunk steht, wird sein Gewicht addiert, verstärkt durch die Häufigkeit im Chunk. Zwei Korrekturen: Das zehnte Vorkommen zählt weniger als das erste, und lange Chunks werden abgewertet, weil sie zufällig mehr Wörter enthalten.» |
| `→` | rotes Ergebnis, Kasten «Was ist BM25?» | «Das richtige Dokument sagt ‹Rechnungen in GBP› und ‹Währungscode›. Kein Wort der Frage steht darin. BM25 vergleicht Zeichenfolgen, keine Bedeutung.» |
| `q` → **E1**, dann `→` bis zum Ergebnis | «meldung» in 31 Chunks, «nt044» in 3 Chunks, Treffer auf Rang 1 | «Die Gegenprobe. ‹Meldung› steht in 31 Chunks, das Gewicht ist klein. ‹NT044› steht in genau 3, das Gewicht ist gross. Darum landet die Tabellenzeile mit NT044 auf Rang 1. Seltene, exakte Zeichenfolgen sind die Stärke von BM25.» |

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

## R4 · Vektor-DB (5½–7½'), Frage S2

**Ziel:** Bevor die Karte kommt, sehen alle, was eigentlich gespeichert und verglichen wird: Zahlen pro Chunk.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Chunk → «Embedding-Modell» → Zahlenstreifen | «Bevor wir suchen, müssen wir verstehen, was im Index liegt. Ein Embedding-Modell macht aus einem Text eine feste Liste von 384 Zahlen. Ähnliche Bedeutung ergibt ähnliche Zahlen. Das ist ein kleines, eigenes Modell, es läuft hier auf dem Laptop. Mit Claude hat es nichts zu tun.» |
| `→` | Tabelle: eine Zeile pro Chunk, mit Zahlenstreifen | «Und das ist schon die ganze Vektor-Datenbank: eine Tabelle. Pro Chunk eine Zeile, mit dem Text und seinen 384 Zahlen. Die Streifen zeigen die ersten sechzehn davon. Bei uns sind es 1206 Zeilen in einer einzigen SQLite-Datei.» |
| `→` | blaue Zeile «die Frage» | «Die Frage geht durch dasselbe Modell und wird ebenfalls zu 384 Zahlen.» |
| `→` | Spalte «Ähnlichkeit zur Frage» füllt sich, Zeilen sortieren sich | «Suchen heisst jetzt: die Zahlen der Frage mit jeder Zeile vergleichen und nach Ähnlichkeit sortieren. Die obersten Zeilen sind die ‹nächsten Nachbarn›. Kein einziges Wort ist verglichen worden.» |
| `→` | drei Merkkästen | «Darum findet ‹Pfund› das Dokument mit ‹GBP›. Und darum geht ein Code wie NT044 verloren. Eine spezielle Datenbank braucht es erst bei Millionen von Zeilen: Dann hilft ein Index, der nicht jede Zeile prüfen muss.» |

**Übergang:** «Eine Tabelle mit 384 Spalten kann niemand lesen. Darum zeichnen wir sie jetzt als Karte.»

**Fragen**

- *Was ist eine Vektor-Datenbank?* Eine Datenbank, die zu jedem Eintrag einen Zahlenvektor speichert und schnell die ähnlichsten Vektoren zu einer Anfrage findet.
- *Brauche ich dafür ein eigenes Produkt?* Bei einigen tausend Chunks nicht. SQLite mit sqlite-vec oder Postgres mit pgvector reichen. Eigene Vektor-Datenbanken lohnen sich bei sehr grossen Beständen.
- *Was heisst «nearest neighbour»?* Die Einträge, deren Vektor dem der Frage am ähnlichsten ist. Bei grossen Beständen wird das näherungsweise gesucht (ANN, approximate nearest neighbour).
- *Was bedeuten die einzelnen Zahlen?* Einzeln nichts Lesbares. Erst das Muster aller 384 Zahlen zusammen beschreibt die Bedeutung.
- *Woher kommen die Zahlen auf der Folie?* Es sind die echten ersten 16 Werte aus dem Index, die Ähnlichkeiten sind die echten Kosinus-Werte der Suche.

## R5 · Vektorsuche (7½–11½'), Fragen S2, E1, C3

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Karte: jeder Punkt ein Chunk | «Dieselbe Tabelle, jetzt als Karte. Jede Zeile ist ein Punkt, und Zeilen mit ähnlichen Zahlen liegen nah beieinander. Die 384 Zahlen sind dafür auf zwei zusammengedrückt, die Abstände stimmen also nur ungefähr.» |
| `→` | die Frage fliegt als Stern ein | «Die Frage wird mit demselben Modell zu einem Punkt.» |
| `→` | **Schätzfrage**, dann Linien zu den nächsten Nachbarn, Ergebnisliste | Abstimmen, auflösen. «Gesucht sind die nächsten Nachbarn.» |
| `→` | Ausschnitt um die Frage, grünes Ergebnis. Grüne Ringe um alle Chunks des erwarteten Dokuments, darunter ein Satz zu Chunks und Dokumenten | «Rang 1. Dieselbe Frage, an der BM25 gescheitert ist. Das Modell weiss, dass Pfund und GBP dasselbe meinen. Zu den Ringen: Das erwartete Dokument besteht aus 8 Chunks, jeder ist ein Punkt. Zwei davon stehen in den Top 5, Rang 1 und Rang 4. Die anderen sechs handeln von etwas anderem und liegen darum weit weg. Die Suche liefert Chunks, keine Dokumente.» |
| `→` | Formel der Kosinus-Ähnlichkeit, darunter angewendet auf Zeile 112. Auf jeder Linie steht ihr Wert, die Linie zu Rang 1 ist dick | «Warum Rang 1? Für jede Zeile der Tabelle wird diese Formel gerechnet: die Zahlen der Frage mal die Zahlen des Chunks, aufsummiert, geteilt durch die Längen. Für Zeile 112 ergibt das 0.61. Das ist der höchste Wert aller 1206 Zeilen. Die anderen Linien zeigen 0.53, 0.50, 0.48.» |
| `q` → **E1**, dann `→` bis zum Urteil | NT044: Vektor verfehlt | «Und jetzt die Gegenprobe. Was bedeutet die Meldung NT044? Für die Stichwortsuche ist das ein Geschenk. Die Vektorsuche findet den Code nicht einmal in den Top 10. Ziffern tragen kaum Bedeutung, NT044 und NT045 liegen fast aufeinander.» |
| `q` → **C3**, dann `→` bis zum Urteil | italienisches Dokument auf Rang 1 | «Dritte Frage, auf Deutsch gestellt. Die Antwort steht nur im italienischen Dokument. BM25 hat keine Chance, das mehrsprachige Modell springt über die Sprachgrenze.» |

**Sätze:** «Vektoren verstehen Bedeutung, aber nicht Bezeichner.» · «Mehrsprachige Embeddings überspringen die Sprachgrenze.»

**Fragen**

- *Was ist ein Embedding?* Eine Liste von Zahlen, die die Bedeutung eines Textes beschreibt. Ähnliche Texte bekommen ähnliche Zahlen.
- *Warum sind nicht alle Punkte mit Ring verbunden?* Verbunden sind die fünf ähnlichsten Chunks. Ein Ring heisst nur: Dieser Chunk gehört zum erwarteten Dokument. Die Frage gilt als gefunden, sobald einer davon in den Top 5 steht.
- *Wie misst man Nähe?* Hier über die Kosinus-Distanz: den Winkel zwischen zwei Vektoren.
- *Welches Modell ist das?* `paraphrase-multilingual-MiniLM-L12-v2`, klein, mehrsprachig, läuft lokal auf dem Laptop. Es gehen keine Daten nach aussen.
- *Wie kommt die Karte zustande?* Hauptkomponentenanalyse (PCA) von 384 auf 2 Dimensionen. Abstände stimmen nur ungefähr, die Nachbarn stammen aus der echten Rangliste.
- *Wo werden die Vektoren gespeichert?* In derselben SQLite-Datei, mit der Erweiterung sqlite-vec. Eine eigene Vektor-Datenbank braucht es bei dieser Grösse nicht.
- *Hat das etwas mit dem Sprachmodell zu tun?* Nein. Embedding-Modelle sind eigene, viel kleinere Modelle. Claude kommt in diesem Teil gar nicht vor.

## R6 · Hybrid (11½–13½'), Fragen S2, dann E1

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | zwei Ranglisten nebeneinander | «Jede Suche hat einen blinden Fleck, und zwar dort, wo die andere stark ist. Also beide zusammen.» |
| `→` | Karten wandern in eine gemeinsame Reihenfolge, mit `1/(60+Rang)` | «Reciprocal Rank Fusion: Jede Liste vergibt Punkte nach Rang, eins durch sechzig plus Rang. Die Punkte werden addiert. Es zählt nur die Position, nicht der Score. Darum lassen sich zwei völlig verschiedene Verfahren mischen.» |
| `→` | Urteil | Bei S2: «Der Vektor-Treffer bleibt auf Rang 1.» Dann `q` → **E1**: «Und hier schadet die Fusion. BM25 hat den Treffer auf Rang 1 gehabt, das Rauschen der Vektoren drückt ihn auf Rang 2.» |

**Satz:** «Fusion gleicht blinde Flecken aus, im Schnitt. Im Einzelfall kann sie einen sicheren Treffer verwässern.»

**Fragen:** *Warum 60?* Der Wert aus der Originalarbeit zu RRF von 2009. Er dämpft den Vorsprung der obersten Ränge und ist kaum empfindlich. · *Warum nicht die Scores addieren?* BM25-Scores und Kosinus-Werte haben verschiedene Skalen und sind nicht vergleichbar. · *Geht das besser?* Ja, etwa mit einem Reranker, der die Kandidaten nochmals bewertet. Das kostet Zeit und ein weiteres Modell.

## R7 · Agent (13½–16'), Frage C3 oder M3

**Ziel:** Alle sehen den Weg von der Frage zur Antwort: ein Punkt pro Turn. Ein Turn ist eine Antwort des Modells, also ein Tool-Aufruf oder am Schluss der Text.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | die Frage | «Jetzt der andere Weg. Kein Index, keine Embeddings. Claude Code bekommt dieselben Markdown-Dateien und drei Werkzeuge: Grep, Glob, Read. Das ist eine Aufzeichnung eines echten Laufs.» |
| `→` | **Schätzfrage:** Wie viele Turns? | Abstimmen, auflösen. |
| `→` … | Linie läuft von der Frage zum nächsten Punkt. Jeder Punkt ist ein Turn mit einer Karte: Tool, Suchmuster oder Datei, Grösse des Ergebnisses. Zähler für Turns und Kontext | Bei C3: «Schaut auf das Suchmuster: Militär, militaire, militare. Claude übersetzt den Suchbegriff selbst, ohne dass es jemand verlangt hat.» |
| letzter `→` | grüner letzter Punkt: Turn ohne Tool-Aufruf, die Antwort. Darunter Antworttext und Vergleichstabelle RAG gegen Agent | «Gefunden, mit Quelle. Der Preis sind Turns und Tokens pro Frage. Dafür gibt es nichts zu bauen und nichts aktuell zu halten.» |

**Zahlen im Kopf:** alle 4 Fragen richtig · S2 3 Turns, rund 22'000 Tokens · C3 4 Turns, 31'000 · E1 3 Turns, 22'000 · M3 4 Turns, 36'000 · je 5 bis 10 Sekunden.

**Fragen:** *Skaliert das?* Bei 16 Dateien mühelos. Bei Tausenden liefert Grep zu viele Treffer, Turns und Kontext steigen. Dort beginnt der Bereich von RAG. · *Kann man beides verbinden?* Ja: Der Index wird ein Werkzeug des Agenten, zum Beispiel über MCP. Im Repo liegt dafür `rag/mcp_server/`. · *Warum zählen Tokens bei Grep?* Jedes Suchergebnis landet im Kontext und wird in den folgenden Turns wieder mitgeschickt. · *Warum 3 Turns bei nur 2 Tool-Aufrufen?* Der letzte Turn ist die Antwort selbst. Darin ruft Claude kein Tool mehr auf.

## R8 · Test (16–17')

**Ziel:** Bevor die Punkte kommen, wissen alle, was gemessen wird und was die vier Gruppen sind.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | vier Kästen: 25 Fragen → erwartetes Dokument → Top 5 → Recall@5 | «Vier Fragen sind Anekdoten. Darum ein Test: 25 Fragen, vor der ersten Messung geschrieben. Zu jeder Frage steht fest, in welchem Dokument die Antwort ist. Die Suche liefert fünf Ergebnisse. Ist das Dokument dabei, ist die Frage gefunden.» |
| `→` | vier Karten: Synonym, Andere Sprache, Code oder Kennung, Mehrere Dokumente, je mit einer Beispielfrage | «Die Fragen sind in vier Gruppen geteilt. Jede Gruppe prüft eine andere Schwäche. Pro Gruppe steht eine Beispielfrage. Die Pfund-Frage kennt ihr.» (Hast du vorher mit `q` auch NT044, Militärtransporte oder das Versandbegleitdokument gezeigt, darauf verweisen.) |
| `→` | Hinweis | «Auf der nächsten Folie ist jede Frage ein Punkt. Die vier Beispielfragen sind umrandet, jede in ihrer Gruppe.» |

**Fragen:** *Warum zählt ihr Dokumente und nicht Chunks?* Weil vorab nur festgelegt ist, in welchem Dokument die Antwort steht. Das ist grosszügig: Ein Treffer im richtigen Dokument kann an der falschen Stelle liegen. · *Was heisst der halbe Punkt?* Die Frage erwartet zwei Dokumente, gefunden ist eines.

## R9 · Messung (17–19')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Reihe BM25: 25 Punkte, nach Kategorie gruppiert, 0.76 | «Jede Frage ist ein Punkt, sortiert nach den vier Gruppen. Voll heisst: Das richtige Dokument steht in den Top 5. Schaut, wo BM25 die Lücken hat: bei den Fragen in einer anderen Sprache.» |
| `→` | Reihe Vektor, 0.76 | «Die Vektorsuche: gleiche Quote, 0.76. Aber die Lücken sind an anderen Stellen: bei den Bezeichnern und bei den Synonymen.» |
| `→` | Reihe Hybrid, 0.92 | «Und zusammen: 0.92. Hybrid gewinnt hier klar, weil die Fehler fast nicht überlappen. Die halben Punkte sind Fragen mit zwei erwarteten Dokumenten, von denen nur eines gefunden worden ist.» |
| `→` | **Schätzfrage:** anderes Embedding-Modell, Sprachwechsel | Abstimmen. Antwort zeigen: «Schlechter. Von 0.83 auf 0.50.» |
| `→` | drei Karten: Varianten im Vergleich | «Gilt das immer? Links mit dem einfachen Chunking, in der Mitte unsere Variante, rechts mit einem deutlich grösseren Modell. Rechts bringt Hybrid nichts mehr: 0.86 wie Vektor allein. Und das grosse Modell ist beim Sprachwechsel schlechter. Grösser ist nicht einfach besser. Am eigenen Korpus messen.» |

**Fragen**

- *Was ist Recall@5?* Der Anteil der erwarteten Dokumente, die unter den ersten fünf Ergebnissen stehen. 0.76 entspricht 19 von 25 Fragen (zwei halbe Punkte zählen als einer).
- *Was ist MRR?* Mean Reciprocal Rank: der Durchschnitt von eins durch den Rang des ersten Treffers. Er misst, wie weit oben der Treffer steht. Rang 1 gibt 1, Rang 2 gibt 0.5.
- *Sind 25 Fragen genug?* Für eine Richtung ja, für Feinheiten nein. Eine Frage entspricht 0.04. Unterschiede unter 0.1 nicht überinterpretieren.
- *Wer hat die Fragen geschrieben?* Entwurf von Claude, fachliche Prüfung durch dich (**noch offen**, vor dem Workshop erledigen), vor der ersten Messung festgelegt. Die Parameter sind danach nicht mehr angepasst worden.
- *Warum ist BM25 bei Synonymen so gut (0.86)?* Gezählt wird auf Dokumentebene, und das grosse Dokument R-14-01 trifft fast immer irgendwo. Die Zahl ist geschönt, sag das offen.
- *Warum ist das grosse Modell schlechter?* Das wissen wir nicht sicher. Gemessen ist: Es verfehlt mehr Fragen, deren Antwort in einem anderssprachigen Dokument steht. Genau darum misst man.

## R10 · Fazit (19–20')

Je `→` eine Kernaussage. Lies sie nicht vor, sondern sag je einen Satz dazu:

1. *Jeder Retriever hat einen blinden Fleck.* «Ihr habt es an den Punkten gesehen.»
2. *Hybrid ist kein Automatismus.* «Mit dem anderen Modell ist der Vorteil weg gewesen.»
3. *Chunking verändert, was gefunden wird.* «Bei uns ein bis zwei Fragen. Das ist Rauschen, und das sage ich lieber offen.»
4. *Für Code im Repo reicht agentische Suche fast immer.* «RAG lohnt sich für grosse, mehrsprachige Wissensbestände ausserhalb des Repos, oder wenn viele Leute dieselben Fragen stellen.»

**Ein Satz zum Schluss (Vertrauensgrenze):** «Was eine Suche zurückgibt, ist fremder Inhalt und landet im Kontext des Agenten, auch eine versteckte Anweisung. Darum gelten die Permissions aus Übung 04 auch hier.»

**Übergang:** `→` zur Teamfrage R11. Danach zu Demo D: «Der Agent hat vorhin viel gelesen. Was, wenn ich das nicht in meinem Kontext haben will?» → Abschnitt D, Folie «Skalieren» (Shift+`→`).

**Fragen**

- *Wofür steht RAG?* Retrieval-Augmented Generation: erst passende Stellen suchen, dann dem Modell als Kontext mitgeben.
- *Und Agentic Search?* Der Agent sucht selbst, in mehreren Schritten, mit Werkzeugen wie Grep und Read, und entscheidet nach jedem Ergebnis neu.
- *Was ist die «Lethal Trifecta»?* Drei Dinge, die zusammen gefährlich sind: Zugriff auf private Daten, Kontakt mit fremden Inhalten und ein Weg nach aussen. Fehlt eines, kann eine eingeschleuste Anweisung keine Daten abziehen.
- *Wann würdest du RAG bauen?* Wenn der Bestand so gross ist, dass Grep zu viele Treffer liefert, wenn er in mehreren Sprachen vorliegt oder wenn viele Leute dieselben Fragen stellen. Dann zuerst 20 bis 30 echte Fragen sammeln und messen.

**Plan B für den ganzen Abschnitt R:** Streikt der Browser, im Terminal `uv run search "Welche Währungsangabe gilt für Fakturen in britischen Pfund?" --mode bm25`, dann `--mode vector`, dann `uv run eval`.

## R11 · Teamfrage (3 Minuten, fällt bei Zeitnot als erste weg)

| Taste | Auf dem Bild | Du sagst oder tust |
|-------|--------------|--------------------|
| (Start) | Frage, drei Stichworte, Uhr mit 3 Minuten | «Wo sucht ihr heute in Dokumentation? Würde dort eine Textsuche reichen?» `z` startet die Uhr. Nachfragen: «Wie viele Dokumente sind das, und in welchen Sprachen?» |

Bei Zeitnot mit Shift+`→` direkt zu Abschnitt D und die Frage im Abschluss stellen.

---

# D Skalieren (2:17, 7 Minuten)

**Ziel:** Ein Subagent schützt den Kontext, ein Worktree schützt die Dateien.

**Form:** Drei Folien und eine Live-Demo. D1 erklärt das Konzept. D2 kündigt die Demo an und bleibt stehen,
während du auf dein Terminal wechselst und den Bildschirm teilst. D3 zeigt nach der Demo als Animation,
was passiert ist. Die Teilnehmenden machen hier nichts selbst. Ablauf im Terminal: `demo-scripts.md`, Demo D.

**Zeit:** Das Budget ist 7 Minuten und ist für die Live-Demo allein geplant gewesen (3 + 4 Minuten).
Mit D1 und D3 reicht es nur, wenn die Live-Demo bei rund 4 Minuten bleibt. Sonst geht die Zeit vom Abschluss ab.
Noch nicht gestoppt.

## D1 · Skalieren (rund 1½ Minuten)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Balken «Hauptsession», wenig belegt | «Das ist eine Session. Jetzt soll jemand einen grossen Diff reviewen. Liest die Hauptsession ihn selbst, steht der ganze Diff danach in ihrem Kontext.» |
| `→` | Auftrag geht nach unten, Subagent-Balken füllt sich stark | «Stattdessen geht der Auftrag an einen Subagent. Er hat ein eigenes Kontextfenster und liest alles, was er braucht.» |
| `→` | blaues Segment «Bericht» in der Hauptsession | «Zurück kommt nur der Bericht. Der Reviewer läuft auf Haiku, also günstiger. Ich zeige das gleich live mit `/context` vorher und nachher.» |
| `→` | Repo fächert sich in zwei Worktrees auf | «Zweiter Teil: zwei Sessions, zwei Features, gleichzeitig. Jede hat ihr eigenes Arbeitsverzeichnis und ihren eigenen Branch.» |
| `→` | Merksatz | «Sie überschreiben sich nicht gegenseitig. Zusammengeführt wird mit Git.» Weiter mit `→` zur Folie «Demo». |

## D2 · Demo (Folie bleibt stehen, Live-Demo rund 4 Minuten)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| `→` | Zwei Karten: Teil 1 Reviewer-Subagent, Teil 2 zwei Sessions in Worktrees, je mit «Achtet auf» | «Jetzt zeige ich das live. Achtet in Teil 1 auf `/context` vorher und nachher, in Teil 2 darauf, wo die Dateien liegen.» → **Ins Terminal wechseln:** Reviewer-Subagent (3'), dann `claude -w office-search` und `claude -w declaration-csv`, drittes Terminal `git worktree list`. Nicht abwarten, bis die Sessions fertig sind. Danach zurück zur Präsentation. |

## D3 · Ablauf (nach der Demo, rund 1½ Minuten)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| `→` | Linie «Hauptsession» mit dem Auftrag | «Nochmals als Bild. Die Hauptsession hat den Auftrag bekommen.» |
| `→` | Abzweigung zum Subagent, fünf Tool-Aufrufe erscheinen nacheinander | «Sie hat ihn an den Reviewer abgegeben. Er hat den Diff und die Dateien in seinem eigenen Fenster gelesen. Die Hauptsession hat gewartet.» |
| `→` | Linie zurück nach oben, «nur der Bericht» | «Zurückgekommen ist nur der Bericht. Darum ist `/context` kaum gewachsen.» |
| `→` | Zwei Branches zweigen ab, Commits erscheinen abwechselnd | «Teil 2: Beide Sessions sind vom selben Stand abgezweigt, jede in ein eigenes Verzeichnis und auf einen eigenen Branch. Sie haben gleichzeitig gearbeitet.» |
| `→` | Beide Branches laufen zurück, `git merge …` | «Das Zusammenführen habe ich nicht gezeigt, weil die Sessions noch laufen. Es ist normales Git: `git merge` oder ein Pull Request pro Branch.» |

**Häufige Fragen**

- *Sieht der Subagent meinen Verlauf?* Nein. Er startet mit seinem eigenen System-Prompt und dem Auftrag. Was er wissen muss, gehört in den Auftrag.
- *Wo liegen Subagents?* Im Projekt unter `.claude/agents/`, persönlich unter `~/.claude/agents/`. Eine Markdown-Datei mit Name, Beschreibung, erlaubten Tools und Modell.
- *Kann ein Subagent Dateien ändern?* Wenn seine Tools das erlauben. Der Reviewer hier darf nur lesen und Bash.
- *Was ist ein Git-Worktree?* Ein zweites Arbeitsverzeichnis desselben Repos auf einem anderen Branch. Git kann das seit Jahren, `claude -w` legt es unter `.claude/worktrees/` an.
- *Von welchem Stand zweigt der Worktree ab?* Standard ist der Default-Branch vom Remote. Mit `"worktree": {"baseRef": "head"}` vom aktuellen lokalen Stand.
- *Wie viele Sessions parallel sind sinnvoll?* So viele, wie ihr reviewen könnt. Der Engpass seid ihr, nicht die Agenten. Und das Kontingent wird geteilt.

---

# ■ Schluss (2:24, 6 Minuten)

## Schluss 1 · Rückblick

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Landkarte, alle Teile grün, Schleife läuft | «Das ist die Karte vom Anfang. Der Unterschied: Jedes Teil habt ihr heute selbst in der Hand gehabt. Kontext mit CLAUDE.md und Skills. Steuerung mit Plan Mode, Permissions, Hooks und Rewind. Erweitern mit MCP. Und skalieren mit Subagents und Worktrees.» |

Danach ohne Folienwechsel, kurz: Modell- und Aufwandswahl (`/model`, `/effort`), erste Teamregeln (Review-Pflicht, Umgang mit Kunden- und Projektdaten, gemeinsame `CLAUDE.md` und `settings.json`). Dann `→` zum Ausblick.

## Schluss 2 · Ausblick (1 Minute)

**Ziel:** Alle wissen, dass es Remote Control und Cloud-Sessions gibt und wo sie nachlesen. Keine Demo.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | vier Karten: Remote Control, Claude Code on the web, `claude -p`, Scheduled Tasks, darunter ein Hinweis | «Vier Dinge, die wir heute nicht angeschaut haben. Remote Control: Ihr führt eine Session vom Handy aus weiter, sie läuft aber weiterhin auf eurem Rechner. Claude Code on the web: Die Session läuft in der Cloud von Anthropic, auf einem GitHub-Repo, und pusht einen Branch. `claude -p` ist Claude ohne Dialog, für Skripte und CI. Und Scheduled Tasks starten Cloud-Sessions nach Zeitplan. Wichtig für uns: Bei allem, was in der Cloud läuft, verlässt der Code euren Rechner. Das klärt ihr vorher im Projekt.» |

Links stehen im README unter «Weiterführend».

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
