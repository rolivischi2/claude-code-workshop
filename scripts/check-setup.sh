#!/usr/bin/env bash
# Verifies that everything needed for the workshop is in place. Runs offline after setup.
set -uo pipefail
source "$(dirname "$0")/lib.sh"
cd "$REPO_ROOT"

section "Werkzeuge"
jv="$(java -version 2>&1 | head -1 | sed -E 's/.*"([0-9]+).*/\1/')"
[ "${jv:-0}" -ge 21 ] 2>/dev/null && ok "Java $jv" || fail "Java 21+ nicht gefunden"
nv="$(version_major "$(node --version 2>/dev/null || echo v0)")"
[ "$nv" -ge 22 ] && ok "Node $(node --version)" || fail "Node 22+ nicht gefunden"
command -v uv >/dev/null && ok "uv" || fail "uv nicht gefunden"
if command -v claude >/dev/null; then
  ok "Claude Code $(claude --version 2>/dev/null | awk '{print $1}')"
  auth="$(claude auth status --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
      try { const a = JSON.parse(s);
        console.log(!a.loggedIn ? "none" : a.authMethod === "claude.ai" ? "ok " + (a.subscriptionType || "?") : "other " + a.authMethod);
      } catch { console.log("unknown"); } });')"
  case "$auth" in
    ok*)    ok "Eingeloggt mit claude.ai-Konto (Abo: ${auth#ok })" ;;
    other*) fail "Login über ${auth#other } statt claude.ai-Abo: in Claude Code /login ausführen (siehe SETUP.md)" ;;
    none)   fail "Nicht eingeloggt: 'claude' starten und /login ausführen" ;;
    *)      warn "Login-Status nicht lesbar: in Claude Code /status prüfen" ;;
  esac
else fail "Claude Code nicht gefunden"; fi

# Playwright MCP (exercise 09) drives an installed Chrome or Edge, not the Playwright Chromium.
if [ -d "/Applications/Google Chrome.app" ] || command -v google-chrome >/dev/null || command -v google-chrome-stable >/dev/null; then
  ok "Google Chrome gefunden (für Playwright MCP, Übung 09)"
elif [ -d "/Applications/Microsoft Edge.app" ] || command -v microsoft-edge >/dev/null; then
  ok "Microsoft Edge gefunden (Übung 09: Variante mit --browser msedge verwenden)"
else
  warn "Weder Chrome noch Edge gefunden: Übung 09 (Playwright MCP) braucht einen der beiden"
fi

section "Projekt"
[ -f .env ] && ok ".env vorhanden (Fake-Werte)" || fail ".env fehlt - scripts/setup.sh ausführen"
(cd app/backend && run_step "Backend-Tests (offline)" "scripts/setup.sh ausführen" ./mvnw -B -q -o test)
(cd app/frontend && run_step "Frontend-Tests" "scripts/setup.sh ausführen" npm test)
[ -f rag/.data/index.db ] && ok "RAG-Index vorhanden" || fail "RAG-Index fehlt - scripts/setup.sh ausführen"

section "Manuell prüfen (in Claude Code)"
echo "  1. claude.ai > Settings > Privacy: Einstellung zur Modellverbesserung geprüft (siehe SETUP.md)"
echo "  2. '/context' einmal ausführen und den Startverbrauch notieren"

summary "Du bist bereit für den Workshop."
