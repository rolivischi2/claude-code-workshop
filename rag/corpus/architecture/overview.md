---
id: architecture-overview
title: Architekturüberblick
lang: de
tags: [architektur, überblick, komponenten]
---

# Architekturüberblick

Raumreservation ist eine klassische Webanwendung mit getrenntem Frontend und Backend. Dieses Dokument gibt einen Überblick über die Bausteine und ihre Beziehungen.

## Bausteine

| Baustein | Technologie | Aufgabe |
|---|---|---|
| Backend | Spring Boot (Java) | Fachlogik, REST-API, Hintergrundjobs |
| Frontend | Angular | Benutzeroberfläche im Browser |
| Datenbank | H2 in der Entwicklung, verwaltete relationale Datenbank in Produktion | Persistenz |
| Kalender-Integration | Schnittstelle zum Kalenderdienst | Synchronisation von Belegungen |
| Verzeichnis-Integration | Schnittstelle zum Personalverzeichnis | Benutzer und Rollen |

### Backend

Das Backend ist in die Schichten Controller, Service und Repository gegliedert. Es stellt eine REST-API bereit, die Fehler als Problem Details meldet. Hintergrundjobs erledigen den Versand von Benachrichtigungen, die Kalender-Synchronisation und die nächtliche Bereinigung.

### Frontend

Das Frontend ist eine Angular-Anwendung mit Standalone-Komponenten. Sie spricht ausschliesslich mit der REST-API des Backends und enthält keine Fachlogik, die nicht auch im Backend geprüft würde.

## Integrationen

Die **Kalender-Integration** schreibt Belegungen in persönliche Kalender (einseitig). Die **Verzeichnis-Integration** bezieht Personen und Rollen aus dem Personalverzeichnis und wird nachts synchronisiert. Beide Integrationen sind entkoppelt: Ihr Ausfall verhindert keine Belegung.

## Umgebungen und Betrieb

Die Anwendung läuft in den Umgebungen dev, int und prod. Der Betrieb stützt sich auf Pipeline, Monitoring und Pikettdienst, die in den Betriebsdokumenten beschrieben sind.

## Wichtige Entscheide

- Wahl der Datenbank: siehe ADR-001.
- Fehlerformat der API: siehe ADR-002.
- Umgang mit gleichzeitigen Belegungen: siehe ADR-003.
