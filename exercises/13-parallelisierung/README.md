# Übung 13 – Parallelisierung mit Worktrees

**Block:** D – Skalieren · **Zeitbudget:** 15 Minuten (Demo, wer mag macht mit)

## Ziel

Zwei Claude-Sessions arbeiten gleichzeitig an zwei Features, ohne sich in die Quere zu kommen.

## Konzept

Mehrere Agents im selben Arbeitsverzeichnis kommen sich in die Quere: Sie überschreiben
Dateien, und Tests laufen auf halbfertigem Code. Git-Worktrees geben jeder Session ein
eigenes Verzeichnis und einen eigenen Branch, bei gemeinsamer Historie. Claude Code legt
sie mit `--worktree` selbst an.

## Aufgabe

1. Zuerst den Stand der Übungen 08–12 sichern, sonst fehlt er in den Worktrees:
   `git add -A && git commit -m "Exercises 08-12"`
2. In `.claude/settings.json` ergänzen, damit Worktrees von **eurem aktuellen Stand** abzweigen
   (Standard wäre `main`, dann fehlten alle Übungen des Tages):
   ```json
   "worktree": { "baseRef": "head" }
   ```
   Committen: `git commit -am "Branch worktrees from HEAD"`
3. **Terminal 1:** `claude -w room-search`, dann Prompt A
4. **Terminal 2:** `claude -w csv-export`, dann Prompt B
5. Beide laufen lassen. Beobachten: `git worktree list` zeigt beide unter `.claude/worktrees/`.
6. Beide Sessions beenden und die Worktrees behalten. Dann im Hauptverzeichnis zusammenführen:
   ```bash
   git merge --no-edit worktree-room-search
   git merge --no-edit worktree-csv-export
   cd app/backend && ./mvnw -q test
   ```

## Vorgeschlagene Prompts

Prompt A:
```
Füge GET /api/rooms/search?minCapacity=10&floor=2 hinzu. Beide Parameter sind optional,
das Ergebnis ist nach Kapazität aufsteigend sortiert. Teamstandard und Tests wie üblich.
Wenn ./mvnw -q test grün ist, committe mit einer passenden Message.
```

Prompt B:
```
Füge GET /api/reservations/export.csv?from=2030-01-01&to=2030-01-31 hinzu: Reservationen,
deren Beginn im Zeitraum liegt, als CSV mit Semikolon, Kopfzeile
id;roomId;title;organizer;start;end, UTF-8 mit BOM (für Excel). Teamstandard und Tests wie üblich.
Wenn ./mvnw -q test grün ist, committe mit einer passenden Message.
```

## Erfolgskriterium

```bash
git log --oneline worktree-room-search -1     # Commit vorhanden
git log --oneline worktree-csv-export -1      # Commit vorhanden
cd app/backend && ./mvnw -q test              # nach dem Merge grün
```

<details>
<summary>Hinweise</summary>

- Branches heissen `worktree-<name>`. Ohne Änderungen räumt Claude den Worktree beim Beenden selbst weg.
- Im Worktree fehlen ignorierte Dateien wie `.env` und `node_modules`. Für Backend-Aufgaben
  ist das egal (Maven nutzt den globalen Cache). `.worktreeinclude` kann Dateien mitkopieren.
- Merge-Konflikt? Beide Features berühren andere Klassen, ein Konflikt ist unwahrscheinlich.
  Falls doch: Claude im Hauptverzeichnis lösen lassen.
- Mehrere Sessions im Blick behalten: `claude agents`.
- Aufräumen: `git worktree remove .claude/worktrees/room-search` (bzw. csv-export).

</details>

## Token-Tipp

Zwei parallele Sessions verbrauchen doppelt so schnell. Prompts vorher fertig formulieren, damit beide in wenigen Turns durch sind.

## Doku

- [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees) · [Manage multiple agents with agent view](https://code.claude.com/docs/en/agent-view)
