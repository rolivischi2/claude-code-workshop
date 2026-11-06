---
id: guidelines-accessibility-frontend
title: Barrierefreiheit im Frontend
lang: de
tags: [richtlinie, accessibility, frontend]
---

# Barrierefreiheit im Frontend

Die Webanwendung muss für alle Mitarbeitenden nutzbar sein, unabhängig von Sehvermögen, motorischen Einschränkungen oder verwendeten Hilfsmitteln. Diese Richtlinie legt die Anforderungen an das Frontend fest.

## Standard

Das Frontend erfüllt die **WCAG 2.1 auf Stufe AA**. Neue Oberflächen werden vor der Integration gegen diese Anforderungen geprüft; bestehende Seiten werden bei jeder grösseren Änderung nachgezogen.

## Tastaturbedienung

Alle Funktionen sind ohne Maus bedienbar.

- Die Reihenfolge der Tabulator-Taste folgt der visuellen Reihenfolge.
- Der Fokus ist jederzeit deutlich sichtbar; er wird nie mit CSS entfernt.
- Dialoge halten den Fokus und geben ihn beim Schliessen an das auslösende Element zurück.
- Schaltflächen und Links werden mit Enter bzw. Leertaste ausgelöst.
- Es gibt keine Tastaturfallen.

## Kontraste

Text hat einen Kontrast von mindestens 4,5 : 1 zum Hintergrund, grosse Schriften und Bedienelemente mindestens 3 : 1. Information wird nie allein über Farbe vermittelt: Ein belegter Zeitraum im Kalender trägt zusätzlich ein Muster oder eine Beschriftung.

### Prüfung

Die Kontraste der Farbpalette sind im Designsystem festgelegt und werden automatisch getestet.

## Semantik und Hilfsmittel

- Native HTML-Elemente haben Vorrang vor selbst gebauten Bedienelementen.
- Formularfelder haben sichtbare Beschriftungen und verknüpfte Fehlermeldungen.
- Bilder und Symbole haben Alternativtexte oder sind als dekorativ markiert.
- Dynamische Meldungen, etwa nach dem Speichern einer Belegung, werden über Live-Regionen angekündigt.

## Tests

Die kritischen Abläufe laufen mit einem automatischen Zugänglichkeitsscan, ergänzt durch manuelle Stichproben mit Bildschirmleser.
