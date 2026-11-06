---
id: ops-incident-severity
title: Schweregrade von Störungen
lang: de
tags: [ops, incident, schweregrad]
---

# Schweregrade von Störungen

Störungen der Raumreservation werden in vier Schweregrade eingeteilt. Der Schweregrad bestimmt, wer informiert wird und wie rasch gehandelt werden muss.

## Übersicht

| Grad | Bezeichnung | Beispiel |
|------|-------------|----------|
| S1 | Totalausfall | Anwendung nicht erreichbar, Buchungen unmöglich |
| S2 | Schwere Beeinträchtigung | Buchungen funktionieren, aber mit stark erhöhter Antwortzeit oder für einen Teil der Nutzenden nicht |
| S3 | Eingeschränkte Funktion | Kalender-Synchronisation fällt aus, Export fehlerhaft |
| S4 | Kosmetisch | Tippfehler, falsch ausgerichtetes Symbol |

## Vorgehen je Grad

### S1

Bei einem Totalausfall wird sofort die Pikett-Person alarmiert und die Statusseite geöffnet. Die Teamleitungen von Atlas, Boreal und Cirrus werden informiert. Ein Rollback wird nach den Regeln des Rollback-Dokuments geprüft. Nach dem Ereignis folgt ein Postmortem.

### S2

Bei einer schweren Beeinträchtigung wird innert 1 Stunde gehandelt. Die Pikett-Person beurteilt die Lage; die Statusseite wird aktualisiert, sobald Nutzende erkennbar betroffen sind. Auch hier folgt ein Postmortem.

### S3

Eine eingeschränkte Funktion wird als Ticket erfasst und innerhalb der normalen Arbeitszeit bearbeitet, in der Regel noch am nächsten Arbeitstag. Ein Alarm ausserhalb der Bürozeiten ist nicht vorgesehen.

### S4

Kosmetische Mängel werden im Backlog geführt und mit anderen Änderungen zusammen im nächsten Wartungsfenster behoben.

## Umgang mit Unsicherheit

Ist der Grad unklar, gilt der höhere. Der Schweregrad darf während der Störung angepasst werden; jede Änderung wird im Kanal begründet. Die endgültige Einstufung legt das Postmortem fest.

## Abgrenzung

Planmässige Unterbrüche im Wartungsfenster sind keine Störungen und erhalten keinen Schweregrad.
