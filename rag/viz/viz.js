/* Agentische Suche vs. RAG – Präsentations-Visualisierung.
 * Kern: Zustand, Navigation, Tastatur, Fragenauswahl, gemeinsame Bausteine.
 * Die Szenen stehen in scenes-retrieval.js (1–4) und scenes-results.js (5–7).
 * Klassische Skripte (keine ES-Module), damit die Seite auch per file:// läuft.
 */
'use strict';
var VIZ = window.VIZ = window.VIZ || {};

/* Kernaussagen für die Schlussfolie. Bei Bedarf hier anpassen. */
VIZ.MESSAGES = [
  'Jeder Retriever hat einen blinden Fleck – genau dort, wo der andere stark ist.',
  'Hybrid ist kein Automatismus. Messen am eigenen Korpus.',
  'Chunking verändert, was gefunden wird. Hier liegt der Unterschied im Rauschen von 25 Fragen.',
  'Für Code im Repo reicht agentische Suche fast immer. RAG lohnt sich für grosse, mehrsprachige Wissensbestände ausserhalb des Repos.'
];

VIZ.CATEGORY = {
  'synonym': 'Synonym',
  'cross-lingual': 'Andere Sprache',
  'exact-identifier': 'Exakter Bezeichner',
  'multi-doc': 'Mehrere Dokumente',
  'all': 'Alle'
};
VIZ.MODE = { bm25: 'BM25', vector: 'Vektor', hybrid: 'Hybrid' };
VIZ.LANG = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' };
VIZ.ORDER = ['korpus', 'chunking', 'bm25', 'vector', 'hybrid', 'agent', 'score', 'fazit'];
VIZ.defs = VIZ.defs || {};

/* ---------- kleine Helfer ---------- */
VIZ.motion = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

VIZ.h = function (tag, attrs) {
  var el = document.createElement(tag);
  VIZ._attrs(el, attrs, false);
  for (var i = 2; i < arguments.length; i++) VIZ._append(el, arguments[i]);
  return el;
};
VIZ.s = function (tag, attrs) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  VIZ._attrs(el, attrs, true);
  for (var i = 2; i < arguments.length; i++) VIZ._append(el, arguments[i]);
  return el;
};
VIZ._attrs = function (el, attrs, isSvg) {
  if (!attrs) return;
  Object.keys(attrs).forEach(function (k) {
    var v = attrs[k];
    if (v === null || v === undefined || v === false) return;
    if (k === 'class') el.setAttribute('class', v);
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.keys(v).forEach(function (p) { el.style.setProperty(p, v[p]); });
    else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  });
};
VIZ._append = function (el, c) {
  if (c === null || c === undefined || c === false) return;
  if (Array.isArray(c)) { c.forEach(function (x) { VIZ._append(el, x); }); return; }
  el.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
};

VIZ.num = function (x, digits) {
  if (x === null || x === undefined || isNaN(x)) return '–';
  return Number(x).toLocaleString('de-CH', { minimumFractionDigits: digits || 0, maximumFractionDigits: digits || 0 });
};
VIZ.kchars = function (n) {
  if (n === null || n === undefined) return '–';
  if (n < 1000) return VIZ.num(n) + ' Zeichen';
  return VIZ.num(n / 1000, 1) + 'k Zeichen';
};

/* Web-Animations mit Rücksicht auf prefers-reduced-motion */
VIZ.anim = function (el, frames, opts) {
  if (!VIZ.motion || !el || !el.animate) return null;
  var o = Object.assign({ duration: 520, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'backwards' }, opts || {});
  return el.animate(frames, o);
};
VIZ.later = function (fn, ms) {
  if (!VIZ.motion) { fn(); return; }
  VIZ.ctx.timers.push(setTimeout(fn, ms));
};

