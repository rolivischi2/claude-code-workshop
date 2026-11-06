---
id: product-csv-export
title: CSV-Export
lang: de
tags: [produkt, export, csv]
---

# CSV-Export

Der CSV-Export liefert die Belegungen eines Zeitraums als Datei, die sich in Tabellenkalkulationen weiterverarbeiten lässt. Er wird für Auswertungen zur Auslastung und für die Abrechnung zwischen Teams verwendet.

## Berechtigung

Nur Raum-Admins dürfen den Export auslösen, und nur für die Räume, die ihnen zugewiesen sind. Facility-Manager können alle Räume exportieren. Andere Benutzende sehen die Funktion nicht; ein direkter Aufruf der Schnittstelle wird mit RR-4103 beantwortet.

## Ablauf

1. Im Menü «Export» den gewünschten Zeitraum wählen (Beginn und Ende des Zeitraums).
2. Optional die Räume einschränken.
3. «CSV herunterladen» anklicken.

Der Export umfasst alle Belegungen, die den Zeitraum berühren, auch solche, die vor dem Beginn starten oder nach dem Ende enden.

## Dateiformat

| Eigenschaft | Wert |
|---|---|
| Trennzeichen | Semikolon |
| Zeichenkodierung | UTF-8 mit BOM, damit Excel Umlaute korrekt anzeigt |
| Zeilenende | CRLF |
| Kopfzeile | ja, mit Spaltennamen |
| Datumsformat | ISO 8601, lokale Zeit |

### Spalten

Raum, Beginn, Ende, Status, Anzahl Teilnehmende sowie Team der Organisation. Namen von Personen sind nach Ablauf der Aufbewahrungsfrist nicht mehr enthalten.

## Hinweise

- Sehr grosse Zeiträume werden in Abschnitte aufgeteilt; bitte höchstens ein Jahr pro Export wählen.
- Die Datei enthält Personendaten und darf nicht an externe Stellen weitergegeben werden.
- Der Export wird protokolliert (Zeitpunkt, auslösende Rolle, Zeitraum).
