# NOTES.md

- 全中文授课；讲解时主动给出 Java 对应物（用户为 Java 后端 P6，类比是加速器）
- 课程要短（单课一个 tangible win），对应 30 天计划的晚间节奏
- 用户目标明确：面试不依赖 AI 手写 → 所有练习默认"关 AI、关补全"作答
- 主资料锁定官方中文教程 3.15（用户指定）
- 工作区即面试目录：当前为 15 课 + 10 个练习场（266 题）；第 1-13 课对齐《一个月转型Agent学习计划.md》的 Agent 主线，第 14/15 课与 10★ 补齐 Python 3.15 官方教程缺口
- lessons/reference HTML 必须自包含：CSS/JS 直接内联（WorkBuddy 预览面板按单文件哈希目录分发，../assets 相对路径会 404）；assets/ 留作组件源码参照，尚无入库的统一构建入口，修改组件后必须同步各页内嵌副本
- 全部课件支持明暗主题：默认跟随系统（prefers-color-scheme），右下角按钮可手动循环 自动→浅色→深色（localStorage 持久化）；高亮 token 与语义色均已变量化，新增颜色只改基础令牌，不写主题专属硬编码
- 全部 15 课的间隔复习均在线评判（review.js 引擎 + window.REVIEW 配置）：先凭记忆写再点检查，expr 模式判表达式、code 模式判完整函数；结果持久化并接入课程进度
- 全部 Python 输入区已接 pyhl.js：语法高亮（透明输入框+上层 overlay）、Tab 插 4 空格、Shift+Tab 原生后退、Esc 解锁、Cmd/Ctrl+S 保存并恢复；目标选择器 textarea.drill-code/.py-lab-editor/.review-code 与 input.drill-in。pylab.js 不再重复处理 Tab
- 【工作流规则】每次更新课程/练习场/组件后，必须同步 lessons/0000-course-outline.html 的课程内容、链接、题量与进度总览；状态芯片只读本地记录，首次打开统一未开始，不写死默认进度
- 语法高亮为双层保障：初始高亮已静态烘焙进 HTML（pyhl-wrap + pre.pyhl-hl），JS 运行时 pyhl.js 采用已有 wrap/pre（:scope > pre.pyhl-hl）只补样式与事件；新增含初始代码的编辑器时需重跑烘焙，否则只靠 JS 动态渲染