VIZ.ENTER = {
  up: [{ opacity: 0, transform: 'translateY(0.7em)' }, { opacity: 1, transform: 'none' }],
  fade: [{ opacity: 0 }, { opacity: 1 }],
  left: [{ opacity: 0, transform: 'translateX(-2.5em)' }, { opacity: 1, transform: 'none' }],
  right: [{ opacity: 0, transform: 'translateX(2.5em)' }, { opacity: 1, transform: 'none' }],
  pop: [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.12)', offset: .7 }, { opacity: 1, transform: 'none' }],
  grow: [{ transform: 'scaleX(0)' }, { transform: 'none' }],
  rise: [{ transform: 'scaleY(0)' }, { transform: 'none' }],
  draw: [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }]
};

/* Element erscheint ab Beat n */
VIZ.at = function (el, beat, enter, delay) {
  el.setAttribute('data-beat', beat);
  if (enter) el.setAttribute('data-enter', enter);
  if (delay) el.setAttribute('data-delay', Math.round(delay));
  return el;
};

/* ---------- gemeinsame Bausteine ---------- */
VIZ.ui = {
  catTag: function (cat) {
    return VIZ.h('span', { class: 'cat cat-' + cat, text: VIZ.CATEGORY[cat] || cat });
  },
  question: function (q, extra) {
    if (!q) return VIZ.h('div', { class: 'question' }, 'Keine Frage ausgewählt.');
    return VIZ.h('div', { class: 'question' },
      VIZ.h('div', { class: 'question-meta' }, VIZ.ui.catTag(q.category),
        VIZ.h('span', { class: 'expected' }, 'Erwartet: ', (q.expected_docs || []).map(VIZ.ui.docShort).join(', '))),
      VIZ.h('p', { class: 'question-text', text: '«' + q.text + '»' }),
      extra || null);
  },
  docShort: function (id) {
    var d = VIZ.ctx.docs[id];
    return d ? d.title : id;
  },
  mark: function (hit) {
    return VIZ.h('span', { class: 'mark ' + (hit ? 'hit' : 'miss'), title: hit ? 'Chunk aus erwartetem Dokument' : 'Chunk aus anderem Dokument' },
      hit ? '✓' : '✗');
  },
  firstHit: function (list) {
    if (!list) return null;
    for (var i = 0; i < list.length; i++) if (list[i].hit) return list[i].rank;
    return null;
  },
  rankText: function (r, k) {
    if (r === null || r === undefined) return 'nicht in den Top ' + (k || 10);
    return 'Rang ' + r;
  },
  note: function (text, cls) {
    return VIZ.h('div', { class: 'note ' + (cls || '') }, text);
  },
  empty: function (title, text) {
    return VIZ.h('div', { class: 'empty' }, VIZ.h('h2', { text: title }), VIZ.h('p', { text: text }));
  },
  /* Begriffe im Text markieren: zuerst ganze Wörter, sonst Teilwort (Komposita). */
  highlight: function (text, terms, cls) {
    var frag = document.createDocumentFragment();
    var ranges = VIZ.ui.findTerms(text, terms);
    var pos = 0;
    ranges.forEach(function (r) {
      if (r[0] > pos) frag.appendChild(document.createTextNode(text.slice(pos, r[0])));
      frag.appendChild(VIZ.h('mark', { class: cls || 'lex', text: text.slice(r[0], r[1]) }));
      pos = r[1];
    });
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    return frag;
  },
  findTerms: function (text, terms) {
    var out = [];
    (terms || []).forEach(function (t) {
      if (!t) return;
      var esc = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re = new RegExp('(?<![\\p{L}\\p{N}])' + esc + '(?![\\p{L}\\p{N}])', 'giu');
      var found = false, m;
      while ((m = re.exec(text))) { out.push([m.index, m.index + m[0].length]); found = true; }
      if (!found) {
        re = new RegExp(esc, 'giu');
        while ((m = re.exec(text))) out.push([m.index, m.index + m[0].length]);
      }
    });
    out.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [];
    out.forEach(function (r) {
      var last = merged[merged.length - 1];
      if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]); else merged.push(r.slice());
    });
    return merged;
  },
  /* Ausschnitt um den ersten Treffer */
  snippet: function (text, terms, len) {
    text = (text || '').replace(/\s+/g, ' ').trim();
    len = len || 170;
    if (text.length <= len) return text;
    var r = VIZ.ui.findTerms(text, terms)[0];
    var start = 0;
    if (r && r[0] > len * 0.45) start = Math.max(0, r[0] - Math.round(len * 0.35));
    var s = text.slice(start, start + len);
    if (start > 0) s = '…' + s.replace(/^\S*\s/, '');
    if (start + len < text.length) s = s.replace(/\s\S*$/, '') + ' …';
    return s;
  },
  headingPath: function (hd) {
    return (hd || '').split(/\s*>\s*/).filter(Boolean).join(' › ');
  }
};

