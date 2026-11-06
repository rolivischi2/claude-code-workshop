---
id: product-cancellation-policy
title: Stornierung
lang: de
tags: [produkt, stornierung, belegung]
---

# Stornierung

Dieses Dokument beschreibt, bis wann und von wem eine Belegung im Raumbuchungssystem storniert werden kann und was danach geschieht.

## Kostenfreie Stornierung

Eine Belegung kann bis 2 Stunden vor Beginn kostenfrei storniert werden. Die Stornierung erfolgt in der Anwendung mit einem Klick auf "Belegung stornieren". Der Raum wird sofort wieder freigegeben und steht für andere Nutzende zur Verfügung. Ist eine Warteliste aktiv, werden die dort vermerkten Personen informiert.

Nutzende erhalten eine Bestätigung per E-Mail. Der Eintrag verschwindet aus dem persönlichen Kalender bei der nächsten Synchronisation.

## Spätere Stornierung

Wird die Belegung erst weniger als 2 Stunden vor Beginn aufgehoben, gilt sie als "verfallen". Der Eintrag bleibt in der Auswertung erhalten und wird mit diesem Status markiert, der Raum wird aber ebenfalls freigegeben. Der Status dient Statistiken und der Auswertung nicht erschienener Belegungen; er hat keine finanziellen Folgen für Einzelpersonen.

| Zeitpunkt | Status | Raum frei |
|-----------|--------|-----------|
| mehr als 2 Stunden vor Beginn | storniert | ja |
| weniger als 2 Stunden vor Beginn | verfallen | ja |

## Wer darf stornieren

### Organisierende

Die Person, welche die Belegung erfasst hat, kann diese annullieren. Bei Serien lässt sich wählen, ob nur eine Wiederholung oder die ganze Serie betroffen ist.

### Raum-Admins

Raum-Admins können jede Belegung jederzeit annullieren, auch kurz vor Beginn oder während sie läuft. Typische Gründe sind ein Defekt im Raum, eine Wartung oder eine Veranstaltung mit Vorrang. Die betroffene Person wird per E-Mail informiert, und der Status bleibt "storniert", nicht "verfallen".

## Hinweise

- Eine bereits begonnene Belegung kann von Organisierenden nicht mehr storniert, aber verkürzt werden.
- Stornierungen werden im Auditjournal festgehalten, ohne Klarnamen.
- Fragen zu Ausnahmen richtet man an die Raum-Admins des betroffenen Raums.
