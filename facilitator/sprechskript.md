# Sprechskript – beide Präsentationen, Schritt für Schritt

Zum Proben. Für jede Szene: Ziel, Zeit, dann pro Tastendruck **was erscheint** und **was du sagst**,
der Übergang und die Fragen, die am ehesten kommen. Die Sätze sind Vorschläge in deiner Tonlage,
keine Texte zum Ablesen. **Die Folien sind englisch beschriftet, gesprochen wird deutsch.** Wo das Skript
ein Element der Folie nennt, steht die englische Beschriftung in Anführungszeichen. Am Schluss steht ein Glossar mit Definitionen in einem Satz.

| Deck | Datei | Wann |
|------|-------|------|
| Concepts (6 Szenen) | `facilitator/konzepte/index.html` | Inputs um 0:00, 0:10, 0:45, 1:35, 2:15, 2:22 |
| Agentic search vs. RAG (9 Szenen) | `rag/viz/index.html` | Demo R, 1:55–2:15 |

**Tasten in beiden Decks:** `→` nächster Schritt · `←` zurück · Zahl = Szene · `f` Vollbild · `r` Animation nochmals ·
`g` Tipp-Runden aus/ein · `?` Hilfe. Im RAG-Deck zusätzlich `q` Frage wählen, `t` (Chunking), `d` (Results: Detail-Diagramme).

**Tipp-Runde:** `→` zeigt die Frage, du lässt per Handzeichen abstimmen («Wer ist für A?»), `→` löst auf,
`→` fährt weiter. Rund 30 Sekunden. Nicht kommentieren, wer falsch lag, sondern gleich die Erklärung zeigen.

**Vor dem Start:** Beide Seiten in zwei Tabs offen, Vollbild, Benachrichtigungen aus. Im RAG-Deck darf unten
rechts **nicht** «Sample data» stehen.

---

# Teil 1 – Konzepte

## Szene 1 · «Map» (0:00, 5 Minuten)

**Ziel:** Alle haben dasselbe Bild im Kopf: ein Modell in einer Schleife. Jede Übung bekommt einen Platz.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Prompt → Model → Tool call → Result | «Ihr kennt Agentic Engineering. Heute schauen wir, wie Claude Code das konkret baut. Der Kern ist klein: Ihr gebt einen Prompt. Das Modell entscheidet, was der nächste Schritt ist. Meistens ist das ein Tool-Aufruf: eine Datei lesen, etwas editieren, einen Befehl ausführen.» |
| `→` | Schleife leuchtet reihum auf, «Answer» erscheint | «Das Ergebnis geht zurück ans Modell, und es entscheidet wieder. Das wiederholt sich, bis das Modell findet, es sei fertig. Das ist der Agentic Loop. Wichtig: Das Modell *schlägt vor*, die Harness *führt aus*. Alles, was wir heute steuern, hängt an diesem Unterschied.» |
| `→` | Band «Context» | «Das Modell sieht nur, was im Kontext steht: den System-Prompt, eure CLAUDE.md, die Beschreibungen der Skills, den Verlauf und alles, was Tools zurückgeben. Block A dreht sich darum: Übung 01 und 02.» |
| `→` | Band «Control» | «Autonomie braucht Leitplanken. Plan Mode, Permissions, Hooks und Rewind sitzen *um* die Schleife herum. Das ist Block B, Übungen 03 bis 05.» |
| `→` | Band «Extend and scale» | «Und am Schluss machen wir die Schleife grösser: neue Werkzeuge über MCP, Wissen ausserhalb des Repos, mehrere Agenten gleichzeitig. Diese Karte seht ihr am Ende nochmals.» |

**Übergang:** «Bevor wir loslegen: Übung 00. Vier Slash-Commands, fünf Minuten. Notiert euch die Zahl aus `/context`, die brauchen wir gleich.»

**Häufige Fragen**

- *Was genau ist eine Harness?* Die Software um das Modell: Sie führt die Schleife, stellt Werkzeuge bereit, verwaltet den Kontext und setzt Regeln durch. Das Modell allein kann nur Text erzeugen.
- *Worin unterscheidet sich das von einem Chat?* Im Chat antwortet das Modell einmal. Hier handelt es in mehreren Schritten und sieht die Folgen seiner Schritte.
- *Wer entscheidet, wann Schluss ist?* Das Modell: Es antwortet ohne weiteren Tool-Aufruf. Ihr könnt jederzeit mit Esc unterbrechen.
- *Ist das bei anderen Coding-Agenten gleich?* Das Grundmuster ja. Unterschiede liegen bei Werkzeugen, Kontextverwaltung und Steuerung.

---

## Szene 2 · «Context» (0:10, 5 Minuten)

