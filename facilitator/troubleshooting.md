# Troubleshooting

## Installation

| Problem | Ursache | Lösung |
|---------|---------|--------|
| `java: command not found` / Version < 21 | kein oder altes JDK | Temurin 21: `brew install --cask temurin@21` bzw. `winget install EclipseAdoptium.Temurin.21.JDK`, Terminal neu öffnen |
| `./mvnw: Permission denied` | Executable-Bit fehlt (z.B. ZIP statt Git-Klon) | `chmod +x app/backend/mvnw` |
| `$'\r': command not found` | Skripte mit CRLF ausgecheckt | `.gitattributes` erzwingt LF. Repo neu klonen, ggf. `git config --global core.autocrlf input` |
| Windows: `running scripts is disabled on this system` | Execution Policy | `powershell -ExecutionPolicy Bypass -File scripts\setup.ps1` |
| Windows: Pfad zu lang (`Filename too long`) | MAX_PATH bei `node_modules` | `git config --global core.longpaths true`, Repo nahe am Laufwerk-Root klonen (`C:\dev\…`) |
| Nichts darf installiert werden | gesperrter Firmen-Laptop | Variante B in SETUP.md: Devcontainer (Codespaces oder Docker) |

## Proxy und Zertifikate

| Problem | Lösung |
|---------|--------|
| Maven hängt / `Connect timed out` | `HTTPS_PROXY` **vor** dem Setup setzen. Das Skript übersetzt ihn in `MAVEN_OPTS`. Mit Benutzer/Passwort zusätzlich `-Dhttps.proxyUser=… -Dhttps.proxyPassword=…` in `MAVEN_OPTS`. |
| npm `ETIMEDOUT` / `ECONNRESET` | `HTTPS_PROXY` gesetzt? Sonst `npm config set proxy …` und `https-proxy …` |
| `PKIX path building failed` (Maven) | Firmen-CA fehlt im JDK: `keytool -importcert -cacerts -alias firma -file firma-ca.crt` |
| `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` (npm, Playwright, Claude Code) | `NODE_EXTRA_CA_CERTS=/pfad/firma-ca.pem` |
| Playwright-Browser-Download scheitert | `HTTPS_PROXY` setzen, `cd app/frontend && npx playwright install chromium` |

## Login und Abo

| Problem | Lösung |
|---------|--------|
| `/status` zeigt API-Key statt claude.ai | `ANTHROPIC_API_KEY` aus der Shell entfernen (auch in `~/.zshrc`, Windows-Umgebungsvariablen), dann `/logout`, `/login` |
| Login-Browserfenster öffnet nicht | URL aus dem Terminal manuell öffnen, Code zurückkopieren |
| «Usage limit reached» | siehe [fallback.md](fallback.md) |

## Während der Übungen

| Problem | Übung | Lösung |
|---------|-------|--------|
| Port 8080 belegt | 06 | Alten Backend-Prozess beenden (`lsof -i :8080` bzw. `netstat -ano \| findstr 8080`) |
| Playwright MCP startet nicht | 06 | Kein Chrome? `"--browser", "msedge"` in `.mcp.json`. Im Devcontainer `"--headless"` ergänzen. `/mcp` zeigt den Fehler. |
| e2e-Test flaky | 06 | Angular läuft zoneless: Im Test auf sichtbare Inhalte warten, bevor Felder gefüllt werden |
| Hook läuft nicht | 04 | `/hooks` prüfen, `claude --debug hooks`. JSON in `settings.json` valide? Nach Änderung Session neu starten. |
| Hook: `spawnSync mvnw.cmd EINVAL` | 04 | Windows braucht `shell: true` für `.cmd` (im Referenz-Hook gelöst) |
| `/rewind` zeigt nichts | 05 | Andere Session als in 04 (z.B. nach `/clear`). Dann direkt mit Git zeigen. |
| Projekt-MCP-Server erscheint nicht | 06 | Nicht bestätigt? `claude mcp reset-project-choices`, Session neu starten |
| TR-4091 kommt nicht (mehr) | 06 | Garantie G3 schon ausgeschöpft oder Backend neu gestartet? Mit Betrag 999999 auslösen, das ist immer zu hoch. |
| Teilnehmer hängt hinterher | alle | `scripts/reset-exercise.sh NN` (sichert eigene Änderungen per `git stash`) |
