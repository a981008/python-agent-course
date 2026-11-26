# Python → Agent 课程（Java 后端 30 天转型）

**在线访问：<https://a981008.github.io/python-agent-course/>**（打开后自动跳转课程大纲；直达大纲：<https://a981008.github.io/python-agent-course/lessons/0000-course-outline.html>）

一套面向 **Java 后端工程师** 的中文 Python 自学课程站：30 天内从"能读能改"练到"面试不依赖 AI、独立手写"，最终服务于 AI Agent 开发（LangChain/LangGraph/MCP 均为 Python 生态）。所有课件为零依赖的自包含 HTML——CSS/JS 全部内联，双击即用，无需构建、无需服务器。

## 快速开始

1. 打开 [lessons/0000-course-outline.html](lessons/0000-course-outline.html)（课程大纲，总入口）
2. 从 [第 1 课](lessons/0001-from-java-to-first-function.html) 开始，每课 20–30 分钟：讲解 → 动手任务 → 检索练习 → 间隔复习
3. 学完当天做课内复习，隔天开新课前先默写，再刷对应练习场

在线判分说明：代码题在浏览器内通过 Pyodide（WebAssembly Python）真实执行断言，首次运行需加载运行时；复习题先凭记忆写、再点"检查"。**所有练习默认关 AI、关补全作答**——这是本课程的核心训练约束。

## 课程结构（17 课 + 16 个练习场，共 346 题）

| 阶段 | 内容 | 页面 |
|---|---|---|
| 阶段一 · 语言地基 | 第 1–4 课：函数入门 / 推导式 / 函数进阶 / 类与 dataclass | `lessons/0001`–`0004` + 1★–4★ 练习场 |
| 阶段二 · 语言纵深与标准库 | 第 5–8 课：异常与上下文 / 独有语法与对象模型 / 模块与 typing / 标准库实战 | `lessons/0005`–`0008` + 5★–8★ 练习场 |
| 阶段三 · 工程化与并发 | 第 9–12 课：脚本工程化（CLI/日志）/ 测试 pytest / 并发模型与 GIL / asyncio | `lessons/0009`–`0012` + 9★–12★ 练习场 |
| 阶段四 · Agent 应用 | 第 13–16 课：装饰器 / 生成器与流式输出 / FastAPI / 手写 Nano Agent（ReAct 循环综合实战） | `lessons/0013`–`0016` + 13★/14★ 练习场 |
| 阶段五 · 面试冲刺 | 第 17 课：算法手写套路（数据结构选型与 Hot100 模板）+ R1★ 语言地基复盘场 | `lessons/0017` + 17★ 练习场 + R1★ 练习场 |

配套资产：

- [reference/java-to-python-syntax.html](reference/java-to-python-syntax.html) — Python 全语法速查表（35 节，Java 对照视角，打印友好）
- [一个月转型Agent学习计划.md](一个月转型Agent学习计划.md) — 30 天晚间节奏总计划
- [社招后端转型 Agent 路径（已落地）.md](社招后端转型%20Agent%20路径（已落地）.md) — 转型路线与面试视角
- [面试问题分类与参考答案.md](面试问题分类与参考答案.md) / [部分面试经验.md](部分面试经验.md) — 面试题库与经验
- [learning-records/](learning-records/) — 逐课学习记录
- [MISSION.md](MISSION.md) / [NOTES.md](NOTES.md) / [RESOURCES.md](RESOURCES.md) — 课程目标、授课约定、资料清单

## 使用特性

- **明暗主题**：默认跟随系统，右下角按钮手动循环 自动→浅色→深色（localStorage 持久化）
- **进度追踪**：大纲表格状态列可点击标记（○ 未开始 → ● 进行中 → ✓ 已完成），仅保存在本机浏览器；复习判分结果同样本地持久化并接入课程进度
- **编辑器体验**：全部 Python 输入区带语法高亮、Tab 缩进、`Cmd/Ctrl+S` 保存、`Cmd/Ctrl+Enter` 运行
- **全宽布局 + 子标题导航**：正文近全宽展示，每页自动生成可跳转的"本页目录"（宽屏右侧吸附、窄屏折叠）
- **快速跳转**：每个页面右上角"当前页小标题"可展开全站导航

## 组件源码

[assets/](assets/) 保存内联组件的参照源码（`base.css` / `pyhl.js` 高亮 / `pylab.js` 在线判分 / `review.js` 复习引擎 / `quiz.js` / `theme.js`）。页面实际使用各文件内嵌副本；修改组件后需同步全部页面的内嵌版本，并同步大纲。

## 主资料

课程对齐 [Python 3.15 官方中文教程](https://docs.python.org/zh-cn/3.15/tutorial/index.html)，语法问题以官方教程为第一参考。