/* ---------- Zustand ---------- */
var S = VIZ.state = { scene: 0, beat: 0, qid: null };
VIZ.ctx = { timers: [], docs: {}, chunks: {}, store: {} };

VIZ.boot = function (data, isSample) {
  if (!data || typeof data !== 'object') { VIZ.fail('window.DATA fehlt oder ist leer.'); return; }
  var D = VIZ.data = data;
  D.meta = D.meta || {};
  D.docs = D.docs || [];
  D.chunks = D.chunks || [];
  D.questions = D.questions || [];
  D.agent = D.agent || [];
  var ctx = VIZ.ctx;
  ctx.data = D;
  ctx.sample = !!(isSample || window.DATA_IS_SAMPLE);
  D.docs.forEach(function (d) { ctx.docs[d.id] = d; });
  D.chunks.forEach(function (c) { ctx.chunks[c.id] = c; });
  ctx.k = D.meta.k || (D.eval && D.eval.k) || 5;
  ctx.rrfK = D.meta.rrf_k || 60;
  ctx.chunk = function (id) { return ctx.chunks[id] || null; };

  VIZ.scenes = VIZ.ORDER.map(function (id) { return VIZ.defs[id]; }).filter(Boolean);

  var showcase = D.questions.filter(function (q) { return q.showcase; });
  S.qid = (showcase[0] || D.questions[0] || {}).id || null;
  VIZ.readHash();

  document.getElementById('sample').hidden = !ctx.sample;
  VIZ.renderMeta();
  VIZ.buildFields();
  VIZ.renderFoot();
  document.getElementById('qchip').addEventListener('click', VIZ.openPicker);
  document.addEventListener('keydown', VIZ.onKey);
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { VIZ.render(S.beat, false); }, 180);
  });
  VIZ.render(0, true, true);
};

VIZ.fail = function (msg) {
  var st = document.getElementById('stage');
  st.innerHTML = '';
  st.appendChild(VIZ.ui.empty('Keine Daten', msg + ' Siehe README.md im Ordner rag/viz.'));
};

VIZ.question = function () {
  var D = VIZ.data;
  return D.questions.filter(function (q) { return q.id === S.qid; })[0] || D.questions[0] || null;
};

VIZ.readHash = function () {
  var m = /s=(\d+)/.exec(location.hash), q = /q=([^&]+)/.exec(location.hash);
  if (m) S.scene = Math.max(0, Math.min(VIZ.scenes.length - 1, +m[1] - 1));
  if (q) {
    var id = decodeURIComponent(q[1]);
    if (VIZ.data.questions.some(function (x) { return x.id === id; })) S.qid = id;
  }
};
VIZ.writeHash = function () {
  try { history.replaceState(null, '', '#s=' + (S.scene + 1) + (S.qid ? '&q=' + encodeURIComponent(S.qid) : '')); } catch (e) { /* file:// ohne History */ }
};

