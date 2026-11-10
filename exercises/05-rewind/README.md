# Übung 05 – Reversibilität mit `/rewind`

**Block:** B – Steuerung · **Zeitbudget:** 5 Minuten

## Ziel

Mit `/rewind` zu einem früheren Stand zurückspringen, mit Git vergleichen und wieder nach vorne kommen.

## Konzept

Mutig experimentieren geht nur mit einem Netz, das Fehler auffängt. Claude Code legt vor
jedem Prompt einen Checkpoint an. `/rewind` (oder zweimal Esc) setzt Code, Konversation oder
beides zurück. Sessions lassen sich fortsetzen und verzweigen. Für alles Dauerhafte gibt es Git.

## Aufgabe

Voraussetzung: dieselbe Session wie in Übung 04 (auch nach `claude -c`).

1. Stand von Übung 04 sichern: `git add -A && git commit -m "Add formatting and protection hooks"`
2. `/rewind` aufrufen (oder Esc Esc bei leerem Prompt) und den Punkt **vor** Prompt 3 aus Übung 04 (Schutz-Hook bauen) wählen.
3. «Restore code and conversation» wählen.
4. Im Terminal vergleichen: `git status` und `git diff --stat`. Welche Dateien sind zurückgesetzt?
5. Wieder nach vorne: `git restore .` holt den committeten Stand zurück.
6. Kontrolle: `git status` ist sauber, `ls .claude/hooks` zeigt beide Skripte.
7. **Vor der Pause** die App für Übung 06 starten, in zwei weiteren Terminals. Sie läuft während der Pause hoch:
   ```bash
   cd app/backend && ./mvnw -q spring-boot:run       # Windows: mvnw.cmd -q spring-boot:run
   cd app/frontend && npm start                       # http://localhost:4200
   ```

## Vorgeschlagene Prompts

Keine. Diese Übung läuft über `/rewind` und Git.

## Erfolgskriterium

Nach Schritt 5 stimmt der Stand wieder mit dem Commit überein:

```bash
git status --short       # leer
```

<details>
<summary>Hinweise</summary>

- Checkpoints erfassen Änderungen über Claudes Datei-Werkzeuge (Edit/Write). **Nicht** erfasst sind
  Dateien, die nur per Bash, von einem Subagent oder von aussen geändert worden sind. Hat Claude eine Datei
  aber einmal selbst editiert, nimmt der Rewind auch spätere Bash-Änderungen an ihr zurück.
- Spannende Frage: Der Hook aus Übung 04 hat `FristFormatter.java` per Maven umformatiert,
  also **nicht** über Edit. Was zeigt `git diff` nach dem Rewind für diese Datei?
- Und `format-edited-file.mjs`? Das habt ihr mit `cp` kopiert, nicht Claude mit Write. Was macht der Rewind damit?
- «Restore conversation» allein ist nützlich, wenn der Code gut ist, die Diskussion aber in eine Sackgasse gelaufen ist.
- Checkpoints sind lokal und an die Session gebunden. Git ist das Netz fürs Team.

</details>

## Token-Tipp

Ein Rewind der Konversation **spart** Kontext: Der Irrweg verschwindet aus dem Verlauf, statt ihn mit «vergiss das wieder» zu überlagern.

## Doku

- [Checkpointing](https://code.claude.com/docs/en/checkpointing) · [Manage sessions](https://code.claude.com/docs/en/sessions)
