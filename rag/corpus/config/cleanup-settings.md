---
id: config-cleanup-settings
title: Konfiguration Bereinigungsjob
lang: de
tags: [config, bereinigung, job]
---

# Konfiguration Bereinigungsjob

Diese Seite beschreibt die Konfigurationsschlüssel des Hintergrundjobs "ReservationCleanupJob". Der Job löscht oder anonymisiert alte Reservationen, damit die Datenbank nicht unbegrenzt wächst und personenbezogene Angaben nicht länger als nötig vorhanden sind.

## Schlüssel

| Schlüssel | Standardwert | Beschreibung |
|-----------|--------------|--------------|
| `rr.cleanup.retention-days` | 400 | Anzahl Tage nach Ende einer Reservation, bis sie bereinigt wird |
| `rr.cleanup.cron` | `0 30 2 * * *` | Zeitplan des Jobs (Cron-Ausdruck), täglich um 02:30 Uhr |
| `rr.cleanup.batch-size` | 500 | Anzahl Datensätze, die pro Durchgang bearbeitet werden |
| `rr.cleanup.mode` | anonymize | Verhalten: `anonymize` oder `delete` |
| `rr.cleanup.dry-run` | false | Wenn true, werden Treffer nur gezählt, aber nicht verändert |
| `rr.cleanup.enabled` | true | Schaltet den Job ein oder aus |

## Verhalten des Jobs

Der "ReservationCleanupJob" läuft gemäss `rr.cleanup.cron` jede Nacht um 02:30 Uhr. Er sucht alle Reservationen, deren Ende länger als `rr.cleanup.retention-days` zurückliegt, und behandelt sie je nach `rr.cleanup.mode`. Im Modus `anonymize` bleiben die Zeitangaben und der Raum für Statistiken erhalten, während alle personenbezogenen Angaben entfernt werden. Im Modus `delete` wird der gesamte Datensatz gelöscht.

### Zeitplan

Der Cron-Ausdruck hat sechs Felder: Sekunde, Minute, Stunde, Tag, Monat, Wochentag. Der Wert `0 30 2 * * *` bedeutet also täglich um 02:30:00 Uhr. Der Zeitpunkt liegt bewusst nach der Neubefüllung von int und vor dem Morgenbetrieb.

## Hinweise

- Vor einer Änderung von `rr.cleanup.retention-days` ist der Datenschutz zu konsultieren; eine Verkürzung wirkt rückwirkend auf alle älteren Datensätze.
- Mit `rr.cleanup.dry-run` lässt sich die Wirkung einer neuen Einstellung prüfen, bevor sie scharf geschaltet wird.
- Läuft der Job nicht durch, erstellt die Pikett-Person am nächsten Arbeitstag ein Ticket.
