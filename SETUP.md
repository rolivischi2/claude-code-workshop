# Setup

Bitte **vor dem Workshop** erledigen (ca. 30 Minuten, das meiste ist Download).
Danach läuft alles offline.

## 1. Voraussetzungen

| Werkzeug | Version | Prüfen mit | Installation |
|----------|---------|------------|--------------|
| Git | aktuell | `git --version` | macOS: `xcode-select --install` · Windows: [Git for Windows](https://git-scm.com/download/win) (inkl. Git Bash) |
| Java (JDK) | 21 oder neuer | `java -version` | z.B. Eclipse Temurin 21 über `brew install --cask temurin@21` bzw. `winget install EclipseAdoptium.Temurin.21.JDK` |
| Node.js | 22.22 oder 24.15 und neuer (LTS) | `node --version` | [nodejs.org](https://nodejs.org) bzw. `brew install node` / `winget install OpenJS.NodeJS.LTS` |
| uv (Python) | aktuell | `uv --version` | `brew install uv` bzw. `winget install astral-sh.uv` ([Doku](https://docs.astral.sh/uv/getting-started/installation/)) |
| Chrome oder Edge | aktuell | – | Für Übung 09 (Playwright MCP). Edge ist auf Windows vorinstalliert. |
| Claude Code | aktuell | `claude --version` | siehe Schritt 2 |

Maven und Python müsst ihr **nicht** installieren: Das Backend bringt den Maven-Wrapper mit,
und `uv` lädt Python 3.12 selbst.

## 2. Claude Code installieren und einloggen

Installation gemäss [Quickstart](https://code.claude.com/docs/en/quickstart):

```bash
curl -fsSL https://claude.ai/install.sh | bash        # macOS / Linux / WSL
irm https://claude.ai/install.ps1 | iex               # Windows PowerShell
```

Dann im Repo `claude` starten und mit eurem **claude.ai-Konto (Pro)** einloggen:

```
/login      → «Claude account with subscription» wählen
/status     → zeigt Konto und Login-Methode
```

> **Wichtig:** Kein API-Key. Falls `ANTHROPIC_API_KEY` in eurer Shell gesetzt ist, nimmt
> Claude Code diesen statt eures Abos. Variable entfernen und `/login` erneut ausführen.
> Remote Control (Übung 14) funktioniert nur mit claude.ai-Login.

## 3. Privatsphäre prüfen

Bei Pro-Konten entscheidet ihr selbst, ob eure Chats und Claude-Code-Sessions zur
Modellverbesserung verwendet werden dürfen. Die Einstellung gilt auch für Claude Code.

→ [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls)
öffnen und bewusst entscheiden. Im Workshop arbeiten wir nur mit synthetischen Daten,
im Projektalltag gelten eure Teamregeln.

Hintergrund: [Data usage](https://code.claude.com/docs/en/data-usage)

## 4. Repo klonen und Setup ausführen

```bash
git clone <repo-url> claude-code-workshop      # URL aus der Einladung
cd claude-code-workshop
scripts/setup.sh                 # macOS / Linux / Git Bash
```

```powershell
git clone <repo-url> claude-code-workshop
cd claude-code-workshop
powershell -ExecutionPolicy Bypass -File scripts\setup.ps1     # Windows
```

Das Skript lädt Maven-Abhängigkeiten, npm-Pakete, den Playwright-Browser und das
Embedding-Modell (~220 MB), baut den Suchindex und erzeugt eine `.env` mit **Fake-Werten**.
Es lässt sich beliebig oft wiederholen.

### Hinter einem Firmen-Proxy

Proxy **vor** dem Skript setzen. Das Skript gibt ihn auch an Maven weiter (Maven liest die
Variablen sonst nicht):

```bash
export HTTPS_PROXY=http://proxy.firma.example:8080
export HTTP_PROXY=$HTTPS_PROXY
export NO_PROXY=localhost,127.0.0.1
```

```powershell
$env:HTTPS_PROXY = "http://proxy.firma.example:8080"
$env:HTTP_PROXY  = $env:HTTPS_PROXY
$env:NO_PROXY    = "localhost,127.0.0.1"
```

## 5. Prüfen

```bash
scripts/check-setup.sh           # Windows: powershell -ExecutionPolicy Bypass -File scripts\check-setup.ps1
```

Alles grün? Dann seid ihr bereit. Den Rest prüfen wir gemeinsam in [Übung 00](exercises/00-setup-check/).

## Probleme?

| Symptom | Lösung |
|---------|--------|
| `mvnw: Permission denied` | `chmod +x app/backend/mvnw` |
| Maven/npm hängt oder `ETIMEDOUT` | Proxy setzen (siehe oben) und Skript erneut starten |
| `UNABLE_TO_GET_ISSUER_CERT` / `PKIX path building failed` | Firmen-Zertifikat fehlt: `NODE_EXTRA_CA_CERTS` setzen bzw. Zertifikat ins JDK importieren, Facilitators fragen |
| Windows: `running scripts is disabled` | Mit `powershell -ExecutionPolicy Bypass -File ...` starten (wie oben) |
| Windows: `$'\r': command not found` in Git Bash | `git config core.autocrlf input`, dann Repo neu klonen |
| Login zeigt «API key» statt Abo | `ANTHROPIC_API_KEY` entfernen, `/logout`, `/login` |

Weitere Hilfe: [Troubleshoot installation and login](https://code.claude.com/docs/en/troubleshoot-install)
