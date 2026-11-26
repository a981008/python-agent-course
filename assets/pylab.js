/* pylab.js — 浏览器内 Python 运行组件（基于 Pyodide/WASM，CDN: unpkg）
 *
 * 用法（每课自包含，内联引入）：
 *   div.py-lab[data-prelude][data-tests]
 *     textarea.py-lab-editor（默认代码）
 *     button.py-lab-run / button.py-lab-reset / span.py-lab-status
 *     pre.py-lab-output
 *   两个 text/x-python 脚本块：prelude（前置代码，用户不可见但参与运行）与 tests（用 print("TEST|" + json) 报告结果）
 */
(function () {
  var PYODIDE_URL = "https://unpkg.com/pyodide@0.29.5/pyodide.js";
  var PYODIDE_INDEX = "https://unpkg.com/pyodide@0.29.5/";
  var pyodidePromise = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.integrity = "sha384-VR47TfKeAmT7vMej7bwOVg0tHTQLLGMSIpsXtFMCZG5OpKZSIXoSLtGY//qHcxc6"; s.crossOrigin = "anonymous";
      s.onload = resolve;
      s.onerror = function () { reject(new Error("脚本加载失败：" + src)); };
      document.head.appendChild(s);
    });
  }

  function getPyodide() {
    if (!pyodidePromise) {
      pyodidePromise = loadScript(PYODIDE_URL).then(function () {
        return window.loadPyodide({ indexURL: PYODIDE_INDEX });
      }).catch(function (e) { pyodidePromise = null; throw e; });
    }
    return pyodidePromise;
  }

  function escapeHtml(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function initLab(lab) {
    var editor = lab.querySelector(".py-lab-editor");
    var runBtn = lab.querySelector(".py-lab-run");
    var resetBtn = lab.querySelector(".py-lab-reset");
    var status = lab.querySelector(".py-lab-status");
    var out = lab.querySelector(".py-lab-output");
    if (!editor || !runBtn || !out) return;
    var starter = editor.getAttribute("data-starter") !== null
      ? editor.getAttribute("data-starter")
      : editor.value;


    // Ctrl/Cmd+Enter 快捷运行（Tab 插入空格由 pyhl.js 统一处理）
    editor.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); runBtn.click(); }
    });

    resetBtn && resetBtn.addEventListener("click", function () {
      if (editor.value === starter) { status.textContent = "当前已是初始代码"; return; }
      if (!confirm("重置为初始代码？当前修改将被覆盖（可先按 Ctrl/Cmd+S 保存）。")) return;
      editor.value = starter;
      editor.dispatchEvent(new Event("input", { bubbles: true }));
      if (typeof editor.__wbClearCode === 'function') editor.__wbClearCode();
      out.hidden = true;
      status.textContent = "已重置为初始代码";
    });

    runBtn.addEventListener("click", function () {
      runBtn.disabled = true;
      status.setAttribute('aria-live','polite'); status.textContent = "首次运行需加载 Python 运行时（约 10–20 秒），请稍候…";
      out.hidden = false;
      out.innerHTML = '<span class="lab-info">⏳ 正在启动 Python 运行环境…</span>';

      var prelude = "";
      var tests = "";
      if (lab.getAttribute("data-prelude")) {
        var p = document.getElementById(lab.getAttribute("data-prelude"));
        if (p) prelude = p.textContent + "\n";
      }
      if (lab.getAttribute("data-tests")) {
        var t = document.getElementById(lab.getAttribute("data-tests"));
        if (t) tests = "\n" + t.textContent + "\n";
      }

      var stdoutLines = [];
      getPyodide().then(function (py) {
        py.setStdout({ batched: function (s) { stdoutLines.push(s); } });
        py.setStderr({ batched: function (s) { stdoutLines.push("[stderr] " + s); } });
        var code = prelude + "# ==== 你的代码 ====\n" + editor.value + "\n" + tests;
        return py.runPythonAsync(code);
      }).then(function () {
        var html = "";
        if (stdoutLines.length) {
          html += stdoutLines.map(function (l) {
            if (l.indexOf("TEST|") === 0) {
              try {
                var r = JSON.parse(l.slice(5));
                return r.ok
                  ? '<span class="lab-pass">✅ ' + escapeHtml(r.name) + '</span>'
                  : '<span class="lab-fail">❌ ' + escapeHtml(r.name) + '</span>\n' +
                    '<span class="lab-info">    ' + escapeHtml(r.msg) + '</span>';
              } catch (e2) { return escapeHtml(l); }
            }
            if (l.indexOf("MISSING|") === 0) {
              return '<span class="lab-fail">⚠️ ' + escapeHtml(l.slice(8)) + '</span>';
            }
            return escapeHtml(l);
          }).join("\n");
        }
        if (!html) html = '<span class="lab-info">（程序没有输出。你的函数已运行，看上面的测试结果——没有测试块则说明执行通过）</span>';
        out.innerHTML = html;
        status.textContent = "运行完成";
        var _t = stdoutLines.filter(function (l) { return l.indexOf("TEST|") === 0; });
        var _m = stdoutLines.some(function (l) { return l.indexOf("MISSING|") === 0; });
        var _all = _t.length > 0 && !_m && _t.every(function (l) {
          try { return JSON.parse(l.slice(5)).ok === true; } catch (e) { return false; }
        });
        if (window.WBProgress) WBProgress.mark({ kind: 'pylab', passed: _all });
      }).catch(function (err) {
        var msg = (err && (err.message || String(err))) || "未知错误";
        out.innerHTML = '<span class="lab-err">💥 ' + escapeHtml(msg) + '</span>' +
          (msg.indexOf("unpkg") > -1 || msg.indexOf("加载失败") > -1
            ? '<span class="lab-info">\n网络无法加载 Python 运行时？可改用本地验证：把代码保存为 .py 文件，终端运行 python3 文件名，测试用例见页面下方参考实现。</span>'
            : '');
        status.setAttribute('aria-live','assertive'); status.textContent = "运行出错";
        var retry = out.querySelector('button.wb-retry');
        if (!retry) {
          retry = document.createElement('button');
          retry.type = 'button'; retry.className = 'py-lab-btn ghost wb-retry';
          retry.textContent = '重试加载 Python 运行时';
          retry.addEventListener('click', function () { runBtn.click(); });
          out.appendChild(retry);
        }
        retry.disabled = false;
      }).finally(function () {
        runBtn.disabled = false;
      });
    });
  }

  function initAll() {
    document.querySelectorAll(".py-lab").forEach(initLab);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else { initAll(); }
})();
