/* Inhalt der Übungsfolien. Quelle ist das jeweilige Übungsblatt (exercises/NN-…/README.md).
 * Prompts, Vorlagen (code) und Prüfbefehle (cmd) müssen wörtlich im Blatt stehen:
 * `node scripts/check-slides.mjs` prüft das. Schritte und Zielsätze sind für die Folie gekürzt.
 */
'use strict';
window.UEBUNGEN = [
  {
    id: 'ue00', nav: 'Übung 00', nr: '00', title: 'Setup-Check', block: 'Start', minutes: 5,
    sheet: 'exercises/00-setup-check/README.md',
    ziel: 'Alle arbeiten mit dem richtigen Login und mit Sonnet. Jede und jeder kennt die eigene Startbelegung des Kontexts.',
    aufgabe: ['Keine Programmieraufgabe. Nur vier Slash-Commands.', 'Das Setup-Skript läuft hier nicht nochmals. Windows: Befehle in Git Bash ausführen.'],
    schritte: [
      'Im Repo-Root `claude` starten.',
      '`/status`: Die Login-Methode muss euer claude.ai-Konto sein, kein API-Key.',
      '`/model sonnet`: Sonnet für den ganzen Nachmittag. Opus verbraucht das Kontingent deutlich schneller.',
      '`/usage`: aktueller Verbrauch im 5-Stunden-Fenster und in der Woche.',
      '`/context`: Wie viel Kontext ist belegt, bevor ihr etwas gefragt habt? **Zahl notieren.**',
      'Privatsphäre-Einstellung prüfen: claude.ai/settings/data-privacy-controls'
    ],
    prompts: [],
    fertig: { text: '`/status` zeigt euer claude.ai-Konto, `/model` zeigt Sonnet, die Zahl aus `/context` ist notiert.' },
    tipp: 'Slash-Commands wie `/context`, `/usage` oder `/model` verbrauchen keine Tokens.'
  },
  {
    id: 'ue01a', nav: 'Übung 01 A', nr: '01', title: 'Kontext und CLAUDE.md · Teil A: ohne CLAUDE.md', block: 'A', minutes: 7,
    sheet: 'exercises/01-kontext-und-claude-md/README.md',
    ziel: 'Sehen, was Kontext kostet. Und sehen, was Claude ohne Projektregeln baut.',
    aufgabe: ['Neuer Endpoint `GET /api/guarantees/{grn}`: liefert eine einzelne Sicherheit, sonst 404.', 'Das Ergebnis mit der Checkliste «Teamstandard» vergleichen.'],
    schritte: [
      'Frische Session. `/context` aufrufen, Startbelegung notieren.',
      'Prompt 1 absetzen, danach wieder `/context`. Was ist gewachsen?',
      '`/clear`, dann Prompt 2 absetzen.',
      'Ergebnis mit der Checkliste vergleichen. Notieren, was fehlt.',
      'Änderungen verwerfen: `git restore . && git clean -fd app/`'
    ],
    liste: { title: 'Checkliste «Teamstandard»', items: [
      'Controller → Service → Repository, keine Logik im Controller',
      'Antwort als DTO (Record) über eine `*Mapper`-Klasse, keine Entity nach aussen',
      'Unbekannte Sicherheit → `NotFoundException` → 404 als Problem Detail',
      'Service-Unit-Test und MockMvc-Test',
      '`./mvnw -q test` grün'
    ] },
    prompts: [
      { label: 'Prompt 1', text: '@app/backend/src/main/java/com/example/transit/common/GlobalExceptionHandler.java\nWelche HTTP-Status und Fehlercodes kann die API zurückgeben?' },
      { label: 'Prompt 2', text: 'Füge einen Endpoint GET /api/guarantees/{grn} hinzu, der eine einzelne Sicherheit liefert.\nGibt es die Sicherheit nicht, soll ein 404 kommen.' }
    ],
    fertig: { text: 'Ihr wisst, welche Punkte der Checkliste ohne CLAUDE.md fehlen. Die Änderungen sind verworfen.' },
    tipp: 'Ein Feature-Prompt, keine Nachbesserung. Es zählt der Vergleich der ersten Antwort.'
  },
  {
    id: 'ue01b', nav: 'Übung 01 B', nr: '01', title: 'Kontext und CLAUDE.md · Teil B: mit CLAUDE.md', block: 'A', minutes: 8,
    sheet: 'exercises/01-kontext-und-claude-md/README.md',
    ziel: 'Derselbe Prompt, diesmal mit Teamkonventionen in der CLAUDE.md. Was ändert sich am Ergebnis?',
    aufgabe: ['Die `CLAUDE.md` erzeugen, um die Teamkonventionen ergänzen und denselben Endpoint nochmals bauen lassen.'],
    schritte: [
      '`/init` ausführen und die erzeugte `CLAUDE.md` lesen.',
      'Den Abschnitt «Teamkonventionen» aus dem Übungsblatt in die `CLAUDE.md` übernehmen, kürzen, anpassen.',
      '`/clear`, Prompt 2 nochmals absetzen. Mit Teil A vergleichen.',
      'Endpoint wieder verwerfen: `git restore . && git clean -fd app/`',
      'Die `CLAUDE.md` behalten und committen.'
    ],
    prompts: [
      { label: 'Prompt 2 (wie in Teil A)', text: 'Füge einen Endpoint GET /api/guarantees/{grn} hinzu, der eine einzelne Sicherheit liefert.\nGibt es die Sicherheit nicht, soll ein 404 kommen.' },
      { label: 'Committen', text: 'git add CLAUDE.md && git commit -m "Add CLAUDE.md with team conventions"', kind: 'cmd' }
    ],
    fertig: { text: 'Teil B erfüllt die Checkliste deutlich besser als Teil A. Die `CLAUDE.md` ist committet.', cmd: 'git log --oneline -1 -- CLAUDE.md' },
    tipp: 'Achtet auf das Mapping: Ohne CLAUDE.md kopiert Claude das Muster aus `GuaranteeService`. Mit CLAUDE.md entsteht ein `GuaranteeMapper`.'
  },
  {
    id: 'ue02', nav: 'Übung 02', nr: '02', title: 'Skills', block: 'A', minutes: 15,
    sheet: 'exercises/02-skills/README.md',
    ziel: 'Einen Skill «Neuer REST-Endpoint nach Teamstandard» bauen und prüfen, ob Claude ihn von sich aus lädt.',
    aufgabe: ['Neuer Endpoint `GET /api/guarantees/{grn}/balance`: liefert den Saldo einer Sicherheit. Offen sind nur Anmeldungen mit Status `OPEN`.', 'Unbekannte Sicherheit → 404 als Problem Detail.'],
    schritte: [
      'Skill anlegen unter `.claude/skills/rest-endpoint/SKILL.md`, zusammen mit Claude (Prompt 1).',
      'Die `description` im Frontmatter kritisch lesen. Sie entscheidet, ob Claude den Skill findet.',
      'Neue Session (`/clear`). Prompt 2 absetzen, **ohne** den Skill zu erwähnen.',
      'Beobachten: Erscheint ein `Skill`-Aufruf? Falls nicht: Beschreibung schärfen, nochmals.'
    ],
    prompts: [
      { label: 'Prompt 1 (Skill bauen)', text: 'Erstelle einen Project Skill unter .claude/skills/rest-endpoint/SKILL.md. Er beschreibt\nSchritt für Schritt, wie in diesem Backend ein neuer REST-Endpoint nach unserem Teamstandard\nentsteht (Schichten, DTO-Record + Mapper, Fehler als Problem Details, Tests). Verweise auf\nbestehende Dateien als Vorlage statt Code zu kopieren. Die description im Frontmatter soll\nklar sagen, wann der Skill zu verwenden ist.' },
      { label: 'Prompt 2 (Feature, neue Session)', text: 'Wir brauchen den Endpoint GET /api/guarantees/{grn}/balance. Er liefert den Saldo einer\nSicherheit (Format siehe exercises/02-skills/README.md).' }
    ],
    fertig: { text: 'Tests grün, inklusive der neuen. Der Skill wurde geladen, ohne dass ihr ihn erwähnt habt.', cmd: 'cd app/backend && ./mvnw -q test' },
    tipp: 'Im Skill auf bestehende Dateien verweisen, statt Code hineinzukopieren. Das hält ihn kurz.'
  },
  {
    id: 'ue03', nav: 'Übung 03', nr: '03', title: 'Plan Mode', block: 'B', minutes: 15,
    sheet: 'exercises/03-plan-mode/README.md',
    ziel: 'Ein Feature zuerst planen lassen, den Plan kritisch prüfen und erst dann umsetzen.',
    aufgabe: [
      'Feature «Abgabenbetrag korrigieren»: `PUT /api/declarations/{mrn}/amount` setzt den neuen Betrag.',
      'Nur Status `OPEN`, sonst 409 `TR-4092`. Betrag grösser als 0, sonst 400.',
      'Die Sicherheit muss den **neuen** Betrag decken. Der alte Betrag derselben Anmeldung zählt nicht mehr mit. Sonst 409 `TR-4091`.'
    ],
    schritte: [
      'Neue Session. **Shift+Tab** drücken, bis unten «plan mode» steht.',
      'Prompt 1 absetzen und den Plan lesen.',
      'Plan mit der Checkliste prüfen und mit **einem** Prompt nachschärfen (Prompt 2).',
      'Plan als Spec-Datei ablegen lassen, erst dann umsetzen (Prompt 3).'
    ],
    liste: { title: 'Checkliste für die Plan-Kritik', items: [
      'Wird die bestehende Prüfung der Sicherheit wiederverwendet statt kopiert?',
      'Wird der alte Betrag aus den offenen Beträgen herausgerechnet?',
      'Sind Tests geplant: Erhöhung ok, Erhöhung zu hoch, Senkung, Status nicht `OPEN`?',
      'Was gilt genau **am** Referenzbetrag?'
    ] },
    prompts: [
      { label: 'Prompt 1 (im Plan Mode)', text: 'Plane das Feature «Abgabenbetrag korrigieren» gemäss exercises/03-plan-mode/README.md.\nZeig mir betroffene Dateien, die Logik der Prüfung gegen die Sicherheit und die geplanten Tests.' },
      { label: 'Prompt 2 (Kritik, Beispiel)', text: 'Bitte überarbeite den Plan: Nutze exceedsReferenceAmount wieder, rechne den alten Betrag der\nAnmeldung aus den offenen Beträgen heraus und ergänze einen Test für einen Betrag, der die\nSicherheit genau ausschöpft. Prüf dabei, ob exceedsReferenceAmount zu seinem Javadoc passt.' },
      { label: 'Prompt 3 (vor der Freigabe)', text: 'Speichere den finalen Plan als docs/specs/betrag-korrigieren.md und setze ihn dann um.' }
    ],
    fertig: { text: 'Tests grün, inklusive der neuen. `docs/specs/betrag-korrigieren.md` existiert.', cmd: 'cd app/backend && ./mvnw -q test' },
    tipp: 'Kritik in einem Prompt sammeln. Jeder Turn sendet den ganzen bisherigen Kontext erneut.'
  },
  {
    id: 'ue04a', nav: 'Übung 04 A', nr: '04', title: 'Permissions und Hooks · Teil A: Permissions', block: 'B', minutes: 6,
    sheet: 'exercises/04-permissions-und-hooks/README.md',
    ziel: 'Festlegen, was Claude in diesem Projekt nie darf und wo es nachfragen muss.',
    aufgabe: ['`.claude/settings.json` von Hand anlegen: `.env` lesen und `git push` verbieten, bei `rm` nachfragen.', '**Wichtig:** Bis zum Ende von Übung 05 kein `/clear` in dieser Session.'],
    schritte: [
      '`.claude/settings.json` anlegen, vorerst nur der Teil `permissions` (rechts).',
      'Claude neu starten: `/exit`, dann `claude -c`. Mit `/permissions` prüfen.',
      'Wegwerf-Ordner anlegen: `mkdir -p scratch/wegwerf`',
      'Prompt 1 und 2 absetzen. Was wird verweigert, wo fragt Claude nach?'
    ],
    code: [{ label: '.claude/settings.json (innerhalb von { … })', text: '"permissions": {\n    "deny": [\n      "Bash(git push *)",\n      "Read(./.env)",\n      "Read(./.env.*)"\n    ],\n    "ask": [\n      "Bash(rm *)"\n    ]\n  }' }],
    prompts: [
      { label: 'Prompt 1', text: 'Zeig mir den Inhalt der Datei .env. Falls das nicht geht, versuch es mit cat im Terminal.' },
      { label: 'Prompt 2', text: 'Pushe den aktuellen Branch mit git push origin HEAD und lösche danach das Verzeichnis scratch/wegwerf.' }
    ],
    fertig: { text: 'Das Lesen von `.env` wird verweigert, auch über `cat`. `git push` wird verweigert. `rm` löst eine Rückfrage aus.' },
    tipp: 'Verweigerte Tool-Aufrufe kosten fast nichts.'
  },
  {
    id: 'ue04b', nav: 'Übung 04 B', nr: '04', title: 'Permissions und Hooks · Teil B: Hooks', block: 'B', minutes: 9,
    sheet: 'exercises/04-permissions-und-hooks/README.md',
    ziel: 'Zwei Hooks einbinden: Einer formatiert nach jedem Edit die geänderte Datei, einer blockiert Edits an generiertem Code.',
    aufgabe: ['Den Formatier-Hook aus der Vorlage übernehmen, den Schutz-Hook von Claude bauen lassen.', 'Der Teil `hooks` für die `settings.json` steht im Übungsblatt.'],
    schritte: [
      'Vorher prüfen: `(cd app/backend && ./mvnw spotless:check)` meldet `FristFormatter.java`.',
      'Formatier-Hook kopieren (Befehl rechts). Lesen, nicht schreiben.',
      'Schutz-Hook von Claude bauen lassen (Prompt 3).',
      'Den Teil `hooks` aus dem Blatt in `.claude/settings.json` ergänzen.',
      'Neu starten: `/exit`, `claude -c`. Mit `/hooks` prüfen.',
      'Prompt 4 und 5 absetzen.'
    ],
    prompts: [
      { label: 'Formatier-Hook kopieren', text: 'mkdir -p .claude/hooks && cp exercises/04-permissions-und-hooks/vorlage/format-edited-file.mjs .claude/hooks/', kind: 'cmd' },
      { label: 'Prompt 3', text: 'Erstelle den PreToolUse-Hook .claude/hooks/protect-generated.mjs (Node, nur Standardbibliothek).\nEr liest das Hook-JSON von stdin. Liegt tool_input.file_path unter app/frontend/src/generated/,\nschreibt er eine Begründung auf stderr und beendet sich mit Exit-Code 2, sonst mit 0.\nTeste ihn, indem du Beispiel-JSON per stdin hineinpipst.' },
      { label: 'Prompt 4', text: 'Ergänze in app/backend/src/main/java/com/example/transit/declaration/FristFormatter.java\nein Javadoc für die Methode format.' },
      { label: 'Prompt 5', text: 'Teste unseren Schutz-Hook: Versuche, in app/frontend/src/generated/api-types.ts dem OfficeDto\nein optionales Feld description hinzuzufügen, und zeig mir die Rückmeldung des Hooks.' }
    ],
    fertig: { text: 'Der Formatier-Hook hat `FristFormatter` formatiert. Bei Prompt 5 wurde der Edit blockiert.', cmd: 'cd app/backend && ./mvnw -q spotless:check' },
    tipp: 'Ein Hook läuft ausserhalb des Modells. Formatieren per Hook kostet keine Tokens.'
  },
  {
    id: 'ue05', nav: 'Übung 05', nr: '05', title: 'Rewind', block: 'B', minutes: 5,
    sheet: 'exercises/05-rewind/README.md',
    ziel: 'Mit `/rewind` zu einem früheren Stand zurückgehen, mit Git vergleichen und wieder nach vorne kommen.',
    aufgabe: ['Dieselbe Session wie in Übung 04 (auch nach `claude -c`).', 'Am Schluss die App für Übung 06 starten. Sie fährt während der Pause hoch.'],
    schritte: [
      'Stand von Übung 04 committen (Befehl rechts).',
      '`/rewind` aufrufen (oder Esc Esc bei leerem Prompt). Den Punkt **vor** Prompt 3 aus Übung 04 wählen.',
      '«Restore code and conversation» wählen.',
      'Vergleichen: `git status` und `git diff --stat`. Welche Dateien sind zurückgesetzt?',
      'Wieder nach vorne: `git restore .`',
      '**Vor der Pause:** Backend und Frontend in zwei weiteren Terminals starten.'
    ],
    prompts: [
      { label: 'Committen', text: 'git add -A && git commit -m "Add formatting and protection hooks"', kind: 'cmd' },
      { label: 'App starten (zwei Terminals)', text: 'cd app/backend && ./mvnw -q spring-boot:run\ncd app/frontend && npm start', kind: 'cmd' }
    ],
    fertig: { text: 'Der Stand stimmt wieder mit dem Commit überein (Ausgabe leer). Die App startet.', cmd: 'git status --short' },
    tipp: 'Ein Rewind der Konversation spart Kontext: Der Irrweg verschwindet aus dem Verlauf.'
  },
  {
    id: 'ue06', nav: 'Übung 06', nr: '06', title: 'Browser über MCP', block: 'C', minutes: 17,
    sheet: 'exercises/06-browser-mcp/README.md',
    ziel: 'Den Playwright-MCP-Server einbinden. Claude reproduziert einen Frontend-Fehler selbst im Browser, behebt ihn und prüft das Ergebnis.',
    aufgabe: ['Bug: Lehnt das Backend eine Transitanmeldung ab (409, Code `TR-4091`), zeigt das Formular **keine** Meldung.'],
    schritte: [
      '`.mcp.json` im Repo-Root anlegen (Vorlage rechts).',
      'Die App läuft seit dem Ende von Übung 05. Sonst jetzt starten.',
      'Claude neu starten. Den Projekt-MCP-Server bestätigen. Mit `/mcp` prüfen: `playwright` ist verbunden.',
      'Prompt absetzen: reproduzieren, beheben, im Browser prüfen, e2e-Test ergänzen.'
    ],
    code: [{ label: '.mcp.json', text: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "node",\n      "args": ["app/frontend/node_modules/@playwright/mcp/cli.js", "--isolated"]\n    }\n  }\n}' }],
    prompts: [
      { label: 'Prompt', text: 'Im Formular «Transitanmeldung erfassen» (http://localhost:4200) erscheint keine Meldung, wenn\ndas Backend die Anmeldung ablehnt (z.B. HTTP 409, Code TR-4091).\n1. Reproduziere das im Browser mit dem Playwright-MCP-Server: Zollstelle Genève-Routes →\n   «Transitanmeldung erfassen», Bestimmung Basel/Weil-Autobahn, Sicherheit Léman Fret Sàrl,\n   Abgabenbetrag 600, Freigabe morgen.\n2. Behebe es: Bei Fehlern vom Backend soll die Meldung aus dem Problem Detail (Feld detail)\n   im Formular erscheinen, mit einem allgemeinen deutschen Text als Rückfallebene.\n3. Verifiziere die Meldung im Browser.\n4. Ergänze einen Playwright-e2e-Test in app/frontend/e2e für diesen Fall.\nFertig ist es, wenn `npm test` und `npm run e2e` in app/frontend grün sind.' }
    ],
    fertig: { text: 'e2e-Tests grün, inklusive des neuen Tests für die 409-Meldung.', cmd: '(cd app/frontend && npm run e2e)' },
    tipp: 'Browser-Snapshots sind gross. Genaue Anweisungen sparen Klick-Runden.'
  }
];

