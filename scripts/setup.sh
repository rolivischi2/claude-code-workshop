#!/usr/bin/env bash
# Installs all dependencies and pre-caches everything so the workshop works offline afterwards.
# Honours HTTP_PROXY / HTTPS_PROXY / NO_PROXY. Safe to run multiple times.
set -uo pipefail
source "$(dirname "$0")/lib.sh"
cd "$REPO_ROOT"

section "Voraussetzungen"
command -v git >/dev/null && ok "git $(git --version | awk '{print $3}')" || fail "git fehlt"
if command -v java >/dev/null; then
  jv="$(java -version 2>&1 | head -1 | sed -E 's/.*"([0-9]+).*/\1/')"
  [ "$jv" -ge 21 ] && ok "Java $jv" || fail "Java $jv gefunden, mindestens 21 nötig"
else fail "Java fehlt (JDK 21 oder neuer installieren)"; fi
if command -v node >/dev/null; then
  node_supported && ok "Node $(node --version)" || fail "Node $(node --version) passt nicht, nötig: $NODE_REQUIRED"
else fail "Node.js fehlt (nötig: $NODE_REQUIRED)"; fi
command -v claude >/dev/null && ok "Claude Code $(claude --version 2>/dev/null | awk '{print $1}')" \
  || warn "Claude Code nicht gefunden (siehe SETUP.md) - Setup läuft trotzdem weiter"
if [ ${#FAILURES[@]} -gt 0 ]; then summary ""; exit 1; fi

section "Proxy"
if [ -n "${HTTPS_PROXY:-${https_proxy:-}}${HTTP_PROXY:-${http_proxy:-}}" ]; then configure_maven_proxy
else ok "Kein Proxy gesetzt"; fi
PROXY_HINT="Hinter einem Firmen-Proxy? HTTPS_PROXY setzen (z.B. export HTTPS_PROXY=http://proxy:8080) und Skript erneut starten."

section "Backend (Maven)"
cd "$REPO_ROOT/app/backend"
run_step "Maven-Abhängigkeiten laden" "$PROXY_HINT" ./mvnw -B -q dependency:go-offline
run_step "Backend bauen und testen" "" ./mvnw -B -q verify
run_step "Formatter (Spotless) vorladen" "$PROXY_HINT" \
  ./mvnw -B -q spotless:check -DspotlessFiles='.*TransitApplication\.java'

section "Frontend (npm)"
cd "$REPO_ROOT/app/frontend"
run_step "npm-Pakete installieren" "$PROXY_HINT" npm ci --no-audit --no-fund
run_step "Playwright-Browser (Chromium) installieren" "$PROXY_HINT" npx playwright install chromium
run_step "Frontend-Tests" "" npm test

section "Konfiguration"
cd "$REPO_ROOT"
if [ -f .env ]; then ok ".env existiert bereits"
else cp .env.example .env && ok ".env aus .env.example erzeugt (nur Fake-Werte)"; fi

summary "Weiter mit: scripts/check-setup.sh"