**Ziel:** Kontext kostet in jedem Turn. Darum lohnt sich, was erst bei Bedarf geladen wird.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | leerer Balken «Context window» | «Dieser Balken ist das Arbeitsgedächtnis des Modells. Was nicht drin ist, weiss es nicht. Was drin ist, bezahlt ihr.» |
| `→` | **Tipp-Runde:** «How full was your context in exercise 00 …?» | Abstimmen lassen. Auflösen: «Schaut auf eure Notiz.» Zwei, drei Zahlen zurufen lassen. |
| `→` | dunkle Segmente: System-Prompt, CLAUDE.md, Beschreibungen | «Das ist belegt, bevor ihr ein Wort tippt: System-Prompt und Werkzeuge, eure CLAUDE.md, die Beschreibungen der Skills, die Namen der MCP-Tools. Das Bild ist ein Schema, eure echte Zahl ist die aus `/context`.» |
| `→` | Turn 1: kleines graues, grosses ockerfarbenes Segment | «Erster Turn. Euer Prompt ist winzig. Gross ist, was Claude dafür *liest*: Dateien, Suchergebnisse, Testausgaben. Tool-Ergebnisse sind fast immer der grösste Posten.» |
| `→` | Balken wächst, darunter «Turn 1/2/3 sends» | «Und jetzt der Punkt, den viele unterschätzen: Jeder Turn schickt *alles Bisherige* wieder mit. Der Prompt-Cache macht den unveränderten Anfang billiger, aber nicht kleiner. Darum der Token-Tipp auf den Blättern: Kritik in einem Prompt sammeln statt in fünf.» |
| `→` | Verlauf schrumpft zu «Summary» | «`/compact` ersetzt den Verlauf durch eine Zusammenfassung. `/clear` leert ihn ganz. Faustregel: Neue Aufgabe, neuer Kontext.» |
| `→` | blaues Segment «Skill body» schiebt sich hinein | «Und das ist die Idee hinter Skills: Progressive Disclosure. Immer geladen ist nur die Beschreibung, ein, zwei Sätze. Der eigentliche Text kommt erst, wenn die Aufgabe dazu passt. Dann bleibt er im Kontext. In Übung 02 baut ihr genau das.» |

**Übergang:** «Übung 01: dasselbe Feature einmal ohne und einmal mit CLAUDE.md. Achtet darauf, was sich am Ergebnis ändert, nicht nur an der Zahl.»

**Häufige Fragen**

- *Was ist ein Token?* Ein Textstück, mit dem das Modell rechnet. Grob drei bis vier Zeichen, auf Deutsch eher weniger Text pro Token als auf Englisch.
- *Wie gross ist das Kontextfenster?* Das hängt vom Modell ab. `/context` zeigt für eure Session Grösse und Belegung.
- *Was ist der Prompt-Cache?* Der unveränderte Anfang einer Anfrage wird beim Anbieter zwischengespeichert und beim nächsten Turn zu einem tieferen Preis gelesen. Er verkleinert den Kontext nicht.
- *Was passiert, wenn der Kontext voll ist?* Claude Code fasst kurz vor der Grenze automatisch zusammen (Auto-Compact). Dabei können Details verloren gehen. Besser selbst `/compact` oder `/clear` setzen.
- *Was gehört in die CLAUDE.md?* Was in *jedem* Turn gelten soll: Build- und Testbefehle, Konventionen, Stolperfallen. Kurz halten: Sie wird immer mitgeschickt.
- *Wann CLAUDE.md, wann Skill?* Immer gültig und kurz: CLAUDE.md. Nur für bestimmte Aufgaben und länger: Skill.
- *Woher weiss Claude, wann ein Skill passt?* Aus der `description` im Kopf der `SKILL.md`. Darum ist dieser eine Satz das Wichtigste am Skill.

---

## Szene 3 · «Guardrails» (0:45, 5 Minuten)

**Ziel:** Jeder Tool-Aufruf läuft durch dieselben Tore. Eine Regel ist eine Garantie, eine Anweisung in der CLAUDE.md nur eine Bitte.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | sechs Tore in einer Reihe | «Ihr erinnert euch: Das Modell schlägt vor, die Harness führt aus. Dazwischen liegen diese Tore, in dieser Reihenfolge.» |
| `→` | `Edit FristFormatter.java` läuft grün durch | «Ein harmloser Edit. Der PreToolUse-Hook hat nichts dagegen, keine deny-Regel, keine ask-Regel, erlaubt. Das Tool läuft. Und danach formatiert der PostToolUse-Hook genau diese eine Datei. Das kostet keinen einzigen Token.» |
| `→` | **Tipp-Runde:** allow im Projekt, deny beim User | Abstimmen. Auflösen: «deny. Geprüft wird immer deny, dann ask, dann allow, über alle Ebenen hinweg.» |
| `→` | `Read .env` bleibt rot bei deny stehen | «Darum ist deny die verlässlichste Regel, die ihr habt. In Übung 04 sperrt ihr damit `.env` und `git push`.» |
| `→` | `Edit src/generated/…` bleibt beim Hook stehen | «Für alles, was sich nicht als Muster schreiben lässt, gibt es Hooks: ein Skript von euch. Endet es mit Exit-Code 2, ist der Aufruf blockiert, und die Begründung geht zurück an Claude. Die Regeln werden dann gar nicht mehr gefragt.» |
| `→` | `rm -r scratch/wegwerf` hält bei ask | «Und ask heisst: Claude hält an und fragt euch. Für alles, was selten und heikel ist.» |
| `→` | `/rewind`-Zeitleiste, Marker springt zurück | «Die letzte Leitplanke ist ein Netz. Vor jedem Prompt legt Claude Code einen Checkpoint an. Mit `/rewind` geht ihr zurück: Code, Konversation oder beides. Mit einem solchen Netz könnt ihr mutiger experimentieren.» |

