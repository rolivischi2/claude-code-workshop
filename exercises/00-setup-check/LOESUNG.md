# Lösung 00 – Setup-Check

Nichts zu bauen. Erwarteter Zustand nach der Übung:

- `scripts/check-setup.sh` war Hausaufgabe und lief vor dem Workshop grün: Java 21+, Node, Claude Code,
  «Eingeloggt mit claude.ai-Konto», Chrome oder Edge, `.env` vorhanden, Backend- und Frontend-Tests.
  Eine Warnung nur bei fehlendem Chrome/Edge (dann geht alles ausser Übung 06). In der Übung selbst läuft es nicht nochmals.
- `/status` zeigt das claude.ai-Konto, nicht «API key». `ANTHROPIC_API_KEY` ist nicht gesetzt.
- `/model` steht auf Sonnet.
- `/usage` zeigt den Verbrauch im 5-Stunden-Fenster und in der Woche.
- Die Startbelegung aus `/context` ist notiert (System-Prompt, Tool-Definitionen, Memory-Dateien).
  Auf `main` gibt es weder CLAUDE.md noch Skills noch MCP-Server: Das ist der kleinste Wert des Nachmittags.

Diskussionsfrage für den Einstieg: Welche Teile der Karte (Modell, Loop, Tools, Kontext,
Steuerung) seht ihr in `/context` schon, bevor ihr etwas gefragt habt?
