# 第 8 课学习记录 · 异步 asyncio（2026-11-26 开课）

- 课程：lessons/0008-asyncio.html（约 35 分钟）
- win：协程心智模型（单线程事件循环、协作式调度）、async def/await 三规则、gather 保序与 return_exceptions、协程 vs 线程（面试高频）
- 动手 3 任务：fetch 协程（调用不执行）→ fetch_all gather 并发（真实计时防作弊：顺序 await 三次 0.15s > 0.12s 阈值当场现形）→ with_timeout（wait_for + asyncio.TimeoutError）
- 配套练习场：lessons/0008-asyncio-drill.html（20 题，19 题测试内含 await——判分引擎 runPythonAsync 支持；#8 race 用 create_task + FIRST_COMPLETED）
- Pyodide 探针已验证：headless Chrome 里 await/gather/计时全部真实可用（3×0.05s 并发耗时 0.050s）
- 下次开课前先做课件复习区 3 道默写（fetch / gather_two 计时版 / iscoroutinefunction 表达式）
