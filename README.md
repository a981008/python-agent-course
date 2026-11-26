# Python 语法与工程能力课程（Java 后端视角）

**在线访问：<https://a981008.github.io/python-agent-course/>**（课程中心；Python 大纲直达：<https://a981008.github.io/python-agent-course/python/lessons/0000-course-outline.html>）

一套面向 **Java 后端工程师** 的中文 Python 语法与工程能力课程站：从"能读能改"练到"面试不依赖 AI、独立手写"，为 AI Agent 开发打牢语言底子。所有课件为零依赖的自包含 HTML——CSS/JS 全部内联，双击即用，无需构建、无需服务器。

## 目录结构

```text
index.html                 课程中心入口
python/                    Python 语法课程
├─ lessons/                大纲、22 课与 22 个课配套练习场 + R1★
├─ reference/              Python 全语法速查表
└─ learning-records/       逐课学习记录
materials/                 面试题库、学习计划、报告等非课程资料
assets/                    内联组件源码参照
```

未来 LangChain、FastAPI 等课程按 `python/` 的同级目录扩展。

## 快速开始

1. 打开 [python/lessons/0000-course-outline.html](python/lessons/0000-course-outline.html)（课程大纲，总入口）
2. 从 [第 1 课](python/lessons/0001-from-java-to-first-function.html) 开始，每课 20–30 分钟：讲解 → 动手任务 → 检索练习 → 间隔复习
3. 学完当天做课内复习，隔天开新课前先默写，再刷对应练习场

在线判分说明：代码题在浏览器内通过 Pyodide（WebAssembly Python）真实执行断言，首次运行需加载运行时；复习题先凭记忆写、再点"检查"。**所有练习默认关 AI、关补全作答**——这是本课程的核心训练约束。

## 课程结构（22 课 + 22 个课配套练习场 + R1★，共 391 题）

| 阶段 | 内容 | 页面 |
|---|---|---|
| 阶段一 · 语言地基 | 第 1–4 课：函数入门 / 解包与模式匹配 / 推导式 / 函数进阶 | `python/lessons/0001`–`0004` + 1★–4★ 练习场 |
| 阶段二 · 对象模型与协议 | 第 5–10 课：类与 dataclass / 异常 / 对象模型 / 属性协议与描述符 / 容器与运算符协议 / 类创建与元编程 | `python/lessons/0005`–`0010` + 5★–10★ 练习场 |
| 阶段三 · 语言纵深与标准库 | 第 11–17 课：装饰器 / 生成器 / 类型系统进阶 / 数据建模 / 模块与打包 / 标准库 / 标准库长尾 | `python/lessons/0011`–`0017` + 11★–17★ 练习场 |
| 阶段四 · 工程化与测试 | 第 18–19 课：脚本工程化（CLI/日志）/ 测试 pytest 与 doctest | `python/lessons/0018`–`0019` + 18★–19★ 练习场 |
| 阶段五 · 并发与异步 | 第 20–22 课：并发与 GIL / asyncio / 异步进阶；R1★ 复盘场收官 | `python/lessons/0020`–`0022` + 20★–22★ + R1★ 练习场 |

配套资产：

- [python/reference/java-to-python-syntax.html](python/reference/java-to-python-syntax.html) — Python 全语法速查表（45 节，Java 对照视角，打印友好）
- [materials/一个月转型Agent学习计划.md](materials/一个月转型Agent学习计划.md) — 30 天晚间节奏总计划
- [materials/社招后端转型 Agent 路径（已落地）.md](materials/社招后端转型%20Agent%20路径（已落地）.md) — 转型路线与面试视角
- [materials/面试问题分类与参考答案.md](materials/面试问题分类与参考答案.md) / [materials/部分面试经验.md](materials/部分面试经验.md) — 面试题库与经验
- [python/learning-records/](python/learning-records/) — 逐课学习记录
- [materials/MISSION.md](materials/MISSION.md) / [materials/NOTES.md](materials/NOTES.md) / [materials/RESOURCES.md](materials/RESOURCES.md) — 课程目标、授课约定、资料清单

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
