# Lösung 05 – Reversibilität mit `/rewind`

Nichts Neues zu bauen. Der Code entspricht `solution/04`.

Was der Rewind auf «vor Prompt 3 aus Übung 04» mit «Restore code and conversation» macht:

| Datei | Wie entstanden | Nach dem Rewind |
|-------|----------------|-----------------|
| `.claude/hooks/protect-generated.mjs` | Claude per **Write** (Prompt 3) | gelöscht, es gab sie am Checkpoint noch nicht |
| `FristFormatter.java` | Claude per **Edit** (Prompt 4), danach vom Hook per **Maven** formatiert | wieder das unformatierte Original ohne Javadoc |
| `.claude/hooks/format-edited-file.mjs` | ihr per **`cp`** im Terminal | unverändert, Checkpoints kennen die Datei nicht |
| `.claude/settings.json` | ihr **von Hand** | unverändert |

Erklärung zu `FristFormatter.java`: Die Formatierung durch Maven erfasst kein Checkpoint. Weil
Claude die Datei aber vorher per Edit geändert hat, liegt der Stand **vor** diesem Edit im
Checkpoint. Der Rewind schreibt diesen Stand zurück und nimmt damit Javadoc **und** Formatierung weg.

Im Terminal danach:

- `git status`: `deleted: .claude/hooks/protect-generated.mjs`, `modified: …/FristFormatter.java`
- `git diff --stat`: nur diese zwei Dateien. Hook-Vorlage und `settings.json` fehlen in der Liste.
- `git restore .` holt beide aus dem Commit zurück, auch die gelöschte Datei. Danach ist `git status --short` leer.

Worauf achten:

- Hätte Claude den Hook per Bash geschrieben (`cat > … <<EOF`), wäre er beim Rewind **stehen geblieben**.
  Checkpoints erfassen nur Edit/Write, keine Bash-Befehle, keine Subagents, keine Änderungen von aussen.
- Zwischen Rewind und `git restore` zeigt `settings.json` noch auf den gelöschten Schutz-Hook.
  Ein Edit in dieser Zeit meldet einen (nicht blockierenden) Hook-Fehler.
- Die Konversation ist nach dem Rewind kürzer: Prompt 3 bis 5 sind weg, `/context` zeigt weniger.

Merksatz: **Checkpoints sind das Undo der Session, Git ist das Netz des Teams.**
