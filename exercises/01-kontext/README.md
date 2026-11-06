# Übung 01 – Context Engineering

**Block:** A – Kontext · **Zeitbudget:** 20 Minuten

## Ziel

Sehen, wie sich das Kontextfenster füllt, und es bewusst verwalten.

## Konzept

Das Kontextfenster ist begrenzt, und die Qualität sinkt, je voller es wird. Kontext ist ein
Budget, das man bewusst verwaltet. Sichtbar wird es mit `/context`. Aufräumen könnt ihr mit
`/clear` (neu anfangen) und `/compact` (zusammenfassen). Gezielte `@`-Referenzen sind
günstiger als «lies alles».

## Aufgabe

Messt nach jedem Schritt mit `/context` und tragt die Zahl in die Tabelle ein.

| Schritt | Aktion | Kontext belegt |
|---------|--------|----------------|
| 0 | frische Session (aus Übung 00) | |
| 1 | eine Datei gezielt lesen lassen | |
| 2 | das ganze Backend lesen lassen | |
| 3 | `/compact` mit Fokus | |
| 4 | `/clear`, dann Frage mit `@`-Referenz | |

## Vorgeschlagene Prompts

Schritt 1:
```
Lies app/backend/src/main/java/com/example/raumreservation/reservation/ReservationService.java
und liste die Geschäftsregeln für Reservationen auf.
```

Schritt 2:
```
Lies alle Java-Dateien unter app/backend/src und gib mir einen Überblick über die Architektur.
```

Schritt 3:
```
/compact Behalte nur die Geschäftsregeln und die Schichtenarchitektur
```

Schritt 4 (nach `/clear`):
```
@app/backend/src/main/java/com/example/raumreservation/common/GlobalExceptionHandler.java
Welche HTTP-Status und Fehlercodes kann die API zurückgeben?
```

## Erfolgskriterium

Eure Tabelle ist ausgefüllt, und ihr könnt erklären:

- Was kostet am meisten Kontext: eure Prompts, die Antworten oder die Tool-Ergebnisse?
- Wann nehmt ihr `/clear`, wann `/compact`?

<details>
<summary>Hinweise</summary>

- `/compact` ohne Fokus fasst alles zusammen. Mit Fokus bestimmt ihr, was überlebt.
- Claude Code kompaktiert automatisch, wenn das Fenster voll wird. Besser ist es, vorher selbst aufzuräumen.
- `@` mit Tab vervollständigt Pfade. Die Datei landet direkt im Kontext, ohne Such-Turns.
- Ein Teil des Startkontexts sind System-Prompt und Tool-Definitionen. Den bezahlt ihr in jeder Session.

</details>

## Token-Tipp

Schritt 2 ist absichtlich teuer, aber das Backend ist klein. Im echten Projekt fragt ihr
nie «lies alles», sondern lasst Claude suchen oder referenziert gezielt.

## Doku

- [Explore the context window](https://code.claude.com/docs/en/context-window) (interaktive Simulation) · [How Claude Code uses prompt caching](https://code.claude.com/docs/en/prompt-caching) · [Manage costs effectively](https://code.claude.com/docs/en/costs)
- Lernen: [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic Engineering Blog)
