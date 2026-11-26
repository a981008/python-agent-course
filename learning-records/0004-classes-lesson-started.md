# 0004 · 类与 dataclass：self、@dataclass 与 Protocol（开课）

- 日期：2026-11-26
- 状态：已发布，待学员完成
- 最近发展区定位：第 1-3 课已覆盖 def/推导/签名设计；本课进入面向对象——Java 后端的主场，重点放在"少了什么"（new/访问修饰符/@Override）与"多出什么"（self 显式传参、@dataclass、结构化 Protocol）
- 动手任务 3 个（11 条测试）：
  - 任务 1 手写 Message 类（__init__/__repr__，对应 Java toString）
  - 任务 2 @dataclass AgentState（含防作弊：默认列表共享当场抓住 + __eq__ 自动生成验证）；可变默认值手写 = [] 会在类定义时 ValueError
  - 任务 3 ChatModel Protocol（@runtime_checkable + isinstance；"未声明继承的类也应通过"测试逼出真结构化匹配）
- 间隔复习埋点：Point dataclass 默写 / Basket default_factory / Dog 继承重写（测试经 type().__mro__ 验证继承，规避 review.js exec 命名空间拿不到 Animal 的问题）
- 修复：theme.js 此前从未注入任何页面（NOTES 承诺的手动切换按钮缺失），本次已注入全部 7 页
- 下节预告：第 5 课 异常与资源管理（try/except/raise from/with/@contextmanager）

## 练习场追加（2026-11-26）

- lessons/0004-classes-drill.html：20 题 5 分类（A 手写类×5 / B dataclass×5 / C 继承×4 / D Protocol×3 / E 综合×3），复用 0003 练习场 exec 判分引擎，进度键 lesson-0004-drill-progress
- 防作弊：#15 检查 Protocol 在 __mro__ 且 @runtime_checkable 生效；#19 uppercase 仅关键字（没加 * 当场抓）
- #11-14/#16-19 共 8 题带 drill-data 数据块（Animal/Dog/Retriever/FakeModel/Message 等类定义展示）
- 全部 20 题参考答案过判分模拟；starter 无答案泄漏；node --check 3/3；headless 20 编辑框高亮全生效
- 大纲加 4★ 行（● 配套练习中）+ 资产表行；0004 课件导航挂练习场
