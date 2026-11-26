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
        quiz.dispatchEvent(new CustomEvent("quiz:answered", {
          bubbles: true, detail: { correct: key === answer }
        }));
      });
    });
  }
  function initAll() { document.querySelectorAll(".quiz").forEach(initQuiz); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else { initAll(); }
})();
