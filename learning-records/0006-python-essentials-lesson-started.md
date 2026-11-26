# 第 6 课学习记录 · Python 独有语法专题：切片、闭包与对象模型

日期：2026-11-26
状态：课件已发布，开始学习

## 课程定位

大纲扩容后新增的第 6 课（13 课制），集中补 Java 没有对应物的语法面。对应速查表新增的 Python 独有 12 节内容。验收标准：闭包计数器与切片操作全对，能讲清 is 与 == 的区别。

## 覆盖点

1. REPL 内省：python3 交互态、`_` 变量、help()/dir()、python3 -i 现场调试
2. 切片：start:stop:step、负索引、步长反转、浅拷贝、越界不炸、切片赋值
3. 闭包与 LEGB：四层查找顺序、nonlocal（读不需声明写才要）、循环变量闭包共享坑
4. 对象模型：is 与 ==、id()、判等纪律、可哈希（tuple 可以 list 不行）、_x/__x name mangling
5. bytes 与编码：encode/decode、open() 忘写 encoding 的 GBK 坑
6. Enum：auto()、按值反查、IntEnum

## 动手任务（对应验收）

1. make_counter 闭包计数器（防作弊：count 放全局共享会当场抓）
2. rotate(lst, k) 切片循环右移（k 取模、空列表保护、返回新列表不改原表）
3. Status(Enum) 定义 + from_value 按值反查（mro 验 Enum 基类、ValueError 容错）

## 下一步

学完本课后做间隔复习 3 题（闭包默写/切片默写/is 判别表达式），然后说"继续下一课"进入第 7 课《模块、项目结构与 typing》（含 venv 与 pip）。
