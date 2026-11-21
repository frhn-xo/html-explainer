// Player engine for playable diagrams (html-explainer skill, references/playable.md).
// Paste inside a classic <script> after the template's toVSCode() script; fill in the page data below.
(function () {
  // ===== Page data: replace for each page =====
  // A file link for captions, the same as the page's other file links.
  function code(path, line, text) {
    return '<a href="' + path + '#L' + line + '"><code>' + text + '</code></a>';
  }
  // DESIGN.md colours: mint = what happens (try 1), lavender = try 2, coral = where it goes wrong, pink = new code at work.
  var COLORS = { 1: '#a4d4c5', 2: '#b8a4ed', bad: '#ff6b5a', fix: '#ff4d8b' };
  var STEPS_A = [];
  // ===== Engine: copy as is =====
  var players = [];
  var lastUsed = null;

  function makePlayer(options) {
    var root = options.root;
    var STEPS = options.steps;
    var dia = root.querySelector('.dia');
    var caption = root.querySelector('.player-caption');
    var stepLabel = root.querySelector('.player-step');
    var current = 0;
    var timer = null;
    var svg = null;
    var layer = null;

    function nodeOf(name) {
      var pattern = new RegExp('(^|-)flowchart-' + name + '-\\d+$');
      return Array.from(svg.querySelectorAll('g.node')).find(function (g) { return pattern.test(g.id); });
    }
    function boxOf(name) {
      var g = nodeOf(name);
      var b = g.getBBox();
      var m = layer.getCTM().inverse().multiply(g.getCTM());
      var corners = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (c) {
        var p = svg.createSVGPoint();
        p.x = c[0];
        p.y = c[1];
        return p.matrixTransform(m);
      });
      var xs = corners.map(function (p) { return p.x; });
      var ys = corners.map(function (p) { return p.y; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, hw: (x1 - x0) / 2, hh: (y1 - y0) / 2 };
    }
    // Where a line from the box's centre towards (px, py) leaves the box, pushed out by a small gap.
    function edgePoint(box, px, py, gap) {
      var dx = px - box.cx, dy = py - box.cy;
      var t = Math.min(dx !== 0 ? box.hw / Math.abs(dx) : Infinity, dy !== 0 ? box.hh / Math.abs(dy) : Infinity);
      var len = Math.hypot(dx, dy) || 1;
      return { x: box.cx + dx * t + dx / len * gap, y: box.cy + dy * t + dy / len * gap };
    }
    function el(tag, attrs) {
      var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      return e;
    }
    function kindOf(step) {
      if (step.bad) {
        return 'bad';
      } else if (step.fix) {
        return 'fix';
      } else {
        return String(step.t);
      }
    }
    function drawArrow(step, opacity, isCurrent) {
      var a = boxOf(step.from), b = boxOf(step.to);
      var mx = (a.cx + b.cx) / 2, my = (a.cy + b.cy) / 2;
      var dx = b.cx - a.cx, dy = b.cy - a.cy, len = Math.hypot(dx, dy) || 1;
      var bend = step.bend || 0;
      var c = { x: mx - dy / len * bend, y: my + dx / len * bend };
      var p0 = edgePoint(a, c.x, c.y, 3), p2 = edgePoint(b, c.x, c.y, step.miss ? 4 : 9);
      var color = COLORS[kindOf(step)];
      var g = el('g', { opacity: opacity });
      var path = el('path', {
        d: 'M' + p0.x + ',' + p0.y + ' Q' + c.x + ',' + c.y + ' ' + p2.x + ',' + p2.y,
        fill: 'none', stroke: color, 'stroke-width': isCurrent ? 4 : 2.5,
        'stroke-dasharray': step.miss || step.to === 'fail' || step.from === 'fail' ? '8 6' : 'none',
        'marker-end': step.miss ? 'none' : 'url(#' + options.id + '-head-' + kindOf(step) + ')'
      });
      g.appendChild(path);
      if (step.miss) {
        var cross = el('text', { x: p2.x, y: p2.y + 8, fill: color, 'font-size': '26', 'font-weight': '700', 'text-anchor': 'middle' });
        cross.textContent = '✕';
        g.appendChild(cross);
      }
      var lx = 0.25 * p0.x + 0.5 * c.x + 0.25 * p2.x, ly = 0.25 * p0.y + 0.5 * c.y + 0.25 * p2.y;
      var label = el('text', { x: lx, y: ly + 5, fill: '#ffffff', 'font-size': isCurrent ? '20' : '15', 'font-weight': isCurrent ? '700' : '400', 'text-anchor': 'middle' });
      label.textContent = (STEPS.indexOf(step) + 1) + '. ' + step.label;
      g.appendChild(label);
      layer.appendChild(g);
      var lb = label.getBBox();
      g.insertBefore(el('rect', { x: lb.x - 5, y: lb.y - 2, width: lb.width + 10, height: lb.height + 4, rx: 6, fill: '#0a1a1a', stroke: color, 'stroke-width': 1 }), label);
      return path;
    }
    function animateDot(path, color) {
      var dot = el('circle', { r: 8, fill: color, stroke: '#fff', 'stroke-width': 2 });
      layer.appendChild(dot);
      var total = path.getTotalLength(), started = null;
      function frame(now) {
        if (started === null) {
          started = now;
        }
        var k = Math.min((now - started) / 700, 1);
        var p = path.getPointAtLength(total * k);
        dot.setAttribute('cx', p.x);
        dot.setAttribute('cy', p.y);
        if (k < 1) {
          requestAnimationFrame(frame);
        } else {
          dot.remove();
        }
      }
      requestAnimationFrame(frame);
    }
    function render(n, animate) {
      current = n;
      stepLabel.textContent = 'Step ' + n + ' / ' + STEPS.length + (n > 0 ? ' · ' + (options.tWord || 'try') + ' ' + STEPS[n - 1].t : '');
      if (n === 0) {
        caption.innerHTML = options.intro;
      } else {
        caption.innerHTML = '<span class="cap-step" style="color:' + COLORS[kindOf(STEPS[n - 1])] + '">Step ' + n + '</span> ' + STEPS[n - 1].cap;
      }
      caption.querySelectorAll('a[href]').forEach(function (a) {
        a.href = toVSCode(a.getAttribute('href'));
      });
      if (!svg) {
        return;
      }
      if (svg.getBoundingClientRect().width === 0) {
        return; // the section is collapsed; drawn again when it opens
      }
      while (layer.lastChild) {
        layer.removeChild(layer.lastChild);
      }
      svg.querySelectorAll('g.node.play-active').forEach(function (g) { g.classList.remove('play-active'); });
      var path = null;
      var nowTry = n > 0 ? STEPS[n - 1].t : 0;
      STEPS.slice(0, n).forEach(function (step, i) {
        var isCurrent = measuring || i === n - 1; // while measuring, every arrow at its largest size
        var opacity;
        if (isCurrent) {
          opacity = 1;
        } else if (step.t < nowTry) {
          opacity = 0.12;
        } else {
          opacity = 0.4;
        }
        var drawn = drawArrow(step, opacity, isCurrent);
        if (isCurrent) {
          path = drawn;
        }
      });
      if (n > 0) {
        nodeOf(STEPS[n - 1].to).classList.add('play-active');
        if (animate) {
          animateDot(path, COLORS[kindOf(STEPS[n - 1])]);
        }
      }
    }
    function stopAuto() {
      clearInterval(timer);
      timer = null;
      root.querySelector('[data-play="auto"]').textContent = '▶ Play';
    }
    function go(n, animate) {
      render(Math.max(0, Math.min(STEPS.length, n)), animate);
    }
    function step(delta) {
      stopAuto();
      go(current + delta, delta > 0);
    }
    root.querySelectorAll('[data-play]').forEach(function (button) {
      button.addEventListener('click', function () {
        lastUsed = api;
        switch (button.dataset.play) {
          case 'next':
            step(1);
            break;
          case 'back':
            step(-1);
            break;
          case 'reset':
            stopAuto();
            go(0, false);
            break;
          default:
            if (timer) {
              stopAuto();
            } else {
              if (current >= STEPS.length) {
                go(0, false);
              }
              button.textContent = '❚❚ Pause';
              timer = setInterval(function () {
                if (current >= STEPS.length) {
                  stopAuto();
                } else {
                  go(current + 1, true);
                }
              }, 1800);
            }
        }
      });
    });
    // An arrow's curve or label can reach past Mermaid's own frame, and would be cut off there.
    // Draw every arrow once, measure how far they reach, and widen the frame to fit,
    // so it never changes size while the player runs. A collapsed section is fitted when it opens.
    var fitted = false;
    var measuring = false;
    function fitArrows() {
      if (!fitted && svg.getBoundingClientRect().width > 0) {
        var stepBefore = current;
        measuring = true;
        render(STEPS.length, false);
        measuring = false;
        current = stepBefore;
        var reach = layer.getBBox();
        var view = svg.viewBox.baseVal;
        var pad = 8;
        var x0 = Math.min(view.x, reach.x - pad);
        var y0 = Math.min(view.y, reach.y - pad);
        var x1 = Math.max(view.x + view.width, reach.x + reach.width + pad);
        var y1 = Math.max(view.y + view.height, reach.y + reach.height + pad);
        var maxWidth = parseFloat(svg.style.maxWidth);
        if (maxWidth) {
          svg.style.maxWidth = (maxWidth * (x1 - x0) / view.width) + 'px';
        }
        svg.setAttribute('viewBox', [x0, y0, x1 - x0, y1 - y0].join(' '));
        fitted = true;
      }
    }
    function init() {
      svg = dia.querySelector('svg');
      layer = el('g', { class: 'play-layer' });
      var defs = el('defs', {});
      ['1', '2', 'bad', 'fix'].forEach(function (kind) {
        var marker = el('marker', { id: options.id + '-head-' + kind, viewBox: '0 0 10 10', refX: '8', refY: '5', markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse' });
        marker.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: COLORS[kind] }));
        defs.appendChild(marker);
      });
      svg.appendChild(defs);
      svg.appendChild(layer);
      fitArrows();
      render(current, false);
      // Redraw when a collapsed section holding the player opens.
      document.addEventListener('toggle', function () {
        fitArrows();
        render(current, false);
      }, true);
    }
    var api = {
      root: root,
      step: step,
      inView: function () {
        var box = root.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
      }
    };
    render(0, false);
    if (window.mermaidRendered) {
      init();
    } else {
      document.addEventListener('mermaid-rendered', init);
    }
    return api;
  }
  // ===== One makePlayer call per player on the page =====
  players.push(makePlayer({
    id: 'play-a', root: document.getElementById('player-a'), steps: STEPS_A, tWord: 'try',
    intro: '<b>Only the structure so far.</b> Press <b>Next</b> to start.'
  }));

  document.addEventListener('keydown', function (event) {
    var plain = !event.metaKey && !event.ctrlKey && !event.altKey;
    if (plain && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      var visible = players.filter(function (p) { return p.inView(); });
      var target = null;
      if (lastUsed && visible.indexOf(lastUsed) !== -1) {
        target = lastUsed;
      } else if (visible.length > 0) {
        target = visible[0];
      }
      if (target) {
        event.preventDefault();
        if (event.key === 'ArrowRight') {
          target.step(1);
        } else {
          target.step(-1);
        }
      }
    }
  });
})();
