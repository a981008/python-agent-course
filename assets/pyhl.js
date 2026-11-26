/* pyhl.js —— Python 语法高亮 + Tab 缩进 + 本地保存组件（自包含，无外部依赖）
 *
 * 目标元素：textarea.drill-code / textarea.py-lab-editor / textarea.review-code / input.drill-in
 * 实现：透明原文本框 + 上层 pointer-events:none 的高亮 pre（内容实时同步）
 * 附加 1：Tab 键在光标处插入 4 空格（所有编辑器统一行为）
 * 附加 2：Cmd/Ctrl+S 在编辑器内 = 保存代码到 localStorage（并拦截浏览器"保存网页"）
 *         加载时若编辑器仍是初始/空白状态，恢复上次保存的内容
 *         同时派发 'wb-code-save' 事件（detail: {ta, code, key}），页面引擎可监听桥接
 * 附加 3：静态代码块 <pre><code> 兜底高亮（正常由构建脚本烘焙进 HTML，
 *         此处仅处理未烘焙的块；非 Python 块标 data-nohl 退出）
 */
(function () {
  "use strict";

  var KW = ("def return if elif else for while in not and or is None True False import from as class " +
    "try except finally raise with lambda yield pass break continue global nonlocal assert del " +
    "async await match case self cls").split(" ");
  var BUILTIN = ("print len range sum min max sorted enumerate zip map filter isinstance str int float bool " +
    "list dict set tuple type abs round any all input super dataclass field repr dir help divmod format " +
    "staticmethod property open exit").split(" ");
  var KWSET = {}, BSET = {};
  KW.forEach(function (w) { KWSET[w] = 1; });
  BUILTIN.forEach(function (w) { BSET[w] = 1; });

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var TOK = /("""[\s\S]*?"""|'''[\s\S]*?'''|(?:[fFrRbBuU]{0,2})"(?:\\.|[^"\\\n])*"|(?:[fFrRbBuU]{0,2})'(?:\\.|[^'\\\n])*'|#[^\n]*|@[A-Za-z_][\w.]*|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?j?\b|\b[A-Za-z_]\w*\b)/g;

  function hl(src) {
    var out = "", last = 0, m;
    TOK.lastIndex = 0;
    while ((m = TOK.exec(src)) !== null) {
      var t = m[0];
      out += esc(src.slice(last, m.index));
      var cls = "";
      var c0 = t.charAt(0);
      if (c0 === "#") cls = "tk-com";
      else if (c0 === "@") cls = "tk-dec";
      else if (c0 === '"' || c0 === "'") cls = "tk-str";
      else if (/\d/.test(c0)) cls = "tk-num";
      else if (KWSET[t]) cls = "tk-kw";
      else if (BSET[t]) cls = "tk-fn";
      out += cls ? '<span class="' + cls + '">' + esc(t) + "</span>" : esc(t);
      last = m.index + t.length;
    }
    out += esc(src.slice(last));
    return out;
  }

  var SEL = "textarea.drill-code, textarea.py-lab-editor, textarea.review-code, input.drill-in";

  function num(cs, prop) { return parseFloat(cs[prop]) || 0; }

  /* ---- 本地保存：编辑器内 Cmd/Ctrl+S = 保存代码 ---- */

  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.style.cssText = "position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);" +
        "padding:0.45rem 1rem;border-radius:999px;font-size:0.82rem;font-weight:600;z-index:9999;" +
        "background:var(--accent,#a0522d);color:var(--on-accent,#fff);box-shadow:0 4px 14px rgba(0,0,0,0.25);" +
        "opacity:0;transition:opacity 0.25s;pointer-events:none;";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = "1";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.style.opacity = "0"; }, 1600);
  }

  function editorKey(ta, idx) {
    var anchor = null;
    try {
      var drill = ta.closest(".drill");
      if (drill && drill.dataset.n) anchor = "d" + drill.dataset.n;
      if (!anchor && ta.id) anchor = ta.id;
    } catch (e) { /* closest 不可用则退回序号 */ }
    if (!anchor) anchor = "idx" + idx;
    return "wb-code:" + location.pathname + ":" + anchor;
  }

  function saveCode(ta, key) {
    var code = ta.value;
    try { localStorage.setItem(key, code); } catch (e) { return; }
    try {
      document.dispatchEvent(new CustomEvent("wb-code-save", { detail: { ta: ta, code: code, key: key } }));
    } catch (e) { /* 旧浏览器无 CustomEvent 则跳过桥接 */ }
    toast("✓ 代码已保存（浏览器本地，刷新不丢）");
  }

  function enhance(ta, idx) {
    if (ta.__pyhl) return;
    ta.__pyhl = true;

    var cs = getComputedStyle(ta);
    var isInput = ta.tagName === "INPUT";

    // 定位容器：静态烘焙的页面已带 .pyhl-wrap，直接采用；否则现场包一层
    var wrap = (ta.parentNode && ta.parentNode.classList &&
                ta.parentNode.classList.contains("pyhl-wrap"))
      ? ta.parentNode : null;
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "pyhl-wrap";
      if (cs.display === "block" || !isInput) wrap.style.display = "block";
      if (isInput) { wrap.style.flex = cs.flex; wrap.style.display = "block"; }
      ta.parentNode.insertBefore(wrap, ta);
      wrap.appendChild(ta);
    }
    wrap.style.margin = cs.marginTop + " " + cs.marginRight + " " + cs.marginBottom + " " + cs.marginLeft;
    ta.style.margin = "0";

    // 高亮层：优先采用静态烘焙的 pre，否则创建
    var pre = wrap.querySelector(":scope > pre.pyhl-hl") ||
      (function () {
        var p = document.createElement("pre");
        p.className = "pyhl-hl";
        p.setAttribute('aria-hidden', 'true');
        wrap.insertBefore(p, ta);
        return p;
      })();
    var padT = num(cs, "paddingTop") + num(cs, "borderTopWidth");
    var padB = num(cs, "paddingBottom") + num(cs, "borderBottomWidth");
    var padL = num(cs, "paddingLeft") + num(cs, "borderLeftWidth");
    var padR = num(cs, "paddingRight") + num(cs, "borderRightWidth");
    pre.style.padding = padT + "px " + padR + "px " + padB + "px " + padL + "px";
    pre.style.fontFamily = cs.fontFamily;
    pre.style.fontSize = cs.fontSize;
    pre.style.fontWeight = cs.fontWeight;
    pre.style.fontStyle = cs.fontStyle;
    pre.style.lineHeight = cs.lineHeight;
    pre.style.letterSpacing = cs.letterSpacing;
    pre.style.tabSize = cs.tabSize || "4";
    pre.style.borderRadius = cs.borderRadius;
    pre.style.whiteSpace = isInput ? "pre" : "pre-wrap";
    pre.style.overflowWrap = "break-word";

    ta.classList.add("pyhl-src");

    function sync() {
      pre.innerHTML = hl(ta.value) + "\n";
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }

    ta.addEventListener("input", sync);
    ta.addEventListener("scroll", function () {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    });
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(sync).observe(ta);
    }

    // 本地保存：恢复 + Cmd/Ctrl+S
    var codeKey = editorKey(ta, idx);
    ta.__wbClearCode = function () { try { localStorage.removeItem(codeKey); } catch (e) {} };
    try {
      var saved = localStorage.getItem(codeKey);
      if (saved !== null && saved !== "" && (ta.value === "" || ta.value === ta.defaultValue)) {
        ta.value = saved; // 引擎已恢复过的（≠ 初始值）不覆盖
      }
    } catch (e) { /* localStorage 不可用则跳过 */ }

    var escUnlocked = false;
    ta.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey &&
          (e.key === "s" || e.key === "S")) {
        e.preventDefault(); // 拦截浏览器"保存网页"
        saveCode(ta, codeKey);
        return;
      }
      if (e.key === "Escape") { escUnlocked = true; return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey || escUnlocked) { escUnlocked = false; return; }
      e.preventDefault();
      var s = ta.selectionStart, en = ta.selectionEnd, v = ta.value;
      ta.value = v.slice(0, s) + "    " + v.slice(en);
      ta.selectionStart = ta.selectionEnd = s + 4;
      sync();
    });

    sync();
  }

  function initAll() {
    document.querySelectorAll(SEL).forEach(function (ta, idx) {
      try { enhance(ta, idx); } catch (err) {
        // 单个编辑器失败不影响其余；静态烘焙的高亮仍然可见
        if (typeof console !== "undefined") console.warn("pyhl enhance failed:", err);
      }
    });
    // 静态块兜底：仅形状一 pre>code（形状二 lang-tag 块由构建脚本烘焙）
    document.querySelectorAll("pre > code:not([data-nohl])").forEach(function (codeEl) {
      try { enhanceStatic(codeEl); } catch (err) {
        if (typeof console !== "undefined") console.warn("pyhl static enhance failed:", err);
      }
    });
  }

  /* ---- 静态代码块兜底：未烘焙的 <pre><code> 现场高亮（已烘焙/Java 块不动） ---- */
  function enhanceStatic(codeEl) {
    var pre = codeEl.closest("pre");
    if (!pre || codeEl.querySelector("span")) return; // 已烘焙则跳过
    if (pre.hasAttribute("data-nohl") ||
        (pre.querySelector(":scope > span[data-pyhl]") &&
         pre.querySelector(":scope > span[data-pyhl]").getAttribute("data-pyhl") !== "1")) return;
    codeEl.innerHTML = hl(codeEl.textContent);
    pre.classList.add("pyhl-static");
  }

  window.PYHL = { hl: hl };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
