/* review.js — 间隔复习在线评判引擎（Pyodide）
 * 页面需提供：
 *   - 预置数据块：script 标签，type="text/x-python"，id="review-env"（可选）
 *   - window.REVIEW = [{ id, mode: 'expr'|'code', name, tind, ref }]   // tind 为缩进 8 空格的测试代码
 *   - .review 块：data-id / data-mode / data-name，含 .review-code、.review-btn、.review-refbtn、.review-status、.review-ref
 * expr 模式：用户代码 eval 为 _val，测试引用 _val 与 env 全局变量
 * code 模式：用户代码 exec 进独立命名空间，取 data-name 函数为 _fn，测试引用 _fn
 */
(function () {
  if (!window.REVIEW || !window.REVIEW.length) return;
  var ENV_CODE = (document.getElementById('review-env') || { textContent: '' }).textContent;
  var pyodide = null, loading = null;

  function ensurePy() {
    if (pyodide) return Promise.resolve(pyodide);
    if (!loading) {
      loading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = 'https://unpkg.com/pyodide@0.29.5/pyodide.js';
        s.integrity = 'sha384-VR47TfKeAmT7vMej7bwOVg0tHTQLLGMSIpsXtFMCZG5OpKZSIXoSLtGY//qHcxc6'; s.crossOrigin = 'anonymous';
        document.head.appendChild(s);
        s.onload = function () {
          loadPyodide().then(function (py) {
            var ready = ENV_CODE.trim() ? py.runPythonAsync(ENV_CODE) : Promise.resolve();
            return ready.then(function () { return py.runPythonAsync('_G = dict(globals())'); })
              .then(function () { pyodide = py; resolve(py); });
          }).catch(reject);
        };
        s.onerror = function () { reject(new Error('CDN 加载失败，请检查网络')); };
      });
      loading.catch(function () { loading = null; });
    }
    return loading;
  }

  function buildCode(cfg, userCode) {
    if (cfg.mode === 'expr') {
      return 'import json as _json\n' +
        '_res = {"ok": False, "msg": ""}\n' +
        'try:\n' +
        '    _val = eval(' + JSON.stringify(userCode) + ')\n' +
        'except BaseException as _e:\n' +
        '    _res = {"ok": False, "msg": type(_e).__name__ + ": " + str(_e)}\n' +
        'else:\n' +
        '    try:\n' +
        cfg.tind + '\n' +
        '        _res = {"ok": True, "msg": ""}\n' +
        '    except AssertionError as _e:\n' +
        '        _res = {"ok": False, "msg": str(_e)}\n' +
        '    except Exception as _e:\n' +
        '        _res = {"ok": False, "msg": type(_e).__name__ + ": " + str(_e)}\n' +
        '_json.dumps(_res)';
    }
    return 'import json as _json\n' +
      '_res = {"ok": False, "msg": ""}\n' +
      '_lenv = dict(_G)\n' +
      'try:\n' +
      '    exec(compile(' + JSON.stringify(userCode) + ', "<review>", "exec"), _lenv)\n' +
      '    _fn = _lenv.get(' + JSON.stringify(cfg.name) + ')\n' +
      'except Exception as _e:\n' +
      '    _res = {"ok": False, "msg": type(_e).__name__ + ": " + str(_e)}\n' +
      'else:\n' +
      '    try:\n' +
      '        assert _fn is not None, "函数未定义：检查函数名拼写"\n' +
      cfg.tind + '\n' +
      '        _res = {"ok": True, "msg": ""}\n' +
      '    except AssertionError as _e:\n' +
      '        _res = {"ok": False, "msg": str(_e)}\n' +
      '    except Exception as _e:\n' +
      '        _res = {"ok": False, "msg": type(_e).__name__ + ": " + str(_e)}\n' +
      '_json.dumps(_res)';
  }

  function check(id) {
    var el = document.querySelector('.review[data-id="' + id + '"]');
    var cfg = window.REVIEW.filter(function (r) { return r.id === id; })[0];
    if (!el || !cfg) return;
    var ta = el.querySelector('.review-code');
    var st = el.querySelector('.review-status');
    var v = ta.value.trim();
    if (!v) { st.className = 'review-status info'; st.setAttribute('aria-live', 'polite'); st.textContent = '先凭记忆写出来，再点检查'; return; }
    st.className = 'review-status info'; st.setAttribute('aria-live', 'polite');
    st.textContent = '判分中…';
    ensurePy().then(function (py) {
      return py.runPythonAsync(buildCode(cfg, v));
    }).then(function (out) {
      var res = JSON.parse(out);
      if (res.ok) {
        st.className = 'review-status pass';
        st.setAttribute('aria-live', 'polite');
        st.textContent = '✓ 通过——明天再来复核一次更稳';
        if (window.WBSpaced) WBSpaced.pass(id);
        if (window.WBProgress) WBProgress.mark({ kind: 'review', unit: id, total: window.REVIEW.length, passed: true });
      } else {
        var msg = res.msg; if (msg.length > 140) msg = msg.slice(0, 140) + '…';
        st.className = 'review-status fail'; st.setAttribute('aria-live', 'assertive');
        st.textContent = '✗ ' + msg;
      }
    }).catch(function (e) {
      st.className = 'review-status fail'; st.setAttribute('aria-live', 'assertive');
      st.textContent = '判分失败：' + ((e && e.message) || String(e));
      var bar = st.parentNode, retry = el.querySelector('.review-retry');
      if (!retry && bar) {
        retry = document.createElement('button');
        retry.type = 'button'; retry.className = 'review-btn ghost review-retry';
        retry.textContent = '重试加载 Python 运行时';
        retry.addEventListener('click', function () {
          var b = el.querySelector('.review-btn'); if (b) b.click();
        });
        bar.appendChild(retry);
      }
    });
  }

  window.addEventListener('DOMContentLoaded', function () {
    window.REVIEW.forEach(function (cfg) {
      var el = document.querySelector('.review[data-id="' + cfg.id + '"]');
      if (!el) return;
      var btn = el.querySelector('.review-btn');
      var refBtn = el.querySelector('.review-refbtn');
      var ref = el.querySelector('.review-ref');
      if (btn) btn.addEventListener('click', function () { check(cfg.id); });
      if (refBtn && ref) refBtn.addEventListener('click', function () {
        if (ref.hidden) { ref.textContent = '参考答案：\n' + cfg.ref; ref.hidden = false; refBtn.textContent = '收起参考'; }
        else { ref.hidden = true; refBtn.textContent = '参考'; }
      });
      var ta = el.querySelector('.review-code');
      if (ta) ta.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); check(cfg.id); }
      });
    });
  });
})();
