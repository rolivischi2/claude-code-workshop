---
id: architecture-adr-002-problem-details
title: "ADR-002: Problem Details für Fehlerantworten"
lang: de
tags: [architektur, adr, fehler, api]
---

# ADR-002: Problem Details für Fehlerantworten

Status: akzeptiert

## Kontext

Die API lieferte zu Beginn Fehler in unterschiedlichen Formen: manchmal ein Text, manchmal ein JSON-Objekt mit wechselnden Feldern. Das Frontend und externe Clients mussten für jeden Endpunkt eigene Auswertungen schreiben. Zudem gelangten in einzelnen Fällen interne Details in die Antworten.

## Entscheid

Alle API-Fehler werden im Format **RFC 7807** (Problem Details, Medientyp `application/problem+json`) geliefert. Jede Antwort enthält die Standardfelder `type`, `title`, `status` und `detail` sowie die zusätzliche Eigenschaft `code` mit dem Fehlercode der Anwendung. Ein globaler Exception-Handler im Backend erzeugt diese Antworten zentral.

## Verworfene Alternativen

### Eigenes Fehlerformat

Ein selbst definiertes Format hätte volle Freiheit gegeben, verursacht aber Pflegeaufwand und ist Neuen unbekannt. Es wurde verworfen, weil ein Standard existiert.

### Nur HTTP-Statuscodes

Statuscodes allein sind zu grob, um etwa zwischen verschiedenen Ablehnungsgründen bei einem Konflikt zu unterscheiden. Dies wurde verworfen.

### Fehlermeldung als Freitext

Texte sind für Menschen lesbar, aber für Programme nicht stabil. Verworfen.

## Konsequenzen

- Clients können einheitlich auf die Eigenschaft `code` reagieren und sind nicht von Texten abhängig.
- Das Schema der Codes (`RR-<HTTP-Status><laufende Nummer>`) muss gepflegt werden; neue Codes werden zuerst dokumentiert.
- Der Exception-Handler wird zur zentralen Stelle, die bei neuen Ausnahmetypen angepasst werden muss.
- Bestehende Clients mussten einmalig umgestellt werden.
- Stacktraces erscheinen nicht mehr in Antworten; die Fehlersuche stützt sich auf Korrelations-IDs in den Journalen.
