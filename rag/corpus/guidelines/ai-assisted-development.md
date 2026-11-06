---
id: guidelines-ai-assisted-development
title: KI-gestützte Entwicklung
lang: de
tags: [richtlinie, ki, entwicklung]
---

# KI-gestützte Entwicklung

KI-Werkzeuge können die Entwicklung beschleunigen, bergen aber Risiken für Datenschutz und Codequalität. Diese Richtlinie legt fest, was erlaubt ist.

## Keine Kunden- oder Projektdaten in Prompts

In Prompts dürfen keine Kunden- oder Projektdaten stehen. Dazu zählen Personendaten, Zugangsdaten, interne Hostnamen, Auszüge aus der Produktionsdatenbank und vertrauliche Dokumente. Wer ein Problem schildern möchte, ersetzt Daten durch erfundene Beispiele oder kürzt den Ausschnitt auf das Nötigste. Kommt trotzdem etwas Sensibles in einen Prompt, wird dies sofort dem Sicherheitsverantwortlichen gemeldet.

## Generierter Code durchläuft das normale Review

Code, der von einem KI-Werkzeug stammt, wird behandelt wie jeder andere Code. Er durchläuft das normale Review nach dem Vier-Augen-Prinzip, muss alle Tests bestehen und die Konventionen einhalten. Die Autorin oder der Autor des Änderungsantrags bleibt verantwortlich und versteht, was eingereicht wird. Hinweise im Antrag, welche Teile unterstützt erstellt wurden, sind erwünscht.

### Besondere Aufmerksamkeit

- erfundene Bibliotheken oder Methoden,
- fehlende Fehlerbehandlung,
- unsichere Muster bei Eingaben und Berechtigungen,
- Lizenzfragen bei grösseren übernommenen Abschnitten.

## Agenten dürfen nicht pushen

Autonome Agenten und Assistenten dürfen nicht in Repositories pushen und keine Branches auf dem zentralen Server anlegen oder verändern. Sie arbeiten in der lokalen Arbeitskopie der Entwicklerin oder des Entwicklers. Die Person prüft die Änderungen und sendet sie selbst ab.

## Zugriffe

Agenten erhalten keinen Zugriff auf Produktionsumgebungen, den Bastion-Host oder den Secret-Speicher. Für lokale Arbeit genügen synthetische Daten.

## Genehmigte Werkzeuge

Eine Liste der freigegebenen Werkzeuge wird vom Architekturteam geführt. Nicht gelistete Werkzeuge dürfen nicht mit Projektinhalten verwendet werden.
