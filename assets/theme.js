/* theme.js — 白天/黑夜主题：默认跟随系统自动切换，可手动循环 自动→浅色→深色 */
/* WBProgress + WBSpaced + 反馈语义 —— 体验侧公共运行时 */
(function () {
  if (window.WBProgress) return;
  var KEY = 'wb-progress-v1';
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function lessonOf() { var m = location.pathname.match(/\/(\d{4})-/); return m ? m[1] : ''; }
  function mark(detail) {
    var d = detail || {}, lesson = d.lesson || lessonOf();
    if (!lesson) return;
    var s = read(), L = s[lesson] || (s[lesson] = {});
    if (d.kind === 'quiz') {
      var q = L.quiz || (L.quiz = { total: 0, units: {} });
      q.total = d.total || q.total; q.units[d.unit] = !!d.passed; q.ts = Date.now();
    } else if (d.kind === 'pylab') {
      L.pylab = { passed: !!d.passed, ts: Date.now() };
    } else if (d.kind === 'review') {
      var r = L.review || (L.review = { total: 0, units: {} });
      r.total = d.total || r.total; r.units[d.unit] = !!d.passed; r.ts = Date.now();
    } else if (d.kind === 'drill') {
      L.drill = { solved: d.solved || 0, total: d.total || 0, ts: Date.now() };
    }
    write(s);
    try {
      var ev = {}; Object.keys(d).forEach(function (k) { ev[k] = d[k]; });
      ev.lesson = lesson; ev.ts = Date.now();
      document.dispatchEvent(new CustomEvent('wb:progress', { bubbles: true, detail: ev }));
    } catch (e) {}
  }
  window.WBProgress = { key: KEY, read: read, write: write, mark: mark, lessonOf: lessonOf };
})();
(function () {
  if (window.WBSpaced) return;
  var KEY = 'wb-review-v1', DAY = 86400000;
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function write(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function pass(unit) {
    var m = location.pathname.match(/\/(\d{4})-/); if (!m) return;
    var s = read(), L = s[m[1]] || (s[m[1]] = {});
    L[unit] = { passed: true, ts: Date.now() }; write(s);
  }
  function dueCount() {
    var s = read(), now = Date.now(), n = 0;
    Object.keys(s).forEach(function (lesson) {
      var L = s[lesson] || {};
      Object.keys(L).forEach(function (u) {
        var r = L[u]; if (r && r.passed && r.ts + DAY <= now) n++;
      });
    });
    return n;
  }
  window.WBSpaced = { key: KEY, read: read, pass: pass, dueCount: dueCount };
})();
(function () {
  function tag(sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
    });
  }
  function init() {
    tag('.review-status'); tag('.drill-status'); tag('.py-lab-status');
    document.querySelectorAll('.quiz').forEach(function (q) {
      if (q.querySelector('.quiz-live')) return;
      var live = document.createElement('span');
      live.className = 'quiz-live';
      live.setAttribute('role', 'status');
      live.setAttribute('aria-live', 'polite');
      live.setAttribute('aria-atomic', 'true');
      live.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      q.appendChild(live);
    });
    [['textarea.py-lab-editor', 'Python 代码编辑区'],
     ['textarea.review-code', '间隔复习默写区'],
     ['textarea.drill-code', '练习作答代码区']].forEach(function (p) {
      document.querySelectorAll(p[0]).forEach(function (ta, i) {
        if (!ta.getAttribute('aria-label') && !(ta.labels && ta.labels.length))
          ta.setAttribute('aria-label', p[1] + '，第 ' + (i + 1) + ' 个');
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
(function () {
  var KEY = 'wb-theme-pref';
  var pref = 'auto';
  try { pref = localStorage.getItem(KEY) || 'auto'; } catch (e) {}
  var root = document.documentElement;

  function apply() {
    if (pref === 'auto') root.removeAttribute('data-theme'); // 交给 prefers-color-scheme
    else root.dataset.theme = pref;
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = { auto: '🌓 主题·自动', light: '☀️ 浅色', dark: '🌙 深色' }[pref];
  }

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) mq.addEventListener('change', function () { if (pref === 'auto') apply(); });

  function toggle() {
    pref = pref === 'auto' ? 'light' : (pref === 'light' ? 'dark' : 'auto');
    try { localStorage.setItem(KEY, pref); } catch (e) {}
    apply();
  }

  function init() {
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle no-print';
    btn.title = '切换主题：自动（跟随系统）→ 浅色 → 深色';
    btn.addEventListener('click', toggle);
    document.body.appendChild(btn);
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
