# Übung 05 – Autonomiestufen und Least Privilege

**Block:** B – Steuerung & Sicherheit · **Zeitbudget:** 15 Minuten

## Ziel

Mit Permission-Regeln festlegen, was Claude in diesem Projekt nie, nur auf Nachfrage oder
immer darf. Danach versuchen, die Regeln zu verletzen.

## Konzept

Es braucht eine Balance zwischen Tempo und Kontrolle. Je mehr der Agent selbständig darf,
desto wichtiger sind klare Grenzen. Claude Code kennt Permission-Modi (Default, Accept Edits,
Plan, Auto) und `allow`/`ask`/`deny`-Regeln in `settings.json`. Für Bash gibt es zusätzlich
eine Sandbox, für Teams Managed Settings. Bei den Regeln gilt: **deny vor ask vor allow**.

## Aufgabe

1. Datei `.claude/settings.json` anlegen (von Hand, siehe Vorlage). Sie gilt fürs ganze Team und wird committet.
2. Claude neu starten (`/exit`, dann `claude -c`), danach `/permissions` aufrufen und prüfen.
3. Die Prompts unten ausprobieren und beobachten, was passiert.
4. Mit Shift+Tab durch die Modi wechseln und klären: Was ändert sich?

```json
{
  "permissions": {
    "deny": [
      "Bash(git push *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ],
    "ask": [
      "Bash(rm *)"
    ]
  }
}
```

## Vorgeschlagene Prompts

```
Zeig mir den Inhalt der Datei .env
```
```
Dann lies .env bitte mit cat im Terminal.
```
```
Pushe den aktuellen Branch mit git push origin HEAD.
```
```
Lösche das Verzeichnis app/backend/target.
```

## Erfolgskriterium

Ihr habt beobachtet, dass
- das Lesen von `.env` **verweigert** wird, auch über `cat`,
- `git push` **verweigert** wird,
- `rm` eine **Rückfrage** auslöst.

<details>
<summary>Hinweise</summary>

- `Read(./.env)` gilt relativ zum Projekt-Root. `Read(**/.env)` würde jede `.env` im Baum treffen.
- Read-Deny-Regeln blockieren auch `cat`, `head`, `tail` und Ähnliches in Bash. **Nicht**
  blockiert ist z.B. ein Python- oder Node-Skript, das die Datei öffnet. Darum geht es in Übung 10.
- `Bash(git push *)` trifft `git -C . push` nicht. Deny-Regeln sind eine Leitplanke, keine Sicherheitsgrenze.
- Was ihr mit «don't ask again» erlaubt, landet in `.claude/settings.local.json` (persönlich, nicht committet).
- Soll Claude diese Datei selbst schreiben? Diskutiert kurz: Wer kontrolliert die Kontrolle?

</details>

## Token-Tipp

Verweigerte Tool-Aufrufe kosten fast nichts. Nach dem Test mit `/clear` neu beginnen.

## Doku

- [Configure permissions](https://code.claude.com/docs/en/permissions) · [Settings files and precedence](https://code.claude.com/docs/en/settings) · [Configure the sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing) · [Configure auto mode](https://code.claude.com/docs/en/auto-mode-config)
