# Übung 09 – Tool-Erweiterung über MCP

**Block:** C – Verifizieren & Erweitern · **Zeitbudget:** 30 Minuten

## Ziel

Den Playwright-MCP-Server einbinden und Claude einen Frontend-Fehler **selbst im Browser**
reproduzieren, beheben und verifizieren lassen.

## Konzept

Ohne Standard wäre jede Integration eine Eigenentwicklung. MCP (Model Context Protocol) trennt
Agent und Werkzeug sauber. MCP-Server laufen lokal (stdio) oder entfernt (HTTP) und gelten
pro Scope (lokal, Projekt, User). Mit `.mcp.json` im Repo hat das ganze Team dieselben Server.
`/mcp` zeigt ihren Status.

## Aufgabe

Bug: Wird eine Reservation wegen Überschneidung abgelehnt (409, Code `RR-4091`), zeigt das
Formular **keine** Meldung. Der Button wird einfach wieder aktiv.

1. `.mcp.json` im Repo-Root anlegen (Vorlage unten).
2. App starten, in **zwei weiteren Terminals**:
   ```bash
   cd app/backend && ./mvnw -q spring-boot:run       # Windows: mvnw.cmd -q spring-boot:run
   cd app/frontend && npm start                       # http://localhost:4200
   ```
3. Claude neu starten. Den Projekt-MCP-Server bestätigen, wenn gefragt. Mit `/mcp` prüfen: `playwright` ist verbunden.
4. Mit dem Prompt unten den Fehler reproduzieren, beheben und verifizieren lassen.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["app/frontend/node_modules/@playwright/mcp/cli.js", "--isolated"]
    }
  }
}
```

Kein Chrome installiert, aber Edge? Dann `"--browser", "msedge"` zu den `args` hinzufügen.

## Vorgeschlagene Prompts

```
Im Reservationsformular (http://localhost:4200) erscheint keine Meldung, wenn das Backend
eine Reservation wegen Überschneidung ablehnt (HTTP 409, Code RR-4091).
1. Reproduziere das im Browser mit dem Playwright-MCP-Server: Raum Eiger, eine Reservation
   anlegen, dann eine überschneidende zweite.
2. Behebe es: Bei Fehlern vom Backend soll eine verständliche deutsche Meldung erscheinen,
   bei 409 «Der Raum ist in diesem Zeitraum bereits belegt.»
3. Verifiziere die Meldung im Browser.
4. Ergänze einen Playwright-e2e-Test in app/frontend/e2e für diesen Fall.
Fertig ist es, wenn `npm test` und `npm run e2e` in app/frontend grün sind.
```

## Erfolgskriterium

```bash
(cd app/frontend && npm run e2e)    # grün, inkl. neuem Test für die 409-Meldung
(cd app/frontend && npm test)       # grün
```

<details>
<summary>Hinweise</summary>

- Der MCP-Server wird mit `node` statt `npx` gestartet: Das nutzt das bereits installierte
  Paket (offline) und funktioniert auf Windows ohne `cmd /c`-Umweg.
- Projekt-Server aus `.mcp.json` müssen einmal bestätigt werden. Zurücksetzen mit `claude mcp reset-project-choices`.
- Für den e2e-Test: Die überschneidende Reservation am besten im Test selbst per API anlegen
  (`request.post('http://localhost:8080/api/reservations', …)`), statt auf Seed-Daten zu bauen.
- Flaky e2e-Test? Angular läuft hier ohne Zone.js. Wartet im Test auf sichtbare Inhalte
  (`await expect(…).toBeVisible()`), bevor ihr Felder ausfüllt.
- `--headless` in den `args` blendet das Browserfenster aus, spart aber keine Tokens.

</details>

## Token-Tipp

Browser-Snapshots sind gross. Präzise Anweisungen («Raum Eiger, dann Formular») sparen
Klick-Runden. Nach der Übung den MCP-Server mit `/mcp` deaktivieren, wenn ihr ihn nicht mehr braucht:
Auch Tool-Definitionen belegen Kontext.

## Doku

- [Connect to MCP servers](https://code.claude.com/docs/en/mcp) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp-quickstart)
- Lernen: [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol) · [MCP: Advanced Topics](https://anthropic.skilljar.com/model-context-protocol-advanced-topics) (Anthropic Academy) · [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) (Anthropic Engineering Blog)
