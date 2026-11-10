/* Übungsfolien, Titelfolie und Pause. Inhalt: uebungen-daten.js (window.UEBUNGEN, window.ABLAUF).
 * Jede Übungsfolie zeigt am Ende alles gleichzeitig: Aufgabe, Schritte, Prompts, Prüfung.
 * Taste z startet/pausiert die Uhr der Folie, x setzt sie zurück. */
'use strict';
(function () {
  var h = VIZ.h, at = VIZ.at;

  /* `code` und **fett** in kurzen Texten */
  function rich(text) {
    var out = [], re = /`([^`]+)`|\*\*([^*]+)\*\*/g, pos = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > pos) out.push(text.slice(pos, m.index));
      out.push(m[1] !== undefined ? h('code', { text: m[1] }) : h('b', { text: m[2] }));
      pos = m.index + m[0].length;
    }
    if (pos < text.length) out.push(text.slice(pos));
    return out;
  }

  /* ---------- Uhr ---------- */
  var clocks = {};
  function clock(id, minutes) { return clocks[id] || (clocks[id] = { left: minutes * 60, total: minutes * 60, running: false, last: 0 }); }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
  function paintClock() {
    var el = document.getElementById('ex-clock');
    if (!el) return;
    var c = clocks[el.getAttribute('data-id')];
    if (!c) return;
    if (c.running) { var now = Date.now(); c.left -= (now - c.last) / 1000; c.last = now; if (c.left <= 0) { c.left = 0; c.running = false; } }
    el.querySelector('.clock-time').textContent = fmt(c.left);
    el.classList.toggle('running', c.running);
    el.classList.toggle('late', c.left <= 120 && c.left < c.total);
    el.classList.toggle('over', c.left <= 0);
    el.querySelector('.clock-hint').textContent = c.left <= 0 ? 'Zeit um' : c.running ? 'läuft · z pausiert' : c.left < c.total ? 'pausiert · z weiter · x zurück' : 'z startet die Uhr';
  }
  setInterval(paintClock, 500);
  function clockKeys(id, minutes) {
    return {
      z: function () { var c = clock(id, minutes); c.running = !c.running && c.left > 0; c.last = Date.now(); paintClock(); },
      x: function () { var c = clock(id, minutes); c.left = c.total; c.running = false; paintClock(); }
    };
  }
  function clockEl(id, minutes) {
    clock(id, minutes);
    return h('div', { class: 'clock', id: 'ex-clock', 'data-id': id }, h('span', { class: 'clock-time', text: fmt(clocks[id].left) }), h('span', { class: 'clock-hint' }));
  }

  /* Inhalt verkleinern, bis die Folie ohne Scrollen passt */
  function fit(stage) {
    var main = stage.querySelector('.ex-fit');
    if (!main) return;
    var size = 1;
    main.style.fontSize = '';
    void stage.offsetHeight;
    while (size > 0.62 && stage.scrollHeight > stage.clientHeight + 1) { size -= 0.03; main.style.fontSize = size + 'em'; }
  }

  /* ---------- Übungsfolie ---------- */
  function uebung(u) {
    VIZ.defs[u.id] = {
      id: u.id, nav: u.nav, minutes: u.minutes,
      title: (u.nr === 'D' ? 'Demo D zum Mitmachen · ' : 'Übung ' + u.nr + ' · ') + u.title,
      lead: u.ziel.replace(/[`*]/g, ''),
      beats: 3,
      help: [['z / x', 'Übungsfolien: Uhr starten oder pausieren / zurücksetzen']],
      keys: clockKeys(u.id, u.minutes),
      render: function (stage) {
        stage.classList.add('stage-uebung');
        stage.appendChild(h('div', { class: 'ex-head' },
          h('div', { class: 'ex-task' }, h('span', { class: 'ex-label', text: 'Aufgabe' }), u.aufgabe.map(function (a) { return h('p', {}, rich(a)); })),
          h('div', { class: 'ex-meta' }, clockEl(u.id, u.minutes), h('span', { class: 'ex-sheet' }, 'Blatt: ', h('code', { text: u.sheet })))));
        var left = h('div', { class: 'ex-col' },
          at(h('div', { class: 'ex-box' }, h('span', { class: 'ex-label', text: 'Schritte' }),
            h('ol', { class: 'ex-steps' }, u.schritte.map(function (s) { return h('li', {}, rich(s)); }))), 1, 'left'));
        if (u.liste) left.appendChild(at(h('div', { class: 'ex-box ex-list' }, h('span', { class: 'ex-label', text: u.liste.title }),
          h('ul', {}, u.liste.items.map(function (s) { return h('li', {}, rich(s)); }))), 1, 'left', 150));
        var right = h('div', { class: 'ex-col' });
        (u.code || []).forEach(function (c, i) {
          right.appendChild(at(h('div', { class: 'ex-prompt is-code' }, h('span', { class: 'ex-label', text: c.label }), h('pre', { text: c.text })), 2, 'right', i * 120));
        });
        (u.prompts || []).forEach(function (p, i) {
          right.appendChild(at(h('div', { class: 'ex-prompt' + (p.kind === 'cmd' ? ' is-cmd' : '') }, h('span', { class: 'ex-label', text: p.label }), h('pre', { text: p.text })), 2, 'right', 100 + i * 120));
        });
        if (!right.children.length) right.appendChild(at(h('div', { class: 'ex-box ex-none', text: 'Keine Prompts. In dieser Übung tippt ihr nur Slash-Commands.' }), 2, 'fade'));
        var foot = at(h('div', { class: 'ex-foot' },
          h('div', { class: 'ex-done' }, h('span', { class: 'ex-label', text: 'Fertig, wenn' }), h('p', {}, rich(u.fertig.text)), u.fertig.cmd ? h('pre', { text: u.fertig.cmd }) : null),
          h('div', { class: 'tidbit' }, h('b', { text: 'Token-Tipp' }), h('span', {}, rich(u.tipp)))), 2, 'up', 300);
        stage.appendChild(h('div', { class: 'ex-fit' }, h('div', { class: 'ex-main' }, left, right), foot));
        fit(stage);
        paintClock();
      },
      step: function () { fit(document.getElementById('stage')); }
    };
  }
  (window.UEBUNGEN || []).forEach(uebung);

  /* ---------- Titelfolie mit Ablauf ---------- */
  VIZ.defs.titel = {
    id: 'titel', nav: 'Ablauf', title: 'Claude Code Workshop',
    lead: 'Agentic Engineering in der Praxis. Ein Nachmittag, sieben Übungen, zwei Demos.',
    beats: 1,
    render: function (stage) {
      var rows = window.ABLAUF || [];
      stage.appendChild(h('div', { class: 'agenda' }, rows.map(function (r, i) {
        return at(h('div', { class: 'agenda-row' + (r.block === 'Pause' ? ' is-break' : '') },
          h('span', { class: 'agenda-time', text: r.zeit }), h('b', { text: r.block }), h('span', { text: r.inhalt }),
          r.praxis ? h('span', { class: 'ex-tag', text: r.praxis }) : h('span', {})), 0, 'up', 150 + i * 90);
      })));
      stage.appendChild(at(h('p', { class: 'agenda-note' }, 'Muster pro Block: Problem → Konzept → Umsetzung in Claude Code → Übung im Terminal. Alle Übungsblätter liegen im Repo unter ', h('code', { text: 'exercises/' }), '.'), 0, 'fade', 1000));
    }
  };

  /* ---------- Pause ---------- */
  VIZ.defs.pause = {
    id: 'pause', nav: 'Pause', title: 'Pause', minutes: 10,
    lead: '10 Minuten. Danach geht es mit MCP und dem Browser weiter.',
    beats: 1,
    help: [],
    keys: clockKeys('pause', 10),
    render: function (stage) {
      stage.appendChild(h('div', { class: 'pause' }, clockEl('pause', 10),
        h('div', { class: 'tidbit' }, h('b', { text: 'Vor der Pause erledigt?' }),
          h('span', {}, rich('Backend und Frontend für Übung 06 laufen in zwei Terminals (letzter Schritt von Übung 05). `http://localhost:4200` zeigt die App.')))));
      paintClock();
    }
  };
})();
