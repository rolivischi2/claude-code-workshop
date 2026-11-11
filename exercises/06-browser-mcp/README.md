# Übung 06 – Browser über MCP

**Block:** C – Browser über MCP · **Zeitbudget:** 17 Minuten

## Ziel

Den Playwright-MCP-Server einbinden und Claude einen Frontend-Fehler **selbst im Browser**
reproduzieren, beheben und verifizieren lassen.

## Konzept

Ohne Standard wäre jede Integration eine Eigenentwicklung. MCP (Model Context Protocol) trennt
Agent und Werkzeug sauber. MCP-Server laufen lokal (stdio) oder entfernt (HTTP) und gelten
pro Scope (lokal, Projekt, User). Mit `.mcp.json` im Repo hat das ganze Team dieselben Server.
`/mcp` zeigt ihren Status.

## Aufgabe

Bug: Wird eine Transitanmeldung abgelehnt, weil die Garantie nicht reicht (409, Code `TR-4091`),
zeigt das Formular **keine** Meldung. Der Button wird einfach wieder aktiv.

Neu ist hier vor allem der **Feedback-Loop**: Claude prüft sein Ergebnis selbst, zuerst im
Browser, dann mit einem e2e-Test. Ein Agent, der seine Arbeit verifizieren kann, braucht
weniger Kontrolle durch euch.

1. `.mcp.json` im Repo-Root anlegen (Vorlage unten).
2. Die App läuft seit dem Ende von Übung 05. Falls nicht, in **zwei weiteren Terminals** starten:
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
Im Formular «Transitanmeldung erfassen» (http://localhost:4200) erscheint keine Meldung, wenn
das Backend die Anmeldung ablehnt (z.B. HTTP 409, Code TR-4091).
1. Reproduziere das im Browser mit dem Playwright-MCP-Server: Zollstelle Genève-Routes →
   «Transitanmeldung erfassen», Bestimmung Basel/Weil-Autobahn, Garantie Léman Fret Sàrl,
   Abgabenbetrag 600, Freigabe morgen.
2. Behebe es: Bei Fehlern vom Backend soll die Meldung aus dem Problem Detail (Feld detail)
   im Formular erscheinen, mit einem allgemeinen deutschen Text als Rückfallebene.
3. Verifiziere die Meldung im Browser.
4. Ergänze einen Playwright-e2e-Test in app/frontend/e2e für diesen Fall.
Fertig ist es, wenn `npm test` und `npm run e2e` in app/frontend grün sind.
```

## Erfolgskriterium

```bash
(cd app/backend && ./mvnw -q package -DskipTests)   # nur nötig, wenn das Backend nicht schon läuft
(cd app/frontend && npm run e2e)    # grün, inkl. neuem Test für die 409-Meldung
(cd app/frontend && npm test)       # grün
```

<details>
<summary>Hinweise</summary>

- Der MCP-Server wird mit `node` statt `npx` gestartet: Das nutzt das bereits installierte
  Paket (offline) und funktioniert auf Windows ohne `cmd /c`-Umweg.
- Projekt-Server aus `.mcp.json` müssen einmal bestätigt werden. Zurücksetzen mit `claude mcp reset-project-choices`.
- Für den e2e-Test: Die Seed-Daten liegen in einer In-Memory-Datenbank. Ein erfolgreicher
  Testlauf verbraucht Garantie. Den Fehlerfall darum mit einem Betrag auslösen, der **immer**
  zu hoch ist (z.B. 999999), statt auf den genauen Restbetrag zu bauen.
- Flaky e2e-Test? Angular läuft hier ohne Zone.js. Wartet im Test auf sichtbare Inhalte
  (`await expect(…).toBeVisible()`), bevor ihr Felder ausfüllt.
- `--headless` in den `args` blendet das Browserfenster aus, spart aber keine Tokens.

</details>

## Token-Tipp

Browser-Snapshots sind gross. Präzise Anweisungen («Genève-Routes, dann Formular») sparen
Klick-Runden. Nach der Übung den MCP-Server mit `/mcp` deaktivieren, wenn ihr ihn nicht mehr braucht:
Auch Tool-Definitionen belegen Kontext.

## Doku

- [Connect to MCP servers](https://code.claude.com/docs/en/mcp) · [Connect Claude Code to tools via MCP](https://code.claude.com/docs/en/mcp-quickstart)
- Lernen: [Introduction to Model Context Protocol](https://anthropic.skilljar.com/introduction-to-model-context-protocol) · [MCP: Advanced Topics](https://anthropic.skilljar.com/model-context-protocol-advanced-topics) (Anthropic Academy) · [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) (Anthropic Engineering Blog)
