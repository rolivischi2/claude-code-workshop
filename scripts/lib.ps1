# Shared helpers for the workshop scripts (dot-sourced). Compatible with Windows PowerShell 5.1 and PowerShell 7.
$ErrorActionPreference = 'Continue'
$script:RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$script:Failures = New-Object System.Collections.Generic.List[string]
$script:IsWin = ($env:OS -eq 'Windows_NT')

function Write-Ok($msg)   { Write-Host "[OK]   $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "[FEHL] $msg" -ForegroundColor Red; $script:Failures.Add($msg) }
function Write-Warn($msg) { Write-Host "[!]    $msg" -ForegroundColor Yellow }
function Write-Section($msg) { Write-Host ""; Write-Host "== $msg ==" -ForegroundColor Cyan }

# Runs a native command quietly; on failure shows the last lines and a hint.
function Invoke-Step {
    param([string]$Name, [string]$Hint, [string]$Command, [string[]]$Arguments)
    $log = New-TemporaryFile
    & $Command @Arguments *> $log
    if ($LASTEXITCODE -eq 0) { Write-Ok $Name }
    else {
        Write-Fail $Name
        Get-Content $log -Tail 15 | ForEach-Object { Write-Host "    $_" }
        if ($Hint) { Write-Host "    Tipp: $Hint" -ForegroundColor Yellow }
    }
    Remove-Item $log -ErrorAction SilentlyContinue
}

# The Maven wrapper differs per OS.
function Get-Mvnw { if ($script:IsWin) { '.\mvnw.cmd' } else { './mvnw' } }

# Maven/Java ignore HTTP(S)_PROXY. Translate them into JVM system properties.
function Set-MavenProxy {
    $opts = ''
    foreach ($scheme in 'http', 'https') {
        $url = [Environment]::GetEnvironmentVariable("$($scheme.ToUpper())_PROXY")
        if (-not $url) { $url = [Environment]::GetEnvironmentVariable("$($scheme)_proxy") }
        if (-not $url) { continue }
        try { $uri = [Uri]$url } catch { Write-Warn "Proxy-URL nicht lesbar: $url"; continue }
        $port = if ($uri.Port -gt 0) { $uri.Port } else { 8080 }
        $opts += " -D$scheme.proxyHost=$($uri.Host) -D$scheme.proxyPort=$port"
    }
    $noProxy = $env:NO_PROXY
    if ($noProxy -and $opts) { $opts += " -Dhttp.nonProxyHosts=$($noProxy -replace ',', '|')" }
    if ($opts) {
        $env:MAVEN_OPTS = "$env:MAVEN_OPTS$opts"
        Write-Ok "Proxy erkannt, Maven verwendet:$opts"
    }
}

function Get-Major([string]$version) {
    if ($version -match '(\d+)') { [int]$Matches[1] } else { 0 }
}

function Get-JavaMajor {
    $line = (& java -version 2>&1 | Select-Object -First 1) | Out-String
    if ($line -match '"(\d+)') { [int]$Matches[1] } else { 0 }
}

function Write-Summary([string]$next) {
    Write-Host ""
    if ($script:Failures.Count -eq 0) { Write-Host "Alles bereit. $next" -ForegroundColor Green; return 0 }
    Write-Host "$($script:Failures.Count) Schritt(e) fehlgeschlagen:" -ForegroundColor Red
    $script:Failures | ForEach-Object { Write-Host "  - $_" }
    Write-Host "Hilfe: facilitator/troubleshooting.md bzw. SETUP.md (Abschnitt Probleme)"
    return 1
}
