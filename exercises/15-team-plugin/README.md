# Übung 15 – Capstone: Team-Plugin

**Block:** Capstone · **Zeitbudget:** 25 Minuten

## Ziel

Skill, Hooks, Reviewer und MCP-Konfiguration als **ein** Team-Plugin bündeln, über einen
lokalen Marketplace verteilen und in einem frischen Klon installieren.

## Konzept

Ohne Paketierung bleiben gute Setups bei Einzelnen hängen. Ein Plugin macht sie für das ganze Team
installierbar. Plugins bündeln Skills, Hooks, MCP-Server und Subagents. Verteilt werden sie
über einen eigenen Marketplace, im einfachsten Fall ein Ordner im Repo.

## Aufgabe

1. Plugin-Struktur bauen lassen (Prompt 1):
   ```
   plugins/
   ├── .claude-plugin/marketplace.json         ← Marketplace «raumreservation-team-marketplace»
   └── raumreservation-team/
       ├── .claude-plugin/plugin.json          ← nur name, description, version
       ├── skills/rest-endpoint/SKILL.md       ← aus Übung 03
       ├── agents/reviewer.md                  ← aus Übung 12
       ├── hooks/hooks.json                    ← Hooks aus Übung 06, Pfade über ${CLAUDE_PLUGIN_ROOT}
       ├── hooks/format-edited-file.mjs
       ├── hooks/protect-generated.mjs
       └── .mcp.json                           ← playwright (+ handbook)
   ```
2. Prüfen: `claude plugin validate plugins/raumreservation-team` und `claude plugin validate plugins`
3. Committen.
4. Frischen Klon vom **Startzustand** (`start/00`) anlegen, dort gibt es noch kein `.claude/`-Setup.
   Das Plugin nur lokal installieren:
   ```bash
   git clone --branch start/00 . ../ccw-frisch
   cd ../ccw-frisch
   claude plugin marketplace add ../claude-code-workshop/plugins --scope local
   claude plugin install raumreservation-team@raumreservation-team-marketplace --scope local
   ```
5. Im Klon `claude` starten. Mit `/plugin` und `/hooks` prüfen, ob alles da ist, dann Prompt 2 testen.

## Vorgeschlagene Prompts

Prompt 1 (im Workshop-Repo):
```
Bündle unser .claude-Setup als Plugin gemäss exercises/15-team-plugin/README.md: den Skill
rest-endpoint, den reviewer-Agent, beide Hooks (Skripte ins Plugin kopieren, Pfade über
${CLAUDE_PLUGIN_ROOT}) und die MCP-Server aus .mcp.json. Lege dazu einen lokalen Marketplace
unter plugins/ an. Prüfe mit `claude plugin validate`.
```

Prompt 2 (im frischen Klon):
```
Ergänze in app/backend/src/main/java/com/example/raumreservation/reservation/DurationFormatter.java
ein Javadoc für die Methode format.
```

## Erfolgskriterium

- `claude plugin validate` meldet keine Fehler.
- Im frischen Klon ist das Plugin installiert, der Skill erscheint als `/raumreservation-team:rest-endpoint`.
- Nach Prompt 2 ist `./mvnw -q spotless:check` im Klon grün: Der Plugin-Hook hat formatiert.

<details>
<summary>Hinweise</summary>

- `--scope local` schreibt nur in die `.claude/settings.local.json` des Klons. Euer globales Setup bleibt sauber.
- Im Plugin heissen Skills `/<plugin>:<skill>`, damit sich Plugins nicht in die Quere kommen.
- Im Plugin zeigen Pfade über `${CLAUDE_PLUGIN_ROOT}` auf das Plugin selbst und über
  `${CLAUDE_PROJECT_DIR}` auf das Projekt, in dem es läuft.
- Im Team-Alltag: Marketplace in ein eigenes Repo, Projekte registrieren ihn über
  `extraKnownMarketplaces` und `enabledPlugins` in `.claude/settings.json`.
- Aufräumen: `claude plugin uninstall raumreservation-team@raumreservation-team-marketplace --scope local`, Klon löschen.
- MCP-Server im Klon nicht verbunden oder leer? Erwartet: Im Klon fehlen `node_modules` und der RAG-Index.
- Plugins sind Code mit euren Rechten. Installiert nur, was ihr gelesen habt (siehe Übung 10).

</details>

## Token-Tipp

Das Bündeln ist vor allem Kopierarbeit. Gebt Claude die Zielstruktur vor (wie oben), statt sie entwerfen zu lassen.

## Doku

- [Plugins overview](https://code.claude.com/docs/en/plugins/overview) · [Create a Claude Code plugin](https://code.claude.com/docs/en/plugins/create) · [Manage plugins for your organization](https://code.claude.com/docs/en/plugins/org)
