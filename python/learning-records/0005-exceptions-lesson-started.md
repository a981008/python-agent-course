# 0005 · 异常与资源管理（开课）

- 日期：2026-11-26
- 状态：已发布，待学员完成
- 最近发展区定位：第 1-4 课已覆盖语法主线与类；本课进入 try/except/else/finally、raise from 异常链、自定义异常层次、with/@contextmanager，全程 Java（checked 异常/throws/try-with-resources）对照，并引入 EAFP vs LBYL
- 动手任务按大纲验收"三层防御"展开（12 条测试）：
  - 任务 1 业务异常层：InsufficientBalanceError(Exception) + withdraw raise（类型名/消息/继承三重断言）
  - 任务 2 重试层：retry_call——ValueError 重试、用尽抛最后一次、防作弊"吞所有异常重试"当场抓住
  - 任务 3 兜底层：@contextmanager suppress_error（hasattr __enter__/__exit__ 验证装饰器在位 + 其他异常照常抛）
- 间隔复习埋点：pay 自定义异常默写 / retry 重试模板默写 / suppress @contextmanager 默写（测试均只引用 _fn，规避 exec 命名空间限制）
- 构建管线沿用 0005 修好的块头唯一标记抓取（grab 加唯一性断言）；headless 验证 4 编辑区 pyhl-src 全部生效
- 下节预告：第 6 课 模块、项目结构与 typing 全量