VIZ.renderMeta = function () {
  var m = VIZ.data.meta, c = m.corpus || {};
  var parts = [];
  if (m.model) parts.push('Modell ' + String(m.model).split('/').pop());
  if (m.chunking) parts.push('Chunking ' + (m.chunking === 'heading' ? 'Überschriften' : 'feste Länge'));
  if (VIZ.data.questions.length) parts.push('k = ' + VIZ.ctx.k);
  if (c.docs) parts.push(VIZ.num(c.docs) + ' Dokumente, ' + VIZ.num(c.chunks) + ' Chunks');
  if (VIZ.META) parts = parts.concat(VIZ.META);
  var el = document.getElementById('meta');
  el.innerHTML = '';
  parts.forEach(function (p) { el.appendChild(VIZ.h('span', { text: p })); });
};

VIZ.buildFields = function () {
  var nav = document.getElementById('fields');
  nav.innerHTML = '';
  VIZ.scenes.forEach(function (sc, i) {
    nav.appendChild(VIZ.h('button', { class: 'field', type: 'button', 'data-i': i, title: sc.title,
      onclick: function () { VIZ.go(i); } },
      VIZ.h('span', { class: 'field-no', text: String(i + 1) }),
      VIZ.h('span', { class: 'field-label', text: sc.nav })));
  });
};

/* ---------- Rendern und Beats ---------- */
VIZ.scene = function () { return VIZ.scenes[S.scene]; };
VIZ.beatCount = function () {
  var sc = VIZ.scene();
  return Math.max(1, typeof sc.beats === 'function' ? sc.beats(VIZ.ctx) : (sc.beats || 1));
};

VIZ.render = function (beat, animate, first) {
  var sc = VIZ.scene(), ctx = VIZ.ctx, stage = document.getElementById('stage');
  ctx.timers.forEach(clearTimeout);
  ctx.timers = [];
  VIZ.closeGuess();
  ctx.q = VIZ.question();
  stage.innerHTML = '';
  stage.className = 'stage stage-' + sc.id;
  document.getElementById('title').textContent = sc.title;
  document.getElementById('lead').textContent = typeof sc.lead === 'function' ? sc.lead(ctx) : sc.lead;
  var chip = document.getElementById('qchip');
  chip.style.visibility = sc.usesQuestion && ctx.q ? 'visible' : 'hidden';
  if (ctx.q) {
    chip.innerHTML = '';
    chip.appendChild(VIZ.ui.catTag(ctx.q.category));
    chip.appendChild(VIZ.h('span', { class: 'qchip-text', text: ctx.q.text }));
    chip.appendChild(VIZ.h('kbd', { text: 'q' }));
  }
  Array.prototype.forEach.call(document.querySelectorAll('.field'), function (f, i) {
    f.classList.toggle('active', i === S.scene);
    f.classList.toggle('done', i < S.scene);
    f.setAttribute('aria-current', i === S.scene ? 'step' : 'false');
  });
  sc.render(stage, ctx);
  var n = VIZ.beatCount();
  S.beat = Math.max(0, Math.min(n - 1, beat));
  VIZ.apply(S.beat, animate, -1);
  if (animate && !first) VIZ.anim(stage, VIZ.ENTER.fade, { duration: 220 });
  VIZ.writeHash();
};

VIZ.apply = function (b, animate, from) {
  var stage = document.getElementById('stage');
  Array.prototype.forEach.call(stage.querySelectorAll('[data-beat]'), function (el) {
    var n = +el.getAttribute('data-beat');
    if (n <= b) {
      var wasHidden = el.classList.contains('hid');
      el.classList.remove('hid');
      if (animate && n > from && (wasHidden || from < 0)) {
        var kind = el.getAttribute('data-enter') || 'up';
        if (kind === 'none') return;
        var delay = +(el.getAttribute('data-delay') || 0);
        if (from < 0) delay += Math.max(0, n) * 650; /* Wiederholung: Beats nacheinander */
        VIZ.anim(el, VIZ.ENTER[kind] || VIZ.ENTER.up, { delay: delay, duration: kind === 'draw' ? 650 : 520 });
      }
    } else {
      el.classList.add('hid');
    }
  });
  var sc = VIZ.scene();
  if (sc.step) sc.step(b, animate, from, VIZ.ctx);
  VIZ.renderBeats();
};

