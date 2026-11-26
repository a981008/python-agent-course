# NOTES.md

- 全中文授课；讲解时主动给出 Java 对应物（用户为 Java 后端 P6，类比是加速器）
- 课程要短（单课一个 tangible win），对应 30 天计划的晚间节奏
- 用户目标明确：面试不依赖 AI 手写 → 所有练习默认"关 AI、关补全"作答
- 主资料锁定官方中文教程 3.15（用户指定）
- 工作区即面试目录：lessons 主题应与《一个月转型Agent学习计划.md》的 W1 模块（asyncio/装饰器/类型提示/列表推导/异常处理）对齐
- lessons/reference HTML 必须自包含：CSS/JS 直接内联（WorkBuddy 预览面板按单文件哈希目录分发，../assets 相对路径会 404）；assets/ 仅作组件源码留存
- 全部课件支持明暗主题：默认跟随系统（prefers-color-scheme），右下角按钮可手动循环 自动→浅色→深色（localStorage 持久化）；base.css 全面变量化，硬编码浅色已清除
- 三节课的间隔复习已改为在线评判（assets/review.js 引擎 + window.REVIEW 配置）：先凭记忆写再点检查，expr 模式判表达式、code 模式判完整函数
- 全部 Python 输入区已接 pyhl.js 组件：语法高亮（透明输入框+上层 overlay）+ Tab 统一插 4 空格；目标选择器 textarea.drill-code/.py-lab-editor/.review-code 与 input.drill-in。改动高亮逻辑只改 assets/pyhl.js 后重跑注入即可（ pylab.js 的 Tab 处理已移交 pyhl，勿重复添加）
- 【工作流规则】每次更新课程/练习场/组件后，必须同步更新课程大纲 lessons/0000-course-outline.html：课程状态芯片（✓/●/○）、资产表新增行、进度总览一句话。发布新课件时也要挂入大纲
- 语法高亮为双层保障：初始高亮已静态烘焙进 HTML（pyhl-wrap + pre.pyhl-hl，由 tmp 构建脚本用 pyhl.js 的 hl() 生成），JS 运行时 pyhl.js 自动采用已有 wrap/pre（:scope > pre.pyhl-hl）只补样式与事件；新增含初始代码的编辑器时需重跑烘焙，否则只靠 JS 动态渲染
