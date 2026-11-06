---
id: product-booking-rules
title: Regeln für Belegungen
lang: de
tags: [produkt, belegung, regeln]
---

# Regeln für Belegungen

Dieses Dokument fasst die fachlichen Regeln zusammen, die das System beim Anlegen einer Belegung prüft. Verstösst eine Anfrage gegen eine Regel, wird sie abgelehnt und die Benutzenden erhalten eine Meldung mit dem passenden Fehlercode.

## Regeln im Überblick

1. **Zeitspanne:** Eine Belegung umfasst maximal vier Stunden, gerechnet von Beginn bis Ende. Wer mehr Zeit benötigt, legt mehrere Belegungen an.
2. **Buchungshorizont:** Eine Belegung darf höchstens 90 Tage im Voraus angelegt werden.
3. **Beginn in der Zukunft:** Der Beginn muss in der Zukunft liegen. Rückwirkende Belegungen sind nicht möglich.
4. **Ende nach Beginn:** Das Ende muss nach dem Beginn liegen.
5. **Kapazität:** Die Kapazität eines Raums muss grösser als 0 sein. Räume ohne Plätze können nicht belegt werden.

### Zeitpunkte

Alle Zeitpunkte werden in der lokalen Zeit des Standorts erfasst und geprüft. Die Prüfung verwendet eine injizierbare Uhr, damit die Regeln in automatisierten Tests reproduzierbar sind.

## Prüfreihenfolge

Das System prüft zuerst die Form der Anfrage (Beginn, Ende, Raum), danach die Zeitregeln und zuletzt die Verfügbarkeit des Raums. Die Verfügbarkeit wird im Service geprüft, nicht im Client.

## Abgrenzung

- Die Regeln zu Überschneidungen sind im Dokument zu Buchungskonflikten beschrieben.
- Die Regeln für Wiederholungen stehen im Dokument zu Serienbuchungen.
- Die Werte der Grenzen sind konfigurierbar; siehe die Konfiguration der Reservationslimiten.

## Hinweise für Support

Meldet eine Person, ihre Anfrage werde abgelehnt, prüft der Support zuerst, ob Beginn und Ende plausibel erfasst wurden (Zeitzone, AM/PM) und ob der Raum aktiv ist.
