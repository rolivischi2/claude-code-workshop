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
    id: 'rueckblick', nav: 'Rückblick', title: 'Rückblick: alle Teile im Einsatz',
    lead: 'Jedes dieser Teile habt ihr heute selbst benutzt.',
    beats: 2,
    render: function (stage) {
      stage.classList.add('recap');
      karte(stage, true);
      stage.appendChild(at(h('p', { class: 'recap-q', text: 'Welches Teil setzt ihr am Montag als Erstes ein?' }), 1, 'up'));
    },
    step: function (b, animate, from) { if (b === 0 && animate && from < 0) VIZ.later(runLoop, 900); }
  };

  /* ===================== 2 Kontext als Budget ===================== */
  /* Breiten in Prozent des Kontextfensters pro Beat. SCHEMA, nicht gemessen.
     Nach dem Dry-Run hier die echten Werte aus /context eintragen. */
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
      return { before: 1, question: 'Wie viel Kontext war in Übung 00 belegt, bevor ihr etwas eingegeben habt?',
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
    beats: 6,
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
      var cps = ['Prompt 1', 'Prompt 2', 'Prompt 3', 'Prompt 4', 'jetzt'];
      stage.appendChild(at(h('div', { class: 'rewind' },
        h('div', { class: 'rewind-head' }, h('b', { text: '/rewind' }), h('span', { text: 'Vor jedem Prompt legt Claude Code einen Checkpoint an. Zurücksetzen lassen sich Code, Konversation oder beides.' })),
        h('div', { class: 'rewind-line' }, cps.map(function (c, i) { return h('div', { class: 'cp', 'data-i': i }, h('i'), h('span', { text: c })); })),
        h('p', { class: 'muted small', text: 'Erfasst werden Änderungen über Edit und Write. Dateien, die nur per Bash oder von aussen geändert wurden, bleiben unverändert. Für dauerhafte Stände: Git.' })), 5, 'up'));
    },
    step: function (b, animate) {
      var c = CALLS[b] || null, out = document.getElementById('lp-out');
      document.getElementById('lp-call').classList.toggle('hid', !c && b < 5);
      document.getElementById('lp-call').classList.toggle('faded', b >= 5);
      out.classList.toggle('hid', !c);
      each('.gate', function (g) { g.classList.remove('pass', 'stop', 'wait', 'skip'); });
      if (b >= 5) {
        var cp = document.querySelectorAll('.cp');
        each('.cp', function (el) { el.classList.remove('undone', 'target'); });
        VIZ.later(function () {
          [4, 3].forEach(function (i, n) { VIZ.later(function () { cp[i].classList.add('undone'); }, n * 450); });
          VIZ.later(function () { cp[2].classList.add('target'); }, 900);
        }, animate ? 700 : 0);
        return;
      }
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
    guess: function () {
      return { before: 2, question: 'Der Subagent liest den ganzen Diff. Um wie viel wächst der Kontext der Hauptsession?',
        options: ['Um den ganzen Diff', 'Nur um seine Zusammenfassung'], correct: 1,
        reveal: 'Der Subagent hat ein eigenes Kontextfenster. In die Hauptsession kommt nur sein Bericht.' };
    },
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
})();
