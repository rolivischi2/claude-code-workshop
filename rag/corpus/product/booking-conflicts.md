---
id: product-booking-conflicts
title: Buchungskonflikte
lang: de
tags: [produkt, belegung, konflikt]
---

# Buchungskonflikte

Dieses Dokument legt fest, wie die Raumreservation mit Konflikten zwischen Belegungen umgeht. Es richtet sich an Produktverantwortliche, Testende und den Support.

## Grundregel

Zwei Belegungen desselben Raums dürfen sich zeitlich nicht überschneiden. Jeder der vier Räume Eiger, Moench, Jungfrau und Pilatus wird einzeln betrachtet: Eine Belegung in Eiger hat keinen Einfluss auf Belegungen in Jungfrau.

Zwei Belegungen überschneiden sich, wenn der Beginn der einen vor dem Ende der anderen liegt und umgekehrt das Ende der einen nach dem Beginn der anderen.

## Aneinandergrenzende Belegungen

Aneinandergrenzende Belegungen sind ausdrücklich erlaubt. Endet eine Belegung um 11:00 Uhr und beginnt die nächste um 11:00 Uhr, liegt kein Konflikt vor. Der Endzeitpunkt zählt also nicht zur Belegung. Diese Regel ermöglicht lückenlose Abfolgen, ohne dass Nutzende Minuten verschenken müssen. Ein Mindestabstand ist nur dann relevant, wenn er in der Konfiguration eingestellt wurde; der Standard ist kein Abstand.

| Beispiel | Ergebnis |
|----------|----------|
| 09:00–11:00 und 11:00–12:00 im selben Raum | erlaubt |
| 09:00–11:00 und 10:59–12:00 im selben Raum | Konflikt |
| 09:00–11:00 in Eiger und 09:00–11:00 in Pilatus | erlaubt |

## Verhalten des Systems

Geht eine Anfrage ein, die sich mit einer bestehenden Belegung überschneidet, lehnt das System sie ab. Es antwortet mit dem Fehlercode RR-4091 und dem HTTP-Status 409. Es wird nichts gespeichert, und die bestehende Belegung bleibt unverändert.

### Meldung an die Benutzenden

Die Benutzerin oder der Benutzer soll eine verständliche Meldung sehen, zum Beispiel: "Der Raum ist in diesem Zeitraum bereits belegt. Bitte wähle eine andere Zeit oder einen anderen Raum." Technische Begriffe, Codes oder Angaben zu der Person, welche die andere Belegung erfasst hat, werden nicht angezeigt. Das Frontend darf die Eingaben nicht verwerfen, damit die Anfrage rasch angepasst werden kann.

## Gleichzeitige Anfragen

Treffen zwei überschneidende Anfragen praktisch gleichzeitig ein, wird nur eine angenommen. Die andere erhält ebenfalls RR-4091. Die technische Umsetzung beschreibt das Architekturdokument zu parallelen Buchungen.

## Serienbuchungen

Bei Serien wird jede Wiederholung einzeln geprüft. Eine Kollision betrifft nur die jeweilige Wiederholung.
