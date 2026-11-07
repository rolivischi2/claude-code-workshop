/* Szenen 1–4: Chunking, BM25, Vektor, Hybrid (RRF). */
'use strict';
(function () {
  var h = VIZ.h, s = VIZ.s, ui = VIZ.ui, at = VIZ.at;
  var WORD = /[\p{L}\p{N}]/u;

  /* Ergebnis-Karte für BM25 und Vektor */
  function resultCard(r, ctx, o) {
    var c = ctx.chunk(r.chunk) || { doc: '?', heading: '', text: '(Chunk nicht in den Daten)' };
    var w = o.max > 0 ? Math.max(4, Math.round(100 * r.score / o.max)) : 0;
    var text = ui.snippet(c.text, o.terms, o.len || 150);
    return h('div', { class: 'rcard ' + (r.hit ? 'is-hit' : 'is-miss') + ' rc-' + o.mode },
      h('span', { class: 'rank', text: r.rank }),
      h('div', { class: 'rc-body' },
        h('div', { class: 'rc-title' },
          h('span', { class: 'rc-doc', text: ui.docShort(c.doc) }),
          c.heading ? h('span', { class: 'rc-head', text: ui.headingPath(c.heading).split(' › ').pop() }) : null),
        h('p', { class: 'rc-text' }, o.terms ? ui.highlight(text, o.terms) : text)),
      h('div', { class: 'rc-score' },
        h('span', { class: 'score-num', text: VIZ.num(r.score, o.digits) }),
        h('span', { class: 'score-bar' }, h('span', { style: { width: w + '%' } }))),
      ui.mark(r.hit));
  }

  function restRow(list, k, label) {
    var rest = (list || []).slice(k);
    if (!rest.length) return null;
    return h('div', { class: 'rest' }, h('span', { class: 'rest-label', text: label || ('Rang ' + (k + 1) + '–' + (k + rest.length)) }),
      rest.map(function (r) { return h('span', { class: 'rest-dot ' + (r.hit ? 'hit' : 'miss'), title: 'Rang ' + r.rank, text: r.rank }); }));
  }

  function verdictBox(cls, big, lines) {
    return h('div', { class: 'verdict ' + cls }, h('p', { class: 'verdict-big', text: big }),
      lines.filter(Boolean).map(function (l) { return h('p', { class: 'verdict-line', text: l }); }));
  }

  function noQuestion(stage) {
    stage.appendChild(ui.empty('Keine Fragen', 'Die Daten enthalten keine Fragen (questions ist leer).'));
  }

  /* ===================== 1 Chunking ===================== */
  VIZ.defs.chunking = {
    id: 'chunking', nav: 'Chunking', title: 'Chunking: wo das Messer ansetzt',
    lead: 'Ein Abschnitt aus dem Korpus, zwei Arten zu schneiden. Gefunden wird immer ein ganzer Chunk.',
    beats: 3,
    render: function (stage, ctx) {
      var demo = ctx.data.chunkingDemo;
      if (!demo || !demo.text) { stage.appendChild(ui.empty('Kein Beispielabschnitt', 'chunkingDemo fehlt in den Daten.')); this._demo = null; return; }
      this._demo = demo;
      var fx = demo.fixed || [], hd = demo.heading || [];
      var size = median(fx.map(function (c) { return c.end - c.start; }));
      var ov = median(fx.slice(1).map(function (c, i) { return fx[i].end - c.start; }));
      this._fixedLabel = 'Feste Länge' + (size ? ' (' + VIZ.num(size) + ' Zeichen' + (ov > 0 ? ', ' + VIZ.num(ov) + ' überlappend' : '') + ')' : '');
      var self = this;
      var bar = h('div', { class: 'toolbar' },
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Chunking-Art' },
          h('button', { type: 'button', class: 'seg-btn', 'data-mode': 'fixed', onclick: function () { self.setBeat(1); } }, this._fixedLabel),
          h('button', { type: 'button', class: 'seg-btn', 'data-mode': 'heading', onclick: function () { self.setBeat(2); } }, 'Entlang der Überschriften')),
        h('span', { class: 'toolbar-hint' }, h('kbd', { text: 't' }), ' umschalten'),
        h('div', { class: 'stats', id: 'ch-stats' }));
      var doc = ctx.docs[demo.doc];
      var page = h('div', { class: 'page' },
        h('div', { class: 'page-src', text: 'Quelle: ' + (doc ? doc.title : demo.doc) + ', ' + VIZ.num(demo.text.length) + ' Zeichen' }),
        h('div', { class: 'page-text', id: 'ch-text' }));
      stage.appendChild(bar);
      stage.appendChild(h('div', { class: 'ch-grid' }, page, h('div', { class: 'chunklist', id: 'ch-list' })));
    },
    setBeat: function (b) {
      var f = VIZ.state.beat;
      if (f === b) return;
      VIZ.state.beat = b;
      VIZ.apply(b, true, f);
    },
    keys: {
      t: function () { var d = VIZ.defs.chunking; d.setBeat(VIZ.state.beat === 1 ? 2 : 1); }
    },
    step: function (b, animate) {
      if (!this._demo) return;
      var mode = b === 0 ? 'raw' : b === 1 ? 'fixed' : 'heading';
      Array.prototype.forEach.call(document.querySelectorAll('.seg-btn'), function (x) {
        x.classList.toggle('on', x.getAttribute('data-mode') === mode);
      });
      this.paint(mode, animate);
    },
    paint: function (mode, animate) {
      var demo = this._demo, text = demo.text, L = text.length;
      var chunks = mode === 'fixed' ? (demo.fixed || []) : mode === 'heading' ? (demo.heading || []) : [];
      chunks = chunks.map(function (c, i) { return { start: c.start, end: c.end, heading: c.heading, i: i }; });
      var heads = [], m, re = /^(?:#{1,6}\s*)?\d+(?:\.\d+)*\.?\s+\S.*$/gm;
      while ((m = re.exec(text))) heads.push([m.index, m.index + m[0].length]);
      var bset = {}; bset[0] = 1; bset[L] = 1;
      chunks.forEach(function (c) { bset[c.start] = 1; bset[c.end] = 1; });
      heads.forEach(function (r) { bset[r[0]] = 1; bset[r[1]] = 1; });
      var bounds = Object.keys(bset).map(Number).filter(function (x) { return x >= 0 && x <= L; }).sort(function (a, b) { return a - b; });
      var starts = {}, cuts = {};
      chunks.forEach(function (c) {
        starts[c.start] = (starts[c.start] || []).concat(c.i);
        if (c.start > 0) cuts[c.start] = 1;
        if (c.end < L) cuts[c.end] = 1;
      });
      var el = document.getElementById('ch-text');
      el.innerHTML = '';
      var midword = 0, anims = [];
      for (var bi = 0; bi < bounds.length - 1; bi++) {
        var a = bounds[bi], z = bounds[bi + 1];
        if (cuts[a]) {
          var bad = WORD.test(text[a - 1] || '') && WORD.test(text[a] || '');
          if (bad) midword++;
          var cut = h('span', { class: 'cut' + (bad ? ' bad' : ''), title: bad ? 'Schnitt mitten im Wort' : 'Schnitt' });
          el.appendChild(cut);
          anims.push([cut, a, 'cut']);
        }
        (starts[a] || []).forEach(function (ci) {
          var pill = h('span', { class: 'pill', text: ci + 1 });
          el.appendChild(pill);
          anims.push([pill, a, 'pill']);
        });
        var cover = chunks.filter(function (c) { return c.start <= a && c.end >= z; });
        var cls = 'sg';
        if (mode !== 'raw') cls += cover.length > 1 ? ' sg-ov' : cover.length === 1 ? ' sg-' + (cover[0].i % 2) : ' sg-none';
        if (heads.some(function (r) { return r[0] <= a && r[1] >= z; })) cls += ' sg-h';
        var seg = h('span', { class: cls, text: text.slice(a, z) });
        el.appendChild(seg);
        if (mode !== 'raw') anims.push([seg, a, 'seg']);
      }
      fitText(el, el.parentNode);
      if (animate) anims.forEach(function (x) {
        var d = 1500 * x[1] / L;
        if (x[2] === 'seg') VIZ.anim(x[0], [{ backgroundColor: 'rgba(255,255,255,0)' }, {}], { delay: d, duration: 260 });
        else if (x[2] === 'cut') VIZ.anim(x[0], [{ transform: 'scaleY(0)', opacity: 0 }, { transform: 'scaleY(1.5)', opacity: 1, offset: .6 }, { transform: 'none', opacity: 1 }], { delay: d, duration: 380 });
        else VIZ.anim(x[0], VIZ.ENTER.pop, { delay: d, duration: 360 });
      });

      /* Kennzahlen */
      var st = document.getElementById('ch-stats');
      st.innerHTML = '';
      if (mode === 'raw') st.appendChild(h('span', {}, h('b', { text: '1' }), ' Abschnitt'));
      else {
        st.appendChild(h('span', {}, h('b', { text: chunks.length }), ' Chunks'));
        st.appendChild(h('span', { class: midword ? 'bad' : 'good' }, h('b', { text: midword }), ' Schnitte mitten im Wort'));
        var ovc = chunks.filter(function (c, i) { return i > 0 && chunks[i - 1].end > c.start; }).length;
        if (ovc) st.appendChild(h('span', {}, h('b', { text: ovc }), ' Überlappungen'));
        if (mode === 'heading') st.appendChild(h('span', { class: 'good' }, 'Überschriftenpfad als Kontext'));
      }

      /* Karten */
      var list = document.getElementById('ch-list');
      list.innerHTML = '';
      if (mode === 'raw') {
        list.appendChild(h('div', { class: 'ch-intro' },
          h('p', { text: 'Noch ungeschnitten.' }),
          h('p', { class: 'muted', text: 'Ein Embedding-Modell sieht nur ein kurzes Stück auf einmal, BM25 bewertet ganze Chunks. Also muss der Text in Stücke.' })));
        return;
      }
      var max = 7;
      chunks.slice(0, max).forEach(function (c, i) {
        var card;
        if (mode === 'fixed') {
          card = h('div', { class: 'ccard' },
            h('div', { class: 'ccard-top' }, h('span', { class: 'pill', text: i + 1 }), h('span', { class: 'muted', text: VIZ.num(c.end - c.start) + ' Zeichen' })),
            h('p', { class: 'ccard-frag' }, h('span', { class: 'muted', text: 'Anfang ' }), fragStart(text, c.start)),
            h('p', { class: 'ccard-frag' }, h('span', { class: 'muted', text: 'Ende ' }), fragEnd(text, c.end)));
        } else {
          card = h('div', { class: 'ccard' },
            h('div', { class: 'ccard-top' }, h('span', { class: 'pill', text: i + 1 }), h('span', { class: 'muted', text: VIZ.num(c.end - c.start) + ' Zeichen' })),
            h('p', { class: 'ccard-head', text: ui.headingPath(c.heading) || '(ohne Überschrift)' }));
        }
        list.appendChild(card);
        if (animate) VIZ.anim(card, VIZ.ENTER.right, { delay: 250 + i * 110 });
      });
      var shown = Math.min(max, chunks.length);
      var more = h('p', { class: 'muted more' });
      list.appendChild(more);
      function moreText() { var r = chunks.length - shown; more.textContent = r > 1 ? '+ ' + r + ' weitere Chunks' : r === 1 ? '+ 1 weiterer Chunk' : ''; }
      moreText();
      while (shown > 2 && list.scrollHeight > list.clientHeight + 1) {
        list.removeChild(list.querySelectorAll('.ccard')[shown - 1]);
        shown--;
        moreText();
      }
    }
  };
  /* Schrift so wählen, dass der ganze Abschnitt in den Rahmen passt */
  function fitText(el, box) {
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    var size = rem * 0.95;
    el.style.fontSize = size + 'px';
    while (size > 9 && box.scrollHeight > box.clientHeight + 1) {
      size -= 0.5;
      el.style.fontSize = size + 'px';
    }
  }
  function median(a) { if (!a.length) return 0; a = a.slice().sort(function (x, y) { return x - y; }); return a[Math.floor(a.length / 2)]; }
  function fragStart(text, pos) {
    var seg = text.slice(pos, pos + 28).replace(/\n/g, ' ');
    var partial = pos > 0 && WORD.test(text[pos - 1]) && WORD.test(text[pos]);
    if (!partial) return h('span', { class: 'frag', text: '«' + seg.replace(/\s\S*$/, '') + ' …»' });
    var mm = /^[\p{L}\p{N}]+/u.exec(seg);
    return h('span', { class: 'frag' }, '«', h('span', { class: 'broken', text: mm[0] }), seg.slice(mm[0].length).replace(/\s\S*$/, '') + ' …»');
  }
  function fragEnd(text, pos) {
    var seg = text.slice(Math.max(0, pos - 28), pos).replace(/\n/g, ' ');
    var partial = pos < text.length && WORD.test(text[pos - 1]) && WORD.test(text[pos]);
    if (!partial) return h('span', { class: 'frag', text: '«… ' + seg.replace(/^\S*\s/, '') + '»' });
    var mm = /[\p{L}\p{N}]+$/u.exec(seg);
    return h('span', { class: 'frag' }, '«… ' + seg.slice(0, seg.length - mm[0].length).replace(/^\S*\s/, ''), h('span', { class: 'broken', text: mm[0] }), '»');
  }

  /* ===================== 2 BM25 ===================== */
  VIZ.defs.bm25 = {
    id: 'bm25', nav: 'BM25', usesQuestion: true, title: 'BM25: gleiche Wörter zählen',
    lead: 'Lexikalische Suche wertet aus, welche Suchbegriffe wörtlich im Chunk stehen und wie selten sie im Korpus sind.',
    beats: 3,
    render: function (stage, ctx) {
      var q = ctx.q;
      if (!q) { noQuestion(stage); return; }
      var list = q.bm25 || [], k = ctx.k;
      var counts = {};
      (q.query_terms || []).forEach(function (t) { counts[t] = 0; });
      list.forEach(function (r) { (r.matched || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
      var terms = h('div', { class: 'terms' }, h('span', { class: 'terms-label', text: 'Suchbegriffe, die BM25 abfragt' }),
        (q.query_terms || []).map(function (t, i) {
          return at(h('span', { class: 'term', 'data-term': t, 'data-count': counts[t] || 0 }, t,
            h('span', { class: 'term-count', text: (counts[t] || 0) + '×' })), 0, 'pop', 250 + i * 140);
        }));
      stage.appendChild(ui.question(q, terms));

      var col = h('div', { class: 'results' });
      if (!list.length) col.appendChild(at(ui.note('BM25 liefert keinen einzigen Chunk: kein Suchbegriff kommt wörtlich im Korpus vor.', 'miss'), 1));
      var max = list.length ? list[0].score : 1;
      list.slice(0, k).forEach(function (r, i) {
        col.appendChild(at(resultCard(r, ctx, { mode: 'lex', max: max, terms: q.query_terms, digits: 2 }), 1, 'right', i * 110));
      });
      var rest = restRow(list, k);
      if (rest) col.appendChild(at(rest, 1, 'fade', k * 110));

      var fh = ui.firstHit(list);
      var zero = (q.query_terms || []).filter(function (t) { return !counts[t]; });
      var big = fh && fh <= k ? 'Treffer auf Rang ' + fh : fh ? 'Erster Treffer erst auf Rang ' + fh : 'Kein Treffer in den Top ' + Math.max(list.length, 10);
      var lines = [];
      if (zero.length) lines.push('«' + zero.join('», «') + '» steht in keinem gefundenen Chunk.');
      if (q.note) lines.push(q.note);
      if (!(fh && fh <= k)) lines.push('BM25 vergleicht Zeichenfolgen, nicht Bedeutung: Synonyme und andere Sprachen bleiben unsichtbar.');
      else if (q.category === 'exact-identifier') lines.push('Seltene, exakte Zeichenfolgen sind die Stärke von BM25.');
      var side = h('div', { class: 'side' },
        at(h('div', { class: 'explain' },
          h('p', {}, 'Score steigt, wenn ein Begriff ', h('b', { text: 'oft im Chunk' }), ' und ', h('b', { text: 'selten im Korpus' }), ' vorkommt.'),
          h('p', { class: 'muted', text: 'Ein Wort, das nicht wörtlich vorkommt, trägt nichts bei.' })), 1, 'fade', 300),
        at(verdictBox(fh && fh <= k ? 'hit' : 'miss', big, lines), 2, 'up'));
      stage.appendChild(h('div', { class: 'two-col' }, col, side));
    },
    step: function (b) {
      Array.prototype.forEach.call(document.querySelectorAll('.term'), function (t) {
        t.classList.toggle('zero', b >= 2 && t.getAttribute('data-count') === '0');
        t.classList.toggle('counted', b >= 1);
      });
    }
  };

  /* ===================== 3 Vektor ===================== */
  VIZ.defs.vector = {
    id: 'vector', nav: 'Vektor', usesQuestion: true, title: 'Vektorsuche: ähnliche Bedeutung',
    lead: 'Jeder Chunk wird zu einem Punkt im Bedeutungsraum. Gesucht werden die nächsten Nachbarn der Frage.',
    beats: 4,
    render: function (stage, ctx) {
      var q = ctx.q;
      if (!q) { noQuestion(stage); return; }
      stage.appendChild(ui.question(q));
      var mapBox = h('div', { class: 'map' });
      var list = q.vector || [], k = ctx.k;
      var col = h('div', { class: 'results' });
      var max = list.length ? list[0].score : 1;
      if (!list.length) col.appendChild(at(ui.note('Keine Vektor-Ergebnisse für diese Frage.', 'miss'), 2));
      list.slice(0, k).forEach(function (r, i) {
        col.appendChild(at(resultCard(r, ctx, { mode: 'sem', max: max, digits: 2, len: 120 }), 2, 'right', 300 + i * 120));
      });
      var rest = restRow(list, k);
      if (rest) col.appendChild(at(rest, 2, 'fade', 300 + k * 120));
      var fh = ui.firstHit(list);
      var lines = [];
      if (q.note) lines.push(q.note);
      if (!(fh && fh <= k)) lines.push(q.category === 'exact-identifier'
        ? 'Codes wie IE015 und IE051 liegen im Bedeutungsraum fast aufeinander: Ziffern tragen kaum Bedeutung.'
        : 'Die nächsten Nachbarn sind ähnlich, aber nicht die gesuchte Stelle.');
      else if (q.category === 'cross-lingual' || q.category === 'synonym') lines.push('Bedeutung statt Wortgleichheit: hier ist das Modell stark.');
      col.appendChild(at(verdictBox(fh && fh <= k ? 'hit' : 'miss',
        fh && fh <= k ? 'Treffer auf Rang ' + fh : fh ? 'Erster Treffer erst auf Rang ' + fh : 'Kein Treffer in den Top ' + Math.max(list.length, 10), lines), 3, 'up'));
      stage.appendChild(h('div', { class: 'two-col map-col' }, mapBox, col));
      this.drawMap(mapBox, ctx, q);
    },
    drawMap: function (box, ctx, q) {
      var plot = h('div', { class: 'map-plot' });
      var caption = h('p', { class: 'map-caption', text: '2D-Projektion, Abstände nur ungefähr. Die Nachbarn kommen aus der echten Rangliste.' });
      var legend = h('div', { class: 'legend' });
      box.appendChild(plot); box.appendChild(caption); box.appendChild(legend);
      this._map = null;
      var W = Math.max(300, plot.clientWidth), H = Math.max(200, plot.clientHeight);
      var pts = ctx.data.chunks.filter(function (c) { return typeof c.x === 'number' && typeof c.y === 'number'; });
      if (!pts.length) { plot.appendChild(ui.note('Keine Koordinaten (x, y) in den Chunks.')); return; }
      var k = ctx.k;
      var nb = (q.vector || []).slice(0, k).map(function (r) { return { r: r, c: ctx.chunk(r.chunk) }; })
        .filter(function (x) { return x.c && typeof x.c.x === 'number'; });
      var qxy = q.query_xy && q.query_xy.length === 2 ? q.query_xy : null, est = false;
      if (!qxy && nb.length) { est = true; qxy = [avg(nb.map(function (x) { return x.c.x; })), avg(nb.map(function (x) { return x.c.y; }))]; }
      var xs = pts.map(function (p) { return p.x; }), ys = pts.map(function (p) { return p.y; });
      if (qxy) { xs.push(qxy[0]); ys.push(qxy[1]); }
      var full = { x0: Math.min.apply(null, xs), x1: Math.max.apply(null, xs), y0: Math.min.apply(null, ys), y1: Math.max.apply(null, ys) };
      /* Nahaufnahme: Rahmen um Frage und Top-k-Nachbarn */
      var zoom = null;
      if (qxy && nb.length) {
        var zx = nb.map(function (x) { return x.c.x; }).concat([qxy[0]]), zy = nb.map(function (x) { return x.c.y; }).concat([qxy[1]]);
        var cx = (Math.min.apply(null, zx) + Math.max.apply(null, zx)) / 2, cy = (Math.min.apply(null, zy) + Math.max.apply(null, zy)) / 2;
        var hx = Math.max((Math.max.apply(null, zx) - Math.min.apply(null, zx)) * 0.75, (full.x1 - full.x0) * 0.14);
        var hy = Math.max((Math.max.apply(null, zy) - Math.min.apply(null, zy)) * 0.75, (full.y1 - full.y0) * 0.14);
        zoom = { x0: cx - hx, x1: cx + hx, y0: cy - hy, y1: cy + hy };
        if (hx * 2 > (full.x1 - full.x0) * 0.8 && hy * 2 > (full.y1 - full.y0) * 0.8) zoom = null; /* lohnt sich nicht */
      }
      var expected = {};
      (q.expected_docs || []).forEach(function (d) { expected[d] = 1; });
      var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'map-svg', role: 'img', 'aria-label': 'Karte der Chunks' });
      var gp = at(s('g', { class: 'pts' }), 0, 'fade');
      var gx = at(s('g', { class: 'exp' }), 3, 'fade');
      var items = [], langs = {};
      function place(el, x, y) { items.push({ el: el, x: x, y: y }); return el; }
      pts.forEach(function (c) {
        var lang = c.lang || (ctx.docs[c.doc] || {}).lang || 'de';
        langs[lang] = 1;
        gp.appendChild(place(s('g', {}, shape(lang, 0, 0, 5)), c.x, c.y));
        if (expected[c.doc]) gx.appendChild(place(s('g', {}, s('circle', { cx: 0, cy: 0, r: 11, class: 'ring' })), c.x, c.y));
      });
      svg.appendChild(gp);
      svg.appendChild(gx);
      var lines = [], star = null;
      if (qxy) {
        var glines = s('g', {}), gnb = s('g', {});
        nb.forEach(function (x, i) {
          var ln = at(s('line', { class: 'nb-line', pathLength: 1 }), 2, 'draw', i * 120);
          lines.push({ el: ln, x: x.c.x, y: x.c.y });
          glines.appendChild(ln);
          var g = at(s('g', { class: 'nb ' + (x.r.hit ? 'hit' : 'miss') }), 2, 'fade', 250 + i * 120);
          g.appendChild(s('circle', { cx: 0, cy: 0, r: 15, class: 'nb-pulse', style: { 'animation-delay': (i * 0.15) + 's' } }));
          g.appendChild(s('circle', { cx: 0, cy: 0, r: 13, class: 'nb-dot' }));
          g.appendChild(s('text', { x: 0, y: 5, class: 'nb-rank', text: x.r.rank }));
          gnb.appendChild(place(g, x.c.x, x.c.y));
        });
        svg.appendChild(glines);
        svg.appendChild(gnb);
        var inner = s('g', { class: 'query-fly' },
          s('polygon', { points: starPts(0, 0, 17, 7.5), class: 'q-star' }),
          s('text', { x: 22, y: 6, class: 'q-label', text: est ? 'Frage (Position geschätzt)' : 'Frage' }));
        star = at(s('g', { class: 'query' }, inner), 1, 'none');
        svg.appendChild(place(star, qxy[0], qxy[1]));
        this._q = { el: inner, item: items[items.length - 1] };
      }
      plot.appendChild(svg);
      if (zoom) plot.appendChild(at(h('span', { class: 'zoom-badge', text: 'Nahaufnahme um die Frage' }), 3, 'fade', 300));
      Object.keys(langs).forEach(function (l) {
        var sv = s('svg', { viewBox: '0 0 20 20', width: 18, height: 18 }); sv.appendChild(shape(l, 10, 10, 6));
        legend.appendChild(h('span', {}, sv, VIZ.LANG[l] || l));
      });
      legend.appendChild(at(h('span', {}, h('i', { class: 'lg-ring' }), 'erwartetes Dokument'), 3, 'fade'));
      this._map = { W: W, H: H, full: full, zoom: zoom, items: items, lines: lines, qxy: qxy, cur: null };
      this.layout(full);
    },
    layout: function (E) {
      var M = this._map, pad = 30, W = M.W, H = M.H;
      function X(v) { return pad + (W - 2 * pad) * (v - E.x0) / ((E.x1 - E.x0) || 1); }
      function Y(v) { return H - pad - (H - 2 * pad) * (v - E.y0) / ((E.y1 - E.y0) || 1); }
      M.items.forEach(function (it) { it.el.setAttribute('transform', 'translate(' + X(it.x).toFixed(1) + ',' + Y(it.y).toFixed(1) + ')'); });
      if (M.qxy) {
        var qx = X(M.qxy[0]), qy = Y(M.qxy[1]);
        M.lines.forEach(function (l) {
          l.el.setAttribute('x1', qx.toFixed(1)); l.el.setAttribute('y1', qy.toFixed(1));
          l.el.setAttribute('x2', X(l.x).toFixed(1)); l.el.setAttribute('y2', Y(l.y).toFixed(1));
        });
        M.qpx = [qx, qy];
      }
      M.cur = E;
    },
    zoomTo: function (E, animate) {
      var M = this._map, self = this;
      if (!M || M.cur === E) return;
      var A = M.cur, t0 = performance.now(), dur = 1000;
      if (!animate || !VIZ.motion) { this.layout(E); return; }
      var token = M.token = {};
      (function tick(t) {
        if (M.token !== token || self._map !== M) return;
        var p = Math.min(1, (t - t0) / dur), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        var I = {};
        ['x0', 'x1', 'y0', 'y1'].forEach(function (k) { I[k] = A[k] + (E[k] - A[k]) * e; });
        self.layout(I);
        if (p < 1) requestAnimationFrame(tick); else self.layout(E);
      })(t0);
    },
    step: function (b, animate, from) {
      var M = this._map;
      if (!M) return;
      if (b >= 1 && animate && from < 1 && this._q && M.qpx) {
        var Q = this._q;
        var delay = from < 0 ? 650 : 0;
        VIZ.anim(Q.el, [{ transform: 'translate(' + (-M.qpx[0] + 40) + 'px,' + (-M.qpx[1] + 20) + 'px) scale(2.2)', opacity: 0 },
          { opacity: 1, offset: .2 }, { transform: 'none', opacity: 1 }], { duration: 1100, delay: delay, easing: 'cubic-bezier(.3,.1,.2,1)' });
      }
      var target = b >= 3 && M.zoom ? M.zoom : M.full;
      if (animate && from < 0 && target !== M.full) {
        var self = this;
        VIZ.later(function () { self.zoomTo(target, true); }, b * 650);
      } else this.zoomTo(target, animate);
      var m = document.querySelector('.map');
      if (m) m.classList.toggle('pulsing', b === 2 && VIZ.motion);
    }
  };
  function avg(a) { return a.reduce(function (x, y) { return x + y; }, 0) / a.length; }
  function shape(lang, x, y, r) {
    if (lang === 'fr') return s('rect', { x: x - r * .85, y: y - r * .85, width: r * 1.7, height: r * 1.7, class: 'pt pt-fr' });
    if (lang === 'it') return s('polygon', { points: [x, y - r * 1.1, x + r, y + r * .75, x - r, y + r * .75].join(','), class: 'pt pt-it' });
    if (lang === 'de') return s('circle', { cx: x, cy: y, r: r, class: 'pt pt-de' });
    return s('circle', { cx: x, cy: y, r: r, class: 'pt pt-other' });
  }
  function starPts(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r : R;
      p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return p.join(' ');
  }

  /* ===================== 4 Hybrid / RRF ===================== */
  VIZ.defs.hybrid = {
    id: 'hybrid', nav: 'Hybrid', usesQuestion: true, title: 'Hybrid: zwei Ranglisten, eine Fusion',
    lead: function (ctx) { return 'Reciprocal Rank Fusion zählt nur Ränge: Jeder Chunk erhält 1/(' + ctx.rrfK + ' + Rang) aus jeder Liste, in der er vorkommt.'; },
    beats: 3,
    render: function (stage, ctx) {
      var q = ctx.q;
      if (!q) { noQuestion(stage); return; }
      stage.appendChild(ui.question(q));
      var k = ctx.k, K = ctx.rrfK;
      function side(mode, list, enter) {
        var c = h('div', { class: 'hcol hcol-' + mode });
        c.appendChild(h('h2', { class: 'hcol-head', text: mode === 'lex' ? 'BM25' : 'Vektor' }));
        if (!list || !list.length) c.appendChild(at(ui.note('Keine Treffer'), 0, enter));
        (list || []).slice(0, 10).forEach(function (r, i) {
          var ch = ctx.chunk(r.chunk);
          c.appendChild(at(h('div', { class: 'hrow ' + (r.hit ? 'is-hit' : 'is-miss'), 'data-chunk': r.chunk },
            h('span', { class: 'hrow-rank', text: r.rank }),
            h('span', { class: 'hrow-doc', text: ch ? ui.docShort(ch.doc) : '#' + r.chunk }),
            ui.mark(r.hit)), 0, enter, i * 50));
        });
        return c;
      }
      var mid = h('div', { class: 'hcol hcol-fuse' });
      mid.appendChild(h('h2', { class: 'hcol-head', text: 'Fusion (RRF)' }));
      var hy = q.hybrid;
      if (!hy || !hy.length) {
        mid.appendChild(at(ui.note('Für diese Frage gibt es kein Hybrid-Ergebnis in den Daten.'), 1));
      } else {
        hy.slice(0, k).forEach(function (r, i) {
          var ch = ctx.chunk(r.chunk), f = r.from || {};
          var parts = h('div', { class: 'contrib' },
            contrib('lex', f.bm25, K), h('span', { class: 'op', text: '+' }), contrib('sem', f.vector, K),
            h('span', { class: 'op', text: '=' }), h('b', { class: 'sum', text: VIZ.num(r.score, 4) }));
          mid.appendChild(at(h('div', { class: 'fcard ' + (r.hit ? 'is-hit' : 'is-miss'), 'data-chunk': r.chunk, 'data-from': JSON.stringify(f) },
            h('span', { class: 'rank', text: r.rank }),
            h('div', { class: 'rc-body' },
              h('div', { class: 'rc-title' }, h('span', { class: 'rc-doc', text: ch ? ui.docShort(ch.doc) : '#' + r.chunk })),
              parts),
            ui.mark(r.hit)), 1, 'none'));
        });
        var rest = restRow(hy, k);
        if (rest) mid.appendChild(at(rest, 1, 'fade', 200 + k * 180));
      }
      var bh = ui.firstHit(q.bm25), vh = ui.firstHit(q.vector), hh = ui.firstHit(hy);
      var v = fusionVerdict(bh, vh, hh, k);
      var score = h('div', { class: 'cmp' },
        cmpItem('lex', 'BM25', bh, k), cmpItem('sem', 'Vektor', vh, k), cmpItem('fuse', 'Hybrid', hh, k));
      stage.appendChild(h('div', { class: 'hgrid' }, side('lex', q.bm25, 'left'), mid, side('sem', q.vector, 'right')));
      stage.appendChild(at(h('div', { class: 'verdict wide ' + v.cls }, h('span', { class: 'cmp-label', text: 'Erster Treffer' }), score,
        h('p', { class: 'verdict-big', text: v.text })), 2, 'up'));
    },
    step: function (b, animate, from) {
      var used = {};
      Array.prototype.forEach.call(document.querySelectorAll('.fcard'), function (c) { used[c.getAttribute('data-chunk')] = 1; });
      Array.prototype.forEach.call(document.querySelectorAll('.hrow'), function (r) {
        r.classList.toggle('used', b >= 1 && !!used[r.getAttribute('data-chunk')]);
        r.classList.toggle('dim', b >= 1 && !used[r.getAttribute('data-chunk')]);
      });
      if (!(b >= 1 && animate && from < 1)) return;
      var base = from < 0 ? 650 : 0;
      Array.prototype.forEach.call(document.querySelectorAll('.fcard'), function (card, i) {
        var f = JSON.parse(card.getAttribute('data-from') || '{}'), id = card.getAttribute('data-chunk');
        var src = null;
        var useB = f.bm25 && (!f.vector || f.bm25 <= f.vector);
        src = document.querySelector((useB ? '.hcol-lex' : '.hcol-sem') + ' .hrow[data-chunk="' + id + '"]');
        var to = card.getBoundingClientRect();
        var dx = 0, dy = 0;
        if (src) { var fr = src.getBoundingClientRect(); dx = fr.left - to.left; dy = fr.top - to.top; }
        VIZ.anim(card, [{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.85)', opacity: 0 },
          { opacity: 1, offset: .15 }, { transform: 'none', opacity: 1 }], { duration: 850, delay: base + i * 230, easing: 'cubic-bezier(.35,.1,.2,1)' });
      });
    }
  };
  function contrib(mode, rank, K) {
    if (!rank) return h('span', { class: 'cpart none c-' + mode, text: mode === 'lex' ? 'nicht in BM25' : 'nicht in Vektor' });
    return h('span', { class: 'cpart c-' + mode, title: VIZ.num(1 / (K + rank), 4) }, '1/(' + K + '+' + rank + ')');
  }
  function cmpItem(mode, label, r, k) {
    return h('div', { class: 'cmp-item c-' + mode }, h('span', { class: 'cmp-mode', text: label }),
      h('b', { class: 'cmp-rank ' + (r && r <= k ? 'hit' : 'miss'), text: r ? 'Rang ' + r : '–' }));
  }
  function fusionVerdict(bh, vh, hh, k) {
    var cand = [bh, vh].filter(function (x) { return x; });
    var best = cand.length ? Math.min.apply(null, cand) : null;
    var weak = bh === best ? 'Vektor' : 'BM25';
    if (!hh && !best) return { cls: 'miss', text: 'Keiner der beiden findet das erwartete Dokument. Fusion kann nichts retten.' };
    if (!hh) return { cls: 'miss', text: 'Die Fusion verliert den Treffer aus den Top 10.' };
    if (!best || hh < best) return { cls: 'hit', text: 'Fusion hilft: Der Treffer steigt auf Rang ' + hh + '.' };
    if (hh === best) return { cls: hh <= k ? 'hit' : 'miss', text: 'Fusion hält den besten Rang (' + hh + '), besser wird es nicht.' };
    return { cls: hh <= k ? 'warn' : 'miss', text: 'Fusion schadet: Rauschen von ' + weak + ' drückt den Treffer von Rang ' + best + ' auf Rang ' + hh + (hh > k ? ', aus den Top ' + k + '.' : '.') };
  }
})();
