# NOTES.md

- 全中文授课；讲解时主动给出 Java 对应物（用户为 Java 后端 P6，类比是加速器）
- 课程要短（单课一个 tangible win），对应 30 天计划的晚间节奏
- 用户目标明确：面试不依赖 AI 手写 → 所有练习默认"关 AI、关补全"作答
- 主资料锁定官方中文教程 3.15（用户指定）
- 工作区即面试目录：当前为 17 课 + 16 个练习场（346 题）。2026-11-26 重排：旧 8(asyncio)→12、9(stdlib)→8、10→13、11→14、12→15、13→16、15→9；新增 9 脚本工程化、10 测试、11 并发与 GIL、17 算法套路；旧 10★ 补漏场改为 R1★ 语言地基复盘场（阶段五）；旧 0014/0015 已拆解（数值/异常→5，pytest→10，argparse/logging→9，weakref→6，bisect/heapq→17）并删除。第 4 批练习场（9★/10★/11★/13★/14★/17★，共 80 题）由 .workbuddy/build_drills_batch4.py 生成：复用 0008 练习场页面壳，静态卡片 + const EX 同源生成，代码答案逐题在 CPython 真跑断言后落盘；新增练习场时改该脚本的 DRILLS 规格并重跑，再跑 sync_nav.py。练习场进度键必须全局唯一；历史遗留例外：8★（0008-stdlib-drill）仍用 lesson-0009-drill-progress、R1★（0006-review-drill）仍用 lesson-0010-drill-progress、12★ 用 lesson-0008-drill-progress-v3，为保留已有本地进度不迁移，新增练习场不得复用这些键
- 导航唯一事实源：.workbuddy/sync_nav.py 的 LESSONS/DRILLS 清单；改课号、增删课程后重跑 `python3 .workbuddy/sync_nav.py` 统一刷新右上角快速跳转与课页上一课/下一课（幂等）
- 课程重排的一次性进度迁移脚本内嵌在大纲页（flag `wb-restructure-20261126`）：把旧课号的 wb-progress/wb-review/wb-lesson-status/wb-code 键搬到新键，只执行一次
- lessons/reference HTML 必须自包含：CSS/JS 直接内联（WorkBuddy 预览面板按单文件哈希目录分发，../assets 相对路径会 404）；assets/ 留作组件源码参照，尚无入库的统一构建入口，修改组件后必须同步各页内嵌副本
- 全部课件支持明暗主题：默认跟随系统（prefers-color-scheme），右下角按钮可手动循环 自动→浅色→深色（localStorage 持久化）；高亮 token 与语义色均已变量化，新增颜色只改基础令牌，不写主题专属硬编码
- 全部课件的间隔复习均在线评判（review.js 引擎 + window.REVIEW 配置）：先凭记忆写再点检查，expr 模式判表达式、code 模式判完整函数；结果持久化并接入课程进度
- 全部 Python 输入区已接 pyhl.js：语法高亮（透明输入框+上层 overlay）、Tab 插 4 空格、Shift+Tab 原生后退、Esc 解锁、Cmd/Ctrl+S 保存并恢复；目标选择器 textarea.drill-code/.py-lab-editor/.review-code 与 input.drill-in。pylab.js 不再重复处理 Tab
- 【工作流规则】每次更新课程/练习场/组件后，必须同步 lessons/0000-course-outline.html 的课程内容、链接、题量与进度总览；状态芯片只读本地记录，首次打开统一未开始，不写死默认进度
- 语法高亮为双层保障：初始高亮已静态烘焙进 HTML（pyhl-wrap + pre.pyhl-hl），JS 运行时 pyhl.js 采用已有 wrap/pre（:scope > pre.pyhl-hl）只补样式与事件；新增含初始代码的编辑器时需重跑烘焙，否则只靠 JS 动态渲染
- 非编辑区静态代码块（pre>code 与 pre+lang-tag 两种形状）也已 Python 高亮：由 .workbuddy/tmp_static_hl.py bake 烘焙（span data-pyhl 标记幂等；对照/SHELL/TOML/散文块保持原样，shape-1 打 data-nohl）；JAVA 标签块用构建脚本内置 hl_java 分词烘焙（data-pyhl="java"，类型名复用 tk-dec 色，无运行时依赖）；LBYL/EAFP 同块多标签分段逐段判语种；新增讲解代码后重跑 bake；pyhl.js 运行时仅对未烘焙的 pre>code 兜底。内嵌 pyhl 副本用同脚本 sync 子命令统一替换（以 assets/pyhl.js 为准）
- 练习场选择题统一卡片样式（.drill-opts/.drill-opt/.opt-letter/.opt-text，与 quiz 组件同视觉）：选项内联 code 由 tmp_static_hl.py 的 opt-text 段烘焙高亮（code data-pyhl="1" 幂等，pyhl.js 运行时对 .opt-text>code 兜底）；检查后标注 .is-right/.is-wrong；"答案"按钮为开/合切换语义——refreshUI 只填充 ansbox 内容不自动展开，重开后首次点击必能打开（修复已揭示态 reload 后首点变收起的空白问题）；check() 读编辑器一律空安全（mc 行无输入框曾 TypeError）；.drill-in/.drill-code 显式 background/color 主题变量（禁止浏览器默认白底）