VIZ.renderBeats = function () {
  var el = document.getElementById('beats'), n = VIZ.beatCount();
  el.innerHTML = '';
  if (n < 2) return;
  for (var i = 0; i < n; i++) el.appendChild(VIZ.h('span', { class: 'beat' + (i <= S.beat ? ' on' : '') }));
};

VIZ.next = function () {
  if (VIZ._guess) {
    if (!VIZ._guess.revealed) { VIZ.revealGuess(); return; }
    VIZ.closeGuess();
  } else if (S.beat < VIZ.beatCount() - 1) {
    var g = VIZ.pendingGuess(S.beat + 1);
    if (g) { VIZ.showGuess(g); return; }
  }
  if (S.beat < VIZ.beatCount() - 1) { var f = S.beat; S.beat++; VIZ.apply(S.beat, true, f); VIZ.writeHash(); }
  else if (S.scene < VIZ.scenes.length - 1) VIZ.go(S.scene + 1);
};
VIZ.prev = function () {
  if (VIZ._guess) { delete VIZ._guessed[VIZ._guess.key]; VIZ.closeGuess(); return; }
  if (S.beat > 0) { S.beat--; VIZ.apply(S.beat, false, S.beat + 1); }
  else if (S.scene > 0) { S.scene--; VIZ.render(99, false); }
};
VIZ.go = function (i, atEnd) {
  if (i < 0 || i >= VIZ.scenes.length) return;
  S.scene = i;
  VIZ.render(atEnd ? 99 : 0, true);
};
VIZ.replay = function () { VIZ.render(S.beat, true); };

/* ---------- Tipp-Runden: erst raten (Handzeichen), dann auflösen ----------
 * Eine Szene kann guess(ctx) definieren und eine Tipp-Runde (oder ein Array davon) liefern:
 *   { before: Beat, vor dem gefragt wird, question, options: [..], correct: Index oder null, reveal: Text }
 * Die richtige Antwort wird in der Szene aus den Daten berechnet, nie fest eingetragen.
 * Ablauf: → zeigt die Frage, → löst auf, → fährt mit dem Beat weiter. g schaltet alle Runden aus/ein. */
