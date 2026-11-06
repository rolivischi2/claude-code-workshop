# Übung 14 – Entkopplung von Ausführung und Steuerung: Remote Control

**Block:** Mittag (Live-Demo) · **Zeitbudget:** 10 Minuten, für euch optional

## Ziel

Eine lokale Session vom Handy aus weiterführen und steuern.

## Konzept

Die Session soll weiterlaufen und steuerbar bleiben, auch wenn man nicht am Rechner sitzt.
Mit **Remote Control** bleiben Ausführung und Dateizugriff lokal, das Handy ist nur das
Fenster. Verwandte Ideen: Push-Benachrichtigungen, headless `claude -p` für Skripte und CI,
und Cloud-Sessions, die gar nicht mehr auf eurem Rechner laufen.

## Demo (Facilitator)

Vor dem Mittag startet ein Facilitator eine längere Aufgabe mit Remote Control und steuert
sie während der Pause vom Handy aus. Nach dem Mittag schauen wir das Ergebnis gemeinsam an.

## Aufgabe (optional)

1. Eine der drei Varianten:
   - in einer laufenden Session: `/remote-control` (kurz `/rc`)
   - neue Session, fernsteuerbar: `claude --remote-control`
   - reiner Server-Modus mit QR-Code: `claude remote-control`
2. Am Handy die Claude-App öffnen (Bereich «Code») oder claude.ai/code im Browser.
   Die Session erscheint dort. Bei `claude remote-control` zeigt die Leertaste einen QR-Code.
3. Vom Handy aus eine kleine Frage stellen, z.B. «Welche Tests gibt es im Backend?».
4. Beobachten: Die Tools laufen auf eurem Rechner, das Handy zeigt nur Verlauf und Freigaben.

## Vorgeschlagene Prompts

```
Welche Tests gibt es im Backend, und welche davon decken die Warteliste ab?
```

## Erfolgskriterium

Keines. Wer mag, hat eine Antwort auf dem Handy gesehen.

<details>
<summary>Hinweise</summary>

- Voraussetzung: claude.ai-Login mit Abo (Pro reicht). Mit API-Key steht Remote Control nicht zur Verfügung.
- In Team- und Enterprise-Organisationen muss ein Admin die Funktion freischalten.
- Der Rechner muss eingeschaltet bleiben und die Session offen.
- Freigaben (Permissions) gelten weiter. Ein `deny` bleibt auch vom Handy aus ein `deny`.

</details>

## Token-Tipp

Remote Control selbst kostet nichts extra. Es ist dieselbe Session.

## Doku

- [Remote Control](https://code.claude.com/docs/en/remote-control) · [Claude Code on mobile](https://code.claude.com/docs/en/mobile) · [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) · [Use Claude Code in the cloud](https://code.claude.com/docs/en/claude-code-on-the-web)
