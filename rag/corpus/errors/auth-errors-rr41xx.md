---
id: errors-auth-errors-rr41xx
title: Fehlercodes RR-41xx
lang: de
tags: [fehler, authentifizierung, berechtigung]
---

# Fehlercodes RR-41xx

Die Codes der Gruppe RR-41xx betreffen Anmeldung, Sitzung und Berechtigungen. Sie werden als Problem Details mit der Eigenschaft `code` ausgeliefert.

## Übersicht

| Code | HTTP | Bedeutung | Massnahme |
|------|------|-----------|-----------|
| RR-4101 | 401 | Sitzung abgelaufen | Erneut anmelden |
| RR-4103 | 403 | Fehlende Berechtigung für die Aktion | Rolle prüfen; Berechtigung bei der zuständigen Stelle beantragen |
| RR-4105 | 423 | Konto gesperrt nach zu vielen Anmeldeversuchen | Sperrfrist abwarten oder den Support kontaktieren |

## Erläuterungen

### RR-4101

Die Sitzung läuft nach einer Zeit ohne Aktivität ab. Der Wert ist in der Sicherheitskonfiguration festgelegt. Das Frontend leitet bei diesem Code auf die Anmeldeseite um und merkt sich die zuletzt geöffnete Ansicht. Nicht gesendete Eingaben in einem Formular können verloren gehen; das Frontend soll deshalb Entwürfe lokal vorhalten.

### RR-4103

Die Person ist angemeldet, besitzt aber nicht die nötige Rolle. Typische Fälle sind der Versuch eines Mitglieds, den CSV-Export aufzurufen oder die Belegung eines anderen Teams zu annullieren. Im Fehlertext wird die benötigte Rolle genannt, jedoch nicht, wer sie besitzt. Die Rollen sind im Produktdokument zu Rollen und Rechten beschrieben.

### RR-4105

Das Konto wird gesperrt, wenn die maximale Zahl fehlgeschlagener Anmeldeversuche erreicht ist. Die Sperre wird nach der konfigurierten Frist automatisch aufgehoben. Der Support kann sie früher lösen, nachdem er die Identität der Person geprüft hat. Im Auditjournal erscheint nur eine technische Kennung, kein Klartextname.

## Hinweise

- Wiederholte RR-4105 für viele verschiedene Konten in kurzer Zeit kann auf einen automatisierten Angriff deuten und wird der Pikett-Person gemeldet.
- RR-41xx-Fehler sind erwartetes Verhalten und lösen keinen Alarm aus.
- Meldungen an die Nutzenden enthalten keine Details, die Rückschlüsse auf bestehende Konten erlauben.
