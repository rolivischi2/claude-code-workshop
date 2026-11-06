---
id: ops-rollback
title: Rollback einer Produktivsetzung
lang: de
tags: [ops, rollback, deployment]
---

# Rollback einer Produktivsetzung

Ein Rollback macht eine fehlerhafte Produktivsetzung rückgängig. Dieses Dokument legt fest, wann und wie er ausgeführt wird.

## Entscheidungsfrist

Über einen Rollback wird innert 15 Minuten nach Störungsbeginn entschieden. Die Entscheidung treffen die Pikett-Person und die Release-Verantwortlichen gemeinsam. Ist nach Ablauf dieser Frist keine Ursache erkennbar, die sich rasch beheben lässt, gilt der Rollback als Regelmassnahme. Wer unsicher ist, entscheidet für den Rollback; eine Korrektur kann später im regulären Wartungsfenster nachgeliefert werden.

## Ausführung

Der Rollback wird mit folgendem Befehl ausgelöst:

```
rr-deploy rollback --to <release>
```

Als `<release>` wird die Kennung der vorherigen Freigabe angegeben. Der Befehl führt die Anwendung wieder auf die vorherige Freigabe, also auf das Artefakt, das vor der betroffenen Produktivsetzung in Betrieb war. Die Pipeline durchläuft dabei nur die Stufe prod; build und int werden nicht wiederholt.

Nach dem Rollback gilt:

1. Dashboards in RR Insight beobachten, bis Fehlerrate und Latenz im Normalbereich liegen.
2. Statusseite aktualisieren, falls sie wegen der Störung geöffnet wurde.
3. Ein Ticket für die Analyse erstellen und der betroffenen Änderung zuordnen.

## Datenbank

Datenbankmigrationen sind gemäss den Entwicklungsrichtlinien immer rückwärtskompatibel. Deshalb ist bei einem Rollback kein Restore der Datenbank nötig. Die ältere Anwendung kann mit dem neueren Schema arbeiten.

Einzige Ausnahme ist ein Datenverlust, etwa durch eine fehlerhafte Migration oder einen Schreibfehler in der Anwendung. In diesem Fall wird die Datenbank aus einer Sicherungskopie wiederhergestellt; das Vorgehen steht in der Dokumentation zu Backup und Restore. Ein solcher Eingriff erfordert das Vier-Augen-Prinzip und die Information der Teamleitungen von Atlas, Boreal und Cirrus.

## Nachbereitung

Jeder Rollback wird im Postmortem behandelt, sofern die Störung als S1 oder S2 eingestuft war.
