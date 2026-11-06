# Übung 07 – Reversibilität

**Block:** B – Steuerung & Sicherheit · **Zeitbudget:** 15 Minuten

## Ziel

Mit `/rewind` zu einem früheren Stand zurückspringen, mit Git vergleichen und wieder nach vorne kommen.

## Konzept

Mutig experimentieren geht nur mit einem Netz, das Fehler auffängt. Claude Code legt vor
jedem Edit einen Checkpoint an. `/rewind` (oder zweimal Esc) setzt Code, Konversation oder
beides zurück. Sessions lassen sich fortsetzen und verzweigen. Für alles Dauerhafte gibt es Git.

## Aufgabe

Voraussetzung: dieselbe Session wie in Übung 06.

1. Stand von Übung 06 sichern: `git add -A && git commit -m "Add formatting and protection hooks"`
2. `/rewind` aufrufen (oder Esc Esc bei leerem Prompt) und den Punkt **vor** Prompt 1 aus Übung 06 wählen.
3. «Restore code and conversation» wählen.
4. Im Terminal vergleichen: `git status` und `git diff --stat`. Welche Dateien sind zurückgesetzt?
5. Wieder nach vorne: `git restore .` holt den committeten Stand zurück.
6. Kontrolle: `git status` ist sauber, `ls .claude/hooks` zeigt beide Skripte.

## Vorgeschlagene Prompts

Keine. Diese Übung läuft über `/rewind` und Git.

## Erfolgskriterium

Nach Schritt 5 stimmt der Stand wieder mit dem Commit überein:

```bash
git status --short       # leer
```

<details>
<summary>Hinweise</summary>

- Checkpoints erfassen nur Änderungen über Claudes Datei-Werkzeuge (Edit/Write). **Nicht**
  erfasst werden Änderungen per Bash, von Subagents oder von aussen.
- Spannende Frage: Der Hook aus Übung 06 hat `DurationFormatter.java` per Maven umformatiert,
  also **nicht** über Edit. Was zeigt `git diff` nach dem Rewind für diese Datei?
- «Restore conversation» allein ist nützlich, wenn der Code gut ist, die Diskussion aber in eine Sackgasse lief.
- Checkpoints sind lokal und an die Session gebunden. Git ist das Netz fürs Team.

</details>

## Token-Tipp

Ein Rewind der Konversation **spart** Kontext: Der Irrweg verschwindet aus dem Verlauf, statt ihn mit «vergiss das wieder» zu überlagern.

## Doku

- [Checkpointing](https://code.claude.com/docs/en/checkpointing) · [Manage sessions](https://code.claude.com/docs/en/sessions)
