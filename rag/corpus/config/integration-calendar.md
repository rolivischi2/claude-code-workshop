---
id: config-integration-calendar
title: Konfiguration Kalender-Synchronisation
lang: de
tags: [config, kalender, integration]
---

# Konfiguration Kalender-Synchronisation

Diese Seite beschreibt die Konfigurationsschlüssel für die Synchronisation der Belegungen mit den persönlichen Kalendern der Nutzenden. Die Synchronisation läuft in eine Richtung: von der Raumreservation zum Kalender.

## Schlüssel

| Schlüssel | Standardwert | Beschreibung |
|-----------|--------------|--------------|
| `rr.calendar.sync-interval` | PT5M | Abstand zwischen zwei Synchronisationsläufen |
| `rr.calendar.timeout` | PT20S | Maximale Wartezeit auf eine Antwort des Kalenderdienstes |
| `rr.calendar.endpoint` | `https://calendar.rr.example.invalid/api` | Adresse des Kalenderdienstes |
| `rr.calendar.batch-size` | 100 | Anzahl Termine pro Aufruf |
| `rr.calendar.retry-max` | 2 | Wiederholungen bei Fehlern, bevor der Lauf abgebrochen wird |
| `rr.calendar.enabled` | true | Schaltet die Synchronisation ein oder aus |

## Hinweise

### Intervall

Mit dem Standardwert PT5M werden neue oder geänderte Belegungen spätestens nach etwa fünf Minuten im Kalender sichtbar. Ein kürzeres Intervall erhöht die Last auf dem Kalenderdienst und bringt für die meisten Nutzenden keinen Vorteil.

### Zeitlimit

Antwortet der Kalenderdienst nicht innerhalb von `rr.calendar.timeout`, wird der Aufruf abgebrochen und der Fehlercode RR-5042 erfasst. Der nächste Lauf versucht es erneut. Häufen sich solche Fehler, prüft die Pikett-Person das Dashboard "Calendar sync" in RR Insight. Das Zeitlimit sollte nicht über dem Intervall liegen, damit sich Läufe nicht überlappen.

### Batchgrösse

Grosse Werte beschleunigen den ersten Abgleich nach einer längeren Pause, können aber das Zeitlimit eher auslösen.

### Betrieb

- Bei Ausfall des Kalenderdienstes bleibt die Raumreservation voll nutzbar; nur die Kalendereinträge verzögern sich.
- Nach Behebung des Ausfalls holt die Synchronisation verpasste Änderungen automatisch nach.
- In int zeigt der Endpunkt auf einen Testdienst.

## Zuständigkeit

Das Team Atlas betreut die Integration und genehmigt Änderungen an diesen Werten.
