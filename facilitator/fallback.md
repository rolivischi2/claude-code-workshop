# Fallback: Wenn das Pro-Limit erreicht ist

Pro hat ein **rollendes 5-Stunden-Fenster** plus ein **Wochenlimit**. Wer früh viel mit Opus
arbeitet, kann am Nachmittag blockiert sein.

## Vorbeugen (im Einstieg ansagen)

- `/model sonnet` in Übung 00. Der Standard ist Opus und verbraucht deutlich schneller.
- `/usage` zwischendurch zeigen lassen (kostet keine Tokens).
- Eine Übung = eine Session, danach `/clear`.
- Keine «lies alles»-Prompts, keine endlosen Korrekturrunden. Lieber `/rewind` und neu formulieren.
- `/effort low` für einfache Aufgaben (z.B. Übung 05, 07, 15).

## Wenn es passiert

1. **Pairen:** Mit dem Nachbarn an einem Rechner weiterarbeiten. Einer tippt, beide denken.
   Das ist ohnehin oft die bessere Lernform.
2. **Günstiger weiterarbeiten** (falls noch etwas Budget da ist):
   `/model haiku` und `/effort low`. Für die meisten Übungen reicht das.
3. **Lösung übernehmen und verstehen:**
   ```bash
   scripts/reset-exercise.sh NN+1      # Stand nach Übung NN, inkl. Referenzlösung
   git diff start/NN solution/NN       # was die Lösung ändert
   ```
   Die Diffs der Lösungen sind klein und eignen sich gut zum Lesen.
4. **Übungen ohne Modell:** 07 (Git-Teil), 11 (`uv run eval` läuft lokal) und 15
   (`claude plugin validate`) gehen auch ohne Budget weiter.
5. **Usage Credits:** Wer selbst zahlen will, kann unter `/usage-credits` zusätzliche
   Nutzung kaufen. Bitte **nicht** im Workshop empfehlen, nur erwähnen, falls jemand fragt.

## Für Facilitators

- Die Facilitators sollten ein Konto mit höherem Limit dabeihaben, um Demos notfalls am Beamer weiterzuführen.
- Wer am Vormittag über 50 % des 5h-Fensters liegt (`/usage`), bekommt den Hinweis, auf Haiku zu wechseln.