**Übergang:** «Übung 03 zuerst: Plan Mode. Da lernt ihr die billigste Leitplanke überhaupt, nämlich erst denken lassen, dann schreiben lassen.»

**Häufige Fragen**

- *Welche Permission-Modi gibt es?* default (fragt nach), acceptEdits (Datei-Edits ohne Rückfrage), plan (nur lesen und planen), auto, dontAsk und bypassPermissions. Shift+Tab schaltet durch default, acceptEdits und plan.
- *Kann ein Hook eine deny-Regel aushebeln?* Nein. Deny- und ask-Regeln werden auch dann noch geprüft, wenn ein Hook «erlauben» zurückgibt.
- *Was passiert bei einem anderen Exit-Code als 2?* Der Aufruf läuft weiter, die erste Zeile von stderr erscheint als Hinweis. Nur 2 blockiert.
- *Ist deny eine Sicherheitsgrenze?* Nein, eine Leitplanke. Ein Skript, das die Datei selbst öffnet, kommt daran vorbei. Für harte Grenzen gibt es die Bash-Sandbox und Managed Settings.
- *Welche Settings-Datei gewinnt?* Von oben nach unten: Managed, Kommandozeile, `settings.local.json`, `settings.json` im Projekt, User. Listen wie `permissions.allow` werden zusammengeführt.
- *Was erfasst ein Checkpoint nicht?* Dateien, die nur per Bash, von einem Subagent oder von aussen geändert wurden. Darum ersetzt Rewind Git nicht.
- *Wie lange bleiben Checkpoints?* Sie gehören zur Session und überleben ein `claude -c`. Laut Doku werden die letzten 100 behalten.
- *Warum Hooks als Node-Skript?* Dieselbe Konfiguration läuft auf macOS und Windows, weil keine Shell dazwischen ist.

---

## Szene 4 · «MCP» (1:35, 3 Minuten)

**Ziel:** MCP ist ein Stecker, kein Produkt. Und: Ein Agent, der sein Ergebnis sieht, braucht weniger Kontrolle.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | links Claude Code, rechts Browser mit der App | «Bis jetzt hat Claude Dateien gelesen und Befehle ausgeführt. Eure App im Browser sieht es nicht.» |
| `→` | MCP-Stecker, Playwright-Server, gestrichelt weitere Server | «MCP, das Model Context Protocol, ist ein offener Standard: eine Steckdose für Werkzeuge. Claude Code kennt nur das Protokoll. Dahinter kann ein Browser hängen, ein Ticket-System, eine Datenbank. In Übung 06 ist es Playwright, lokal gestartet, eingetragen in `.mcp.json`, damit das ganze Team denselben Server hat.» |
| `→` | «Feedback loop» leuchtet reihum | «Das eigentlich Neue ist aber das hier. Claude ändert Code, schaut im Browser nach, sieht den Fehler selbst, korrigiert und sichert das Ergebnis mit einem Test. Ein Agent, der seine Arbeit prüfen kann, braucht weniger Kontrolle durch euch.» |
| `→` | zwei Merksätze: «Context», «Trust» | «Zwei Dinge zum Mitnehmen. Erstens Kontext: Beim Start laden nur die Namen der Tools, die Beschreibungen erst bei Bedarf. Zweitens Vertrauen: Was ein Server zurückgibt, ist fremder Inhalt. Eine Webseite kann Text enthalten, der wie eine Anweisung aussieht.» |

**Übergang:** «Übung 06. Die App läuft bei euch seit vor der Pause. Der Fehler: Das Formular schluckt eine Ablehnung des Backends.»

**Häufige Fragen**

- *Wer hat MCP erfunden?* Anthropic hat es Ende 2024 als offenen Standard veröffentlicht. Inzwischen unterstützen es viele Werkzeuge und Anbieter.
- *stdio oder HTTP?* stdio für lokale Prozesse wie hier, HTTP für entfernte Dienste. SSE gilt als veraltet.
- *Welche Scopes gibt es?* Lokal (nur ich, nur dieses Projekt), Projekt (`.mcp.json`, im Repo geteilt), User (ich, alle Projekte).
- *Warum muss ich den Server bestätigen?* Weil ein geklontes Repo sonst beliebige Programme auf eurem Rechner starten könnte.
- *Brauche ich MCP, wenn es ein CLI gibt?* Oft nicht. Ein gutes CLI über Bash reicht häufig und kostet weniger Kontext. MCP lohnt sich bei strukturierten Daten, Anmeldung und geteilten Diensten.
- *Warum `node` statt `npx` in der Vorlage?* Es nutzt das bereits installierte Paket, funktioniert offline und auf Windows ohne Umweg.

---

## Szene 5 · «Scale» (2:15, Demo D, 7 Minuten)

