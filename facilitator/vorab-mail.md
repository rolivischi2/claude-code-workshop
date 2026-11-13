# Vorab-Mail an die Teilnehmenden

Zum Verschicken rund eine Woche vor dem Workshop. Datum, Zeit und Raum einsetzen. Der Inhalt folgt
[SETUP.md](../SETUP.md). Ändert sich dort etwas, hier nachziehen.

---

**Betreff:** Claude Code Workshop am [Datum]: bitte vorher einrichten (20 Minuten)

Hallo zusammen

Am [Datum] von [Zeit] bis [Zeit] machen wir im [Raum] den Claude Code Workshop: zweieinhalb Stunden,
zum grössten Teil Übungen im Terminal. Damit wir am Nachmittag nicht installieren müssen, richtet bitte
**bis am Vortag** euren Laptop ein. Das dauert rund 20 Minuten, das meiste ist Download.

**1. Voraussetzungen**

- Git
- Java (JDK) 21 oder neuer
- Node.js 22.22.3 oder 24.15 und neuer (LTS). Ein älteres Node 22 genügt nicht.
- Chrome oder Edge
- Claude Code, eingeloggt mit eurem **claude.ai-Konto** (Pro reicht). Kein API-Key.

Wie ihr das installiert und prüft, steht in der Anleitung im Repo (SETUP.md, Abschnitte 1 und 2).

**2. Repo klonen und einrichten**

```
git clone https://github.com/rolivischi2/claude-code-workshop
cd claude-code-workshop
scripts/setup.sh
scripts/check-setup.sh
```

Die Befehle gelten für macOS, Linux und Git Bash unter Windows. Für PowerShell stehen die Varianten in SETUP.md.
Zeigt `check-setup` alles grün, seid ihr bereit.

**3. Wenn ihr nichts installieren dürft**

Dann nehmt den Devcontainer (GitHub Codespaces oder Docker). Auch das steht in SETUP.md, «Variante B».

**4. Wenn etwas nicht geht**

Schaut zuerst in SETUP.md unter «Probleme?». Hilft das nicht, meldet euch bis am Vortag bei mir, mit der
Fehlermeldung. Am Nachmittag selbst haben wir dafür keine Zeit.

**Links**

- Repo und Anleitung: https://github.com/rolivischi2/claude-code-workshop (zuerst SETUP.md)
- Folien des Nachmittags: https://claude-code-workshop-black.vercel.app

Was euch erwartet: Kontext und `CLAUDE.md`, Skills, Plan Mode, Permissions und Hooks, ein Browser über MCP,
dazu zwei Demos (Suche in Zolldokumentation, mehrere Agenten parallel). Am Ende jedes Blocks frage ich euch
nach einem Beispiel aus euren Projekten. Überlegt euch gern vorher eines.

Gruss
Roland
