# Shared helpers for the workshop scripts (sourced, not executed).
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FAILURES=()

if [ -t 1 ]; then GREEN=$'\e[32m'; RED=$'\e[31m'; YELLOW=$'\e[33m'; BOLD=$'\e[1m'; RESET=$'\e[0m'
else GREEN=""; RED=""; YELLOW=""; BOLD=""; RESET=""; fi

ok()   { echo "${GREEN}✔${RESET} $*"; }
fail() { echo "${RED}✘${RESET} $*"; FAILURES+=("$*"); }
warn() { echo "${YELLOW}!${RESET} $*"; }
section() { echo; echo "${BOLD}== $* ==${RESET}"; }

# Runs a command quietly; on failure prints the last lines of its output and a hint.
run_step() {
  local name="$1" hint="$2"; shift 2
  local log; log="$(mktemp)"
  if "$@" >"$log" 2>&1; then ok "$name"
  else
    fail "$name"
    tail -n 15 "$log" | sed 's/^/    /'
    [ -n "$hint" ] && echo "    ${YELLOW}Tipp:${RESET} $hint"
  fi
  rm -f "$log"
}

# Maven/Java ignore HTTP(S)_PROXY. Translate them into JVM system properties.
configure_maven_proxy() {
  local opts="" var url hostport host port scheme
  for scheme in http https; do
    var="$(echo "$scheme" | tr a-z A-Z)_PROXY"
    url="${!var:-$(eval echo "\${$(echo "$var" | tr A-Z a-z):-}")}"
    [ -z "$url" ] && continue
    hostport="${url#*://}"; hostport="${hostport#*@}"; hostport="${hostport%%/*}"
    host="${hostport%%:*}"; port="${hostport##*:}"; [ "$port" = "$host" ] && port=8080
    opts="$opts -D${scheme}.proxyHost=$host -D${scheme}.proxyPort=$port"
  done
  local no_proxy="${NO_PROXY:-${no_proxy:-}}"
  [ -n "$no_proxy" ] && [ -n "$opts" ] && opts="$opts -Dhttp.nonProxyHosts=$(echo "$no_proxy" | tr ',' '|')"
  if [ -n "$opts" ]; then
    export MAVEN_OPTS="${MAVEN_OPTS:-}$opts"
    ok "Proxy erkannt, Maven verwendet:$opts"
  fi
}

version_major() { echo "$1" | sed -E 's/[^0-9]*([0-9]+).*/\1/'; }

summary() {
  echo
  if [ ${#FAILURES[@]} -eq 0 ]; then
    echo "${GREEN}${BOLD}Alles bereit.${RESET} $1"
    return 0
  fi
  echo "${RED}${BOLD}${#FAILURES[@]} Schritt(e) fehlgeschlagen:${RESET}"
  printf '  - %s\n' "${FAILURES[@]}"
  echo "Hilfe: facilitator/troubleshooting.md bzw. SETUP.md (Abschnitt «Probleme»)"
  return 1
}
