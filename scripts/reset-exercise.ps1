# Puts the repository into the start state of exercise NN (tag start/NN) on a branch work/NN.
# Your current changes are NOT lost: they are stashed first (git stash list to find them).
param([string]$Exercise)
. (Join-Path $PSScriptRoot 'lib.ps1')
Set-Location $RepoRoot

if ($Exercise -notmatch '^\d{2}$') {
    Write-Host 'Aufruf: scripts\reset-exercise.ps1 NN   (z.B. scripts\reset-exercise.ps1 03)'
    Write-Host "Verfuegbar: $((git tag -l 'start/*') -replace 'start/', '' -join ' ')"
    exit 2
}
git rev-parse -q --verify "refs/tags/start/$Exercise" *> $null
if ($LASTEXITCODE -ne 0) { Write-Host "Tag start/$Exercise existiert nicht."; exit 2 }

if (git status --porcelain) {
    Write-Warn 'Du hast ungespeicherte Aenderungen. Sie werden gesichert (git stash), nicht geloescht.'
    $answer = Read-Host 'Fortfahren? [j/N]'
    if ($answer -notmatch '^[jJyY]$') { Write-Host 'Abgebrochen.'; exit 1 }
    git stash push --include-untracked -m "reset-exercise $Exercise backup $(Get-Date -Format HH:mm)" | Out-Null
    Write-Ok 'Aenderungen gesichert: git stash list'
}

git checkout -q -B "work/$Exercise" "start/$Exercise"
git clean -fdq   # removes untracked files only; ignored files like .env stay
Write-Ok "Stand von Uebung $Exercise hergestellt (Branch work/$Exercise)"
Write-Host "Loesung zum Vergleich: git diff work/$Exercise origin/solution/$Exercise"
