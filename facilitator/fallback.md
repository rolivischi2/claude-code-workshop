# Fallback: Wenn das Pro-Limit erreicht ist

Pro hat ein **rollendes 5-Stunden-Fenster** plus ein **Wochenlimit**. Die Übungen sind so
ausgelegt, dass sie zusammen deutlich unter einem Fenster bleiben. Wer aber am selben Tag schon
viel mit Opus gearbeitet hat, kann trotzdem blockiert sein.

## Vorbeugen (im Einstieg ansagen)

- `/model sonnet` in Übung 00. Der Standard ist Opus und verbraucht deutlich schneller.
- `/usage` zwischendurch zeigen lassen (kostet keine Tokens).
- Eine Übung = eine Session, danach `/clear`.
- Keine «lies alles»-Prompts, keine endlosen Korrekturrunden. Lieber `/rewind` und neu formulieren.
- `/effort low` für einfache Aufgaben (z.B. Übung 04).

## Wenn es passiert

1. **Pairen:** Mit dem Nachbarn an einem Rechner weiterarbeiten. Einer tippt, beide denken.
   Das ist ohnehin oft die bessere Lernform.
2. **Günstiger weiterarbeiten** (falls noch etwas Budget da ist):
   `/model haiku` und `/effort low`. Für die meisten Übungen reicht das.
3. **Lösung übernehmen und verstehen:**
   ```bash
   scripts/reset-exercise.sh NN+1      # Stand nach Übung NN, inkl. Referenzlösung (nach 06: git switch solution/06)
   git diff start/NN solution/NN       # was die Lösung ändert
   ```
   Die Diffs der Lösungen sind klein und eignen sich gut zum Lesen.
4. **Übungen ohne Modell:** 05 (`/rewind` und Git) und der Permissions-Teil von 04
   (verweigerte Aufrufe kosten fast nichts) gehen auch fast ohne Budget weiter.
5. **Usage Credits:** Wer selbst zahlen will, kann unter `/usage-credits` zusätzliche
   Nutzung kaufen. Bitte **nicht** im Workshop empfehlen, nur erwähnen, falls jemand fragt.

## Für den Facilitator

- Der Facilitator braucht ein Konto mit höherem Limit, um die Demos R und D am Beamer sicher zu zeigen.
  Die RAG-Demo selbst braucht **kein** Modell: Sie spielt vorberechnete Daten ab.
- Wer nach Block B über 50 % des 5h-Fensters liegt (`/usage`), bekommt den Hinweis, für Übung 06 auf Haiku zu wechseln.