**Ziel:** Ein Subagent schützt den Kontext, ein Worktree schützt die Dateien.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Balken «Main session», wenig belegt | «Das ist eure Session. Jetzt soll jemand einen grossen Diff reviewen. Wenn die Hauptsession das selbst liest, ist der Diff danach für immer in eurem Kontext.» |
| `→` | Auftrag geht nach unten, Subagent-Balken füllt sich stark | «Stattdessen geben wir den Auftrag an einen Subagent. Der hat ein eigenes Kontextfenster und liest alles, was er braucht.» → **Jetzt machen alle mit:** Blatt `exercises/demo-d-reviewer`, drei Minuten. `/context` vorher notieren. |
| `→` | **Tipp-Runde:** Wie stark wächst der Hauptkontext? | Abstimmen, während die Subagents laufen. Auflösen. |
| `→` | blaues Segment «Report» in der Hauptsession | «Zurück kommt nur der Bericht. Schaut in euer `/context`: Der Unterschied ist klein. Und der Reviewer läuft auf Haiku, also günstiger. Lesen und Suchen delegieren ist die einfachste Art, Kontext und Kontingent zu schonen.» |
| `→` | Repo fächert sich in zwei Worktrees auf | Am Beamer: zwei Terminals, `claude -w office-search` und `claude -w declaration-csv`. «Zwei Sessions, zwei Features, gleichzeitig. Jede hat ihr eigenes Arbeitsverzeichnis und ihren eigenen Branch.» Drittes Terminal: `git worktree list`. |
| `→` | Merksatz | «Keine gegenseitigen Edits. Und das Zusammenführen ist normales Git: Pull Request, Review, Merge.» Nicht abwarten, bis die Sessions fertig sind. |

**Häufige Fragen**

- *Sieht der Subagent meinen Verlauf?* Nein. Er startet mit seinem eigenen System-Prompt und dem Auftrag. Was er wissen muss, gehört in den Auftrag.
- *Wo liegen Subagents?* Im Projekt unter `.claude/agents/`, persönlich unter `~/.claude/agents/`. Eine Markdown-Datei mit Name, Beschreibung, erlaubten Tools und Modell.
- *Kann ein Subagent Dateien ändern?* Wenn seine Tools das erlauben. Der Reviewer hier darf nur lesen und Bash.
- *Was ist ein Git-Worktree?* Ein zweites Arbeitsverzeichnis desselben Repos auf einem anderen Branch. Git kann das seit Jahren, `claude -w` legt es unter `.claude/worktrees/` an.
- *Von welchem Stand zweigt der Worktree ab?* Standard ist der Default-Branch vom Remote. Mit `"worktree": {"baseRef": "head"}` vom aktuellen lokalen Stand.
- *Wie viele Sessions parallel sind sinnvoll?* So viele, wie ihr reviewen könnt. Der Engpass seid ihr, nicht die Agenten. Und das Kontingent wird geteilt.

---

## Szene 6 · «Recap» (2:22, 8 Minuten)

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Landkarte, alle Teile grün, Schleife läuft | «Das ist die Karte vom Anfang. Der Unterschied: Jedes Teil habt ihr heute selbst in der Hand gehabt. Kontext mit CLAUDE.md und Skills. Steuerung mit Plan Mode, Permissions, Hooks und Rewind. Erweitern mit MCP. Und skalieren mit Subagents und Worktrees.» |
| `→` | Schlussfrage | Frage stellen, drei bis vier Antworten sammeln. Dann: Modell- und Aufwandswahl (`/model`, `/effort`), erste Teamregeln (Review-Pflicht, Umgang mit Kunden- und Projektdaten, gemeinsame `CLAUDE.md` und `settings.json`), Links im README. |

**Häufige Fragen im Abschluss**

- *Welches Modell wofür?* Sonnet als Standard. Das grösste Modell für schwierige Planung und knifflige Fehler. Haiku für Subagents, die suchen und lesen.
- *Was macht `/effort`?* Es stellt ein, wie viel das Modell nachdenkt, bevor es antwortet. Mehr Aufwand kostet mehr Kontingent und Zeit.
- *Womit sollen wir im Team anfangen?* Mit einer gemeinsamen `CLAUDE.md` und einer `settings.json` mit zwei, drei deny-Regeln. Beides committen.
- *Dürfen wir Kundendaten verwenden?* Das ist eine Frage eurer Projektregeln und der Privatsphäre-Einstellung des Kontos, nicht des Werkzeugs. Vor dem ersten Einsatz klären.

---

# Teil 2 – Agentic Search vs. RAG (Demo R, 20 Minuten)

**Roter Faden:** Echte Dokumentation, zwei Wege zur Antwort. Erst zeigen, wo jede Suche blind ist, dann messen,
dann den Agenten ohne Index dagegenstellen. Die Zahlen sind ehrlich gemessen und nicht nachgetunt.

**Die vier Fragen** (mit `q` wählen):

