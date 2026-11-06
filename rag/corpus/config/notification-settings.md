---
id: config-notification-settings
title: Konfiguration Benachrichtigungen
lang: de
tags: [config, benachrichtigungen, e-mail]
---

# Konfiguration Benachrichtigungen

Diese Seite listet die Konfigurationsschlüssel, mit denen der Versand von E-Mail-Benachrichtigungen der Raumreservation gesteuert wird. Die Werte werden pro Umgebung in der Anwendungskonfiguration gesetzt.

## Schlüssel

| Schlüssel | Standardwert | Beschreibung |
|-----------|--------------|--------------|
| `rr.notify.batch-size` | 50 | Anzahl Nachrichten, die pro Versandlauf gesammelt verarbeitet werden |
| `rr.notify.retry-max` | 3 | Maximale Zahl von Wiederholungen bei einem fehlgeschlagenen Versand |
| `rr.notify.sender` | noreply@rr.example.invalid | Absenderadresse der Nachrichten |
| `rr.notify.reminder-lead` | PT15M | Vorlaufzeit der Erinnerung vor Beginn einer Belegung |
| `rr.notify.queue-capacity` | 2000 | Maximale Länge der internen Warteschlange |
| `rr.notify.enabled` | true | Schaltet den Versand insgesamt ein oder aus |

## Hinweise

### Batchgrösse

Mit `rr.notify.batch-size` wird gesteuert, wie viele Nachrichten pro Lauf an den Mailserver übergeben werden. Ein höherer Wert verkürzt den Gesamtversand, belastet aber den Mailserver stärker. Bei Zeitüberschreitungen sollte der Wert eher gesenkt werden.

### Wiederholungen

Schlägt der Versand fehl, wird er höchstens so oft wiederholt, wie `rr.notify.retry-max` angibt. Danach wird die Nachricht verworfen und ein Eintrag mit dem Fehlercode RR-6023 geschrieben, falls der Mailserver den Absender ablehnt.

### Absender

Die Absenderadresse muss auf dem Mailserver zugelassen sein. Eine Änderung von `rr.notify.sender` ohne Abstimmung mit dem zuständigen Team Cirrus führt dazu, dass Nachrichten abgewiesen werden.

### Umgebungen

In dev und int zeigt `rr.notify.sender` auf eine Testadresse, und der Versand geht an einen Auffangserver statt an echte Postfächer. Keinesfalls darf in diesen Umgebungen die Produktionskonfiguration übernommen werden.

## Änderungen

Konfigurationsänderungen laufen über einen normalen Änderungsantrag und werden mit der nächsten Produktivsetzung wirksam.
