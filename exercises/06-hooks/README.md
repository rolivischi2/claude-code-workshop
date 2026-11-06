# Übung 06 – Deterministisch statt probabilistisch: Hooks

**Block:** B – Steuerung & Sicherheit · **Zeitbudget:** 25 Minuten

## Ziel

Zwei Hooks bauen: einer formatiert nach jedem Edit **genau die geänderte Datei**, einer
blockiert Edits an generiertem Code.

## Konzept

Eine Anweisung in der CLAUDE.md ist eine Bitte, das Modell kann sie übersehen. Was garantiert
passieren muss, gehört in einen deterministischen Mechanismus. Hooks sind Befehle, die die
Harness bei Ereignissen ausführt, z.B. «nach jedem Edit» oder «vor einem Tool-Aufruf». Ein
Hook kann einen Aufruf auch blockieren.

## Aufgabe

1. **Vorher prüfen:** `(cd app/backend && ./mvnw spotless:check)` muss `DurationFormatter.java` melden.
   Ist die Datei schon formatiert (z.B. weil Claude in Übung 03/04 das ganze Projekt formatiert hat),
   den Originalzustand zurückholen:
   `git checkout start/00 -- app/backend/src/main/java/com/example/raumreservation/reservation/DurationFormatter.java`
2. **Wichtig:** In dieser Session bis Ende Übung 07 kein `/clear` (für `/rewind`).
3. Hook-Skripte von Claude bauen lassen (Prompt 1). Sie sind in Node geschrieben und laufen
   deshalb gleich auf macOS und Windows.
   - `.claude/hooks/format-edited-file.mjs`: liest das Hook-JSON von stdin
     (`tool_input.file_path`) und formatiert nur diese Datei.
     - `.java` → `./mvnw -q spotless:apply -DspotlessFiles=<Regex auf die Datei>` in `app/backend`
     - `.ts`, `.html`, `.css`, `.scss` unter `app/frontend` → `npx prettier --write <Datei>` in `app/frontend`
   - `.claude/hooks/protect-generated.mjs`: Pfad unter `app/frontend/src/generated/` → Meldung auf stderr und **Exit-Code 2** (blockiert).
4. Hooks in `.claude/settings.json` eintragen (Vorlage unten), zu den Permissions aus Übung 05 dazu.
5. Claude mit `/exit` beenden und mit `claude -c` fortsetzen: Hooks werden beim Start geladen,
   Verlauf und Checkpoints bleiben erhalten. `/hooks` zeigt die aktiven Hooks. Dann Prompt 2 und 3.

```json
{
  "permissions": { "…": "aus Übung 05" },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "node", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/format-edited-file.mjs"] }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "node", "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/protect-generated.mjs"] }
        ]
      }
    ]
  }
}
```

## Vorgeschlagene Prompts

Prompt 1:
```
Erstelle die zwei Hook-Skripte .claude/hooks/format-edited-file.mjs und
.claude/hooks/protect-generated.mjs gemäss exercises/06-hooks/README.md. Nur Node-Standardbibliothek,
keine Abhängigkeiten. Teste beide, indem du Beispiel-JSON per stdin hineinpipst.
```

Prompt 2:
```
Ergänze in app/backend/src/main/java/com/example/raumreservation/reservation/DurationFormatter.java
ein Javadoc für die Methode format.
```

Prompt 3:
```
Teste unseren Schutz-Hook: Versuche trotz des Generator-Hinweises, in
app/frontend/src/generated/api-types.ts dem RoomDto ein optionales Feld description
hinzuzufügen, und zeig mir die Rückmeldung des Hooks.
```

## Erfolgskriterium

```bash
cd app/backend && ./mvnw -q spotless:check     # grün: der Hook hat DurationFormatter formatiert
```

…und bei Prompt 3 habt ihr gesehen, wie der Edit **blockiert** wurde.

<details>
<summary>Hinweise</summary>

- Meldet `spotless:check` auch Dateien aus euren Übungen 03/04, sind diese vor dem Hook entstanden.
  Formatiert sie gezielt (z.B. `./mvnw -q spotless:apply -DspotlessFiles='.*Waitlist.*'`), aber **nicht**
  `DurationFormatter`, oder springt mit `scripts/reset-exercise.sh 06` auf den Referenzstand.
- Warum nur die geänderte Datei? Ein `spotless:apply` übers ganze Projekt würde fremde
  Dateien anfassen und jeden Edit verlangsamen.
- Exit-Code 2 in einem PreToolUse-Hook blockiert. stderr geht als Begründung an Claude.
  Andere Exit-Codes blockieren **nicht**.
- Exec-Form (`command` + `args`) läuft ohne Shell. Darum funktioniert dieselbe Konfiguration
  auf macOS und Windows.
- Debuggen: `claude --debug hooks` zeigt, welche Hooks mit welchem Input laufen.

</details>

## Token-Tipp

Ein Hook arbeitet ausserhalb des Modells. Formatieren per Hook kostet keine Tokens, «bitte formatiere danach» in jedem Prompt schon.

## Doku

- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide) · [Hooks reference](https://code.claude.com/docs/en/hooks)
- Lernen: [Claude Code in Action](https://anthropic.skilljar.com/claude-code-in-action) (Anthropic Academy, behandelt Hooks)
