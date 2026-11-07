#!/usr/bin/env bash
# Facilitator check: every start/NN tag and solution/NN branch must build and pass its tests.
# Each ref is checked out into a temporary git worktree, so your working copy stays untouched.
#
#   scripts/verify-all.sh            # backend verify, settings schema, spotless, frontend unit tests
#   scripts/verify-all.sh --e2e      # additionally Playwright e2e (slower, starts backend + frontend per ref)
#   scripts/verify-all.sh solution/04 start/05   # only these refs
#
# Requires a completed scripts/setup.sh in this checkout (node_modules, Maven cache).
# The RAG demo (rag/) is facilitator-only and is not part of the exercise chain.
set -uo pipefail
source "$(dirname "$0")/lib.sh"
cd "$REPO_ROOT"

E2E=0
REFS=()
for arg in "$@"; do
  case "$arg" in
    --e2e) E2E=1 ;;
    *) REFS+=("$arg") ;;
  esac
done
if [ ${#REFS[@]} -eq 0 ]; then
  while IFS= read -r ref; do REFS+=("$ref"); done < <(
    { git tag -l 'start/*'; git branch --format='%(refname:short)' --list 'solution/*'; } | sort -t/ -k2,2V -k1,1r)
fi
[ ${#REFS[@]} -gt 0 ] || { echo "No start/* or solution/* refs found."; exit 1; }
[ -d app/frontend/node_modules ] || { echo "Run scripts/setup.sh first (node_modules missing)."; exit 1; }

WORK="$(mktemp -d "${TMPDIR:-/tmp}/verify-all.XXXXXX")"
trap 'git worktree prune; rm -rf "$WORK"' EXIT
MAIN_LOCK="$(git hash-object app/frontend/package-lock.json)"
RESULTS=()

check() {  # check <label> <dir> <command...>  -> prints ok/FAIL, returns status
  local label="$1" dir="$2"; shift 2
  local log="$WORK/last.log"
  if (cd "$dir" && "$@") >"$log" 2>&1; then echo "ok"; return 0; fi
  echo "FAIL"
  { echo "--- $label failed:"; tail -n 20 "$log"; } >&2
  return 1
}

for ref in "${REFS[@]}"; do
  section "$ref"
  wt="$WORK/$(echo "$ref" | tr '/' '_')"
  if ! git worktree add -q --detach "$wt" "$ref" 2>/dev/null; then
    RESULTS+=("$(printf '%-16s %s' "$ref" 'checkout FAILED')"); continue
  fi

  backend=$(check backend "$wt/app/backend" ./mvnw -B -q -o verify)

  # Claude Code settings (permissions, hooks) must pass the schema check of `claude doctor`.
  settings="-"
  if [ -f "$wt/.claude/settings.json" ] && command -v claude >/dev/null; then
    if (cd "$wt" && claude doctor </dev/null 2>&1) | grep -q "Invalid settings"; then
      settings="FAIL"; (cd "$wt" && claude doctor </dev/null 2>&1) | grep -A3 "Invalid settings" >&2
    else settings="ok"; fi
  fi

  # Formatting must be clean once the hook exercise (04) is solved (seeded violation before that).
  case "$ref" in
    */final) nn=99 ;;
    *) nn=$(echo "$ref" | sed -nE 's#.*/([0-9]+)$#\1#p'); nn=$((10#${nn:-0})) ;;
  esac
  spotless="-"
  if [[ "$ref" == solution/* && $nn -ge 4 ]] || [[ "$ref" == start/* && $nn -ge 5 ]]; then
    spotless=$(check spotless "$wt/app/backend" ./mvnw -B -q -o spotless:check)
  fi

  if [ "$(git -C "$wt" hash-object app/frontend/package-lock.json)" = "$MAIN_LOCK" ]; then
    ln -s "$REPO_ROOT/app/frontend/node_modules" "$wt/app/frontend/node_modules"
  else
    (cd "$wt/app/frontend" && npm ci --prefer-offline --no-audit --no-fund >/dev/null 2>&1)
  fi
  frontend=$(check frontend "$wt/app/frontend" npm test)
  e2e="-"
  [ $E2E -eq 1 ] && e2e=$(check e2e "$wt/app/frontend" npm run e2e)

  RESULTS+=("$(printf '%-16s backend=%-4s settings=%-4s spotless=%-4s frontend=%-4s e2e=%-4s' \
    "$ref" "$backend" "$settings" "$spotless" "$frontend" "$e2e")")
  [[ "$backend$settings$spotless$frontend$e2e" == *FAIL* ]] && FAILURES+=("$ref")
  git worktree remove --force "$wt"
done

section "Summary"
printf '%s\n' "${RESULTS[@]}"
summary "Alle Refs geprüft."
