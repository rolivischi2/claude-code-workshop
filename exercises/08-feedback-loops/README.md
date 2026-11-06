# Übung 08 – Feedback-Loops und Verifikation

**Block:** C – Verifizieren & Erweitern · **Zeitbudget:** 20 Minuten

## Ziel

Einen Fehler beheben lassen, mit einer klaren Regel: **Fertig ist erst, wenn alle Tests grün sind.**

## Konzept

Ein Agent ist nur so gut wie seine Möglichkeit, das eigene Ergebnis zu prüfen. Ohne Prüfung
rät er, mit Prüfung iteriert er. Tests, Linter und Build sind Checks, die Claude selbst
ausführen kann. Im Frontend kommt der Browser als «Augen» dazu (Übung 09).

## Aufgabe

Eine Teamleiterin meldet: «Ich kann den Raum Eiger nicht von 11 bis 12 Uhr buchen, obwohl
die Reservation davor um 11 Uhr endet.»

1. Den Bug reproduzieren lassen. Im Backend gibt es einen deaktivierten Test, der genau diesen Fall abdeckt.
2. Fehler beheben, Test aktivieren (`@Disabled` entfernen).
3. Claude meldet erst «fertig», wenn beide Testsuiten grün sind.
4. Optional, aber empfohlen: Die Regel als «Definition of Done» in die `CLAUDE.md` aufnehmen.

## Vorgeschlagene Prompts

```
Bug: Aneinandergrenzende Reservationen (z.B. 10–11 und 11–12 Uhr im selben Raum) werden
fälschlich als Überschneidung abgelehnt. Suche den deaktivierten Test, der das abdeckt,
aktiviere ihn und behebe den Fehler.
Du bist erst fertig, wenn `./mvnw -q test` in app/backend UND `npm test` in app/frontend grün sind.
Zeig mir am Schluss die Ausgabe beider Befehle.
```

Optional für die CLAUDE.md:
```markdown
## Definition of Done
- Eine Aufgabe ist erst abgeschlossen, wenn `./mvnw -q test` (app/backend) und `npm test` (app/frontend) grün sind.
- Nie Tests deaktivieren oder löschen, um grün zu werden.
```

## Erfolgskriterium

```bash
cd app/backend && ./mvnw -q test       # grün, kein @Disabled mehr im ReservationServiceTest
cd app/frontend && npm test            # grün
grep -rn "@Disabled" app/backend/src/test   # keine Treffer
```

<details>
<summary>Hinweise</summary>

- Der Kommentar über der fehlerhaften Methode beschreibt die Absicht korrekt. Der Code tut etwas anderes.
- Achtet darauf, **wie** Claude den Fehler findet: zuerst Test laufen lassen (rot), dann fixen (grün)?
- Die Regel «nie Tests deaktivieren» ist wichtig. Ohne sie ist «Test löschen» ein valider Weg zu Grün.
- Die Testausgabe ist absichtlich kurz gehalten (`-q`, Log-Level WARN). Lange Logs fressen Kontext bei jeder Iteration.

</details>

## Token-Tipp

`-q` und kurze Testausgaben sind bares Geld: Claude liest die Ausgabe jedes Testlaufs vollständig.

## Doku

- [Best practices](https://code.claude.com/docs/en/best-practices) (Abschnitt «give Claude a way to verify its work») · [Use Claude Code with Chrome](https://code.claude.com/docs/en/chrome)
