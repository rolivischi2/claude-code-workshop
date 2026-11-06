---
id: ops-runbook-high-latency
title: "Runbook: hohe Antwortzeiten"
lang: de
tags: [ops, runbook, latenz]
---

# Runbook: hohe Antwortzeiten

Dieses Runbook gilt, wenn die Raumreservation auffallend träge antwortet. Es wird von der Pikett-Person befolgt, sobald der Alarm zur Antwortzeit eingeht oder Nutzende eine langsame Anwendung melden.

## Voraussetzungen

Die Pikett-Person hat Zugang zu RR Insight und zum Bastion-Host. Ist sie unsicher, ob die Lage ernst ist, ordnet sie die Störung nach dem Dokument zu den Schweregraden ein. Eine stark erhöhte Antwortzeit entspricht in der Regel S2.

## Schritte

### 1. Dashboard prüfen

Im Dashboard "API overview" wird geprüft, ob die Antwortzeit bei allen Endpunkten oder nur bei einzelnen erhöht ist. Gleichzeitig werden Anfragerate, Fehlerrate und CPU-Auslastung der Instanzen betrachtet. Ein plötzlicher Anstieg der Anfragerate deutet auf Lastspitzen hin, ein Anstieg ohne mehr Anfragen auf ein internes Problem.

### 2. Logdateien nach Timeouts durchsuchen

Danach werden die Logdateien der letzten Stunde nach Timeouts und Fehlercodes durchsucht. Häufen sich Meldungen zu Verbindungen zur Datenbank, wird zum Runbook über den erschöpften Verbindungspool gewechselt. Zeitüberschreitungen bei der Kalender-Synchronisation weisen auf ein Problem der externen Anbindung hin; sie betreffen die Antwortzeit der Buchung nur indirekt.

### 3. Instanzen skalieren

Ist die CPU-Auslastung hoch und die Datenbank unauffällig, werden zusätzliche Instanzen gestartet, soweit der erlaubte Bereich es zulässt. Die Änderung wird im Pikett-Kanal angekündigt. Danach beobachtet die Pikett-Person während einiger Minuten, ob sich die Antwortzeit erholt.

## Entscheidungshilfe: Pikett-Person alarmiert?

| Situation | Vorgehen |
|-----------|----------|
| Alarm löst Pikett-Person aus | Runbook ab Schritt 1 befolgen |
| Meldung von Nutzenden, kein Alarm | Pikett-Person informieren, Dashboard prüfen |
| Auslöser war eine Produktivsetzung | Rollback gemäss Rollback-Dokument prüfen |

Wurde die Pikett-Person alarmiert, quittiert sie den Alarm und meldet sich im Kanal. Bleibt die Antwortzeit trotz aller Schritte hoch, eskaliert die Pikett-Person an das Team der laufenden Woche und öffnet bei Bedarf die Statusseite.

## Abschluss

Sobald die Antwortzeit wieder normal ist, hält die Pikett-Person Ursache und Massnahmen im Ticket fest. Fehlende Informationen im Runbook werden direkt ergänzt.