| Kürzel | Frage | Was sie zeigt |
|--------|-------|---------------|
| **S2** | Welche Währungsangabe gilt für Fakturen in britischen Pfund? | Synonym: Das Dokument sagt «GBP» und «Währungscode». BM25 findet nichts, Vektor Rang 1 |
| **E1** | Was bedeutet die Meldung NT044? | Bezeichner: BM25 Rang 1, Vektor nicht in den Top 10, Hybrid Rang 2 |
| **C3** | Wer muss das Zollformular für Militärtransporte ausfüllen …? | Sprachwechsel: Antwort nur im italienischen Dokument. BM25 nichts, Vektor Rang 1 |
| **M3** | Was ändert sich mit NCTS Phase 5 beim Layout … und bei der Tarifnummer? | Zwei Dokumente: Keine Suche bringt beide in die Top 5, der Agent findet beide |

## Szene 1 · «Corpus» (0–1½')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | 16 Kacheln, «16 documents», «267 pages» | «Bis jetzt hat Claude im Code gesucht. Was, wenn das Wissen woanders steht? Das hier ist echte Dokumentation des BAZG zum Transitverfahren: 16 Dokumente, 267 Seiten. Dieselbe Domäne wie eure Übungs-App.» |
| `→` | deutsche Kacheln verblassen, «3 languages» | «Und sie ist mehrsprachig. Zwei Dokumente gibt es nur auf Französisch, eines nur auf Italienisch. Das wird gleich wichtig.» |
| `→` | «chunks in the index», zwei Wege: «Build an index first», «Let the agent search» | «Wie findet ein Agent darin die richtige Stelle? Zwei Wege. Entweder wir bauen vorher einen Index und schlagen bei jeder Frage nach: Das ist RAG. Oder der Agent sucht selbst, mit Grep und Read, so wie im Code. Wir schauen uns beide an und messen.» |

**Fragen:** *Warum nicht einfach alles in den Kontext?* 267 Seiten bei jedem Turn mitzuschicken ist teuer und macht Antworten ungenauer. · *Sind die Dokumente im Repo?* Nein, sie werden von der BAZG-Seite geladen, die Liste steht in `rag/sources.yaml`.

## Szene 2 · «Chunking» (1½–3')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | ein Abschnitt aus R-14-01 als Fliesstext | «Ein Index findet keine Dokumente, sondern Stücke davon: Chunks. Also müssen wir schneiden.» |
| `→` | Schnitte nach fester Länge, rot wo mitten im Wort | «Die einfache Art: alle 400 Zeichen, mit etwas Überlappung. Seht ihr die roten Stellen? Der Schnitt geht mitten durch Wörter und Sätze.» |
| `→` | Schnitte an Überschriften, Pfad davor | «Die bessere Art: an den Überschriften entlang. Jeder Chunk bekommt seinen Überschriftenpfad vorangestellt, so weiss er, wo er herkommt.» (`t` wechselt hin und her.) |

**Satz:** «Was ein Chunk ist, bestimmt, was gefunden werden kann.»

**Fragen:** *Wie gross soll ein Chunk sein?* Gross genug für einen vollständigen Gedanken, klein genug, dass fünf davon in den Kontext passen. · *Wozu Überlappung?* Damit ein Satz an der Schnittkante in mindestens einem Chunk ganz bleibt. · *Bringt das besseres Chunking etwas?* Hier ein bis zwei Fragen von 25. Das ist im Rauschen. Sag das so.

## Szene 3 · «BM25» (3–5½'), Frage S2

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Frage, vier Suchbegriffe ploppen auf | «Erste Suche: BM25, die klassische Stichwortsuche. Sie fragt nach diesen Wörtern: Währungsangabe, Fakturen, britischen, Pfund.» |
| `→` | **Tipp-Runde:** Findet BM25 das richtige Dokument? | Abstimmen. Auflösen: «Nein. Kein einziger Treffer.» |
| `→` | Ergebnisliste, Begriffe mit Trefferzahl | «BM25 zählt, welche Suchwörter wörtlich im Chunk stehen, und gewichtet seltene Wörter höher.» |
| `→` | Begriffe durchgestrichen, rotes Urteil | «Das richtige Dokument sagt ‹Rechnungen in GBP› und ‹Währungscode›. Kein Wort der Frage kommt darin vor. Stichwortsuche ist blind für Synonyme.» |

**Fragen:** *Wofür steht BM25?* «Best Matching 25», eine Bewertungsformel aus den Neunzigern, Standard in Suchmaschinen wie Elasticsearch. Hier über SQLite FTS5. · *Kann man Synonyme nicht einfach hinterlegen?* Ja, aber die Liste muss jemand pflegen, pro Fachgebiet und Sprache. · *Was passiert mit Füllwörtern?* Eine Stoppwortliste entfernt sie vor der Abfrage.

## Szene 4 · «Vector DB» (5½–7½'), Frage S2

