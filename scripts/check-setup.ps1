# Verifies that everything needed for the workshop is in place. Runs offline after setup.
. (Join-Path $PSScriptRoot 'lib.ps1')
Set-Location $RepoRoot

Write-Section 'Werkzeuge'
if ((Get-Command java -ErrorAction SilentlyContinue) -and (Get-JavaMajor) -ge 21) { Write-Ok "Java $(Get-JavaMajor)" }
else { Write-Fail 'Java 21+ nicht gefunden' }
if ((Get-Command node -ErrorAction SilentlyContinue) -and (Get-Major (node --version)) -ge 22) { Write-Ok "Node $(node --version)" }
else { Write-Fail 'Node 22+ nicht gefunden' }
if (Get-Command uv -ErrorAction SilentlyContinue) { Write-Ok 'uv' } else { Write-Fail 'uv nicht gefunden' }
if (Get-Command claude -ErrorAction SilentlyContinue) {
    Write-Ok 'Claude Code'
    try {
        $auth = (claude auth status --json 2>$null | Out-String) | ConvertFrom-Json
        if (-not $auth.loggedIn) { Write-Fail "Nicht eingeloggt: 'claude' starten und /login ausfuehren" }
        elseif ($auth.authMethod -eq 'claude.ai') { Write-Ok "Eingeloggt mit claude.ai-Konto (Abo: $($auth.subscriptionType))" }
        else { Write-Fail "Login ueber $($auth.authMethod) statt claude.ai-Abo: in Claude Code /login ausfuehren (siehe SETUP.md)" }
    } catch { Write-Warn 'Login-Status nicht lesbar: in Claude Code /status pruefen' }
} else { Write-Fail 'Claude Code nicht gefunden' }

# Playwright MCP (exercise 09) drives an installed Chrome or Edge, not the Playwright Chromium.
$chromePaths = @("$env:ProgramFiles\Google\Chrome\Application\chrome.exe", "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe", "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe", '/Applications/Google Chrome.app')
$edgePaths = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe", '/Applications/Microsoft Edge.app')
if ($chromePaths | Where-Object { $_ -and (Test-Path $_) }) { Write-Ok 'Google Chrome gefunden (fuer Playwright MCP, Uebung 09)' }
elseif ($edgePaths | Where-Object { $_ -and (Test-Path $_) }) { Write-Ok 'Microsoft Edge gefunden (Uebung 09: Variante mit --browser msedge verwenden)' }
else { Write-Warn 'Weder Chrome noch Edge gefunden: Uebung 09 (Playwright MCP) braucht einen der beiden' }

Write-Section 'Projekt'
if (Test-Path '.env') { Write-Ok '.env vorhanden (Fake-Werte)' } else { Write-Fail '.env fehlt - scripts\setup.ps1 ausfuehren' }
Set-Location (Join-Path $RepoRoot 'app/backend')
Invoke-Step 'Backend-Tests (offline)' 'scripts\setup.ps1 ausfuehren' (Get-Mvnw) @('-B', '-q', '-o', 'test')
Set-Location (Join-Path $RepoRoot 'app/frontend')
Invoke-Step 'Frontend-Tests' 'scripts\setup.ps1 ausfuehren' 'npm' @('test')
Set-Location $RepoRoot
if (Test-Path 'rag/.data/index.db') { Write-Ok 'RAG-Index vorhanden' } else { Write-Fail 'RAG-Index fehlt - scripts\setup.ps1 ausfuehren' }

Write-Section 'Manuell pruefen (in Claude Code)'
Write-Host "  1. claude.ai > Settings > Privacy: Einstellung zur Modellverbesserung geprueft (siehe SETUP.md)"
Write-Host "  2. '/context' einmal ausfuehren und den Startverbrauch notieren"

exit (Write-Summary 'Du bist bereit fuer den Workshop.')
