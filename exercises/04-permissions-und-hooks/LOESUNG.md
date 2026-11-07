# Lösung 04 – Permissions und Hooks

- `.claude/settings.json` (committet, gilt fürs Team), genau die Vorlage aus der Übung:
  - deny `Bash(git push *)`, `Read(./.env)`, `Read(./.env.*)`, ask `Bash(rm *)`
  - Hooks in Exec-Form (`"command": "node", "args": [...]`), beide mit Matcher `Edit|Write`
- `.claude/hooks/format-edited-file.mjs` (PostToolUse): Kopie der Vorlage, unverändert
  - `.java` unter `app/backend/src/` → `mvnw -q spotless:apply -DspotlessFiles=<Regex auf genau diese Datei>`
  - `.ts/.html/.css/.scss/.json` unter `app/frontend/` → `npx prettier --write <Datei>`
  - alles andere (Doku, `.claude/`, `rag/`) bleibt unberührt. Formatter-Fehler → Exit 2, die Meldung geht an Claude
- `.claude/hooks/protect-generated.mjs` (PreToolUse): Pfade unter `app/frontend/src/generated/` →
  Exit 2 mit Begründung auf stderr, sonst Exit 0. Der Pfad wird normalisiert, darum greift auch `src/app/../generated/`.
- `FristFormatter.java`: Javadoc für `format`, vom Hook formatiert. `./mvnw spotless:check` ist grün.

Erwartete Beobachtungen:

- Prompt 1: `Read(.env)` und `cat .env` werden verweigert. Claude meldet das und schlägt oft
  einen anderen Weg vor. Darum: Deny-Regeln sind eine Leitplanke, keine Sicherheitsgrenze.
- Prompt 2: `git push` wird verweigert, das Löschen von `scratch/wegwerf` per `rm` löst eine Rückfrage aus.
  `Read(./.env.*)` sperrt übrigens auch `.env.example`. Lieber zu streng.
- Prompt 4: Claude ergänzt das Javadoc per Edit, der Hook formatiert danach die **ganze Datei**
  (auch die präparierten Formatfehler). Nur diese eine Datei, keine fremden Diffs.
- Prompt 5: Der Edit an `api-types.ts` wird blockiert, Claude zeigt die Begründung des Hooks.

Designentscheide:

- **Node statt Shell-Skript**: Eine `.sh` läuft nicht in PowerShell, eine `.ps1` nicht auf macOS.
  Die Exec-Form startet ohne Shell, dieselbe `settings.json` gilt für alle.
- **Hook statt Bitte in der CLAUDE.md**: Formatieren und Schützen passieren garantiert und kosten keine Tokens.
- **PostToolUse kann nichts rückgängig machen.** Exit 2 meldet nur das Problem, damit Claude reagieren kann.

Testen ohne Claude:
`echo '{"tool_input":{"file_path":"app/frontend/src/generated/api-types.ts"}}' | node .claude/hooks/protect-generated.mjs; echo $?` → 2.
Settings prüfen: `claude doctor` meldet ungültige Hooks und Permission-Regeln unter «Invalid settings».
