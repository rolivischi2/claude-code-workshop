// Recorded answers are Markdown; the slide shows plain text (no **, `, list dashes).
function plainAnswer(md) {
  return md.replace(/\*\*|__|`/g, '').replace(/(^|\s)[-*]\s+/g, '$1').replace(/\s+-\s*$/, '').replace(/\s{2,}/g, ' ').trim();
}

/* Szenen 6–8: Agentische Suche, Messung, Fazit. */
'use strict';
(function () {
  var h = VIZ.h, ui = VIZ.ui, at = VIZ.at;

  /* ===================== 5 Agentische Suche ===================== */
  function runFor(ctx) {
    var q = ctx.q;
    return q ? (ctx.data.agent || []).filter(function (a) { return a.question === q.id; })[0] || null : null;
  }
  function perBeat(run) { return Math.max(1, Math.ceil(((run && run.steps) || []).length / 10)); }

  VIZ.defs.agent = {
    id: 'agent', usesData: true, nav: 'Agent', usesQuestion: true, title: 'Der Agent sucht selbst',
    lead: 'Aufzeichnung eines echten Laufs von Claude Code mit Grep, Glob und Read auf den Korpus-Dateien. Kein Index, keine Embeddings, dafür mehrere Schritte.',
    beats: function (ctx) {
      var run = runFor(ctx);
      if (!run) return 1;
      return 2 + Math.ceil((run.steps || []).length / perBeat(run));
    },
    guess: function (ctx) {
      var run = runFor(ctx);
      if (!run || !run.turns) return null;
      return { before: 1, question: 'Wie viele Turns braucht Claude Code für diese Frage, ohne Index?',
        options: ['1–2', '3–4', '5 oder mehr'], correct: run.turns <= 2 ? 0 : run.turns <= 4 ? 1 : 2,
        reveal: VIZ.num(run.turns) + ' Turns' + (run.input_tokens ? ', ' + VIZ.num(run.input_tokens) + ' Input-Tokens' : '') + '.' };
    },
    render: function (stage, ctx) {
      var q = ctx.q, run = runFor(ctx);
      this._run = run;
      if (!q) { stage.appendChild(ui.empty('Keine Fragen', 'Die Daten enthalten keine Fragen.')); return; }
      stage.appendChild(ui.question(q));
      var runs = ctx.data.agent || [];
      if (!run) {
        var box = h('div', { class: 'empty inline' },
          h('h2', { text: runs.length ? 'Für diese Frage gibt es keine Aufzeichnung.' : 'Die Daten enthalten keine aufgezeichneten Läufe.' }),
          h('p', { text: runs.length ? 'Aufgezeichnet sind:' : 'Die Pipeline schreibt sie ins Feld agent von data.js.' }));
        runs.forEach(function (a) {
          var qq = ctx.data.questions.filter(function (x) { return x.id === a.question; })[0];
          if (!qq) return;
          box.appendChild(h('button', { class: 'pick inline', type: 'button', onclick: function () { VIZ.pick(qq.id); } },
            ui.catTag(qq.category), h('span', { class: 'pick-text', text: qq.text })));
        });
        stage.appendChild(box);
        return;
      }
      var steps = run.steps || [], per = perBeat(run), last = 1 + Math.ceil(steps.length / per);
      var maxChars = Math.max.apply(null, steps.map(function (st) { return st.result_chars || 0; }).concat([1]));
      var tl = h('ol', { class: 'timeline' });
      steps.forEach(function (st, i) {
        var w = Math.round(100 * (st.result_chars || 0) / maxChars);
        tl.appendChild(at(h('li', { class: 'tstep', 'data-i': i },
          h('span', { class: 'tstep-n', text: st.n || i + 1 }),
          h('span', { class: 'tool tool-' + String(st.tool || '').toLowerCase(), text: st.tool || '?' }),
          h('code', { class: 'tstep-in', text: st.input || '', title: st.input || '' }),
          h('span', { class: 'tstep-res' },
            h('span', { class: 'res-bar' }, h('span', { style: { width: w + '%' } })),
            h('span', { class: 'res-num' + (st.result_chars ? '' : ' empty-res'), text: st.result_chars ? VIZ.kchars(st.result_chars) : 'leer' }))),
          1 + Math.floor(i / per), 'left'));
      });
      var counters = h('div', { class: 'counters' },
        counter('Turns', 'c-turns'), counter('Kontext (Tokens)', 'c-ctx'),
        h('div', { class: 'spark', id: 'spark' }, steps.map(function (st, i) {
          return h('span', { class: 'spark-bar', 'data-i': i, style: { height: '0%' } });
        })));
      var answer = at(h('div', { class: 'answer ' + (run.found_expected ? 'hit' : 'miss') },
        h('p', { class: 'verdict-big' }, ui.mark(run.found_expected), run.found_expected ? ' Erwartetes Dokument gefunden' : ' Erwartetes Dokument nicht gefunden'),
        run.answer ? h('blockquote', { text: plainAnswer(run.answer) }) : null,
        h('p', { class: 'muted small', text: [run.model, run.duration_s ? VIZ.num(run.duration_s) + ' s' : null,
          run.output_tokens ? VIZ.num(run.output_tokens) + ' Output-Tokens' : null].filter(Boolean).join(', ') })), last, 'up');
      var hy = ui.firstHit(q.hybrid), vec = ui.firstHit(q.vector), k = ctx.k;
      var ragRank = hy || vec;
      var cmp = at(h('table', { class: 'vs' },
        h('thead', {}, h('tr', {}, h('th', {}), h('th', { text: 'RAG' }), h('th', { text: 'Agent' }))),
        h('tbody', {},
          vsRow('Vorbereitung', 'Index aufbauen und aktuell halten', 'keine'),
          vsRow('Aufwand pro Frage', '1 Abfrage, Top ' + k + ' Chunks', VIZ.num(run.turns) + ' Turns, ' + VIZ.num(run.input_tokens) + ' Input-Tokens'),
          vsRow('Andere Wortwahl', 'nur soweit das Embedding-Modell sie erkennt', 'formuliert um und übersetzt selbst'),
          h('tr', {}, h('th', { text: 'Ergebnis' }),
            h('td', {}, ui.mark(!!(ragRank && ragRank <= k)), ' ', ragRank ? 'Rang ' + ragRank + (hy ? ' (Hybrid)' : ' (Vektor)') : 'nicht in den Top 10'),
            h('td', {}, ui.mark(!!run.found_expected), run.found_expected ? ' gefunden' : ' nicht gefunden')))), last, 'up', 250);
      stage.appendChild(h('div', { class: 'agent-grid' },
        h('div', { class: 'agent-left' }, tl, cmp),
        h('div', { class: 'agent-right' }, counters, answer)));
      this._vals = { turns: 0, ctx: 0 };
    },
    step: function (b, animate) {
      var run = this._run;
      if (!run) return;
      var steps = run.steps || [], per = perBeat(run), last = 1 + Math.ceil(steps.length / per);
      var shown = b >= last ? steps.length : Math.min(steps.length, b * per);
      var turns = b >= last ? (run.turns || shown) : shown;
      var cx = shown ? (steps[shown - 1].context_tokens || 0) : 0;
      if (b >= last && run.input_tokens) cx = run.input_tokens;
      document.querySelector('#c-ctx .counter-label').textContent = b >= last && run.input_tokens ? 'Input-Tokens gesamt' : 'Kontext (Tokens)';
      countTo('c-turns', this._vals.turns, turns, animate);
      countTo('c-ctx', this._vals.ctx, cx, animate);
      this._vals = { turns: turns, ctx: cx };
      var maxCtx = Math.max.apply(null, steps.map(function (st) { return st.context_tokens || 0; }).concat([1]));
      Array.prototype.forEach.call(document.querySelectorAll('.spark-bar'), function (el, i) {
        el.style.height = i < shown ? Math.max(3, Math.round(100 * (steps[i].context_tokens || 0) / maxCtx)) + '%' : '0%';
      });
      Array.prototype.forEach.call(document.querySelectorAll('.tstep'), function (el, i) {
        el.classList.toggle('current', b < last && i === shown - 1);
      });
    }
  };
  function counter(label, id) {
    return h('div', { class: 'counter', id: id }, h('span', { class: 'counter-val', text: '0' }), h('span', { class: 'counter-label', text: label }));
  }
  function countTo(id, from, to, animate) {
    var el = document.querySelector('#' + id + ' .counter-val');
    if (!el) return;
    if (!animate || !VIZ.motion || from === to) { el.textContent = VIZ.num(to); return; }
    var t0 = performance.now(), dur = 700;
    (function tick(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = VIZ.num(Math.round(from + (to - from) * e));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  function vsRow(label, a, b) { return h('tr', {}, h('th', { text: label }), h('td', { text: a }), h('td', { text: b })); }

  /* ===================== 7 Messung, Detail (Taste d) ===================== */
  function variants(ctx) {
    var E = ctx.data.eval;
    if (!E || !E.rows || !E.rows.length) return [];
    if (E.variants && E.variants.length) return E.variants;
    var seen = [];
    E.rows.forEach(function (r) { if (seen.indexOf(r.variant) < 0) seen.push(r.variant); });
    return seen;
  }
  function variantLabel(v) {
    return String(v).split('+').map(function (p) {
      return p === 'heading' ? 'Überschriften' : p === 'fixed' ? 'feste Länge' : p;
    }).join(' + ');
  }
  VIZ.variantLabel = variantLabel;

  VIZ.defs.score = {
    id: 'score', usesData: true, nav: 'Messung', title: 'Messung im Detail',
    lead: function (ctx) {
      var k = (ctx.data.eval && ctx.data.eval.k) || ctx.k;
      return 'Recall@' + k + ': Steht das erwartete Dokument in den Top ' + k + '? MRR: Auf welchem Rang steht der erste Treffer?';
    },
    beats: function (ctx) { return Math.max(1, variants(ctx).length); },
    help: [['v', 'Messung im Detail: nächste Variante']],
    keys: {
      v: function (ctx) {
        var n = VIZ.beatCount(), f = VIZ.state.beat;
        VIZ.state.beat = (f + 1) % n;
        VIZ.apply(VIZ.state.beat, true, f);
      },
      d: function () { VIZ.scenes[VIZ.state.scene] = VIZ.defs.messung; VIZ.render(99, true); }
    },
    render: function (stage, ctx) {
      var E = ctx.data.eval, vs = variants(ctx);
      this._ok = !!vs.length;
      if (!vs.length) { stage.appendChild(ui.empty('Keine Messwerte', 'eval.rows fehlt in den Daten.')); return; }
      var modes = (E.modes && E.modes.length) ? E.modes : ['bm25', 'vector', 'hybrid'];
      var cats = ((E.categories && E.categories.length) ? E.categories : ['synonym', 'cross-lingual', 'exact-identifier', 'multi-doc']).concat(['all']);
      this._E = E; this._modes = modes; this._cats = cats; this._vs = vs;
      var self = this;
      var bar = h('div', { class: 'toolbar' },
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Variante' }, vs.map(function (v, i) {
          return h('button', { type: 'button', class: 'seg-btn', 'data-v': i, onclick: function () {
            var f = VIZ.state.beat; if (f === i) return; VIZ.state.beat = i; VIZ.apply(i, true, f);
          } }, variantLabel(v), v === ctx.data.meta.variant ? h('span', { class: 'seg-note', text: 'Szenen ' + VIZ.questionScenes() }) : null);
        })),
        h('span', { class: 'toolbar-hint' }, h('kbd', { text: 'v' }), ' Variante ', h('kbd', { text: 'd' }), ' zurück zur Übersicht'),
        h('div', { class: 'legend modes' }, modes.map(function (m) {
          return h('span', {}, h('i', { class: 'sw m-' + m }), VIZ.MODE[m] || m);
        }), h('span', { class: 'ghost-legend' }, h('i', { class: 'sw ghost' }), 'vorherige Variante')));
      stage.appendChild(bar);
      var k = E.k || ctx.k;
      stage.appendChild(h('div', { class: 'charts' }, chart('recall', 'Recall@' + k, modes, cats, E), chart('mrr', 'MRR', modes, cats, E)));
      var nAll = E.rows.filter(function (r) { return r.category === 'all'; }).map(function (r) { return r.n; })[0];
      stage.appendChild(h('p', { class: 'caption', text: 'n = Anzahl Fragen pro Kategorie. Bei n = 6 ändert eine einzige Frage den Recall um 0.17' +
        (nAll ? ', über alle ' + nAll + ' Fragen um ' + VIZ.num(1 / nAll, 2) : '') + '. Kleine Unterschiede sind nicht belastbar.' }));
    },
    step: function (b, animate, from) {
      if (!this._ok) return;
      var self = this, v = this._vs[b], pv = from >= 0 && from !== b ? this._vs[from] : null;
      Array.prototype.forEach.call(document.querySelectorAll('.seg-btn'), function (x) { x.classList.toggle('on', +x.getAttribute('data-v') === b); });
      var rows = {};
      this._E.rows.forEach(function (r) { rows[r.variant + '|' + r.mode + '|' + r.category] = r; });
      function apply() {
        Array.prototype.forEach.call(document.querySelectorAll('.bar'), function (el) {
          var key = el.getAttribute('data-key'), metric = el.getAttribute('data-metric');
          var r = rows[v + '|' + key], p = pv ? rows[pv + '|' + key] : null;
          var val = r ? r[metric] : null;
          el.style.height = (val ? Math.max(0.5, val * 100) : 0) + '%';
          el.classList.toggle('missing', val === null || val === undefined);
          var lab = el.querySelector('.bar-val');
          lab.textContent = val === null || val === undefined ? '–' : VIZ.num(val, 2);
          lab.style.marginBottom = '0px';
          var g = el.parentNode.querySelector('.ghost[data-key="' + key + '"]');
          if (g) {
            var pval = p ? p[metric] : null;
            var show = pv && pval !== null && pval !== undefined && Math.abs(pval - (val || 0)) > 0.004;
            g.style.bottom = (pval || 0) * 100 + '%';
            g.style.visibility = show ? 'visible' : 'hidden';
            if (show) {
              /* Wert über die Markierung der vorherigen Variante heben, wenn sie im Weg ist */
              var dy = (pval - (val || 0)) * el.parentNode.clientHeight;
              if (dy > -6 && dy < lab.offsetHeight + 6) lab.style.marginBottom = Math.round(dy + 8) + 'px';
            }
          }
        });
        Array.prototype.forEach.call(document.querySelectorAll('.grp-n'), function (el) {
          var r = rows[v + '|' + el.getAttribute('data-key')];
          el.textContent = r && r.n ? 'n = ' + r.n : '';
        });
      }
      if (from < 0 && animate && VIZ.motion) {
        Array.prototype.forEach.call(document.querySelectorAll('.bar'), function (el) { el.style.height = '0%'; });
        document.querySelector('.charts').offsetHeight; /* Reflow, damit die Übergänge starten */
        VIZ.later(apply, 120);
      } else apply();
    }
  };
  function chart(metric, title, modes, cats, E) {
    var plot = h('div', { class: 'plot' });
    [0, 0.25, 0.5, 0.75, 1].forEach(function (g) {
      plot.appendChild(h('div', { class: 'grid', style: { bottom: g * 100 + '%' } }, h('span', { text: VIZ.num(g, 2) })));
    });
    var groups = h('div', { class: 'groups' });
    cats.forEach(function (c) {
      var bars = h('div', { class: 'bars' });
      modes.forEach(function (m) {
        bars.appendChild(h('div', { class: 'slot' },
          h('div', { class: 'bar m-' + m, 'data-key': m + '|' + c, 'data-metric': metric, style: { height: '0%' } },
            h('span', { class: 'bar-val' })),
          h('div', { class: 'ghost m-' + m, 'data-key': m + '|' + c })));
      });
      groups.appendChild(h('div', { class: 'grp' + (c === 'all' ? ' grp-all' : '') }, bars,
        h('div', { class: 'grp-label' }, h('span', { text: VIZ.CATEGORY[c] || c }), h('span', { class: 'grp-n', 'data-key': modes[0] + '|' + c }))));
    });
    plot.appendChild(groups);
    return h('div', { class: 'chart' }, h('h2', { text: title }), plot);
  }


  /* ===================== 7 Messung: jede Frage ein Punkt ===================== */
  /* Recall pro Frage und Modus aus den echten Ranglisten: Anteil der erwarteten Dokumente in den Top k.
     Ergibt gemittelt dieselben Zahlen wie eval.rows (dort stehen auch die übrigen Varianten). */
  var DMODES = ['bm25', 'vector', 'hybrid'];
  function qRecall(q, mode, ctx) {
    var exp = q.expected_docs || [], found = {};
    (q[mode] || []).slice(0, ctx.k).forEach(function (r) {
      var c = ctx.chunk(r.chunk);
      if (c && exp.indexOf(c.doc) >= 0) found[c.doc] = 1;
      else if (!c && r.hit) found['?' + r.rank] = 1;
    });
    return exp.length ? Math.min(1, Object.keys(found).length / exp.length) : 0;
  }
  function dotData(ctx) {
    var qs = ctx.data.questions || [];
    if (!qs.length || !qs.some(function (q) { return q.bm25 || q.vector || q.hybrid; })) return null;
    var cats = [];
    qs.forEach(function (q) { if (cats.indexOf(q.category) < 0) cats.push(q.category); });
    var order = ['synonym', 'cross-lingual', 'exact-identifier', 'multi-doc'];
    cats.sort(function (a, b) { return (order.indexOf(a) + 99) % 99 - (order.indexOf(b) + 99) % 99; });
    return { qs: qs, cats: cats };
  }
  function evalRow(ctx, variant, mode, cat) {
    var E = ctx.data.eval;
    return E && E.rows ? E.rows.filter(function (r) { return r.variant === variant && r.mode === mode && r.category === cat; })[0] || null : null;
  }
  /* Kategorien, in denen ein Modus am meisten Recall verliert (bei Gleichstand mehrere), aus den Punkten gerechnet */
  function weakest(D, mode, ctx) {
    var rows = D.cats.map(function (c) {
      var qs = D.qs.filter(function (q) { return q.category === c; });
      var loss = qs.reduce(function (n, q) { return n + 1 - qRecall(q, mode, ctx); }, 0) / qs.length;
      return { cat: c, loss: loss, n: qs.length, miss: qs.filter(function (q) { return qRecall(q, mode, ctx) < 1; }).length };
    });
    var max = Math.max.apply(null, rows.map(function (r) { return r.loss; }));
    return max > 0 ? rows.filter(function (r) { return r.loss > max - 0.005; }) : [];
  }
  VIZ.defs.messung = {
    id: 'messung', usesData: true, nav: 'Messung', title: 'Messung: ein Punkt pro Frage',
    lead: function (ctx) { return 'Voller Punkt: Das erwartete Dokument steht in den Top ' + ctx.k + '. Halber Punkt: nur eines von zwei erwarteten Dokumenten. Kreuz: nicht gefunden.'; },
    beats: 4,
    help: [['d', 'Messung: Detail-Diagramme (Recall und MRR pro Kategorie) ein/aus']],
    keys: { d: function () { VIZ.scenes[VIZ.state.scene] = VIZ.defs.score; VIZ.render(0, true); } },
    /* Tipp vor der ersten Variante, die bei gleichem Chunking nur das Embedding-Modell wechselt */
    guess: function (ctx) {
      if (!dotData(ctx)) return null;
      var vs = variants(ctx), E = ctx.data.eval, cat = 'cross-lingual';
      function rec(v) {
        var r = E.rows.filter(function (x) { return x.variant === v && x.mode === 'vector' && x.category === cat; })[0];
        return r ? r.recall : null;
      }
      for (var i = 1; i < vs.length; i++) {
        var a = String(vs[i - 1]).split('+'), b = String(vs[i]).split('+');
        var ra = rec(vs[i - 1]), rb = rec(vs[i]);
        if (a[0] !== b[0] || a[1] === b[1] || ra === null || rb === null) continue;
        var d = rb - ra;
        return { before: 3, question: 'Anderes Embedding-Modell: ' + b[1] + ' statt ' + a[1] + '. Wie ändert sich die Vektorsuche bei Fragen, deren Antwort in einer anderen Sprache steht?',
          options: ['Besser', 'Gleich', 'Schlechter'], correct: Math.abs(d) < 0.005 ? 1 : d > 0 ? 0 : 2,
          reveal: 'Recall@' + (E.k || ctx.k) + ' Vektor, ' + VIZ.CATEGORY[cat] + ': ' + VIZ.num(ra, 2) + ' → ' + VIZ.num(rb, 2) + '.' };
      }
      return null;
    },
    render: function (stage, ctx) {
      var D = dotData(ctx), self = this;
      this._D = D;
      if (!D) { stage.appendChild(ui.empty('Keine Ranglisten', 'questions[].bm25/vector/hybrid fehlen in den Daten.')); return; }
      var mainV = ctx.data.meta.variant || (variants(ctx)[1] || variants(ctx)[0]);
      var grid = h('div', { class: 'dm' });
      grid.appendChild(h('div', {}));
      grid.appendChild(h('div', { class: 'dm-cats' }, D.cats.map(function (c) {
        var n = D.qs.filter(function (q) { return q.category === c; }).length;
        return h('div', { class: 'dm-cat', style: { width: (n * 2.4 - 0.4) + 'rem' } }, VIZ.CATEGORY[c] || c, h('span', { text: n + ' Fragen' }));
      })));
      grid.appendChild(h('div', {}));
      var sub = { bm25: 'gleiche Wörter', vector: 'ähnliche Bedeutung', hybrid: 'beide, per RRF' };
      DMODES.forEach(function (m, mi) {
        var i = 0, sum = 0;
        var row = h('div', { class: 'dm-row mc-' + m }, D.cats.map(function (c) {
          return h('div', { class: 'dm-grp' }, D.qs.filter(function (q) { return q.category === c; }).map(function (q) {
            var r = qRecall(q, m, ctx);
            sum += r;
            return at(h('span', { class: 'dot ' + (r >= 1 ? 'full' : r > 0 ? 'half' : 'none') + (q.showcase ? ' showcase' : ''), title: q.id + ': ' + q.text }), mi, 'pop', (i++) * 45);
          }));
        }));
        var ev = evalRow(ctx, mainV, m, 'all');
        var val = ev ? ev.recall : sum / D.qs.length;
        grid.appendChild(at(h('div', { class: 'dm-mode' }, VIZ.MODE[m] || m, h('span', { text: sub[m] })), mi, 'left'));
        grid.appendChild(row);
        grid.appendChild(at(h('div', { class: 'dm-score mc-' + m }, h('b', { text: VIZ.num(val, 2) }), h('span', { text: 'Recall@' + ctx.k + ' über ' + D.qs.length + ' Fragen' })), mi, 'up', i * 45 + 200));
      });
      stage.appendChild(grid);
      stage.appendChild(h('div', { class: 'dm-legend' },
        h('span', {}, h('i', { class: 'dot full' }), 'gefunden'), h('span', {}, h('i', { class: 'dot half' }), 'eines von zwei Dokumenten'),
        h('span', {}, h('i', { class: 'dot none' }), 'nicht gefunden'), h('span', {}, h('i', { class: 'dot full showcase' }), 'Frage aus den Szenen ' + VIZ.questionScenes()),
        h('span', { class: 'toolbar-hint detail' }, h('kbd', { text: 'd' }), ' Detail-Diagramme')));
      stage.appendChild(h('p', { class: 'dm-caption', id: 'dm-caption' }));
      /* Varianten: drei Karten statt dreissig Balken */
      var vs = variants(ctx);
      if (vs.length) stage.appendChild(at(h('div', { class: 'vcards' }, vs.map(function (v, vi) {
        var prevSame = vi > 0 && String(vs[vi - 1]).split('+')[0] === String(v).split('+')[0] ? vs[vi - 1] : null;
        var x = evalRow(ctx, v, 'vector', 'cross-lingual'), px = prevSame ? evalRow(ctx, prevSame, 'vector', 'cross-lingual') : null;
        return h('div', { class: 'vcard' + (v === mainV ? ' main' : '') },
          h('h3', {}, VIZ.variantLabel(v), v === mainV ? h('span', { text: 'oben gezeigt' }) : null),
          DMODES.map(function (m, i) {
            var r = evalRow(ctx, v, m, 'all'), val = r ? r.recall : null;
            return h('div', { class: 'vbar mc-' + m }, VIZ.MODE[m], h('i', {}, at(h('b', { style: { width: (val || 0) * 100 + '%' } }), 3, 'grow', 200 + vi * 150 + i * 80)),
              h('em', { text: val === null ? '–' : VIZ.num(val, 2) }));
          }),
          x ? h('p', { class: 'vcard-x' }, 'Vektor, ' + VIZ.CATEGORY['cross-lingual'] + ': ',
            h('b', { class: px ? (x.recall < px.recall - 0.005 ? 'down' : x.recall > px.recall + 0.005 ? 'up' : '') : '', text: VIZ.num(x.recall, 2) }),
            px ? ' (vorher ' + VIZ.num(px.recall, 2) + ')' : '') : null);
      })), 3, 'up'));
    },
    step: function (b, animate, from, ctx) {
      var D = this._D, c = document.getElementById('dm-caption');
      if (!D || !c) return;
      var text;
      if (b <= 1) {
        var m = DMODES[b], w = weakest(D, m, ctx);
        text = w.length ? VIZ.MODE[m] + ' ist am schwächsten bei ' + w.map(function (r) {
          return '«' + (VIZ.CATEGORY[r.cat] || r.cat) + '» (' + r.miss + ' von ' + r.n + ' nicht gefunden)';
        }).join(' und ') + '.' : VIZ.MODE[m] + ' findet alles.';
      } else if (b === 2) {
        var miss = D.qs.filter(function (q) { return qRecall(q, 'hybrid', ctx) < 1; }).length;
        text = 'Die Fehler liegen bei verschiedenen Fragen. Kombiniert bleiben ' + miss + ' von ' + D.qs.length + ' Fragen ohne vollständigen Treffer.';
      } else text = 'Gilt das immer? Dieselbe Messung mit anderem Chunking und anderem Embedding-Modell.';
      c.textContent = text;
      if (animate) VIZ.anim(c, VIZ.ENTER.up);
    }
  };

  /* ===================== 8 Fazit ===================== */
  VIZ.defs.fazit = {
    id: 'fazit', usesData: true, nav: 'Fazit', title: 'Fazit',
    lead: '',
    beats: function () { return VIZ.MESSAGES.length; },
    render: function (stage) {
      stage.appendChild(h('ol', { class: 'messages' }, VIZ.MESSAGES.map(function (m, i) {
        return at(h('li', {}, h('p', { text: m })), i, 'up');
      })));
    }
  };
})();
