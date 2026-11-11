# Übung 00 – Setup-Check

**Block:** Einstieg · **Zeitbudget:** 5 Minuten (das Setup selbst ist Hausaufgabe, siehe [SETUP.md](../../SETUP.md))

## Ziel

Alle starten mit einer funktionierenden Umgebung, dem richtigen Login und einem sparsamen Modell.

## Konzept

Claude Code ist eine Harness: ein Modell in einer Schleife, mit Werkzeugen, Kontext und
Steuerung. Alle Blöcke des Nachmittags haben einen festen Platz auf dieser Karte. Bevor wir sie
einzeln anschauen, prüfen wir, dass die Grundlage steht.

```
            ┌──────────── Steuerung (Plan Mode, Permissions, Hooks) ────────────┐
Prompt ──▶  Modell ──▶ Tool-Aufruf (Read, Edit, Bash, MCP …) ──▶ Ergebnis ──▶ Kontext ──┐
            ▲                                                                          │
            └────────────────────────────── Agentic Loop ◀─────────────────────────────┘
Kontext = System-Prompt + CLAUDE.md + Skills-Beschreibungen + Verlauf + Tool-Ergebnisse
```

## Aufgabe

`scripts/check-setup.sh` gehört zur Hausaufgabe und läuft hier **nicht** nochmals (es führt alle
Tests aus und dauert mehrere Minuten). Windows: Die Befehle der Übungsblätter sind für **Git Bash** geschrieben.

1. Im Repo-Root `claude` starten und nacheinander eingeben:
   - `/status`: Login-Methode muss euer claude.ai-Konto sein, kein API-Key.
   - `/model sonnet`: Sonnet für den ganzen Nachmittag. Der Standard ist Opus, das braucht euer Kontingent deutlich schneller auf.
   - `/usage`: euer aktueller Verbrauch im 5-Stunden-Fenster und in der Woche.
   - `/context`: Wie viel Kontext ist belegt, **bevor** ihr etwas gefragt habt? Zahl notieren.
2. Privatsphäre-Einstellung unter
   [claude.ai/settings/data-privacy-controls](https://claude.ai/settings/data-privacy-controls) bewusst prüfen.

## Vorgeschlagene Prompts

Keine. In dieser Übung tippt ihr nur Slash-Commands.

## Erfolgskriterium

`/status` zeigt euer claude.ai-Konto, `/model` zeigt Sonnet, und ihr habt die Startbelegung aus
`/context` notiert. Wir brauchen sie gleich im Input zu Block A und in Übung 01.

<details>
<summary>Hinweise</summary>

- Falscher Login in `/status`? `/logout`, dann `/login` und «Claude account with subscription» wählen.
- `ANTHROPIC_API_KEY` in der Shell gesetzt? Entfernen, sonst verrechnet Claude Code über die API.
- Fehlt Chrome/Edge (Warnung), funktioniert alles ausser Übung 06.

</details>

## Zusatzaufgabe (für Schnelle)

`/permissions` öffnen: Welche Regeln gelten, bevor ihr etwas konfiguriert habt? In Übung 04 legt ihr eigene an.

## Token-Tipp

Slash-Commands wie `/context`, `/usage` oder `/model` verbrauchen keine Tokens.

## Doku

- [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) · [Extend Claude Code](https://code.claude.com/docs/en/features-overview) · [Explore the .claude directory](https://code.claude.com/docs/en/claude-directory) · [Glossary](https://code.claude.com/docs/en/glossary)
- Lernen: [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Anthropic Engineering Blog)
