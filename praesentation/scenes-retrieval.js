/* Szenen 1–6: Korpus, Chunking, BM25, Vektor-Datenbank, Vektorsuche, Hybrid (RRF). */
'use strict';
(function () {
  var h = VIZ.h, s = VIZ.s, ui = VIZ.ui, at = VIZ.at;
  var WORD = /[\p{L}\p{N}]/u;

  /* Ergebnis-Karte für BM25 und Vektor */
  function resultCard(r, ctx, o) {
    var c = ctx.chunk(r.chunk) || { doc: '?', heading: '', text: '(Chunk fehlt in den Daten)' };
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
    return h('div', { class: 'rest' }, h('span', { class: 'rest-label', text: label || ('Weitere Ergebnisse, Rang ' + (k + 1) + '–' + (k + rest.length)) }),
      rest.map(function (r) { return h('span', { class: 'rest-dot ' + (r.hit ? 'hit' : 'miss'), title: 'Rang ' + r.rank, text: r.rank }); }),
      rest.some(function (r) { return r.hit; }) ? h('span', { class: 'rest-key', text: 'grün = Chunk aus dem erwarteten Dokument' }) : null);
  }

  function verdictBox(cls, big, lines) {
    return h('div', { class: 'verdict ' + cls }, h('p', { class: 'verdict-big', text: big }),
      lines.filter(Boolean).map(function (l) { return h('p', { class: 'verdict-line', text: l }); }));
  }

  function noQuestion(stage) {
    stage.appendChild(ui.empty('Keine Fragen', 'Die Daten enthalten keine Fragen (questions ist leer).'));
  }

  /* Tipp-Runde «Findet diese Suche das richtige Dokument?» – Antwort aus der echten Rangliste */
  function hitGuess(ctx, list, before, question) {
    var q = ctx.q;
    if (!q || !list) return null;
    var k = ctx.k, fh = ui.firstHit(list), ok = !!(fh && fh <= k);
    return { before: before, question: question.replace('{k}', k), options: ['Ja, in den Top ' + k, 'Nein'], correct: ok ? 0 : 1,
      reveal: ok ? 'Erster Treffer auf Rang ' + fh + '.' : fh ? 'Erster Treffer erst auf Rang ' + fh + '.' : 'Kein Treffer in den Top ' + Math.max(list.length, 10) + '.' };
  }

  /* ===================== 1 Korpus ===================== */
  VIZ.defs.korpus = {
    id: 'korpus', usesData: true, nav: 'Korpus', title: 'Der Korpus: echte Zolldokumentation',
    lead: 'Eine Kachel pro Dokument. Je breiter, desto mehr Seiten. Jede Frage dieses Experiments lässt sich daraus beantworten.',
    beats: 3,
    render: function (stage, ctx) {
      var docs = (ctx.data.docs || []).slice().sort(function (a, b) { return (b.pages || 0) - (a.pages || 0); });
      if (!docs.length) { stage.appendChild(ui.empty('Keine Dokumente', 'docs fehlt in den Daten.')); return; }
      var pages = docs.reduce(function (n, d) { return n + (d.pages || 0); }, 0);
      var langs = {};
      docs.forEach(function (d) { var l = langs[d.lang] = langs[d.lang] || { docs: 0, pages: 0 }; l.docs++; l.pages += d.pages || 0; });
      var chunks = (ctx.data.meta.corpus || {}).chunks;
      stage.appendChild(h('div', { class: 'kfacts' },
        fact(VIZ.num(docs.length), 'Dokumente', 0, 0),
        pages ? fact(VIZ.num(pages), 'Seiten', 0, 150) : null,
        fact(String(Object.keys(langs).length), 'Sprachen', 1, 0),
        chunks ? fact(VIZ.num(chunks), 'Chunks im Index', 2, 0) : null));
      var wall = h('div', { class: 'kwall' });
      docs.forEach(function (d, i) {
        var w = Math.max(1, d.pages || 1);
        wall.appendChild(at(h('div', { class: 'ktile kl-' + d.lang, title: d.title, style: { 'flex-grow': w, 'flex-basis': (w * 0.36) + '%' } },
          h('span', { class: 'ktile-title', text: d.title }),
          h('span', { class: 'ktile-meta', text: (d.pages ? VIZ.num(d.pages) + ' S. · ' : '') + (VIZ.LANG[d.lang] || d.lang) })), 0, 'pop', i * 60));
      });
      stage.appendChild(wall);
      stage.appendChild(at(h('div', { class: 'legend klegend' }, Object.keys(langs).sort(function (a, b) { return langs[b].pages - langs[a].pages; }).map(function (l) {
        return h('span', {}, h('i', { class: 'sw kl-' + l }), (VIZ.LANG[l] || l) + ': ' + langs[l].docs + (langs[l].docs === 1 ? ' Dokument' : ' Dokumente') +
          (pages ? ', ' + VIZ.num(langs[l].pages) + ' Seiten' : ''));
      })), 1, 'fade'));
      stage.appendChild(at(h('div', { class: 'kroads' },
        h('p', { class: 'kroads-q', text: 'Wie findet ein Agent darin die richtige Stelle?' }),
        h('div', { class: 'kroad kroad-rag' }, h('b', { text: 'Weg 1: RAG' }), h('span', { text: 'Retrieval-Augmented Generation. Dokumente vorab zerlegen und indexieren. Pro Frage die besten Stellen suchen und dem Modell mitgeben.' })),
        h('div', { class: 'kroad' }, h('b', { text: 'Weg 2: Der Agent sucht selbst' }), h('span', { text: 'Kein Index. Der Agent sucht mit Grep, Glob und Read in mehreren Schritten und entscheidet nach jedem Ergebnis neu.' }))), 2, 'up'));
    },
    step: function (b) {
      Array.prototype.forEach.call(document.querySelectorAll('.ktile'), function (el) {
        el.classList.toggle('dimmed', b >= 1 && el.classList.contains('kl-de'));
      });
    }
  };
  function fact(num, label, beat, delay) {
    return at(h('div', { class: 'kfact' }, h('span', { class: 'kfact-num', text: num }), h('span', { class: 'kfact-label', text: label })), beat, 'up', delay);
  }

  /* ===================== 2 Chunking ===================== */
  VIZ.defs.chunking = {
    id: 'chunking', usesData: true, nav: 'Chunking', title: 'Chunking: den Text zerlegen',
    lead: 'Ein Abschnitt aus dem Korpus, zwei Schnittarten. Die Suche liefert immer ganze Chunks zurück, nie einzelne Sätze.',
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
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Schnittart' },
          h('button', { type: 'button', class: 'seg-btn', 'data-mode': 'fixed', onclick: function () { self.setBeat(1); } }, this._fixedLabel),
          h('button', { type: 'button', class: 'seg-btn', 'data-mode': 'heading', onclick: function () { self.setBeat(2); } }, 'Nach Überschriften')),
        h('span', { class: 'toolbar-hint' }, h('kbd', { text: 't' }), ' wechseln'),
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
    help: [['t', 'Chunking: feste Länge ↔ Überschriften']],
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
        if (mode === 'heading') st.appendChild(h('span', { class: 'good' }, 'Überschriften stehen im Chunk'));
      }

      /* Karten */
      var list = document.getElementById('ch-list');
      list.innerHTML = '';
      if (mode === 'raw') {
        list.appendChild(h('div', { class: 'ch-intro' },
          h('p', { text: 'Noch nicht zerlegt.' }),
          h('p', { class: 'muted', text: 'Ein Chunk ist die Einheit, die indexiert und zurückgegeben wird. Ein Embedding-Modell verarbeitet nur kurze Texte, und BM25 bewertet ganze Chunks. Darum wird jedes Dokument zerlegt.' })));
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

  /* ===================== 3 BM25 ===================== */
  /* Zeigt die drei Schritte der Stichwortsuche mit echten Werten:
     1 Frage zerlegen (query_terms), 2 Seltenheit je Suchbegriff (term_df = Anzahl Chunks im ganzen Index),
     3 Chunks bewerten (Rangliste mit Scores aus SQLite FTS5). */
  function idfWeight(df, N) { return Math.log(1 + (N - df + 0.5) / (df + 0.5)); }
  VIZ.defs.bm25 = {
    id: 'bm25', usesData: true, nav: 'BM25', usesQuestion: true, title: 'BM25: die Stichwortsuche',
    lead: 'BM25 sucht die Wörter der Frage wörtlich in den Chunks. Seltene Wörter zählen mehr als häufige. Die Bedeutung der Wörter spielt keine Rolle.',
    beats: 4,
    guess: function (ctx) {
      return hitGuess(ctx, ctx.q && (ctx.q.bm25 || []), 2, 'Findet BM25 das richtige Dokument in den Top {k}?');
    },
    render: function (stage, ctx) {
      var q = ctx.q;
      if (!q) { noQuestion(stage); return; }
      var list = q.bm25 || [], k = ctx.k, terms = q.query_terms || [];
      var N = (ctx.data.meta.corpus || {}).chunks || 0, df = q.term_df || null;
      var inTop = {};
      list.forEach(function (r) { (r.matched || []).forEach(function (t) { inTop[t] = (inTop[t] || 0) + 1; }); });
      function count(t) { return df ? (df[t] || 0) : (inTop[t] || 0); }
      var wmax = N ? idfWeight(1, N) : 1;

      /* 1 Frage zerlegen */
      var seen = {}, words = (q.text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter(function (w) { if (seen[w]) return false; seen[w] = 1; return true; });
      var tokens = h('div', { class: 'tok' });
      words.forEach(function (w, i) {
        var isTerm = terms.indexOf(w) >= 0, n = count(w);
        var col = h('div', { class: 'tok-col' + (isTerm ? ' is-term' : ' is-stop') + (isTerm && !n ? ' is-zero' : ''), 'data-count': n },
          at(h('span', { class: 'tok-word', text: w }), 0, 'pop', 150 + i * 70));
        if (isTerm) {
          col.appendChild(at(h('span', { class: 'tok-df', text: df ? (n ? 'in ' + VIZ.num(n) + ' Chunks' : 'in keinem Chunk') : (n ? n + '× in den Top 10' : 'kein Treffer') }), 1, 'up', i * 70));
          if (df && N) col.appendChild(at(h('span', { class: 'tok-w', title: 'Gewicht' }, h('b', { style: { width: (n ? Math.max(6, 100 * idfWeight(n, N) / wmax) : 0) + '%' } })), 1, 'grow', 150 + i * 70));
        }
        tokens.appendChild(col);
      });
      stage.appendChild(ui.question(q));
      stage.appendChild(h('div', { class: 'bm-steps' },
        h('div', { class: 'bm-step' }, h('b', { text: '1 Frage zerlegen' }), h('span', { text: 'Kleinschreibung, Füllwörter (durchgestrichen) entfernen. Übrig bleiben die Suchbegriffe.' })),
        at(h('div', { class: 'bm-step' }, h('b', { text: '2 Seltenheit bestimmen' }),
          h('span', { text: df && N ? 'In wie vielen der ' + VIZ.num(N) + ' Chunks kommt der Begriff vor? Je seltener, desto höher sein Gewicht (Balken).' : 'Je seltener ein Begriff im Korpus, desto höher sein Gewicht.' })), 1, 'fade'),
        at(h('div', { class: 'bm-step' }, h('b', { text: '3 Chunks bewerten' }),
          h('span', { text: 'Score = Summe über alle Suchbegriffe: Gewicht × Häufigkeit im Chunk. Wiederholungen zählen immer weniger, lange Chunks werden abgewertet.' })), 2, 'fade')));
      stage.appendChild(tokens);

      /* 3 Rangliste */
      var col = h('div', { class: 'results' });
      if (!list.length) col.appendChild(at(ui.note('BM25 liefert keinen einzigen Chunk. Kein Suchbegriff kommt wörtlich im Korpus vor.', 'miss'), 2));
      var max = list.length ? list[0].score : 1;
      list.slice(0, k).forEach(function (r, i) {
        col.appendChild(at(resultCard(r, ctx, { mode: 'lex', max: max, terms: terms, digits: 2 }), 2, 'right', i * 110));
      });
      var rest = restRow(list, k);
      if (rest) col.appendChild(at(rest, 2, 'fade', k * 110));

      var fh = ui.firstHit(list);
      var zero = terms.filter(function (t) { return !count(t); });
      var big = fh && fh <= k ? 'Treffer auf Rang ' + fh : fh ? 'Erster Treffer erst auf Rang ' + fh : 'Kein Treffer in den Top ' + Math.max(list.length, 10);
      var lines = [];
      if (zero.length) lines.push('«' + zero.join('», «') + '» ' + (zero.length > 1 ? 'kommen' : 'kommt') + (df ? ' im ganzen Korpus nicht vor.' : ' in keinem gefundenen Chunk vor.'));
      var nb = q.note_bm25 !== undefined ? q.note_bm25 : q.note;
      if (nb) lines.push(nb);
      if (!(fh && fh <= k)) lines.push('BM25 vergleicht Zeichenfolgen. Synonyme und andere Sprachen findet es nicht.');
      else if (q.category === 'exact-identifier') lines.push('Seltene, exakte Zeichenfolgen sind die Stärke von BM25.');
      var side = h('div', { class: 'side' },
        at(verdictBox(fh && fh <= k ? 'hit' : 'miss', big, lines), 3, 'up'),
        at(ui.tidbit('Was ist BM25?', 'Eine feste Rechenformel («Best Matching 25»), kein KI-Modell. Sie zählt nur Wörter. Jede klassische Volltextsuche nutzt sie, zum Beispiel Elasticsearch. In diesem Experiment führt die Volltextsuche von SQLite die Berechnung aus.'), 3, 'up', 200));
      stage.appendChild(h('div', { class: 'two-col' }, col, side));
    },
    step: function (b) {
      Array.prototype.forEach.call(document.querySelectorAll('.tok-col.is-zero'), function (t) { t.classList.toggle('zero', b >= 1); });
    }
  };

  /* ===================== 4 Vector database ===================== */
  /* Shows what is actually stored and compared: one row per chunk with its embedding, the question
     as one more list of numbers, and the similarity column that decides the ranking. All rows, numbers
     and scores are real (chunks[].v and questions[].query_v hold the first numbers of each embedding). */
  var VROWS = 7;
  function strip(v, cls) {
    var el = h('span', { class: 'vstrip ' + (cls || '') });
    if (!v || !v.length) { el.appendChild(h('span', { class: 'vstrip-none', text: 'Zahlen fehlen in dieser Datendatei' })); return el; }
    var max = Math.max.apply(null, v.map(Math.abs)) || 1;
    v.forEach(function (x) {
      var a = Math.min(1, Math.abs(x) / max);
      el.appendChild(h('i', { title: String(x), style: { background: x >= 0 ? 'rgba(44,107,176,' + (0.12 + 0.88 * a).toFixed(2) + ')' : 'rgba(20,20,19,' + (0.08 + 0.72 * a).toFixed(2) + ')' } }));
    });
    el.appendChild(h('span', { class: 'vstrip-more', text: '…' }));
    return el;
  }
  function numbers(v, n) {
    if (!v || !v.length) return '';
    return '[' + v.slice(0, n).map(function (x) { return (x >= 0 ? ' ' : '') + x.toFixed(2); }).join(', ') + ', …]';
  }
  VIZ.defs.vecdb = {
    id: 'vecdb', usesData: true, nav: 'Vektor-DB', usesQuestion: true, title: 'Vektor-Datenbank: Text als Zahlen gespeichert',
    lead: function (ctx) {
      return 'Ein Embedding-Modell berechnet aus einem Text eine Liste von ' + (ctx.data.meta.dims || 384) + ' Zahlen. Texte mit ähnlicher Bedeutung erhalten ähnliche Zahlen. Die Datenbank speichert pro Chunk eine solche Liste.';
    },
    beats: 5,
    render: function (stage, ctx) {
      var q = ctx.q;
      if (!q) { noQuestion(stage); return; }
      var dims = ctx.data.meta.dims || 384, k = ctx.k;
      var list = (q.vector || []).slice(0, VROWS).filter(function (r) { return ctx.chunk(r.chunk); });
      if (!list.length) { stage.appendChild(ui.question(q)); stage.appendChild(ui.note('Keine Vektor-Ergebnisse für diese Frage.', 'miss')); this._ok = false; return; }
      this._ok = true;
      var first = ctx.chunk(list[0].chunk), total = (ctx.data.meta.corpus || {}).chunks;
      var model = String(ctx.data.meta.model || 'Embedding-Modell').split('/').pop();

      /* 1 text -> model -> numbers */
      stage.appendChild(h('div', { class: 'emb' },
        at(h('div', { class: 'emb-text' }, h('span', { class: 'emb-label', text: 'Ein Chunk' }), h('p', { text: ui.snippet(first.text, null, 120) })), 0, 'left'),
        at(h('span', { class: 'emb-arrow', text: '→' }), 0, 'fade', 250),
        at(h('div', { class: 'emb-model' }, h('b', { text: 'Embedding-Modell' }), h('span', { text: model }), h('span', { class: 'emb-fine', text: 'klein, läuft lokal, ist nicht Claude' })), 0, 'pop', 350),
        at(h('span', { class: 'emb-arrow', text: '→' }), 0, 'fade', 600),
        at(h('div', { class: 'emb-vec' }, h('span', { class: 'emb-label', text: VIZ.num(dims) + ' Zahlen = das Embedding (der Vektor) dieses Chunks' }),
          strip(first.v), h('code', { text: numbers(first.v, 6) })), 0, 'right', 700)));

      /* 2 the table */
      var rows = list.slice().sort(function (a, b) { return a.chunk - b.chunk; });
      var maxScore = Math.max.apply(null, list.map(function (r) { return r.score; })) || 1;
      var table = h('div', { class: 'vt', id: 'vt' });
      table.appendChild(h('div', { class: 'vt-row vt-head' }, h('span', { text: 'Zeile' }), h('span', { text: 'Dokument' }), h('span', { text: 'Text des Chunks' }),
        h('span', { text: 'Embedding (' + VIZ.num(dims) + ' Zahlen)' }), at(h('span', { text: 'Ähnlichkeit zur Frage' }), 3, 'fade')));
      table.appendChild(at(h('div', { class: 'vt-row vt-query' }, h('span', { text: '?' }), h('span', { text: 'die Frage' }),
        h('span', { class: 'vt-text', text: q.text }), strip(q.query_v, 'q'), h('span', { class: 'vt-sim', text: 'gleiches Modell, ebenfalls ' + VIZ.num(dims) + ' Zahlen' })), 2, 'up'));
      var body = h('div', { class: 'vt-body', id: 'vt-body' });
      rows.forEach(function (r, i) {
        var c = ctx.chunk(r.chunk);
        body.appendChild(at(h('div', { class: 'vt-row' + (r.hit ? ' is-hit' : ''), 'data-chunk': r.chunk, 'data-rank': r.rank, 'data-score': r.score },
          h('span', { class: 'vt-id', text: r.chunk }),
          h('span', { class: 'vt-doc', text: ui.docShort(c.doc) }),
          h('span', { class: 'vt-text', text: ui.snippet(c.text, null, 90) }),
          strip(c.v),
          h('span', { class: 'vt-sim simcell' }, h('i', {}, h('b', { style: { width: Math.max(4, 100 * r.score / maxScore) + '%' } })),
            h('em', { text: VIZ.num(r.score, 2) }), h('span', { class: 'vt-rank', text: r.rank <= k ? '#' + r.rank : '' }), r.hit ? ui.mark(true) : h('span', { class: 'mark-gap' }))), 1, 'up', i * 70));
      });
      table.appendChild(body);
      table.appendChild(at(h('div', { class: 'vt-foot', text: '… insgesamt ' + (total ? VIZ.num(total) + ' Zeilen' : 'eine Zeile pro Chunk') +
        ' · hier ist die Datenbank eine SQLite-Datei mit der Erweiterung sqlite-vec' }), 1, 'fade', rows.length * 70));
      stage.appendChild(table);

      /* 3 short notes */
      stage.appendChild(h('div', { class: 'tidbits' },
        at(ui.tidbit('Wie wird Ähnlichkeit gemessen?', 'Mit der Kosinus-Ähnlichkeit: dem Winkel zwischen zwei Vektoren. 1 = gleiche Richtung, 0 = kein Zusammenhang.'), 3, 'up'),
        at(ui.tidbit('Wozu eine eigene Datenbank?', 'Bei Millionen Zeilen ist der Vergleich mit jeder einzelnen Zeile zu langsam. Eine Vektor-Datenbank hat einen Index, der die ähnlichsten Zeilen findet, ohne alle zu prüfen.'), 4, 'up'),
        at(ui.tidbit('Wörter werden nicht verglichen', 'Nur die Zahlen. Darum findet «Pfund» den Text mit «GBP». Und darum geht ein Code wie NT044 unter.'), 4, 'up', 150)));
    },
    step: function (b, animate, from) {
      if (!this._ok) return;
      var body = document.getElementById('vt-body');
      if (!body) return;
      var rows = [].slice.call(body.children), sorted = b >= 3;
      var before = rows.map(function (r) { return r.getBoundingClientRect().top; });
      rows.slice().sort(function (x, y) {
        return sorted ? +x.getAttribute('data-rank') - +y.getAttribute('data-rank') : +x.getAttribute('data-chunk') - +y.getAttribute('data-chunk');
      }).forEach(function (r) { body.appendChild(r); });
      document.getElementById('vt').classList.toggle('scored', sorted);
      if (animate && from >= 0 && (from < 3) !== (b < 3)) rows.forEach(function (r, i) {
        var dy = before[i] - r.getBoundingClientRect().top;
        if (dy) VIZ.anim(r, [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 900, delay: 450, fill: 'backwards', easing: 'cubic-bezier(.3,.1,.2,1)' });
      });
    }
  };

  /* ===================== 5 Vektor ===================== */
  VIZ.defs.vector = {
    id: 'vector', usesData: true, nav: 'Vektorsuche', usesQuestion: true, title: 'Vektorsuche: die nächsten Nachbarn',
    lead: 'Dieselbe Tabelle als Karte. Jede Zeile ist ein Punkt. Zeilen mit ähnlichen Zahlen liegen nah beieinander. Die Suche liefert die Punkte, die der Frage am nächsten sind.',
    beats: 4,
    guess: function (ctx) {
      return hitGuess(ctx, ctx.q && (ctx.q.vector || []), 2, 'Findet die Vektorsuche das richtige Dokument in den Top {k}?');
    },
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
      var nv = q.note_vector !== undefined ? q.note_vector : q.note;
      if (nv) lines.push(nv);
      if (!(fh && fh <= k)) lines.push(q.category === 'exact-identifier'
        ? 'Codes wie IE015 und IE051 erhalten fast dieselben Zahlen. Ziffern tragen kaum Bedeutung.'
        : 'Die nächsten Nachbarn sind inhaltlich ähnlich, aber nicht die gesuchte Stelle.');
      else if (q.category === 'cross-lingual' || q.category === 'synonym') lines.push('Verglichen wird die Bedeutung, nicht der Wortlaut. Das ist die Stärke des Modells.');
      col.appendChild(at(verdictBox(fh && fh <= k ? 'hit' : 'miss',
        fh && fh <= k ? 'Treffer auf Rang ' + fh : fh ? 'Erster Treffer erst auf Rang ' + fh : 'Kein Treffer in den Top ' + Math.max(list.length, 10), lines), 3, 'up'));
      stage.appendChild(h('div', { class: 'two-col map-col' }, mapBox, col));
      this.drawMap(mapBox, ctx, q);
    },
    drawMap: function (box, ctx, q) {
      var plot = h('div', { class: 'map-plot' });
      var caption = h('p', { class: 'map-caption', text: 'Jeder Punkt hat 384 Zahlen. Die Karte reduziert sie auf 2, die Abstände stimmen darum nur ungefähr. Die Nachbarn stammen aus der echten Rangliste.' });
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
      if (zoom) plot.appendChild(at(h('span', { class: 'zoom-badge', text: 'Ausschnitt um die Frage' }), 3, 'fade', 300));
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
    id: 'hybrid', usesData: true, nav: 'Hybrid', usesQuestion: true, title: 'Hybrid: zwei Ranglisten zusammenführen',
    lead: function (ctx) { return 'Reciprocal Rank Fusion (RRF) wertet nur die Ränge aus. Ein Chunk erhält aus jeder Liste 1/(' + ctx.rrfK + ' + Rang). Die Scores selbst zählen nicht. So lassen sich zwei verschiedene Verfahren kombinieren.'; },
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
        mid.appendChild(at(ui.note('Für diese Frage fehlt das Hybrid-Ergebnis in den Daten.'), 1));
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
    if (!hh && !best) return { cls: 'miss', text: 'Keine der beiden Suchen findet das erwartete Dokument. Daran ändert die Fusion nichts.' };
    if (!hh) return { cls: 'miss', text: 'Nach der Fusion steht der Treffer nicht mehr in den Top 10.' };
    if (!best || hh < best) return { cls: 'hit', text: 'Die Fusion hilft: Der Treffer steigt auf Rang ' + hh + '.' };
    if (hh === best) return { cls: hh <= k ? 'hit' : 'miss', text: 'Die Fusion hält den besten Rang (' + hh + '). Besser wird er nicht.' };
    return { cls: hh <= k ? 'warn' : 'miss', text: 'Die Fusion schadet: Falsche Treffer aus ' + weak + ' verdrängen den richtigen von Rang ' + best + ' auf Rang ' + hh + (hh > k ? ', aus den Top ' + k + '.' : '.') };
  }
})();