**Ziel:** Bevor die Karte kommt, sehen alle, was eigentlich gespeichert und verglichen wird: Zahlen pro Chunk.

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Textstück → «Embedding model» → Zahlenstreifen | «Bevor wir suchen, müssen wir verstehen, was im Index liegt. Ein Embedding-Modell macht aus einem Text eine feste Liste von 384 Zahlen. Ähnliche Bedeutung ergibt ähnliche Zahlen. Das ist ein kleines, eigenes Modell, es läuft hier auf dem Laptop. Mit Claude hat es nichts zu tun.» |
| `→` | Tabelle: eine Zeile pro Chunk, mit Zahlenstreifen | «Und das ist schon die ganze Vektor-Datenbank: eine Tabelle. Pro Chunk eine Zeile, mit dem Text und seinen 384 Zahlen. Die Streifen zeigen die ersten sechzehn davon. Bei uns sind es 1206 Zeilen in einer einzigen SQLite-Datei.» |
| `→` | blaue Zeile «the question» | «Die Frage geht durch dasselbe Modell und wird ebenfalls zu 384 Zahlen.» |
| `→` | Spalte «similarity to the question» füllt sich, Zeilen sortieren sich | «Suchen heisst jetzt: die Zahlen der Frage mit jeder Zeile vergleichen und nach Ähnlichkeit sortieren. Die obersten Zeilen sind die ‹nächsten Nachbarn›. Kein einziges Wort wurde verglichen.» |
| `→` | drei Merkkästen | «Darum findet ‹Pfund› das Dokument mit ‹GBP›. Und darum geht ein Code wie NT044 verloren. Eine spezielle Datenbank braucht es erst bei Millionen von Zeilen: Dann hilft ein Index, der nicht jede Zeile prüfen muss.» |

**Übergang:** «Eine Tabelle mit 384 Spalten kann niemand lesen. Darum zeichnen wir sie jetzt als Karte.»

**Fragen**

- *Was ist eine Vektor-Datenbank?* Eine Datenbank, die zu jedem Eintrag einen Zahlenvektor speichert und schnell die ähnlichsten Vektoren zu einer Anfrage findet.
- *Brauche ich dafür ein eigenes Produkt?* Bei einigen tausend Chunks nicht. SQLite mit sqlite-vec oder Postgres mit pgvector reichen. Eigene Vektor-Datenbanken lohnen sich bei sehr grossen Beständen.
- *Was heisst «nearest neighbour»?* Die Einträge, deren Vektor dem der Frage am ähnlichsten ist. Bei grossen Beständen wird das näherungsweise gesucht (ANN, approximate nearest neighbour).
- *Was bedeuten die einzelnen Zahlen?* Einzeln nichts Lesbares. Erst das Muster aller 384 Zahlen zusammen beschreibt die Bedeutung.
- *Woher kommen die Zahlen auf der Folie?* Es sind die echten ersten 16 Werte aus dem Index, die Ähnlichkeiten sind die echten Kosinus-Werte der Suche.

## Szene 5 · «Vector» (7½–11½'), Fragen S2, E1, C3

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Karte: jeder Punkt ein Chunk | «Dieselbe Tabelle, jetzt als Karte. Jede Zeile ist ein Punkt, und Zeilen mit ähnlichen Zahlen liegen nah beieinander. Die 384 Zahlen sind dafür auf zwei zusammengedrückt, die Abstände stimmen also nur ungefähr.» |
| `→` | die Frage fliegt als Stern ein | «Die Frage wird mit demselben Modell zu einem Punkt.» |
| `→` | **Tipp-Runde**, dann Linien zu den nächsten Nachbarn, Ergebnisliste | Abstimmen, auflösen. «Gesucht sind die nächsten Nachbarn.» |
| `→` | Nahaufnahme, grünes Urteil | «Rang 1. Dieselbe Frage, an der BM25 gescheitert ist. Das Modell weiss, dass Pfund und GBP dasselbe meinen.» |
| `q` → **E1**, dann `→` bis zum Urteil | NT044: Vektor verfehlt | «Und jetzt die Gegenprobe. Was bedeutet die Meldung NT044? Für die Stichwortsuche ist das ein Geschenk. Die Vektorsuche findet den Code nicht einmal in den Top 10. Ziffern tragen kaum Bedeutung, NT044 und NT045 liegen fast aufeinander.» |
| `q` → **C3**, dann `→` bis zum Urteil | italienisches Dokument auf Rang 1 | «Dritte Frage, auf Deutsch gestellt. Die Antwort steht nur im italienischen Dokument. BM25 hat keine Chance, das mehrsprachige Modell springt über die Sprachgrenze.» |

**Sätze:** «Vektoren verstehen Bedeutung, aber nicht Bezeichner.» · «Mehrsprachige Embeddings überspringen die Sprachgrenze.»

**Fragen**

- *Was ist ein Embedding?* Eine Liste von Zahlen, die die Bedeutung eines Textes beschreibt. Ähnliche Texte bekommen ähnliche Zahlen.
- *Wie misst man Nähe?* Hier über die Kosinus-Distanz: den Winkel zwischen zwei Vektoren.
- *Welches Modell ist das?* `paraphrase-multilingual-MiniLM-L12-v2`, klein, mehrsprachig, läuft lokal auf dem Laptop. Es gehen keine Daten nach aussen.
- *Wie kommt die Karte zustande?* Hauptkomponentenanalyse (PCA) von 384 auf 2 Dimensionen. Abstände stimmen nur ungefähr, die Nachbarn stammen aus der echten Rangliste.
- *Wo werden die Vektoren gespeichert?* In derselben SQLite-Datei, mit der Erweiterung sqlite-vec. Eine eigene Vektor-Datenbank braucht es bei dieser Grösse nicht.
- *Hat das etwas mit dem Sprachmodell zu tun?* Nein. Embedding-Modelle sind eigene, viel kleinere Modelle. Claude kommt in diesem Teil gar nicht vor.