VIZ.guessOn = true;
VIZ._guessed = {};
VIZ._guess = null;
VIZ.guessKey = function (g) {
  var sc = VIZ.scene();
  return sc.id + '|' + (sc.usesQuestion ? S.qid : '') + '|' + g.before;
};
VIZ.pendingGuess = function (toBeat) {
  var sc = VIZ.scene();
  if (!VIZ.guessOn || !sc || !sc.guess) return null;
  var gs = sc.guess(VIZ.ctx);
  if (!gs) return null;
  if (!Array.isArray(gs)) gs = [gs];
  for (var i = 0; i < gs.length; i++) {
    var g = gs[i];
    if (g && g.before === toBeat && g.options && g.options.length && !VIZ._guessed[VIZ.guessKey(g)]) return g;
  }
  return null;
};
VIZ.showGuess = function (g) {
  var layer = document.getElementById('guess');
  if (!layer) { layer = VIZ.h('div', { class: 'guess-layer', id: 'guess' }); document.body.appendChild(layer); }
  layer.innerHTML = '';
  var opts = g.options.map(function (o, i) {
    return VIZ.h('li', { class: 'guess-opt', 'data-i': i },
      VIZ.h('span', { class: 'guess-letter', text: String.fromCharCode(65 + i) }), VIZ.h('span', { class: 'guess-text', text: o }));
  });
  var card = VIZ.h('div', { class: 'guess', role: 'dialog', 'aria-label': 'Tipp-Runde' },
    VIZ.h('div', { class: 'guess-tag', text: 'Euer Tipp · Handzeichen' }),
    VIZ.h('p', { class: 'guess-q', text: g.question }),
    VIZ.h('ol', { class: 'guess-opts' }, opts),
    VIZ.h('p', { class: 'guess-reveal hid', text: g.reveal || '' }),
    VIZ.h('p', { class: 'guess-hint' }, VIZ.h('kbd', { text: '→' }), ' auflösen ', VIZ.h('kbd', { text: 'g' }), ' Tipp-Runden aus'));
  layer.appendChild(card);
  layer.hidden = false;
  VIZ._guess = { g: g, key: VIZ.guessKey(g), revealed: false };
  VIZ._guessed[VIZ._guess.key] = true;
  VIZ.anim(card, VIZ.ENTER.pop, { duration: 380 });
};
VIZ.revealGuess = function () {
  var st = VIZ._guess, layer = document.getElementById('guess');
  if (!st || !layer) return;
  st.revealed = true;
  var c = st.g.correct;
  Array.prototype.forEach.call(layer.querySelectorAll('.guess-opt'), function (el, i) {
    if (c === null || c === undefined) return;
    el.classList.add(i === c ? 'right' : 'dim');
    if (i === c) VIZ.anim(el, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }, { transform: 'scale(1)' }], { duration: 520, fill: 'none' });
  });
  var r = layer.querySelector('.guess-reveal');
  if (st.g.reveal) { r.classList.remove('hid'); VIZ.anim(r, VIZ.ENTER.up, { delay: 200 }); }
  layer.querySelector('.guess-hint').innerHTML = '';
  layer.querySelector('.guess-hint').appendChild(VIZ.h('span', {}, VIZ.h('kbd', { text: '→' }), ' weiter'));
};
VIZ.closeGuess = function () {
  var layer = document.getElementById('guess');
  if (layer) { layer.hidden = true; layer.innerHTML = ''; }
  VIZ._guess = null;
};
VIZ.toggleGuess = function () {
  VIZ.guessOn = !VIZ.guessOn;
  if (VIZ.guessOn) VIZ._guessed = {}; else VIZ.closeGuess();
  VIZ.toast(VIZ.guessOn ? 'Tipp-Runden ein' : 'Tipp-Runden aus');
};
VIZ.hasGuess = function () { return VIZ.scenes.some(function (sc) { return !!sc.guess; }); };
/* «3–6»: Nummern der Szenen, die mit der gewählten Frage arbeiten */
VIZ.questionScenes = function () {
  var idx = [];
  VIZ.scenes.forEach(function (sc, i) { if (sc.usesQuestion) idx.push(i + 1); });
  if (!idx.length) return '';
  return idx.length > 1 ? idx[0] + '–' + idx[idx.length - 1] : String(idx[0]);
};

VIZ.renderFoot = function () {
  var el = document.getElementById('keys');
  if (!el) return;
  var k = function (t) { return VIZ.h('kbd', { text: t }); };
  el.innerHTML = '';
  VIZ._append(el, [k('←'), k('→'), ' Schritt ', k('1'), '–', k(String(VIZ.scenes.length)), ' Szene ']);
  if (VIZ.questionScenes()) VIZ._append(el, [k('q'), ' Frage ']);
  if (VIZ.hasGuess()) VIZ._append(el, [k('g'), ' Tipp-Runden ']);
  VIZ._append(el, [k('r'), ' nochmals ', k('f'), ' Vollbild ', k('?'), ' Hilfe']);
};

