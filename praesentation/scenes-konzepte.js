/* Konzept-Szenen für die Input-Teile des Nachmittags (Einstieg, A, B, C, D, Abschluss).
 * Läuft auf dem Motor in viz.js. Keine Daten, alles Schema.
 * Aussagen zu Reihenfolgen und Verhalten sind gegen code.claude.com/docs geprüft (Stand 2026-11-10):
 * permissions, hooks, checkpointing, context-window, skills, sub-agents, worktrees, mcp. */
'use strict';
(function () {
  var h = VIZ.h, at = VIZ.at, ui = VIZ.ui;

  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  /* Elemente nacheinander kurz aufleuchten lassen */
  function chase(els, gap, cls) {
    els.forEach(function (el, i) {
      VIZ.later(function () { el.classList.add(cls || 'glow'); }, i * gap);
      VIZ.later(function () { el.classList.remove(cls || 'glow'); }, i * gap + gap * 1.5);
    });
  }
  function tag(t) { return h('span', { class: 'ex-tag', text: t }); }
  function chip(label, where, cls) { return h('div', { class: 'kchip ' + (cls || '') }, h('b', { text: label }), where ? tag(where) : null); }
  function node(id, label, sub) { return h('div', { class: 'lnode', id: 'n-' + id }, h('b', { text: label }), sub ? h('span', { text: sub }) : null); }
  function arrow(t) { return h('span', { class: 'larrow', text: t || '→' }); }

  /* ===================== 1 Landkarte / 6 Rückblick ===================== */
  function karte(stage, recap) {
    var b = function (n) { return recap ? 0 : n; };
    stage.appendChild(at(h('div', { class: 'band band-steer' }, h('span', { class: 'band-label', text: 'Steuerung' }),
      chip('Plan Mode', 'Übung 03'), chip('Permissions', 'Übung 04'), chip('Hooks', 'Übung 04'), chip('Rewind', 'Übung 05')), b(3), 'up'));
    stage.appendChild(h('div', { class: 'loop' },
      at(node('prompt', 'Prompt', 'von euch'), 0, 'left'), at(arrow(), 0, 'fade', 150),
      h('div', { class: 'loop-core' },
        at(node('modell', 'Modell', 'wählt den nächsten Schritt'), 0, 'pop', 200), at(arrow(), 0, 'fade', 350),
        at(node('tool', 'Tool-Aufruf', 'Read, Edit, Bash, MCP …'), 0, 'pop', 400), at(arrow(), 0, 'fade', 550),
        at(node('ergebnis', 'Ergebnis', 'kommt in den Kontext'), 0, 'pop', 600),
        at(h('div', { class: 'loop-back' }, h('span', { text: '↺ Agentic Loop: wiederholt sich, bis das Modell keinen Tool-Aufruf mehr macht' })), b(1), 'fade')),
      at(arrow(), b(1), 'fade', 300), at(node('antwort', 'Antwort', 'an euch'), b(1), 'right', 300)));
    stage.appendChild(at(h('div', { class: 'band band-ctx' }, h('span', { class: 'band-label', text: 'Kontext' }),
      chip('System-Prompt', null, 'plain'), chip('CLAUDE.md', 'Übung 01'), chip('Skills', 'Übung 02'), chip('Verlauf', null, 'plain'), chip('Tool-Ergebnisse', null, 'plain')), b(2), 'up'));
    stage.appendChild(at(h('div', { class: 'band band-ext' }, h('span', { class: 'band-label', text: 'Erweitern und skalieren' }),
      chip('MCP', 'Übung 06'), chip('Agentic Search vs. RAG', 'Demo R'), chip('Subagents', 'Demo D'), chip('Worktrees', 'Demo D')), b(4), 'up'));
  }
  function runLoop() {
    var ids = ['modell', 'tool', 'ergebnis', 'modell', 'tool', 'ergebnis', 'modell', 'antwort'];
    chase(ids.map(function (i) { return document.getElementById('n-' + i); }), 420);
  }
  VIZ.defs.karte = {
    id: 'karte', nav: 'Überblick', title: 'Claude Code ist eine Harness',
    lead: 'Ein Modell in einer Schleife, mit Tools, Kontext und Steuerung. Jede Übung von heute gehört zu einem dieser Teile.',
    beats: 5,
    render: function (stage) { karte(stage, false); },
    step: function (b, animate) { if (b === 1 && animate) runLoop(); }
  };
  VIZ.defs.rueckblick = {
    id: 'rueckblick', nav: 'Rückblick', title: 'Rückblick',
    lead: 'Alle Teile der Harness, je mit der Übung oder Demo von heute.',
    beats: 1,
    render: function (stage) {
      stage.classList.add('recap');
      karte(stage, true);
    },
    step: function (b, animate, from) { if (b === 0 && animate && from < 0) VIZ.later(runLoop, 900); }
  };

  /* ===================== Ausblick: heute nicht behandelt ===================== */
  /* Angaben gemäss code.claude.com/docs (remote-control, claude-code-on-the-web, headless, routines), Stand November 2026. */
  var AUSBLICK = [
    { main: true, name: 'Remote Control', was: 'Eine lokale Session vom Handy oder vom Browser aus weiterführen. Sie läuft weiterhin auf eurem Rechner, mit euren Dateien und Tools. Der Rechner muss eingeschaltet bleiben.',
      wie: [['/remote-control', 'in der laufenden Session'], ['claude --remote-control', 'beim Start']] },
    { main: true, name: 'Claude Code on the web', was: 'Eine Session läuft in einer Cloud-Umgebung von Anthropic, auch wenn der Laptop zu ist. Sie arbeitet auf einem GitHub-Repo und pusht ihr Ergebnis als Branch.',
      wie: [['claude.ai/code', 'im Browser'], ['claude --cloud "Auftrag"', 'aus dem Terminal'], ['claude --teleport', 'holt die Session ins Terminal']] },
    { name: 'Ohne Dialog: claude -p', was: 'Ein Prompt, eine Antwort, dann endet der Prozess. Für Skripte und CI.',
      wie: [['claude -p "Auftrag"', 'Ausgabe auf stdout']] },
    { name: 'Scheduled Tasks', was: 'Cloud-Sessions nach Zeitplan oder auf ein GitHub-Ereignis hin, zum Beispiel jede Nacht. Research Preview.',
      wie: [['/schedule', 'anlegen und verwalten']] }
  ];
  VIZ.defs.ausblick = {
    id: 'ausblick', nav: 'Ausblick', title: 'Ausblick: heute nicht behandelt',
    lead: 'Vier Funktionen für später. Alle laufen mit dem claude.ai-Login, auch im Pro-Abo.',
    beats: 1,
    render: function (stage) {
      stage.appendChild(h('div', { class: 'ab' }, AUSBLICK.map(function (c, i) {
        return at(h('div', { class: 'ab-card' + (c.main ? ' is-main' : '') }, h('b', { text: c.name }), h('p', { text: c.was }),
          c.wie.map(function (w) { return h('p', { class: 'ab-how' }, h('code', { text: w[0] }), ' ' + w[1]); })), 0, 'up', 150 + i * 150);
      })));
      stage.appendChild(at(ui.note('Bei Cloud-Sessions verlässt der Code euren Rechner. Vorher klären, ob das für euer Projekt erlaubt ist. Doku: code.claude.com/docs'), 0, 'fade', 900));
    }
  };

  /* ===================== 2 Kontext als Budget ===================== */
  /* Breiten in Prozent des Kontextfensters pro Beat. Schema, bewusst nicht gemessen:
     Die Folie zeigt Verhältnisse, die eigene Zahl liefert /context in Übung 00. */
  var SEG = [
    { id: 'sys', label: 'System-Prompt und Tools', kind: 'always', w: [0, 8, 8, 8, 8, 8] },
    { id: 'md', label: 'CLAUDE.md, Memory', kind: 'always', w: [0, 2, 2, 2, 2, 2] },
    { id: 'desc', label: 'Skill-Beschreibungen, MCP-Toolnamen', kind: 'always', w: [0, 2, 2, 2, 2, 2] },
    { id: 'talk', label: 'Verlauf (Prompts, Antworten)', kind: 'talk', w: [0, 0, 3, 10, 3, 4] },
    { id: 'tools', label: 'Tool-Ergebnisse (gelesene Dateien, Ausgaben)', kind: 'tool', w: [0, 0, 11, 30, 0, 3] },
    { id: 'skill', label: 'Skill-Inhalt, erst bei Bedarf', kind: 'demand', w: [0, 0, 0, 0, 0, 6] }
  ];
  var CAPTION = [
    'Das Kontextfenster ist alles, was das Modell sieht. Was nicht darin steht, kennt es nicht.',
    'Bereits belegt, bevor ihr etwas eingebt. Das ist eure Zahl aus /context in Übung 00.',
    'Turn 1: Der Prompt ist klein. Gross sind die Dateien und Ausgaben, die Claude dafür liest.',
    'Jeder Turn sendet den gesamten bisherigen Kontext erneut. Der Prompt-Cache senkt den Preis für den unveränderten Anfang, nicht die Grösse.',
    '/compact ersetzt den Verlauf durch eine Zusammenfassung. /clear löscht ihn.',
    'Progressive Disclosure: Von einem Skill ist nur die Beschreibung immer geladen. Der Inhalt wird erst geladen, wenn die Aufgabe dazu passt.'
  ];
  function total(b) { return SEG.reduce(function (n, s) { return n + s.w[b]; }, 0); }
  VIZ.defs.kontext = {
    id: 'kontext', nav: 'Kontext', title: 'Kontext ist ein Budget',
    lead: 'Was immer geladen ist, kostet in jedem Turn. Was erst bei Bedarf geladen wird, kostet nur dann.',
    beats: 6,
    guess: function () {
      return { before: 1, question: 'Wie viel Kontext ist in Übung 00 belegt gewesen, bevor ihr etwas eingegeben habt?',
        options: ['unter 5 %', '5 bis 15 %', 'über 15 %'], correct: null,
        reveal: 'Eure Zahl aus /context. Dieser Anteil wird in jedem Turn mitgesendet.' };
    },
    render: function (stage) {
      stage.appendChild(h('div', { class: 'cx' },
        h('div', { class: 'cx-head' }, h('span', { text: 'Kontextfenster' }), h('span', { class: 'cx-fill', id: 'cx-fill' }), h('span', { class: 'schema', text: 'schematisch' })),
        h('div', { class: 'cx-bar', id: 'cx-bar' }, SEG.map(function (s) {
          return h('div', { class: 'cx-seg k-' + s.kind, id: 'seg-' + s.id, style: { width: '0%' } }, h('span', { text: s.label }));
        }))));
      stage.appendChild(h('div', { class: 'legend cx-legend' },
        h('span', {}, h('i', { class: 'sw k-always' }), 'immer geladen'),
        h('span', {}, h('i', { class: 'sw k-talk' }), 'Verlauf'),
        h('span', {}, h('i', { class: 'sw k-tool' }), 'Tool-Ergebnisse'),
        h('span', {}, h('i', { class: 'sw k-demand' }), 'erst bei Bedarf')));
      stage.appendChild(h('div', { class: 'cx-turns' }, [2, 3, 3].map(function (b, i) {
        var w = i === 1 ? Math.round((total(2) + total(3)) / 2) : total(b);
        return at(h('div', { class: 'cx-turn' }, h('span', { class: 'cx-turn-label', text: 'Turn ' + (i + 1) + ' sendet' }),
          h('span', { class: 'cx-turn-bar', style: { width: w + '%' } })), b, 'grow', i === 2 ? 350 : i === 1 ? 0 : 0);
      })));
      stage.appendChild(h('p', { class: 'cx-caption', id: 'cx-caption' }));
    },
    step: function (b, animate) {
      SEG.forEach(function (s) {
        var el = document.getElementById('seg-' + s.id);
        el.style.width = s.w[b] + '%';
        el.classList.toggle('named', s.w[b] >= 6);
        if (s.id === 'talk') el.firstChild.textContent = b === 4 ? 'Zusammenfassung' : s.label;
      });
      document.getElementById('cx-fill').textContent = b ? 'ca. ' + total(b) + ' % belegt' : 'leer';
      var c = document.getElementById('cx-caption');
      c.textContent = CAPTION[b];
      if (animate) VIZ.anim(c, VIZ.ENTER.up);
    }
  };

  /* ===================== 3 Leitplanken ===================== */
  var GATES = [
    { id: 'pre', label: 'PreToolUse-Hook', sub: 'Exit 2 blockiert' },
    { id: 'deny', label: 'deny-Regel?', sub: 'hat immer Vorrang' },
    { id: 'ask', label: 'ask-Regel?', sub: 'Rückfrage an euch' },
    { id: 'allow', label: 'allow-Regel oder Modus', sub: 'sonst Rückfrage' },
    { id: 'run', label: 'Tool läuft', sub: '' },
    { id: 'post', label: 'PostToolUse-Hook', sub: 'z.B. formatieren' }
  ];
  /* stop: Index des Tors, an dem der Aufruf hängen bleibt (-1 = läuft durch) */
  var CALLS = [
    null,
    { call: 'Edit  FristFormatter.java', stop: -1, kind: 'hit', out: 'Kein Tor hält den Aufruf auf. Danach formatiert der PostToolUse-Hook diese eine Datei. Das kostet keine Tokens.' },
    { call: 'Read  .env', stop: 1, kind: 'miss', out: 'Verweigert. Eine deny-Regel wird vor ask und allow geprüft, unabhängig davon, in welcher Settings-Datei sie steht.' },
    { call: 'Edit  src/generated/api-types.ts', stop: 0, kind: 'miss', out: 'Der Hook endet mit Exit-Code 2. Seine Meldung (stderr) geht an Claude zurück. Die Regeln werden nicht mehr geprüft.' },
    { call: 'Bash  rm -r scratch/wegwerf', stop: 2, kind: 'ask', out: 'Claude hält an und fragt nach. Ihr entscheidet.' }
  ];
  VIZ.defs.leitplanken = {
    id: 'leitplanken', nav: 'Leitplanken', title: 'Autonomie braucht Leitplanken',
    lead: 'Jeder Tool-Aufruf wird in dieser Reihenfolge geprüft. Eine Anweisung in der CLAUDE.md kann das Modell übersehen, eine Regel nicht.',
    beats: 5,
    guess: function () {
      return { before: 2, question: 'Das Projekt hat eine allow-Regel, eure User-Settings haben eine deny-Regel für denselben Aufruf. Welche gilt?',
        options: ['allow, weil das Projekt Vorrang hat', 'deny'], correct: 1,
        reveal: 'Geprüft wird in der Reihenfolge deny, ask, allow. Das gilt über alle Settings-Dateien hinweg.' };
    },
    render: function (stage) {
      stage.appendChild(h('div', { class: 'lp-call', id: 'lp-call' }, h('span', { class: 'lp-call-label', text: 'Claude schlägt vor' }), h('code', { id: 'lp-code', text: '…' })));
      stage.appendChild(h('div', { class: 'gates' }, GATES.map(function (g, i) {
        return [i ? h('span', { class: 'gate-arrow', text: '→' }) : null,
          at(h('div', { class: 'gate', id: 'g-' + g.id, 'data-i': i }, h('b', { text: g.label }), h('span', { text: g.sub })), 0, 'up', i * 90)];
      })));
      stage.appendChild(h('div', { class: 'verdict lp-out', id: 'lp-out' }, h('p', { class: 'verdict-big', id: 'lp-big' }), h('p', { class: 'verdict-line', id: 'lp-line' })));
    },
    step: function (b, animate) {
      var c = CALLS[b] || null, out = document.getElementById('lp-out');
      document.getElementById('lp-call').classList.toggle('hid', !c);
      out.classList.toggle('hid', !c);
      each('.gate', function (g) { g.classList.remove('pass', 'stop', 'wait', 'skip'); });
      if (!c) return;
      document.getElementById('lp-code').textContent = c.call;
      out.className = 'verdict lp-out ' + (c.kind === 'ask' ? 'warn' : c.kind) + (animate && VIZ.motion ? ' hid' : '');
      document.getElementById('lp-big').textContent = c.kind === 'hit' ? 'Ausgeführt' : c.kind === 'ask' ? 'Rückfrage' : 'Blockiert';
      document.getElementById('lp-line').textContent = c.out;
      var gates = document.querySelectorAll('.gate'), end = c.stop < 0 ? gates.length - 1 : c.stop, gap = animate ? 330 : 0;
      for (var i = 0; i < gates.length; i++) (function (i) {
        VIZ.later(function () {
          gates[i].classList.add(i > end ? 'skip' : i < end || c.stop < 0 ? 'pass' : c.kind === 'ask' ? 'wait' : 'stop');
        }, Math.min(i, end + 1) * gap);
      })(i);
      VIZ.later(function () { out.classList.remove('hid'); VIZ.anim(out, VIZ.ENTER.up); }, (end + 1) * gap);
    }
  };

  /* ===================== 3b Rewind ===================== */
  var RW_PROMPTS = [
    ['Prompt 1', 'Endpoint angelegt'], ['Prompt 2', 'Tests ergänzt'],
    ['Prompt 3', 'Validierung ergänzt'], ['Prompt 4', 'Service umgebaut']
  ];
  VIZ.defs.rewind = {
    id: 'rewind', nav: 'Rewind', title: 'Rewind: zurück zu einem früheren Stand',
    lead: 'Vor jedem Prompt legt Claude Code einen Checkpoint an. Mit /rewind geht ihr zu einem davon zurück.',
    beats: 5,
    render: function (stage) {
      var row = h('div', { class: 'rw-line' });
      RW_PROMPTS.forEach(function (pr, i) {
        row.appendChild(at(h('div', { class: 'rw-cp', id: 'rw-cp' + i }, h('i'), h('span', { text: 'Checkpoint ' + (i + 1) })), 0, 'pop', i * 220));
        row.appendChild(at(h('div', { class: 'rw-card', id: 'rw-card' + i }, h('b', { text: pr[0] }), h('span', { text: pr[1] }),
          i === 3 ? h('em', { id: 'rw-bad', class: 'hid', text: 'Tests rot' }) : null), 0, 'up', 110 + i * 220));
      });
      row.appendChild(at(h('div', { class: 'rw-now' }, h('i'), h('span', { text: 'jetzt' })), 0, 'pop', 900));
      stage.appendChild(row);
      stage.appendChild(h('p', { class: 'rw-caption', id: 'rw-caption' }));
      function opt(label, text, d) { return at(h('div', { class: 'rw-opt' }, h('code', { text: label }), h('span', { text: text })), 3, 'up', d); }
      stage.appendChild(h('div', { class: 'rw-opts' },
        opt('Restore code and conversation', 'Dateien und Verlauf sind wieder auf dem Stand des Checkpoints.', 0),
        opt('Restore conversation', 'Nur der Verlauf geht zurück. Die Dateien bleiben, wie sie sind.', 150),
        opt('Restore code', 'Nur die Dateien gehen zurück. Der Verlauf bleibt.', 300)));
      stage.appendChild(at(ui.note('Erfasst werden Änderungen über Edit und Write. Dateien, die nur per Bash oder von aussen geändert worden sind, bleiben unverändert. Für dauerhafte Stände: Git.'), 4, 'fade'));
    },
    step: function (b) {
      document.getElementById('rw-bad').classList.toggle('hid', b < 1);
      document.getElementById('rw-card3').classList.toggle('bad', b === 1);
      document.getElementById('rw-card3').classList.toggle('undone', b >= 2);
      document.getElementById('rw-cp3').classList.toggle('target', b >= 2);
      document.getElementById('rw-caption').textContent = [
        'Jeder Punkt ist ein Checkpoint: der Stand der Dateien und des Verlaufs vor dem Prompt.',
        'Prompt 4 ist schiefgegangen.',
        '/rewind (oder Esc Esc bei leerem Prompt), dann Checkpoint 4 wählen: der Stand vor Prompt 4.',
        'Danach fragt Claude Code, was zurückgesetzt wird:',
        'Danach fragt Claude Code, was zurückgesetzt wird:'][b];
    }
  };

  /* ===================== 4 MCP ===================== */
  VIZ.defs.mcp = {
    id: 'mcp', nav: 'MCP', title: 'MCP: eine Schnittstelle für alle Tools',
    lead: 'MCP (Model Context Protocol) ist ein offener Standard. Der Agent spricht jedes Tool über dasselbe Protokoll an. Ohne Standard wäre jede Anbindung eine Eigenentwicklung.',
    beats: 4,
    render: function (stage) {
      stage.appendChild(h('div', { class: 'mcp' },
        at(h('div', { class: 'mbox mbox-agent' }, h('b', { text: 'Claude Code' }), h('span', { text: 'kennt nur das Protokoll' })), 0, 'left'),
        at(h('div', { class: 'mplug' }, h('span', { text: 'MCP' }), h('i')), 1, 'grow'),
        h('div', { class: 'mservers' },
          at(h('div', { class: 'mbox mbox-main', id: 'm-pw' }, h('b', { text: 'Playwright-Server' }), h('span', { text: 'lokal, stdio · aus .mcp.json' }), tag('Übung 06')), 1, 'pop', 200),
          at(h('div', { class: 'mbox mbox-ghost' }, h('b', { text: 'Ticket-System' }), h('span', { text: 'entfernt, HTTP' })), 1, 'fade', 500),
          at(h('div', { class: 'mbox mbox-ghost' }, h('b', { text: 'Datenbank, Doku-Suche, …' }), h('span', { text: 'gleiches Protokoll' })), 1, 'fade', 650)),
        at(h('div', { class: 'mplug mplug-thin' }, h('i')), 1, 'grow', 300),
        at(h('div', { class: 'mbox mbox-world', id: 'm-app' }, h('b', { text: 'Browser mit eurer App' }), h('span', { text: 'localhost:4200' })), 0, 'right', 150)));
      var steps = ['ändern', 'im Browser ansehen', 'Fehler sehen', 'korrigieren', 'mit Test absichern'];
      stage.appendChild(at(h('div', { class: 'floop' }, h('span', { class: 'floop-label', text: 'Feedback-Loop' }),
        steps.map(function (s, i) { return [i ? h('span', { class: 'larrow', text: '→' }) : null, h('span', { class: 'fstep', text: s })]; }),
        h('span', { class: 'larrow', text: '↺' })), 2, 'up'));
      stage.appendChild(at(ui.note('Ein Agent, der sein Ergebnis selbst prüfen kann, braucht weniger Kontrolle.'), 2, 'fade', 400));
      stage.appendChild(at(h('div', { class: 'mfacts' },
        h('p', {}, h('b', { text: 'Kontext: ' }), 'Beim Start werden nur die Namen der Tools geladen. Die Beschreibungen folgen erst, wenn ein Tool gebraucht wird.'),
        h('p', {}, h('b', { text: 'Vertrauen: ' }), 'Server aus der .mcp.json eines Repos müsst ihr einmal bestätigen. Was ein Server zurückgibt, ist nicht vertrauenswürdig.')), 3, 'up'));
    },
    step: function (b, animate) {
      if (b === 2 && animate) { var s = [].slice.call(document.querySelectorAll('.fstep')); chase(s.concat(s), 380); }
    }
  };

  /* ===================== 5 Skalieren ===================== */
  VIZ.defs.skalieren = {
    id: 'skalieren', nav: 'Skalieren', title: 'Skalieren: Arbeit abgeben und parallel arbeiten',
    lead: 'Ein Subagent hält euren Kontext klein. Worktrees trennen die Dateien paralleler Sessions.',
    beats: 5,
    render: function (stage) {
      function bar(id, label, sub) {
        return h('div', { class: 'sx-row' }, h('div', { class: 'sx-label' }, h('b', { text: label }), h('span', { text: sub })),
          h('div', { class: 'cx-bar sx-bar' }, h('div', { class: 'cx-seg k-always', style: { width: '10%' } }),
            h('div', { class: 'cx-seg k-talk', id: id + '-talk', style: { width: '0%' } }),
            h('div', { class: 'cx-seg k-tool', id: id + '-tool', style: { width: '0%' } }),
            h('div', { class: 'cx-seg k-demand named', id: id + '-sum', style: { width: '0%' } }, h('span', { text: 'Bericht' }))));
      }
      stage.appendChild(h('div', { class: 'sx' },
        bar('main', 'Hauptsession', 'euer Modell'),
        at(h('div', { class: 'sx-hand', id: 'sx-hand' }, h('span', { text: '↓ Auftrag: «Review den Diff seit start/03»' }), h('span', { id: 'sx-back', class: 'hid', text: '↑ nur der Bericht' })), 1, 'fade'),
        at(bar('sub', 'Subagent «reviewer»', 'eigenes Fenster, eigenes Modell (hier Haiku)'), 1, 'up', 150),
        h('span', { class: 'schema', text: 'schematisch' })));
      stage.appendChild(at(h('div', { class: 'wt' },
        h('div', { class: 'wt-repo' }, h('b', { text: 'euer Repo' }), h('span', { text: 'ein Arbeitsverzeichnis' })),
        h('div', { class: 'wt-fan' },
          at(h('div', { class: 'wt-tree' }, h('code', { text: 'claude -w office-search' }), h('span', { text: '.claude/worktrees/office-search · Branch worktree-office-search' })), 3, 'right', 200),
          at(h('div', { class: 'wt-tree' }, h('code', { text: 'claude -w declaration-csv' }), h('span', { text: '.claude/worktrees/declaration-csv · Branch worktree-declaration-csv' })), 3, 'right', 400))), 3, 'fade'));
      stage.appendChild(at(ui.note('Jede Session hat ein eigenes Verzeichnis und einen eigenen Branch. Sie überschreiben sich nicht gegenseitig. Zusammengeführt wird mit Git, wie üblich.'), 4, 'up'));
    },
    step: function (b) {
      var set = function (id, w) { document.getElementById(id).style.width = w + '%'; };
      set('main-talk', b >= 1 ? 6 : 4); set('main-tool', 3);
      set('sub-talk', b >= 1 ? 4 : 0); set('sub-tool', b >= 1 ? 62 : 0);
      set('main-sum', b >= 2 ? 7 : 0);
      document.getElementById('sx-back').classList.toggle('hid', b < 2);
    }
  };
  /* ===================== 5b Demo D: Ankündigung ===================== */
  VIZ.defs.demolive = {
    id: 'demolive', nav: 'Demo', title: 'Demo: Subagent und Worktrees',
    lead: 'Jetzt live in meinem Terminal. Ihr schaut zu.',
    beats: 1,
    render: function (stage) {
      function part(n, title, lines, watch) {
        return at(h('div', { class: 'dl-card' },
          h('span', { class: 'dl-nr', text: 'Teil ' + n }), h('b', { text: title }),
          h('ol', {}, lines.map(function (l) { return h('li', {}, l[0] ? h('code', { text: l[0] }) : null, h('span', { text: l[1] })); })),
          h('p', { class: 'dl-watch' }, h('b', { text: 'Achtet auf: ' }), watch)), 0, 'up', 150 + n * 150);
      }
      stage.appendChild(h('div', { class: 'dl' },
        part(1, 'Reviewer-Subagent', [
          ['/context', 'Belegung vorher'],
          [null, 'Auftrag: Der Subagent «reviewer» prüft den Diff seit start/03'],
          ['/context', 'Belegung nachher']
        ], 'Wie stark wächst der Kontext der Hauptsession?'),
        part(2, 'Zwei Sessions in Worktrees', [
          ['claude -w office-search', 'Session 1: Suche nach Zollstellen'],
          ['claude -w declaration-csv', 'Session 2: CSV-Export'],
          ['git worktree list', 'zeigt beide Verzeichnisse']
        ], 'Wo liegen die Dateien der beiden Sessions?')));
      stage.appendChild(at(ui.note('Nach der Demo zeigt die nächste Folie den Ablauf nochmals als Bild.'), 0, 'fade', 700));
    }
  };

  /* ===================== 5c Demo D: Ablauf als Bild ===================== */
  VIZ.defs.demoablauf = {
    id: 'demoablauf', nav: 'Ablauf', title: 'Ablauf der Demo',
    lead: 'Was im Terminal passiert ist: zuerst der Subagent, dann die Worktrees.',
    beats: 5,
    render: function (stage) {
      var s = VIZ.s;
      function txt(x, y, cls, t, anchor) { return s('text', { x: x, y: y, class: cls, 'text-anchor': anchor || 'start', text: t }); }
      function line(x1, x2, y, cls) { return s('path', { d: 'M' + x1 + ' ' + y + ' H' + x2, class: 'fl-line ' + cls, pathLength: 1 }); }
      function curve(x1, y1, x2, y2, cls) {
        var m = (x1 + x2) / 2;
        return s('path', { d: 'M' + x1 + ' ' + y1 + ' C' + m + ' ' + y1 + ',' + m + ' ' + y2 + ',' + x2 + ' ' + y2, class: 'fl-line ' + cls, pathLength: 1 });
      }
      function dot(x, y, cls, r) { return s('circle', { cx: x, cy: y, r: r || 11, class: 'fl-dot ' + cls }); }
      var g = s('svg', { class: 'fl', viewBox: '0 0 1600 620', preserveAspectRatio: 'xMidYMid meet' });
      function add(el, beat, enter, delay) { g.appendChild(at(el, beat, enter, delay)); }

      /* Teil 1: Subagent */
      add(txt(0, 26, 'fl-part', 'Teil 1 · Subagent'), 0, 'fade');
      add(txt(0, 92, 'fl-lane', 'Hauptsession'), 0, 'fade');
      add(txt(0, 116, 'fl-sub', 'euer Modell, euer Kontext'), 0, 'fade');
      add(line(360, 520, 95, 'c-main'), 0, 'draw', 100);
      add(dot(520, 95, 'c-main'), 0, 'pop', 600);
      add(txt(520, 60, 'fl-tag', 'Auftrag: «Review den Diff seit start/03»', 'middle'), 0, 'fade', 700);

      add(txt(0, 212, 'fl-lane', 'Subagent «reviewer»'), 1, 'fade');
      add(txt(0, 236, 'fl-sub', 'Haiku, eigenes Kontextfenster'), 1, 'fade');
      add(curve(520, 95, 640, 215, 'c-sub'), 1, 'draw', 0);
      add(line(640, 1140, 215, 'c-sub'), 1, 'draw', 500);
      add(line(520, 1260, 95, 'c-main wait'), 1, 'fade', 300);
      add(txt(890, 82, 'fl-sub', 'wartet, liest selbst nichts', 'middle'), 1, 'fade', 600);
      ['git diff', 'Read', 'Grep', 'Read', 'Read'].forEach(function (t, i) {
        var x = 710 + i * 90;
        add(dot(x, 215, 'c-sub', 8), 1, 'pop', 900 + i * 260);
        add(txt(x, 250, 'fl-tool', t, 'middle'), 1, 'fade', 900 + i * 260);
      });
      add(txt(1580, 250, 'fl-sub', 'Tool-Aufrufe schematisch', 'end'), 1, 'fade', 2200);

      add(curve(1140, 215, 1260, 95, 'c-sub'), 2, 'draw', 0);
      add(dot(1260, 95, 'c-sub'), 2, 'pop', 550);
      add(txt(1260, 60, 'fl-tag c-sub', 'zurück kommt nur der Bericht', 'middle'), 2, 'fade', 600);
      add(line(1260, 1580, 95, 'c-main'), 2, 'draw', 800);
      add(txt(1580, 200, 'fl-sub', 'Der Diff bleibt im Fenster des Subagents.', 'end'), 2, 'fade', 900);

      /* Teil 2: Worktrees */
      add(s('path', { d: 'M0 300 H1600', class: 'fl-rule' }), 3, 'fade');
      add(txt(0, 340, 'fl-part', 'Teil 2 · Worktrees'), 3, 'fade');
      add(txt(0, 486, 'fl-lane', 'euer Branch'), 3, 'fade');
      add(txt(0, 510, 'fl-sub', 'Stand beim Start der Sessions'), 3, 'fade');
      add(line(360, 1580, 480, 'c-main'), 3, 'draw', 0);
      add(dot(440, 480, 'c-main'), 3, 'pop', 300);
      add(txt(0, 398, 'fl-code', 'claude -w office-search'), 3, 'fade', 500);
      add(txt(0, 422, 'fl-sub', 'Branch worktree-office-search'), 3, 'fade', 500);
      add(txt(0, 558, 'fl-code', 'claude -w declaration-csv'), 3, 'fade', 500);
      add(txt(0, 582, 'fl-sub', 'Branch worktree-declaration-csv'), 3, 'fade', 500);
      add(curve(440, 480, 560, 400, 'c-a'), 3, 'draw', 500);
      add(curve(440, 480, 560, 560, 'c-b'), 3, 'draw', 500);
      add(line(560, 1080, 400, 'c-a'), 3, 'draw', 1000);
      add(line(560, 1220, 560, 'c-b'), 3, 'draw', 1000);
      [[660, 400, 'c-a'], [740, 560, 'c-b'], [840, 400, 'c-a'], [920, 560, 'c-b'], [1000, 400, 'c-a'], [1100, 560, 'c-b']].forEach(function (c, i) {
        add(dot(c[0], c[1], c[2], 9), 3, 'pop', 1500 + i * 280);
      });
      add(txt(820, 372, 'fl-sub', 'Commits von Session 1', 'middle'), 3, 'fade', 1700);
      add(txt(920, 596, 'fl-sub', 'Commits von Session 2, gleichzeitig', 'middle'), 3, 'fade', 1900);

      add(curve(1080, 400, 1200, 480, 'c-a'), 4, 'draw', 0);
      add(dot(1200, 480, 'c-a'), 4, 'pop', 550);
      add(txt(1580, 392, 'fl-code c-a', 'git merge worktree-office-search', 'end'), 4, 'fade', 600);
      add(curve(1220, 560, 1340, 480, 'c-b'), 4, 'draw', 900);
      add(dot(1340, 480, 'c-b'), 4, 'pop', 1450);
      add(txt(1580, 600, 'fl-code c-b', 'git merge worktree-declaration-csv', 'end'), 4, 'fade', 1500);

      stage.appendChild(g);
      stage.appendChild(at(ui.note('Jede Session hat in einem eigenen Verzeichnis auf einem eigenen Branch gearbeitet. Zusammengeführt wird mit Git: git merge oder ein Pull Request pro Branch.'), 4, 'fade', 1800));
    }
  };
})();