## Szene 6 · «Hybrid» (11½–13½'), Fragen S2, dann E1

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | zwei Ranglisten nebeneinander | «Jede Suche hat einen blinden Fleck, und zwar dort, wo die andere stark ist. Also beide zusammen.» |
| `→` | Karten wandern in eine gemeinsame Reihenfolge, mit `1/(60+Rang)` | «Reciprocal Rank Fusion: Jede Liste vergibt Punkte nach Rang, eins durch sechzig plus Rang. Die Punkte werden addiert. Es zählt nur die Position, nicht der Score. Darum lassen sich zwei völlig verschiedene Verfahren mischen.» |
| `→` | Urteil | Bei S2: «Der Vektor-Treffer bleibt auf Rang 1.» Dann `q` → **E1**: «Und hier schadet die Fusion. BM25 hatte den Treffer auf Rang 1, das Rauschen der Vektoren drückt ihn auf Rang 2.» |

**Satz:** «Fusion gleicht blinde Flecken aus, im Schnitt. Im Einzelfall kann sie einen sicheren Treffer verwässern.»

**Fragen:** *Warum 60?* Der Wert aus der Originalarbeit zu RRF von 2009. Er dämpft den Vorsprung der obersten Ränge und ist kaum empfindlich. · *Warum nicht die Scores addieren?* BM25-Scores und Kosinus-Werte haben verschiedene Skalen und sind nicht vergleichbar. · *Geht das besser?* Ja, etwa mit einem Reranker, der die Kandidaten nochmals bewertet. Das kostet Zeit und ein weiteres Modell.

## Szene 7 · «Agent» (13½–16½'), Frage C3 oder M3

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | die Frage | «Jetzt der andere Weg. Kein Index, keine Embeddings. Claude Code bekommt dieselben Markdown-Dateien und drei Werkzeuge: Grep, Glob, Read. Das ist eine Aufzeichnung eines echten Laufs.» |
| `→` | **Tipp-Runde:** Wie viele Turns? | Abstimmen, auflösen. |
| `→` … | Zeitleiste füllt sich, Zähler für Turns und Kontext | Bei C3: «Schaut auf das Suchmuster: Militär, militaire, militare. Claude übersetzt den Suchbegriff selbst, ohne dass es jemand verlangt hat.» |
| letzter `→` | Antwort, Vergleichstabelle RAG gegen Agent | «Gefunden, mit Quelle. Der Preis sind Turns und Tokens pro Frage. Dafür gibt es nichts zu bauen und nichts aktuell zu halten.» |

**Zahlen im Kopf:** alle 4 Fragen richtig · S2 3 Turns, rund 22'000 Tokens · C3 4 Turns, 31'000 · E1 3 Turns, 22'000 · M3 4 Turns, 36'000 · je 5 bis 10 Sekunden.

**Fragen:** *Skaliert das?* Bei 16 Dateien mühelos. Bei Tausenden liefert Grep zu viele Treffer, Turns und Kontext steigen. Dort beginnt der Bereich von RAG. · *Kann man beides verbinden?* Ja: Der Index wird ein Werkzeug des Agenten, zum Beispiel über MCP. Im Repo liegt dafür `rag/mcp_server/`. · *Warum zählen Tokens bei Grep?* Jedes Suchergebnis landet im Kontext und wird in den folgenden Turns wieder mitgeschickt.

## Szene 8 · «Results» (16½–19')

| Taste | Auf dem Bild | Du sagst |
|-------|--------------|----------|
| (Start) | Reihe BM25: 25 Punkte, nach Kategorie gruppiert, 0.76 | «Vier Fragen sind Anekdoten. Darum 25 Fragen, vor der ersten Messung geschrieben. Jede Frage ist ein Punkt. Voll heisst: Das richtige Dokument steht in den Top 5. Schaut, wo BM25 die Lücken hat: bei den Fragen in einer anderen Sprache.» |
| `→` | Reihe Vektor, 0.76 | «Die Vektorsuche: gleiche Quote, 0.76. Aber die Lücken sind an anderen Stellen: bei den Bezeichnern und bei den Synonymen.» |
| `→` | Reihe Hybrid, 0.92 | «Und zusammen: 0.92. Hybrid gewinnt hier klar, weil die Fehler fast nicht überlappen. Die halben Punkte sind Fragen mit zwei erwarteten Dokumenten, von denen nur eines gefunden wurde.» |
| `→` | **Tipp-Runde:** anderes Embedding-Modell, Sprachwechsel | Abstimmen. Auflösen: «Schlechter. Von 0.83 auf 0.50.» |
| `→` | drei Karten: Varianten im Vergleich | «Gilt das immer? Links mit dem einfachen Chunking, in der Mitte unsere Variante, rechts mit einem deutlich grösseren Modell. Rechts bringt Hybrid nichts mehr: 0.86 wie Vektor allein. Und das grosse Modell ist beim Sprachwechsel schlechter. Grösser ist nicht einfach besser. Am eigenen Korpus messen.» |

