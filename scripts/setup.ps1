# Installs all dependencies and pre-caches everything so the workshop works offline afterwards.
# Honours HTTP_PROXY / HTTPS_PROXY / NO_PROXY. Safe to run multiple times.
. (Join-Path $PSScriptRoot 'lib.ps1')
Set-Location $RepoRoot

Write-Section 'Voraussetzungen'
if (Get-Command git -ErrorAction SilentlyContinue) { Write-Ok 'git' } else { Write-Fail 'git fehlt' }
if (Get-Command java -ErrorAction SilentlyContinue) {
    $jv = Get-JavaMajor
    if ($jv -ge 21) { Write-Ok "Java $jv" } else { Write-Fail "Java $jv gefunden, mindestens 21 noetig" }
} else { Write-Fail 'Java fehlt (JDK 21 oder neuer installieren)' }
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nv = Get-Major (node --version)
    if ($nv -ge 22) { Write-Ok "Node $(node --version)" } else { Write-Fail "Node $(node --version) zu alt, mindestens 22 noetig" }
} else { Write-Fail 'Node.js fehlt (LTS 22 oder neuer installieren)' }
if (Get-Command uv -ErrorAction SilentlyContinue) { Write-Ok 'uv' } else { Write-Fail 'uv fehlt (siehe SETUP.md)' }
if (Get-Command claude -ErrorAction SilentlyContinue) { Write-Ok 'Claude Code' }
else { Write-Warn 'Claude Code nicht gefunden (siehe SETUP.md) - Setup laeuft trotzdem weiter' }
if ($Failures.Count -gt 0) { Write-Summary ''; exit 1 }

Write-Section 'Proxy'
if ($env:HTTPS_PROXY -or $env:HTTP_PROXY -or $env:https_proxy -or $env:http_proxy) { Set-MavenProxy }
else { Write-Ok 'Kein Proxy gesetzt' }
$proxyHint = 'Hinter einem Firmen-Proxy? $env:HTTPS_PROXY = "http://proxy:8080" setzen und Skript erneut starten.'

Write-Section 'Backend (Maven)'
Set-Location (Join-Path $RepoRoot 'app/backend')
$mvnw = Get-Mvnw
Invoke-Step 'Maven-Abhaengigkeiten laden' $proxyHint $mvnw @('-B', '-q', 'dependency:go-offline')
Invoke-Step 'Backend bauen und testen' '' $mvnw @('-B', '-q', 'verify')
Invoke-Step 'Formatter (Spotless) vorladen' $proxyHint $mvnw @('-B', '-q', 'spotless:check', '-DspotlessFiles=.*RaumreservationApplication\.java')

Write-Section 'Frontend (npm)'
Set-Location (Join-Path $RepoRoot 'app/frontend')
Invoke-Step 'npm-Pakete installieren' $proxyHint 'npm' @('ci', '--no-audit', '--no-fund')
Invoke-Step 'Playwright-Browser (Chromium) installieren' $proxyHint 'npx' @('playwright', 'install', 'chromium')
Invoke-Step 'Frontend-Tests' '' 'npm' @('test')

Write-Section 'RAG (Python/uv)'
Set-Location (Join-Path $RepoRoot 'rag')
Invoke-Step 'Python-Umgebung (uv sync)' $proxyHint 'uv' @('sync', '-q')
Invoke-Step 'Embedding-Modell herunterladen (~220 MB)' $proxyHint 'uv' @('run', '-q', 'index', '--download-only')
Invoke-Step 'Suchindex aufbauen' '' 'uv' @('run', '-q', 'index')

Write-Section 'Konfiguration'
Set-Location $RepoRoot
if (Test-Path '.env') { Write-Ok '.env existiert bereits' }
else { Copy-Item '.env.example' '.env'; Write-Ok '.env aus .env.example erzeugt (nur Fake-Werte)' }

exit (Write-Summary 'Weiter mit: scripts\check-setup.ps1')
