# Lösung 06 – Browser über MCP

- `.mcp.json` im Repo-Root: Playwright-MCP über `node app/frontend/node_modules/@playwright/mcp/cli.js --isolated`
- `app/frontend/src/app/declaration-form/server-error-message.ts`: macht aus einem Backend-Fehler
  eine Meldung. Zuerst die Feldfehler (`errors`), dann `detail` aus dem Problem Detail, sonst ein
  deutscher Text nach HTTP-Status (0, 400, 404, 409, Rest)
- `declaration-form.ts/.html`: Signal `serverError`, Anzeige mit `role="alert"` und
  `data-testid="server-error"`, wird beim nächsten Absenden zurückgesetzt
- Tests: `server-error-message.spec.ts` (Unit) und `e2e/declaration-guarantee-exceeded.spec.ts` (Playwright)

Designentscheide:

- **Reine Funktion** für die Meldung: ohne TestBed testbar, die Komponente bleibt dünn.
- **`detail` direkt anzeigen**: Das Backend schreibt seine Meldungen schon auf Deutsch und mit
  Kontext («noch verfügbar: CHF 500.00»). Eine eigene Übersetzung pro Code wäre doppelte Pflege.
  Ausnahme: Bei Validierungsfehlern ist `detail` englisch («Request validation failed»), dort zählen die deutschen Feldmeldungen.
- Der e2e-Test nutzt **999999**: immer zu hoch, verbraucht nie Garantie. Er läuft darum auch
  mehrmals hintereinander gegen dasselbe Backend (`reuseExistingServer`).
- Vor dem Ausfüllen wartet der Test auf die Überschrift. Ohne Zone.js sind die Felder sonst
  manchmal schon sichtbar, die Optionen aber noch nicht geladen.
- Gegenprobe: Ohne den Fix in der Komponente scheitert der neue e2e-Test (`server-error` nicht gefunden).

Typischer Ablauf mit Playwright-MCP: `browser_navigate` → `browser_snapshot` → Formular ausfüllen
→ Absenden → keine Meldung (Bug bestätigt) → Fix → erneut im Browser prüfen → e2e-Test schreiben
→ `npm test` und `npm run e2e`. Der e2e-Lauf braucht das Backend-Jar (`./mvnw -q package -DskipTests`).
