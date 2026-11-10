/* Konzept-Szenen für die Input-Teile des Nachmittags (Einstieg, A, B, C, D, Abschluss).
 * Läuft auf dem Motor aus rag/viz/viz.js. Keine Daten, alles Schema.
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
    stage.appendChild(at(h('div', { class: 'band band-steer' }, h('span', { class: 'band-label', text: 'Control' }),
      chip('Plan mode', 'Exercise 03'), chip('Permissions', 'Exercise 04'), chip('Hooks', 'Exercise 04'), chip('Rewind', 'Exercise 05')), b(3), 'up'));
    stage.appendChild(h('div', { class: 'loop' },
      at(node('prompt', 'Prompt', 'from you'), 0, 'left'), at(arrow(), 0, 'fade', 150),
      h('div', { class: 'loop-core' },
        at(node('modell', 'Model', 'decides the next step'), 0, 'pop', 200), at(arrow(), 0, 'fade', 350),
        at(node('tool', 'Tool call', 'Read, Edit, Bash, MCP …'), 0, 'pop', 400), at(arrow(), 0, 'fade', 550),
        at(node('ergebnis', 'Result', 'goes into the context'), 0, 'pop', 600),
        at(h('div', { class: 'loop-back' }, h('span', { text: '↺ Agentic loop: repeats until the model decides it is done' })), b(1), 'fade')),
      at(arrow(), b(1), 'fade', 300), at(node('antwort', 'Answer', 'to you'), b(1), 'right', 300)));
    stage.appendChild(at(h('div', { class: 'band band-ctx' }, h('span', { class: 'band-label', text: 'Context' }),
      chip('System prompt', null, 'plain'), chip('CLAUDE.md', 'Exercise 01'), chip('Skills', 'Exercise 02'), chip('Conversation', null, 'plain'), chip('Tool results', null, 'plain')), b(2), 'up'));
    stage.appendChild(at(h('div', { class: 'band band-ext' }, h('span', { class: 'band-label', text: 'Extend and scale' }),
      chip('MCP', 'Exercise 06'), chip('Agentic search vs. RAG', 'Demo R'), chip('Subagents', 'Demo D'), chip('Worktrees', 'Demo D')), b(4), 'up'));
  }
  function runLoop() {
    var ids = ['modell', 'tool', 'ergebnis', 'modell', 'tool', 'ergebnis', 'modell', 'antwort'];
    chase(ids.map(function (i) { return document.getElementById('n-' + i); }), 420);
  }
  VIZ.defs.karte = {
    id: 'karte', nav: 'Map', title: 'Claude Code is a harness',
    lead: 'A model in a loop, with tools, context and control. Every block of this afternoon has its place on this map.',
    beats: 5,
    render: function (stage) { karte(stage, false); },
    step: function (b, animate) { if (b === 1 && animate) runLoop(); }
  };
  VIZ.defs.rueckblick = {
    id: 'rueckblick', nav: 'Recap', title: 'The map, now complete',
    lead: 'You have had every one of these pieces in your own hands today.',
    beats: 2,
    render: function (stage) {
      stage.classList.add('recap');
      karte(stage, true);
      stage.appendChild(at(h('p', { class: 'recap-q', text: 'Which piece will you use first on Monday?' }), 1, 'up'));
    },
    step: function (b, animate, from) { if (b === 0 && animate && from < 0) VIZ.later(runLoop, 900); }
  };

  /* ===================== 2 Kontext als Budget ===================== */
  /* Breiten in Prozent des Kontextfensters pro Beat. SCHEMA, nicht gemessen.
     Nach dem Dry-Run hier die echten Werte aus /context eintragen. */
  var SEG = [
    { id: 'sys', label: 'System prompt and tools', kind: 'always', w: [0, 8, 8, 8, 8, 8] },
    { id: 'md', label: 'CLAUDE.md, memory', kind: 'always', w: [0, 2, 2, 2, 2, 2] },
    { id: 'desc', label: 'Skill descriptions, MCP tool names', kind: 'always', w: [0, 2, 2, 2, 2, 2] },
    { id: 'talk', label: 'Conversation (prompts, answers)', kind: 'talk', w: [0, 0, 3, 10, 3, 4] },
    { id: 'tools', label: 'Tool results (files read, command output)', kind: 'tool', w: [0, 0, 11, 30, 0, 3] },
    { id: 'skill', label: 'Skill body, loaded on demand', kind: 'demand', w: [0, 0, 0, 0, 0, 6] }
  ];
  var CAPTION = [
    'The context window is the working memory. What is not in it, the model does not know.',
    'Already used before you type anything: that is your number from /context in exercise 00.',
    'Turn 1: your prompt is small. What Claude reads to answer it is large.',
    'Every turn sends everything so far again. The prompt cache makes the unchanged start cheaper, not smaller.',
    '/compact replaces the conversation with a summary. /clear empties it completely.',
    'Progressive disclosure: only a skill’s description is always loaded. Its body arrives when the task matches, and then stays.'
  ];
  function total(b) { return SEG.reduce(function (n, s) { return n + s.w[b]; }, 0); }
  VIZ.defs.kontext = {
    id: 'kontext', nav: 'Context', title: 'Context is a budget',
    lead: 'What is always loaded costs you in every turn. What loads on demand costs only when used.',
    beats: 6,
    guess: function () {
      return { before: 1, question: 'How full was your context in exercise 00, before you had typed anything?',
        options: ['under 5 %', '5 to 15 %', 'over 15 %'], correct: null,
        reveal: 'Check the number you noted from /context. You pay for that share in every turn.' };
    },
    render: function (stage) {
      stage.appendChild(h('div', { class: 'cx' },
        h('div', { class: 'cx-head' }, h('span', { text: 'Context window' }), h('span', { class: 'cx-fill', id: 'cx-fill' }), h('span', { class: 'schema', text: 'schematic' })),
        h('div', { class: 'cx-bar', id: 'cx-bar' }, SEG.map(function (s) {
          return h('div', { class: 'cx-seg k-' + s.kind, id: 'seg-' + s.id, style: { width: '0%' } }, h('span', { text: s.label }));
        }))));
      stage.appendChild(h('div', { class: 'legend cx-legend' },
        h('span', {}, h('i', { class: 'sw k-always' }), 'always loaded'),
        h('span', {}, h('i', { class: 'sw k-talk' }), 'conversation'),
        h('span', {}, h('i', { class: 'sw k-tool' }), 'tool results'),
        h('span', {}, h('i', { class: 'sw k-demand' }), 'on demand')));
      stage.appendChild(h('div', { class: 'cx-turns' }, [2, 3, 3].map(function (b, i) {
        var w = i === 1 ? Math.round((total(2) + total(3)) / 2) : total(b);
        return at(h('div', { class: 'cx-turn' }, h('span', { class: 'cx-turn-label', text: 'Turn ' + (i + 1) + ' sends' }),
          h('span', { class: 'cx-turn-bar', style: { width: w + '%' } })), b, 'grow', i === 2 ? 350 : i === 1 ? 0 : 0);
      })));
      stage.appendChild(h('p', { class: 'cx-caption', id: 'cx-caption' }));
    },
    step: function (b, animate) {
      SEG.forEach(function (s) {
        var el = document.getElementById('seg-' + s.id);
        el.style.width = s.w[b] + '%';
        el.classList.toggle('named', s.w[b] >= 6);
        if (s.id === 'talk') el.firstChild.textContent = b === 4 ? 'Summary' : s.label;
      });
      document.getElementById('cx-fill').textContent = b ? 'about ' + total(b) + ' % used' : 'empty';
      var c = document.getElementById('cx-caption');
      c.textContent = CAPTION[b];
      if (animate) VIZ.anim(c, VIZ.ENTER.up);
    }
  };

  /* ===================== 3 Leitplanken ===================== */
  var GATES = [
    { id: 'pre', label: 'PreToolUse hook', sub: 'exit code 2 blocks' },
    { id: 'deny', label: 'deny rule?', sub: 'always wins' },
    { id: 'ask', label: 'ask rule?', sub: 'asks you first' },
    { id: 'allow', label: 'allow rule or mode', sub: 'otherwise asks you' },
    { id: 'run', label: 'Tool runs', sub: '' },
    { id: 'post', label: 'PostToolUse hook', sub: 'e.g. format the file' }
  ];
  /* stop: Index des Tors, an dem der Aufruf hängen bleibt (-1 = läuft durch) */
  var CALLS = [
    null,
    { call: 'Edit  FristFormatter.java', stop: -1, kind: 'hit', out: 'Passes every gate. Afterwards the PostToolUse hook formats exactly this file, without spending a single token.' },
    { call: 'Read  .env', stop: 1, kind: 'miss', out: 'Denied. A deny rule is checked before ask and allow, no matter which settings file it comes from.' },
    { call: 'Edit  src/generated/api-types.ts', stop: 0, kind: 'miss', out: 'The hook exits with code 2. Its reason (stderr) goes back to Claude. The rules are never even reached.' },
    { call: 'Bash  rm -r scratch/wegwerf', stop: 2, kind: 'ask', out: 'Claude stops and asks you. You decide.' }
  ];
  VIZ.defs.leitplanken = {
    id: 'leitplanken', nav: 'Guardrails', title: 'Autonomy needs guardrails',
    lead: 'Every tool call passes through the same gates. A request in CLAUDE.md can be overlooked; a gate cannot.',
    beats: 6,
    guess: function () {
      return { before: 2, question: 'The project has an allow rule, your user settings have a deny rule for the same call. Which one wins?',
        options: ['allow: the project is closer', 'deny'], correct: 1,
        reveal: 'Rules are checked in this order: deny, then ask, then allow. Across all settings files.' };
    },
    render: function (stage) {
      stage.appendChild(h('div', { class: 'lp-call', id: 'lp-call' }, h('span', { class: 'lp-call-label', text: 'Claude proposes' }), h('code', { id: 'lp-code', text: '…' })));
      stage.appendChild(h('div', { class: 'gates' }, GATES.map(function (g, i) {
        return [i ? h('span', { class: 'gate-arrow', text: '→' }) : null,
          at(h('div', { class: 'gate', id: 'g-' + g.id, 'data-i': i }, h('b', { text: g.label }), h('span', { text: g.sub })), 0, 'up', i * 90)];
      })));
      stage.appendChild(h('div', { class: 'verdict lp-out', id: 'lp-out' }, h('p', { class: 'verdict-big', id: 'lp-big' }), h('p', { class: 'verdict-line', id: 'lp-line' })));
      var cps = ['Prompt 1', 'Prompt 2', 'Prompt 3', 'Prompt 4', 'now'];
      stage.appendChild(at(h('div', { class: 'rewind' },
        h('div', { class: 'rewind-head' }, h('b', { text: '/rewind' }), h('span', { text: 'Claude Code creates a checkpoint before every prompt. You can go back for code, conversation or both.' })),
        h('div', { class: 'rewind-line' }, cps.map(function (c, i) { return h('div', { class: 'cp', 'data-i': i }, h('i'), h('span', { text: c })); })),
        h('p', { class: 'muted small', text: 'Checkpoints cover changes made with Claude’s file tools. Files changed only by Bash or by you from outside stay as they are. For anything permanent: Git.' })), 5, 'up'));
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
      document.getElementById('lp-big').textContent = c.kind === 'hit' ? 'Executed' : c.kind === 'ask' ? 'Asks you' : 'Blocked';
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
    id: 'mcp', nav: 'MCP', title: 'MCP: one socket for all tools',
    lead: 'Without a standard, every integration would be custom work. With MCP (Model Context Protocol) the agent talks to every tool the same way.',
    beats: 4,
    render: function (stage) {
      stage.appendChild(h('div', { class: 'mcp' },
        at(h('div', { class: 'mbox mbox-agent' }, h('b', { text: 'Claude Code' }), h('span', { text: 'only knows the protocol' })), 0, 'left'),
        at(h('div', { class: 'mplug' }, h('span', { text: 'MCP' }), h('i')), 1, 'grow'),
        h('div', { class: 'mservers' },
          at(h('div', { class: 'mbox mbox-main', id: 'm-pw' }, h('b', { text: 'Playwright server' }), h('span', { text: 'local, stdio · from .mcp.json' }), tag('Exercise 06')), 1, 'pop', 200),
          at(h('div', { class: 'mbox mbox-ghost' }, h('b', { text: 'Ticket system' }), h('span', { text: 'remote, HTTP' })), 1, 'fade', 500),
          at(h('div', { class: 'mbox mbox-ghost' }, h('b', { text: 'Database, docs search, …' }), h('span', { text: 'same plug' })), 1, 'fade', 650)),
        at(h('div', { class: 'mplug mplug-thin' }, h('i')), 1, 'grow', 300),
        at(h('div', { class: 'mbox mbox-world', id: 'm-app' }, h('b', { text: 'Browser with your app' }), h('span', { text: 'localhost:4200' })), 0, 'right', 150)));
      var steps = ['change', 'look in the browser', 'see the error', 'fix', 'lock in with a test'];
      stage.appendChild(at(h('div', { class: 'floop' }, h('span', { class: 'floop-label', text: 'Feedback loop' }),
        steps.map(function (s, i) { return [i ? h('span', { class: 'larrow', text: '→' }) : null, h('span', { class: 'fstep', text: s })]; }),
        h('span', { class: 'larrow', text: '↺' })), 2, 'up'));
      stage.appendChild(at(ui.note('An agent that can check its own result needs less checking from you.'), 2, 'fade', 400));
      stage.appendChild(at(h('div', { class: 'mfacts' },
        h('p', {}, h('b', { text: 'Context: ' }), 'Only the tool names load at start. The detailed descriptions arrive when a tool is actually needed.'),
        h('p', {}, h('b', { text: 'Trust: ' }), 'Servers from a repo’s .mcp.json need your approval once. Whatever a server returns is untrusted content.')), 3, 'up'));
    },
    step: function (b, animate) {
      if (b === 2 && animate) { var s = [].slice.call(document.querySelectorAll('.fstep')); chase(s.concat(s), 380); }
    }
  };

  /* ===================== 5 Skalieren ===================== */
  VIZ.defs.skalieren = {
    id: 'skalieren', nav: 'Scale', title: 'Scaling: delegate and work in parallel',
    lead: 'A subagent protects your context. Worktrees protect your files.',
    beats: 5,
    guess: function () {
      return { before: 2, question: 'The subagent reads the whole diff. By how much does the context of the main session grow?',
        options: ['By the whole diff', 'Only by its summary'], correct: 1,
        reveal: 'The subagent has its own context window. Only its report comes back.' };
    },
    render: function (stage) {
      function bar(id, label, sub) {
        return h('div', { class: 'sx-row' }, h('div', { class: 'sx-label' }, h('b', { text: label }), h('span', { text: sub })),
          h('div', { class: 'cx-bar sx-bar' }, h('div', { class: 'cx-seg k-always', style: { width: '10%' } }),
            h('div', { class: 'cx-seg k-talk', id: id + '-talk', style: { width: '0%' } }),
            h('div', { class: 'cx-seg k-tool', id: id + '-tool', style: { width: '0%' } }),
            h('div', { class: 'cx-seg k-demand named', id: id + '-sum', style: { width: '0%' } }, h('span', { text: 'Report' }))));
      }
      stage.appendChild(h('div', { class: 'sx' },
        bar('main', 'Main session', 'your model'),
        at(h('div', { class: 'sx-hand', id: 'sx-hand' }, h('span', { text: '↓ Task: “Review the diff since start/03”' }), h('span', { id: 'sx-back', class: 'hid', text: '↑ only the report' })), 1, 'fade'),
        at(bar('sub', 'Subagent “reviewer”', 'own context window, own model (here Haiku)'), 1, 'up', 150),
        h('span', { class: 'schema', text: 'schematic' })));
      stage.appendChild(at(h('div', { class: 'wt' },
        h('div', { class: 'wt-repo' }, h('b', { text: 'Your repo' }), h('span', { text: 'one working directory' })),
        h('div', { class: 'wt-fan' },
          at(h('div', { class: 'wt-tree' }, h('code', { text: 'claude -w office-search' }), h('span', { text: '.claude/worktrees/office-search · branch worktree-office-search' })), 3, 'right', 200),
          at(h('div', { class: 'wt-tree' }, h('code', { text: 'claude -w declaration-csv' }), h('span', { text: '.claude/worktrees/declaration-csv · branch worktree-declaration-csv' })), 3, 'right', 400))), 3, 'fade'));
      stage.appendChild(at(ui.note('Each session has its own files and its own branch, so they cannot edit over each other. Merging is plain Git.'), 4, 'up'));
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
