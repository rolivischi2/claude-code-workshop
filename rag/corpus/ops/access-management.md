---
id: ops-access-management
title: Zugriff auf Produktion
lang: de
tags: [ops, zugriff, sicherheit]
---

# Zugriff auf Produktion

Der Zugriff auf die Produktionsumgebung der Raumreservation ist streng geregelt. Er dient ausschliesslich der Störungsbehebung und der Wartung.

## Einziger Weg: Bastion-Host

Produktionssysteme sind nur über den Bastion-Host `bastion.rr.example.invalid` erreichbar. Direkte Verbindungen von Arbeitsplätzen auf Datenbank oder Anwendungsserver sind technisch gesperrt. Alle Sitzungen auf dem Bastion-Host werden aufgezeichnet und im Auditjournal abgelegt.

## Antrag und Befristung

Zugriff wird per Ticket beantragt. Der Antrag nennt Grund, Umfang und das betroffene System. Die Freigabe erteilt die Teamleitung oder bei einer Störung die Pikett-Person.

Der gewährte Zugriff ist auf 8 Stunden befristet. Danach läuft er automatisch ab; wer weiterarbeiten muss, stellt einen neuen Antrag. Eine Verlängerung ohne Ticket gibt es nicht.

## Datenänderungen

Änderungen an Daten in der Produktion, etwa die Korrektur eines Datensatzes per SQL, erfolgen nach dem Vier-Augen-Prinzip. Eine Person führt die Änderung aus, eine zweite prüft die Anweisung vorab und sieht bei der Ausführung zu. Beide halten das Ergebnis im Ticket fest. Lesende Abfragen auf Produktionsdaten unterliegen den Regeln des Datenschutzes.

Das Vier-Augen-Prinzip gilt auch im Code-Review; die Einzelheiten dazu stehen in den Entwicklungsrichtlinien und sind für den Betrieb nicht massgebend.

## Pflichten

- Zugangsdaten werden nie weitergegeben.
- Persönliche Zugriffe werden nicht für automatische Skripte verwendet.
- Nach Abschluss der Arbeit wird die Sitzung beendet, auch wenn die Befristung noch nicht abgelaufen ist.
- Auffälligkeiten melden die Teams unverzüglich der Teamleitung.

## Kontrolle

Das Auditjournal wird vierteljährlich stichprobenweise geprüft. Zugriffe ohne passendes Ticket gelten als Verstoss und werden von den Teamleitungen von Atlas, Boreal und Cirrus gemeinsam behandelt.
