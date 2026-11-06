# Übung 00 – Setup-Check

**Block:** Einstieg · **Zeitbudget:** 10 Minuten

## Ziel

Alle starten mit einer funktionierenden Umgebung, dem richtigen Login und einem sparsamen Modell.

## Konzept

Claude Code ist eine Harness: ein Modell in einer Schleife, mit Werkzeugen, Kontext und
Steuerung. Alle Blöcke des Tages haben einen festen Platz auf dieser Karte. Bevor wir sie
einzeln anschauen, prüfen wir, dass die Grundlage steht.

```
            ┌──────────── Steuerung (Plan Mode, Permissions, Hooks) ────────────┐
Prompt ──▶  Modell ──▶ Tool-Aufruf (Read, Edit, Bash, MCP …) ──▶ Ergebnis ──▶ Kontext ──┐
            ▲                                                                          │
            └────────────────────────────── Agentic Loop ◀─────────────────────────────┘
Kontext = System-Prompt + CLAUDE.md + Skills-Beschreibungen + Verlauf + Tool-Ergebnisse
```

## Aufgabe

1. Setup-Skript prüfen lassen:
   ```bash
   scripts/check-setup.sh          # Windows: scripts\check-setup.ps1
   ```
2. Im Repo-Root `claude` starten und nacheinander eingeben:
   - `/status`: Login-Methode muss euer claude.ai-Konto sein, kein API-Key.
   - `/model sonnet`: Sonnet für den ganzen Tag. Der Standard ist Opus, das braucht euer Kontingent deutlich schneller auf.
   - `/usage`: euer aktueller Verbrauch im 5-Stunden-Fenster und in der Woche.
   - `/context`: Wie viel Kontext ist belegt, **bevor** ihr etwas gefragt habt? Zahl notieren.
3. Privatsphäre-Einstellung unter
   [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls) bewusst prüfen.

## Vorgeschlagene Prompts

Keine. In dieser Übung tippt ihr nur Slash-Commands.

## Erfolgskriterium

```bash
scripts/check-setup.sh     # alles grün
```

…und ihr habt die Startbelegung aus `/context` notiert. Wir brauchen sie in Übung 01.

<details>
<summary>Hinweise</summary>

- Rot bei «Login»? `/logout`, dann `/login` und «Claude account with subscription» wählen.
- `ANTHROPIC_API_KEY` in der Shell gesetzt? Entfernen, sonst verrechnet Claude Code über die API.
- Fehlt Chrome/Edge (Warnung), funktioniert alles ausser Übung 09.

</details>

## Token-Tipp

Slash-Commands wie `/context`, `/usage` oder `/model` verbrauchen keine Tokens.

## Doku

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) · [Glossary](https://code.claude.com/docs/en/glossary)
- Lernen: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic Engineering Blog)
