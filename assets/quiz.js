/* quiz.js — 可复用检索练习组件
 * 用法：
 * <div class="quiz" data-answer="b">
 *   <p class="quiz-q">问题</p>
 *   <button class="quiz-opt" data-key="a">选项 A</button>
 *   <button class="quiz-opt" data-key="b">选项 B</button>
 *   <p class="quiz-explain" hidden>解析（答后显示）</p>
 * </div>
 * 在每课末尾以内联方式引入本文件内容（不要写 src 引用，见 NOTES.md）
 */
(function () {
  function initQuiz(quiz) {
    var answer = quiz.getAttribute("data-answer");
    var opts = quiz.querySelectorAll(".quiz-opt");
    var explain = quiz.querySelector(".quiz-explain");
    var done = false;
    quiz.setAttribute("role", "radiogroup");
    var qEl = quiz.querySelector(".quiz-q");
    if (qEl && !quiz.getAttribute("aria-labelledby")) {
      if (!qEl.id) qEl.id = "quizq-" + (Math.random() * 1e9 | 0);
      quiz.setAttribute("aria-labelledby", qEl.id);
    }
    opts.forEach(function (b) { b.setAttribute("role", "radio"); b.setAttribute("aria-checked", "false"); });
    opts.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (done) return;
        done = true;
        var key = btn.getAttribute("data-key");
        opts.forEach(function (b) {
          b.disabled = true;
          if (b.getAttribute("data-key") === answer) b.classList.add("is-right");
        });
        if (key !== answer) btn.classList.add("is-wrong");
        if (explain) explain.hidden = false;
        opts.forEach(function (b) { b.setAttribute("aria-checked", b === btn ? "true" : "false"); });
        var liveEl = quiz.querySelector(".quiz-live");
        if (liveEl) liveEl.textContent = (key === answer ? "回答正确。" : "回答错误，正确答案是 " + answer + "。") +
          (explain ? explain.textContent : "");
        quiz.dispatchEvent(new CustomEvent("quiz:answered", {
          bubbles: true, detail: { correct: key === answer }
        }));
        if (window.WBProgress) {
          var allQ = document.querySelectorAll(".quiz");
          WBProgress.mark({ kind: "quiz", unit: "q" + (Array.prototype.indexOf.call(allQ, quiz) + 1),
                            total: allQ.length, passed: key === answer });
        }
      });
    });
  }
  function initAll() { document.querySelectorAll(".quiz").forEach(initQuiz); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else { initAll(); }
})();