`d` zeigt die Detail-Diagramme (Recall und MRR pro Kategorie, `v` wechselt die Variante), falls jemand nachfragt. `d` führt zurück.

**Fragen**

- *Was ist Recall@5?* Der Anteil der erwarteten Dokumente, die unter den ersten fünf Ergebnissen stehen. 0.76 entspricht 19 von 25 Fragen (zwei halbe Punkte zählen als einer).
- *Was ist MRR?* Mean Reciprocal Rank: der Durchschnitt von eins durch den Rang des ersten Treffers. Er misst, wie weit oben der Treffer steht. Rang 1 gibt 1, Rang 2 gibt 0.5.
- *Sind 25 Fragen genug?* Für eine Richtung ja, für Feinheiten nein. Eine Frage entspricht 0.04. Unterschiede unter 0.1 nicht überinterpretieren.
- *Wer hat die Fragen geschrieben?* Entwurf von Claude, fachliche Prüfung durch dich (**noch offen**, vor dem Workshop erledigen), vor der ersten Messung festgelegt. Die Parameter wurden danach nicht mehr angepasst.
- *Warum ist BM25 bei Synonymen so gut (0.86)?* Gezählt wird auf Dokumentebene, und das grosse Dokument R-14-01 trifft fast immer irgendwo. Die Zahl ist geschönt, sag das offen.
- *Warum ist das grosse Modell schlechter?* Das wissen wir nicht sicher. Gemessen ist: Es verfehlt mehr Fragen, deren Antwort in einem anderssprachigen Dokument steht. Genau darum misst man.

## Szene 9 · «Takeaways» (19–20')

Je `→` eine Kernaussage. Lies sie nicht vor, sondern sag je einen Satz dazu:

1. *Jeder Retriever hat einen blinden Fleck.* «Ihr habt es an den Punkten gesehen.»
2. *Hybrid ist kein Automatismus.* «Mit dem anderen Modell war der Vorteil weg.»
3. *Chunking verändert, was gefunden wird.* «Bei uns ein bis zwei Fragen. Das ist Rauschen, und das sage ich lieber offen.»
4. *Für Code im Repo reicht agentische Suche fast immer.* «RAG lohnt sich für grosse, mehrsprachige Wissensbestände ausserhalb des Repos, oder wenn viele Leute dieselben Fragen stellen.»

**Ein Satz zum Schluss (Vertrauensgrenze):** «Was eine Suche zurückgibt, ist fremder Inhalt und landet im Kontext des Agenten, auch eine versteckte Anweisung. Darum gelten die Permissions aus Übung 04 auch hier.»

**Übergang zu Demo D:** «Der Agent hat gerade viel gelesen. Was, wenn ich das nicht in meinem Kontext haben will?» → Concepts, Szene 5 «Scale».

**Fragen**

- *Wofür steht RAG?* Retrieval-Augmented Generation: erst passende Stellen suchen, dann dem Modell als Kontext mitgeben.
- *Und Agentic Search?* Der Agent sucht selbst, in mehreren Schritten, mit Werkzeugen wie Grep und Read, und entscheidet nach jedem Ergebnis neu.
- *Was ist die «Lethal Trifecta»?* Drei Dinge, die zusammen gefährlich sind: Zugriff auf private Daten, Kontakt mit fremden Inhalten und ein Weg nach aussen. Fehlt eines, kann eine eingeschleuste Anweisung keine Daten abziehen.
- *Wann würdest du RAG bauen?* Wenn der Bestand so gross ist, dass Grep zu viele Treffer liefert, wenn er in mehreren Sprachen vorliegt oder wenn viele Leute dieselben Fragen stellen. Dann zuerst 20 bis 30 echte Fragen sammeln und messen.

**Plan B:** Streikt der Browser, im Terminal `uv run search "Welche Währungsangabe gilt für Fakturen in britischen Pfund?" --mode bm25`, dann `--mode vector`, dann `uv run eval`.

---

# Glossar (ein Satz pro Begriff)

| Begriff | Definition |
|---------|------------|
| Harness | Die Software um das Modell: Schleife, Werkzeuge, Kontextverwaltung, Regeln |
| Agentic Loop | Modell entscheidet, Tool läuft, Ergebnis geht zurück, bis das Modell fertig ist |
| Tool-Aufruf | Vorschlag des Modells, ein Werkzeug mit bestimmten Parametern auszuführen |
| Token | Textstück, mit dem das Modell rechnet, grob drei bis vier Zeichen |
| Kontextfenster | Alles, was das Modell in einem Turn sieht, mit einer festen Obergrenze |
| Turn | Eine Runde: Anfrage ans Modell, Antwort oder Tool-Aufruf |
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