/* Ablauf des Nachmittags für die Titelfolie (Quelle: facilitator/timing.md) */
window.ABLAUF = [
  { zeit: '0:00', block: 'Start', inhalt: 'Überblick: Claude Code als Harness', praxis: 'Übung 00' },
  { zeit: '0:10', block: 'A · Kontext', inhalt: 'Kontext als Budget, CLAUDE.md, Skills', praxis: 'Übung 01, 02' },
  { zeit: '0:45', block: 'B · Steuerung', inhalt: 'Plan Mode, Permissions, Hooks, Rewind', praxis: 'Übung 03, 04, 05' },
  { zeit: '1:25', block: 'Pause', inhalt: '10 Minuten', praxis: '' },
  { zeit: '1:35', block: 'C · MCP', inhalt: 'Claude prüft sich selbst im Browser', praxis: 'Übung 06' },
  { zeit: '1:55', block: 'R · Suche', inhalt: 'Suche des Agenten vs. RAG, gemessen auf Zolldokumentation', praxis: 'Demo' },
  { zeit: '2:15', block: 'D · Skalieren', inhalt: 'Subagents und parallele Sessions', praxis: 'Live-Demo' },
  { zeit: '2:22', block: 'Schluss', inhalt: 'Rückblick, Modellwahl, Teamregeln', praxis: '' }
];
