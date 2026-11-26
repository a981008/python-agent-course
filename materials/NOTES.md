# NOTES.md

- 全中文授课；讲解时主动给出 Java 对应物（用户为 Java 后端 P6，类比是加速器）
- 课程要短（单课一个 tangible win），对应 30 天计划的晚间节奏
- 用户目标明确：面试不依赖 AI 手写 → 所有练习默认"关 AI、关补全"作答
- 主资料锁定官方中文教程 3.15（用户指定）
- 工作区即面试目录：当前为 22 课 + 22 个课配套练习场 + R1★ 复盘场（391 题）。2026-11-27 扩展：补齐解包/海象/完整 match、属性协议与描述符、容器与运算符协议、类创建与元编程、类型系统进阶、数据建模、标准库长尾、异步进阶 8 个主题；课号按 22 课重排，新增 8 个练习场（各 8 题，LS_KEY 用内容绑定的 lesson-<文件名>-drill-progress），19★ 扩为 9 题（补 doctest）；旧 14 课内容尽量保留并按新顺序重编号；速查表扩到 45 节。2026-11-26 二次裁剪：删除阶段四 Agent 应用（FastAPI / Nano Agent）与阶段五面试冲刺（算法 17 课、17★），只保留 Python 语法与工程主线；原 13 装饰器→9、14 生成器→10，原 9 脚本工程化→11、10 测试→12、11 并发→13、12 asyncio→14；阶段三收尾用 R1★ 语言地基复盘场。第 4 批练习场（9★/10★/11★/12★/13★/14★，共 71 题）由 .workbuddy/build_drills_batch4.py 生成：复用 0008 练习场页面壳，静态卡片 + const EX 同源生成，代码答案逐题在 CPython 真跑断言后落盘；新增练习场时改该脚本的 DRILLS 规格并重跑，再跑 sync_nav.py。练习场文件名随课号改，但 LS_KEY 保持内容绑定的旧键不迁移（9★=lesson-0013-drill-progress、10★=lesson-0014-drill-progress 等）。练习场进度键必须全局唯一；历史遗留例外（文件名改变但键不迁移，为保留已有本地进度）：8★ 用 lesson-0009-drill-progress、R1★ 用 lesson-0010-drill-progress、14★（asyncio）用 lesson-0008-drill-progress-v3、11★ 用 lesson-0009-scripting-drill-progress、12★ 用 lesson-0010-testing-drill-progress、13★ 用 lesson-0011-drill-progress、9★/10★ 用 lesson-0013/0014-drill-progress，新增练习场不得复用这些键
- 大纲只保留课程表与逐行状态列；进度总览与“课程 ↔ 面试题库对照索引”已删除（2026-11-26），非课程资料统一归档到 materials/
- 目录约定：Python 语法课程在 python/（lessons、reference、learning-records），非课程资料在 materials/，站点入口为根 index.html；未来课程按 langchain/、fastapi/ 同级扩展
- 导航唯一事实源：.workbuddy/sync_nav.py 的 LESSONS/DRILLS 清单；改课号、增删课程后重跑 `python3 .workbuddy/sync_nav.py` 统一刷新右上角快速跳转与课页上一课/下一课（幂等）
- 课程重排的一次性进度迁移脚本内嵌在大纲页：第一段 flag `wb-restructure-20261126`（15→17 课），第二段 flag `wb-restructure-trim-20261126`（17→14 课，删除 15/16/17），第三段 flag `wb-expand-22-20261127`（14→22 课，旧 1–14 映射到新 1/3/4/5/6/7/15/16/11/12/18/19/20/21）；三段按顺序执行，把 wb-progress/wb-review/wb-lesson-status/wb-code 键搬到最终课号，各只执行一次
- python/lessons、python/reference 的 HTML 必须自包含：CSS/JS 直接内联（WorkBuddy 预览面板按单文件哈希目录分发，../assets 相对路径会 404）；assets/ 留作组件源码参照，尚无入库的统一构建入口，修改组件后必须同步各页内嵌副本
- 全部课件支持明暗主题：默认跟随系统（prefers-color-scheme），右下角按钮可手动循环 自动→浅色→深色（localStorage 持久化）；高亮 token 与语义色均已变量化，新增颜色只改基础令牌，不写主题专属硬编码
- 全部课件的间隔复习均在线评判（review.js 引擎 + window.REVIEW 配置）：先凭记忆写再点检查，expr 模式判表达式、code 模式判完整函数；结果持久化并接入课程进度
- 全部 Python 输入区已接 pyhl.js：语法高亮（透明输入框+上层 overlay）、Tab 插 4 空格、Shift+Tab 原生后退、Esc 解锁、Cmd/Ctrl+S 保存并恢复；目标选择器 textarea.drill-code/.py-lab-editor/.review-code 与 input.drill-in。pylab.js 不再重复处理 Tab
- 【工作流规则】每次更新课程/练习场/组件后，必须同步 python/lessons/0000-course-outline.html 的课程内容、链接与题量；状态芯片只读本地记录，首次打开统一未开始，不写死默认进度
- 语法高亮为双层保障：初始高亮已静态烘焙进 HTML（pyhl-wrap + pre.pyhl-hl），JS 运行时 pyhl.js 采用已有 wrap/pre（:scope > pre.pyhl-hl）只补样式与事件；新增含初始代码的编辑器时需重跑烘焙，否则只靠 JS 动态渲染
- 非编辑区静态代码块（pre>code 与 pre+lang-tag 两种形状）也已 Python 高亮：由 .workbuddy/tmp_static_hl.py bake 烘焙（span data-pyhl 标记幂等；对照/SHELL/TOML/散文块保持原样，shape-1 打 data-nohl）；JAVA 标签块用构建脚本内置 hl_java 分词烘焙（data-pyhl="java"，类型名复用 tk-dec 色，无运行时依赖）；LBYL/EAFP 同块多标签分段逐段判语种；新增讲解代码后重跑 bake；pyhl.js 运行时仅对未烘焙的 pre>code 兜底。内嵌 pyhl 副本用同脚本 sync 子命令统一替换（以 assets/pyhl.js 为准）
- 练习场选择题统一卡片样式（.drill-opts/.drill-opt/.opt-letter/.opt-text，与 quiz 组件同视觉）：选项内联 code 由 tmp_static_hl.py 的 opt-text 段烘焙高亮（code data-pyhl="1" 幂等，pyhl.js 运行时对 .opt-text>code 兜底）；检查后标注 .is-right/.is-wrong；"答案"按钮为开/合切换语义——refreshUI 只填充 ansbox 内容不自动展开，重开后首次点击必能打开（修复已揭示态 reload 后首点变收起的空白问题）；check() 读编辑器一律空安全（mc 行无输入框曾 TypeError）；.drill-in/.drill-code 显式 background/color 主题变量（禁止浏览器默认白底）

- 布局与子标题导航（2026-11-26）：全部课件/速查表/报告页改为近全宽（main 上限 110rem），.marginnote 由负外边距浮动改为内联边注；每页内联脚本自动收集 main 内 h2/h3 生成“本页目录”（details.wb-toc），宽屏 ≥1180px 为右侧固定栏，窄屏折叠卡片；锚点 id 运行时生成（sec-N）。新增页面需带同一 CSS/JS 块，或对页面跑 .workbuddy/apply_wide_toc.py（幂等）；移动端 body 顶部留白 4.2rem 防止右上角快速跳转遮挡标题