/* ---------- Tastatur ---------- */
VIZ.onKey = function (e) {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  var k = e.key;
  if (!document.getElementById('picker').hidden) { VIZ.pickerKey(e); return; }
  if (!document.getElementById('help').hidden) {
    if (k === 'Escape' || k === '?' || k === 'h') { VIZ.closeHelp(); e.preventDefault(); }
    return;
  }
  var sc = VIZ.scene();
  if (k === 'g' && VIZ.hasGuess()) { VIZ.toggleGuess(); e.preventDefault(); return; }
  if (VIZ._guess && !/^(Arrow|Page|Home$|End$|[1-9]$| $|f$)/.test(k)) return; /* offene Tipp-Runde: nur Navigation */
  if (sc && sc.keys && sc.keys[k]) { sc.keys[k](VIZ.ctx); e.preventDefault(); return; }
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') {
    if (e.shiftKey && k === 'ArrowRight') VIZ.go(Math.min(VIZ.scenes.length - 1, S.scene + 1)); else VIZ.next();
  } else if (k === 'ArrowLeft' || k === 'PageUp') {
    if (e.shiftKey && k === 'ArrowLeft') VIZ.go(Math.max(0, S.scene - 1)); else VIZ.prev();
  } else if (/^[1-9]$/.test(k) && +k <= VIZ.scenes.length) VIZ.go(+k - 1);
  else if (k === 'Home') VIZ.go(0);
  else if (k === 'End') VIZ.go(VIZ.scenes.length - 1);
  else if (k === 'q' && VIZ.questionScenes()) VIZ.openPicker();
  else if (k === 'r') VIZ.replay();
  else if (k === 'f') VIZ.fullscreen();
  else if (k === '?' || k === 'h') VIZ.openHelp();
  else return;
  e.preventDefault();
};

VIZ.fullscreen = function () {
  var d = document;
  if (d.fullscreenElement) { d.exitFullscreen && d.exitFullscreen(); return; }
  var p = d.documentElement.requestFullscreen ? d.documentElement.requestFullscreen() : null;
  if (p && p.then) p.then(function () { VIZ.toast('Vollbild: f oder Esc beendet es'); })
    .catch(function () { VIZ.toast('Vollbild über den Browser: Ctrl+Cmd+F (Mac) oder F11'); });
  else VIZ.toast('Vollbild über den Browser: Ctrl+Cmd+F (Mac) oder F11');
};

VIZ.toast = function (msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(VIZ._tt);
  VIZ._tt = setTimeout(function () { t.classList.remove('show'); }, 2600);
};

