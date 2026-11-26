/* theme.js — 白天/黑夜主题：默认跟随系统自动切换，可手动循环 自动→浅色→深色 */
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
