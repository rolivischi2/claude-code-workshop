---
id: guidelines-security-checklist
title: Sicherheits-Checkliste
lang: de
tags: [richtlinie, sicherheit, checkliste]
---

# Sicherheits-Checkliste

Diese Checkliste wird bei jeder Änderung durchgegangen, die Eingaben, Berechtigungen oder Konfiguration betrifft. Sie ergänzt das Review und ersetzt es nicht.

## Eingaben validieren

- Alle Eingaben von aussen (Pfad, Query, Body, Header) werden serverseitig validiert, auch wenn der Client bereits prüft.
- Zulässige Werte werden positiv beschrieben (Whitelist), nicht über Ausschlusslisten.
- Datenbankzugriffe verwenden parametrisierte Abfragen; SQL wird nie aus Benutzereingaben zusammengesetzt.
- Ausgaben im Frontend werden vom Framework maskiert; `innerHTML` mit Benutzerinhalt ist verboten.

## Secrets gehören nicht ins Repo

Secrets, API-Schlüssel und Zugangsdaten werden nie im Repository abgelegt, auch nicht in Testdateien oder früheren Commits. Sie liegen im Secret-Speicher und werden zur Laufzeit als Umgebungsvariablen bereitgestellt. Wurde ein Secret versehentlich eingecheckt, gilt es als kompromittiert und wird sofort rotiert.

### .env nie committen

Lokale `.env`-Dateien stehen in `.gitignore`. Wer Beispielwerte teilen möchte, pflegt eine `.env.example` mit Platzhaltern.

## Abhängigkeiten prüfen

- Neue Bibliotheken werden vor der Aufnahme auf Pflege, Lizenz und bekannte Schwachstellen geprüft.
- Die Pipeline führt einen Schwachstellenscan aus; kritische Funde blockieren die Produktivsetzung.
- Versionen werden festgehalten, damit Builds reproduzierbar sind.

## Berechtigungen

- Jeder Endpunkt hat eine ausdrückliche Rollenprüfung.
- Das Prinzip der minimalen Rechte gilt für Dienstkonten und Datenbankbenutzer.
- Verweigerte Aktionen werden mit RR-4103 beantwortet, ohne interne Details.

## Meldung von Vorfällen

Verdacht auf eine Schwachstelle wird nicht öffentlich im Ticketsystem diskutiert, sondern direkt dem Sicherheitsverantwortlichen gemeldet.