/* ---------- Fragenauswahl ---------- */
VIZ.openPicker = function () {
  var D = VIZ.data, ov = document.getElementById('picker');
  if (!D.questions.length) { VIZ.toast('Keine Fragen in den Daten'); return; }
  ov.innerHTML = '';
  var box = VIZ.h('div', { class: 'picker', role: 'dialog', 'aria-label': 'Frage wählen' });
  box.appendChild(VIZ.h('div', { class: 'picker-head' },
    VIZ.h('h2', { text: 'Frage wählen' }),
    VIZ.h('span', { class: 'picker-hint' }, VIZ.h('kbd', { text: '↑' }), VIZ.h('kbd', { text: '↓' }), ' wählen ',
      VIZ.h('kbd', { text: 'Enter' }), ' übernehmen ', VIZ.h('kbd', { text: 'Esc' }), ' schliessen')));
  var list = VIZ.h('div', { class: 'picker-list' });
  var items = [];
  function add(q) {
    var it = VIZ.h('button', { class: 'pick' + (q.id === S.qid ? ' current' : ''), type: 'button', 'data-id': q.id,
      onclick: function () { VIZ.pick(q.id); } },
      VIZ.ui.catTag(q.category),
      VIZ.h('span', { class: 'pick-text', text: q.text }),
      VIZ.h('span', { class: 'pick-id', text: q.id }),
      q.note ? VIZ.h('span', { class: 'pick-note', text: q.note }) : null);
    items.push(it);
    list.appendChild(it);
  }
  var show = D.questions.filter(function (q) { return q.showcase; });
  if (show.length) {
    list.appendChild(VIZ.h('h3', { text: 'Für die Präsentation' }));
    show.forEach(add);
  }
  var cats = ['synonym', 'cross-lingual', 'exact-identifier', 'multi-doc'];
  D.questions.forEach(function (q) { if (cats.indexOf(q.category) < 0) cats.push(q.category); });
  cats.forEach(function (c) {
    var qs = D.questions.filter(function (q) { return q.category === c && !q.showcase; });
    if (!qs.length) return;
    list.appendChild(VIZ.h('h3', { text: VIZ.CATEGORY[c] || c }));
    qs.forEach(add);
  });
  box.appendChild(list);
  ov.appendChild(box);
  ov.onclick = function (e) { if (e.target === ov) VIZ.closePicker(); };
  ov.hidden = false;
  VIZ._pick = { items: items, i: Math.max(0, items.findIndex(function (x) { return x.getAttribute('data-id') === S.qid; })) };
  VIZ.pickerFocus();
};
VIZ.pickerFocus = function () {
  var p = VIZ._pick;
  p.items.forEach(function (x, i) { x.classList.toggle('sel', i === p.i); });
  p.items[p.i].focus({ preventScroll: true });
  p.items[p.i].scrollIntoView({ block: 'nearest' });
};
VIZ.pickerKey = function (e) {
  var p = VIZ._pick, k = e.key;
  if (k === 'Escape' || k === 'q') VIZ.closePicker();
  else if (k === 'ArrowDown' || k === 'ArrowRight') { p.i = Math.min(p.items.length - 1, p.i + 1); VIZ.pickerFocus(); }
  else if (k === 'ArrowUp' || k === 'ArrowLeft') { p.i = Math.max(0, p.i - 1); VIZ.pickerFocus(); }
  else if (k === 'Enter' || k === ' ') VIZ.pick(p.items[p.i].getAttribute('data-id'));
  else return;
  e.preventDefault();
};
VIZ.pick = function (id) {
  S.qid = id;
  VIZ.closePicker();
  var sc = VIZ.scene();
  if (!sc.usesQuestion) {
    var first = VIZ.scenes.findIndex(function (x) { return x.usesQuestion; });
    if (first >= 0) S.scene = first;
  }
  VIZ.render(0, true);
};
VIZ.closePicker = function () {
  var ov = document.getElementById('picker');
  ov.hidden = true;
  ov.innerHTML = '';
};

/* ---------- Hilfe ---------- */
VIZ.openHelp = function () {
  var ov = document.getElementById('help');
  ov.innerHTML = '';
  var rows = [
    ['→  Leertaste  Bild↓', 'nächster Schritt, danach nächste Szene'],
    ['←  Bild↑', 'Schritt zurück'],
    ['Shift + ← →', 'ganze Szene vor oder zurück'],
    ['1 … ' + VIZ.scenes.length, 'direkt zur Szene'],
    ['r', 'Animation der Szene nochmals abspielen'],
    ['f', 'Vollbild ein/aus']
  ];
  if (VIZ.questionScenes()) rows.splice(4, 0, ['q', 'Frage wählen (Szenen ' + VIZ.questionScenes() + ')']);
  if (VIZ.hasGuess()) rows.push(['g', 'Tipp-Runden aus/ein (erst raten, dann auflösen)']);
  VIZ.scenes.forEach(function (sc) { (sc.help || []).forEach(function (r) { rows.push(r); }); });
  rows.push(['?', 'diese Hilfe']);
  var box = VIZ.h('div', { class: 'picker help' }, VIZ.h('div', { class: 'picker-head' }, VIZ.h('h2', { text: 'Tastatur' })),
    VIZ.h('table', {}, rows.map(function (r) {
      return VIZ.h('tr', {}, VIZ.h('th', { text: r[0] }), VIZ.h('td', { text: r[1] }));
    })));
  ov.appendChild(box);
  ov.onclick = VIZ.closeHelp;
  ov.hidden = false;
};
VIZ.closeHelp = function () { var ov = document.getElementById('help'); ov.hidden = true; ov.innerHTML = ''; };
