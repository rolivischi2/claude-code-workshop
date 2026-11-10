# Übung 04 – Permissions und Hooks

**Block:** B – Steuerung · **Zeitbudget:** 15 Minuten

## Ziel

Festlegen, was Claude in diesem Projekt nie, nur auf Nachfrage oder immer darf. Danach zwei
Hooks einbinden: einer formatiert nach jedem Edit **genau die geänderte Datei**, einer
blockiert Edits an generiertem Code.

## Konzept

**Permissions:** Es braucht eine Balance zwischen Tempo und Kontrolle. Claude Code kennt
Permission-Modi (Default, Accept Edits, Plan, Auto) und `allow`/`ask`/`deny`-Regeln in
`settings.json`. Es gilt: **deny vor ask vor allow**.

**Hooks:** Eine Anweisung in der CLAUDE.md ist eine Bitte, das Modell kann sie übersehen. Was
garantiert passieren muss, gehört in einen deterministischen Mechanismus. Hooks sind Befehle,
die die Harness bei Ereignissen ausführt («nach jedem Edit», «vor einem Tool-Aufruf»). Ein
Hook kann einen Aufruf auch blockieren.

## Aufgabe

**Wichtig:** In dieser Session bis Ende Übung 05 kein `/clear` (für `/rewind`).

**Teil A – Permissions**

1. `.claude/settings.json` anlegen, **von Hand** (Vorlage unten, vorerst nur der Teil `permissions`).
   Sie gilt fürs ganze Team und wird committet.
2. Claude neu starten (`/exit`, dann `claude -c`) und mit `/permissions` prüfen.
3. Wegwerf-Ordner anlegen: `mkdir -p scratch/wegwerf`. Dann Prompt 1 und 2 absetzen und beobachten,
   was verweigert wird und wo Claude nachfragt.

**Teil B – Hooks**

4. Vorher prüfen: `(cd app/backend && ./mvnw spotless:check)` meldet `FristFormatter.java`.
5. Formatier-Hook aus der Vorlage übernehmen (er ist fertig, ihr sollt ihn lesen, nicht schreiben):
   ```bash
   mkdir -p .claude/hooks && cp exercises/04-permissions-und-hooks/vorlage/format-edited-file.mjs .claude/hooks/
   ```
6. Den Schutz-Hook von Claude bauen lassen (Prompt 3).
7. Den Teil `hooks` der Vorlage in `.claude/settings.json` ergänzen, Claude mit `/exit` und
   `claude -c` neu starten (Hooks werden beim Start geladen) und mit `/hooks` prüfen.
8. Prompt 4 und 5 absetzen.

```json
{
  "permissions": {
    "deny": [
      "Bash(git push *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ],
    "ask": [
      "Bash(rm *)"
    ]
  },
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
Zeig mir den Inhalt der Datei .env. Falls das nicht geht, versuch es mit cat im Terminal.
```

Prompt 2:
```
Pushe den aktuellen Branch mit git push origin HEAD und lösche danach das Verzeichnis scratch/wegwerf.
```

Prompt 3:
```
Erstelle den PreToolUse-Hook .claude/hooks/protect-generated.mjs (Node, nur Standardbibliothek).
Er liest das Hook-JSON von stdin. Liegt tool_input.file_path unter app/frontend/src/generated/,
schreibt er eine Begründung auf stderr und beendet sich mit Exit-Code 2, sonst mit 0.
Teste ihn, indem du Beispiel-JSON per stdin hineinpipst.
```

Prompt 4:
```
Ergänze in app/backend/src/main/java/com/example/transit/declaration/FristFormatter.java
ein Javadoc für die Methode format.
```

Prompt 5:
```
Teste unseren Schutz-Hook: Versuche, in app/frontend/src/generated/api-types.ts dem OfficeDto
ein optionales Feld description hinzuzufügen, und zeig mir die Rückmeldung des Hooks.
```

## Erfolgskriterium

- Das Lesen von `.env` wird **verweigert**, auch über `cat`. `git push` wird **verweigert**, `rm` löst eine **Rückfrage** aus.
- Der Formatier-Hook hat `FristFormatter` formatiert:
  ```bash
  cd app/backend && ./mvnw -q spotless:check     # grün
  ```
- Bei Prompt 5 ist der Edit **blockiert** worden.

<details>
<summary>Hinweise</summary>

- Read-Deny-Regeln blockieren auch `cat`, `head` und Ähnliches in Bash. **Nicht** blockiert
  ist z.B. ein Python- oder Node-Skript, das die Datei öffnet. Deny-Regeln sind eine
  Leitplanke, keine Sicherheitsgrenze. Für mehr gibt es die Bash-Sandbox und Managed Settings.
- `Bash(git push *)` trifft `git -C . push` nicht.
- Was ihr mit «don't ask again» erlaubt, landet in `.claude/settings.local.json` (persönlich, nicht committet).
- Lest `format-edited-file.mjs`: Warum nur die geänderte Datei? Ein `spotless:apply` übers
  ganze Projekt würde fremde Dateien anfassen und jeden Edit verlangsamen.
- Exit-Code 2 in einem PreToolUse-Hook blockiert, stderr geht als Begründung an Claude.
  Andere Exit-Codes blockieren **nicht**.
- Exec-Form (`command` + `args`) läuft ohne Shell. Darum funktioniert dieselbe Konfiguration auf macOS und Windows.
- Debuggen: `claude --debug hooks` zeigt, welche Hooks mit welchem Input laufen.

</details>

## Token-Tipp

Verweigerte Tool-Aufrufe kosten fast nichts. Und ein Hook arbeitet ausserhalb des Modells:
Formatieren per Hook kostet keine Tokens, «bitte formatiere danach» in jedem Prompt schon.

## Doku

- [Configure permissions](https://code.claude.com/docs/en/permissions) · [Settings files and precedence](https://code.claude.com/docs/en/settings) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing)
- [Automate actions with hooks](https://code.claude.com/docs/en/hooks-guide) · [Hooks reference](https://code.claude.com/docs/en/hooks)
