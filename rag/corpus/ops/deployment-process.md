---
id: ops-deployment-process
title: Produktivsetzung
lang: de
tags: [ops, deployment, release]
---

# Produktivsetzung

Dieses Dokument beschreibt, wie neue Releases der Raumreservation in die Produktion gelangen. Es richtet sich an die Teams Atlas, Boreal und Cirrus sowie an die Release-Verantwortlichen.

## Wartungsfenster

Produktivsetzungen sind ausschliesslich im Wartungsfenster erlaubt: jeweils am Dienstag zwischen 18:00 und 20:00 Uhr. Ausserhalb dieses Fensters werden keine Änderungen in die Produktion übernommen. Ausnahmen gelten nur für Notfallkorrekturen bei einer Störung der Schweregrade S1 oder S2; sie müssen von der Pikett-Person und den Release-Verantwortlichen gemeinsam beschlossen und im Ticket begründet werden.

Das Fenster ist bewusst auf den Dienstagabend gelegt, weil die Nutzung der Räume Eiger, Moench, Jungfrau und Pilatus dann erfahrungsgemäss tief ist.

## Freigabe

Jede Produktivsetzung braucht eine ausdrückliche Freigabe durch die Release-Verantwortlichen. Die Freigabe wird im Ticket dokumentiert und umfasst folgende Punkte:

- Alle automatischen Tests der Pipeline sind grün.
- Das Code-Review ist abgeschlossen.
- Allfällige Datenbankmigrationen sind rückwärtskompatibel.
- Die Pikett-Person der laufenden Woche ist informiert.

Ohne dokumentierte Freigabe bricht die Pipeline vor der letzten Stufe ab.

## Pipeline-Stufen

Die Auslieferung läuft in drei Stufen, die immer in dieser Reihenfolge durchlaufen werden:

| Stufe | Zweck |
|-------|-------|
| build | Kompilieren, Unit-Tests, Erstellen des Artefakts |
| int | Integrationstests mit synthetischen Testdaten |
| prod | Übernahme in die Produktion nach Freigabe |

Die Reihenfolge build → int → prod darf nicht umgangen werden. Ein Artefakt, das nicht auf der Stufe int getestet wurde, kann nicht nach prod gelangen.

### Bedienung

Die Pipeline wird mit dem Kommandozeilenwerkzeug `rr-deploy` angestossen. Der Aufruf für die Produktion wird nur von den Release-Verantwortlichen ausgeführt. Nach der Übernahme beobachtet das durchführende Team während 30 Minuten die Dashboards in RR Insight und meldet das Ergebnis im Teamkanal.

## Bei Problemen

Zeigt sich nach der Produktivsetzung eine Störung, wird gemäss dem Dokument zum Rollback entschieden. Die Kommunikation richtet sich nach den Schweregraden und der Statusseite.
