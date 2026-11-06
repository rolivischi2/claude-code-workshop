#!/usr/bin/env bash
# Puts the repository into the start state of exercise NN (tag start/NN) on a branch work/NN.
# Your current changes are NOT lost: they are stashed first (git stash list to find them).
set -euo pipefail
source "$(dirname "$0")/lib.sh"
cd "$REPO_ROOT"

nn="${1:-}"
if ! [[ "$nn" =~ ^[0-9]{2}$ ]]; then
  echo "Aufruf: scripts/reset-exercise.sh NN   (z.B. scripts/reset-exercise.sh 08)"
  echo "Verfügbar: $(git tag -l 'start/*' | sed 's#start/##' | tr '\n' ' ')"
  exit 2
fi
git rev-parse -q --verify "refs/tags/start/$nn" >/dev/null || { echo "Tag start/$nn existiert nicht."; exit 2; }

if [ -n "$(git status --porcelain)" ]; then
  warn "Du hast ungespeicherte Änderungen. Sie werden gesichert (git stash), nicht gelöscht."
  read -r -p "Fortfahren? [j/N] " answer
  [[ "$answer" =~ ^[jJyY]$ ]] || { echo "Abgebrochen."; exit 1; }
  git stash push --include-untracked -m "reset-exercise $nn backup $(date +%H:%M)" >/dev/null
  ok "Änderungen gesichert: git stash list"
fi

git checkout -q -B "work/$nn" "start/$nn"
git clean -fdq   # removes untracked files only; ignored files like .env stay
ok "Stand von Übung $nn hergestellt (Branch work/$nn)"
echo "Lösung zum Vergleich: git diff work/$nn solution/$nn"
