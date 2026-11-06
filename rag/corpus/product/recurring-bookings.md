---
id: product-recurring-bookings
title: Serienbuchungen
lang: de
tags: [produkt, serie, belegung]
---

# Serienbuchungen

Mit einer Serienbuchung legen Benutzende mehrere gleichartige Belegungen in einem Schritt an, zum Beispiel einen wöchentlichen Termin jeweils am Dienstagmorgen im Raum Eiger.

## Wiederholungsregeln

Eine Serie besteht aus einer ersten Belegung und höchstens 12 Wiederholungen. Unterstützt werden:

- täglich (nur Werktage),
- wöchentlich,
- alle zwei Wochen,
- monatlich am gleichen Wochentag.

Die Serie wird beim Anlegen vollständig erzeugt; es gibt keine «offene» Serie ohne Ende.

## Prüfung auf Konflikte

Jede Instanz der Serie wird einzeln auf Konflikte geprüft. Überschneidet sich eine einzelne Instanz mit einer bestehenden Belegung desselben Raums, wird nur diese Instanz abgelehnt; die übrigen Instanzen bleiben gültig. Die Benutzeroberfläche zeigt nach dem Speichern eine Liste mit den angelegten und den abgelehnten Terminen. Die abgelehnten Termine tragen den Fehlercode RR-4091.

### Weitere Regeln pro Instanz

Auch die allgemeinen Regeln für Belegungen gelten für jede Instanz einzeln. Eine Instanz, die ausserhalb des zulässigen Buchungshorizonts liegt, wird nicht angelegt.

## Ändern und Stornieren

- Eine einzelne Instanz kann geändert oder storniert werden, ohne die übrigen zu berühren.
- Wer die ganze Serie stornieren möchte, wählt «Serie stornieren». Die Stornierungsfrist wird dabei für jede Instanz separat angewendet.
- Das Ändern der Startzeit der gesamten Serie erzeugt die noch nicht begonnenen Instanzen neu und prüft sie erneut auf Konflikte.

## Hinweise

Serien mit vielen Instanzen belasten den Kalender anderer Teams. Raum-Admins können Serien einsehen und bei Bedarf einzelne Instanzen freigeben.
