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
    id: 'agent', nav: 'Agent', usesQuestion: true, title: 'Agentische Suche: Claude Code sucht selbst',
    lead: 'Aufgezeichneter Lauf mit Grep, Glob und Read über die Korpus-Texte. Kein Index, dafür mehrere Runden.',
    beats: function (ctx) {
      var run = runFor(ctx);
      if (!run) return 1;
      return 2 + Math.ceil((run.steps || []).length / perBeat(run));
    },
    guess: function (ctx) {
      var run = runFor(ctx);
      if (!run || !run.turns) return null;
      return { before: 1, question: 'Wie viele Runden (Turns) braucht Claude Code für diese Frage, ganz ohne Index?',
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
          h('h2', { text: runs.length ? 'Für diese Frage gibt es keine Aufzeichnung.' : 'Keine aufgezeichneten Agent-Läufe in den Daten.' }),
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
          vsRow('Vorbereitung', 'Index bauen und aktuell halten', 'keine'),
          vsRow('Aufwand', '1 Abfrage, Top ' + k + ' Chunks', VIZ.num(run.turns) + ' Turns, ' + VIZ.num(run.input_tokens) + ' Input-Tokens'),
          vsRow('Andere Wörter', 'nur was das Modell abbildet', 'formuliert selbst um und übersetzt'),
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

  /* ===================== 6 Messung ===================== */
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
    id: 'score', nav: 'Messung', title: 'Messung: wer findet was?',
    lead: function (ctx) {
      var k = (ctx.data.eval && ctx.data.eval.k) || ctx.k;
      return 'Recall@' + k + ': Ist das erwartete Dokument unter den Top ' + k + '? MRR: Wie weit oben steht der erste Treffer?';
    },
    beats: function (ctx) { return Math.max(1, variants(ctx).length); },
    help: [['v', 'Messung: nächste Variante']],
    /* Tipp vor der ersten Variante, die bei gleichem Chunking nur das Embedding-Modell wechselt */
    guess: function (ctx) {
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
        return { before: i, question: 'Anderes Embedding-Modell: «' + b[1] + '» statt «' + a[1] + '». Wie schneidet die Vektorsuche bei Fragen in einer anderen Sprache ab?',
          options: ['Besser', 'Gleich', 'Schlechter'], correct: Math.abs(d) < 0.005 ? 1 : d > 0 ? 0 : 2,
          reveal: 'Recall@' + (E.k || ctx.k) + ' Vektor, ' + VIZ.CATEGORY[cat] + ': ' + VIZ.num(ra, 2) + ' → ' + VIZ.num(rb, 2) + '.' };
      }
      return null;
    },
    keys: {
      v: function (ctx) {
        var n = VIZ.beatCount(), f = VIZ.state.beat;
        VIZ.state.beat = (f + 1) % n;
        VIZ.apply(VIZ.state.beat, true, f);
      }
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
        h('span', { class: 'toolbar-hint' }, h('kbd', { text: 'v' }), ' Variante'),
        h('div', { class: 'legend modes' }, modes.map(function (m) {
          return h('span', {}, h('i', { class: 'sw m-' + m }), VIZ.MODE[m] || m);
        }), h('span', { class: 'ghost-legend' }, h('i', { class: 'sw ghost' }), 'vorherige Variante')));
      stage.appendChild(bar);
      var k = E.k || ctx.k;
      stage.appendChild(h('div', { class: 'charts' }, chart('recall', 'Recall@' + k, modes, cats, E), chart('mrr', 'MRR', modes, cats, E)));
      var nAll = E.rows.filter(function (r) { return r.category === 'all'; }).map(function (r) { return r.n; })[0];
      stage.appendChild(h('p', { class: 'caption', text: 'n = Anzahl Fragen pro Kategorie. Bei n = 6 verschiebt eine einzige Frage den Recall um 0.17' +
        (nAll ? ', über alle ' + nAll + ' Fragen um ' + VIZ.num(1 / nAll, 2) : '') + '. Kleine Unterschiede nicht überinterpretieren.' }));
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

  /* ===================== 7 Fazit ===================== */
  VIZ.defs.fazit = {
    id: 'fazit', nav: 'Fazit', title: 'Was bleibt',
    lead: '',
    beats: function () { return VIZ.MESSAGES.length; },
    render: function (stage) {
      stage.appendChild(h('ol', { class: 'messages' }, VIZ.MESSAGES.map(function (m, i) {
        return at(h('li', {}, h('p', { text: '«' + m + '»' })), i, 'up');
      })));
    }
  };
})();
