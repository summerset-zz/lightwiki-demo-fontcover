---
title: BOM：文件开头的三个字节
keywords: BOM, 字节序标记, 字节序, U+FEFF, 零宽不换行空格, UTF-8 BOM, EF BB BF, CSV, Excel, 乱码, utf-8-sig, JSON.parse
description: 它不显示、不占宽度，却决定 Excel 认不认中文，也能让 JSON.parse 直接报错。BOM 是什么、为什么有两个名字、什么时候该加什么时候别加。
section: unicode
order: 5
updated: 2026-11-03
draft: false
---

一个文本文件最前面可能藏着三个字节，你在编辑器里看不见它们。它们能让 Excel 认出中文，也能让一段看起来完全正常的 JSON 解析失败。这就是 BOM。

## 它是什么 {#what}

BOM 是文件（或数据流）最前面那几个字节，用来告诉读它的人“这份是哪种编码、字节按什么顺序排”：

| 编码形式 | 开头的字节 |
| --- | --- |
| UTF-8 | `EF BB BF` |
| UTF-16 大端（BE） | `FE FF` |
| UTF-16 小端（LE） | `FF FE` |
| UTF-32 大端 | `00 00 FE FF` |
| UTF-32 小端 | `FF FE 00 00` |

关键的一点：**BOM 不是文件头里的元数据，它就是一个字符**，即码位 `U+FEFF`，被编成上面那串字节而已。所以任何“把文件当文本读”的代码都会把它读进来，成为字符串的第 0 个字符。后面所有麻烦都从这儿来。

## 为什么它有两个名字 {#two-names}

`U+FEFF` 的正式名字是 `ZERO WIDTH NO-BREAK SPACE`（零宽不换行空格），而 `BYTE ORDER MARK` 是它的**旧名**（见 [字符属性](/docs/unicode-character-properties#old-name)）。今天所有人叫它 BOM，通用表里那个反而是“以前的名字”。

为什么当初需要它：UTF-16 与 UTF-32 把码位拆成多个字节存放，“先放高位还是先放低位”历史上两种都有人做。同一串字节 `00 41`，大端读是 `U+0041`（`A`），小端读是 `U+4100`。开头放一个 `U+FEFF`，读的人一看字节顺序就知道按哪种字节顺序读，这正是“字节序标记”的字面意思。

## UTF-8 其实不需要它 {#utf8}

UTF-8 是逐字节读的，没有“两个字节谁在前”的问题，所以 UTF-8 里的 BOM 提供不了任何排序信息，它只剩下一个用处：**声明“我是 UTF-8”**。

于是标准对它的态度很冷淡：

- Unicode 标准说 UTF-8 用 BOM **既非必需也不推荐**；
- RFC 8259（JSON）说得更硬：**生成方不能加**，读取方可以忽略；
- HTML 与 CSS 的解析规则都明确写着：流开头的 BOM 剥掉。

换句话说，UTF-8 的 BOM 不是一种“标准做法”，而是一个**向某些工具妥协的产物**。

## CSV 与 Excel：最常撞上的那个坑 {#csv}

这是它今天还在被使用的主要原因。Excel 打开 `.csv` 时不会去猜编码：**没有 BOM，它就按系统区域设置解码**（中文 Windows 上是 GBK / CP936）。于是一份 UTF-8 的中文表格，在 Excel 里是一堆乱码，而在编辑器里明明好好的。

加上 BOM，Excel 才认得这是 UTF-8。于是有了那条看起来自相矛盾的经验：

- **给人用 Excel 打开的 CSV**：加 BOM；
- **给程序读的 CSV**：别加。

因为程序那一侧，BOM 会跟着第一行第一个字段一起进来：表头 `id` 读出来其实是 `\ufeffid`，于是 `row['id']` 取不到，而文件里明明有这一列，代码说没有。这个报错很难和“编码”联系起来，因为文件看着完全正常。

两边都要的时候，办法是写两份，或者干脆用 `.xlsx`：它自己有编码处理，不靠 BOM 来判断。

## 代码里会咬人的几处 {#gotchas}

同样是“读一个文件”，不同 API 对 BOM 的态度完全不一样：

| 场景 | 会不会剥掉开头的 BOM |
| --- | --- |
| `JSON.parse(读取到的文本)` | **不会**，直接报 `Unexpected token` |
| Node `readFileSync(p, 'utf8')` | **不会** |
| Node `require('./a.json')` | 会（内部先剥） |
| 浏览器 `await res.text()` | 会（按 UTF-8 解码时剥掉） |
| Python `open(p, encoding='utf-8')` | **不会** |
| Python `open(p, encoding='utf-8-sig')` | 会 |
| PHP 文件在 `<?php` 之前带 BOM | 会被当成输出 → `headers already sent` |

所以读到 JSON 这种“一个字符都不许错”的格式时，先 `text.replace(/^\uFEFF/, '')` 再解析；更好的做法是**写入端就别加**。

反过来说，JavaScript 源文件带 BOM 并不出事：`U+FEFF` 在 ECMAScript 里算空白字符。真正会出问题的是**数据文件**：JSON、CSV、配置文件。

## 顺带一个隐形字符 {#invisible}

`\uFEFF` 出现在文本**中间**时，它理论上还兼着“零宽不换行空格”的老功能，但今天的排版引擎基本不认。它更常见的身份是一个**看不见的脏字符**：

```js
'a\uFEFFb' === 'ab'   // false：看着一样，比较不等
```

从网页复制命令、从 Excel 粘贴表头、从某个导出工具拿到的 ID，都可能带着它。看到“同样的字符串却不相等”或者“ID 明明对得上却查不到”，先怀疑它。

## 怎么查 {#inspect}

- 看前三个字节：`xxd -l 3 文件`（macOS / Linux）、`Format-Hex -Count 3 文件`（PowerShell）、`od -c 文件 | head -1`；
- 编辑器：VS Code 右下角的编码一栏会写 `UTF-8 with BOM`，点它可以换；
- `file 文件` 的输出里会带 `with BOM`。

## 本站的做法 {#this-site}

本站的文件与响应都是 UTF-8 **不带** BOM：markdown 按编辑器默认保存，JSON 由 `JSON.stringify` 生成（它不会加 BOM），接口响应的 `Content-Type` 明确写着 `charset=utf-8`，读取方不用猜。

本站目前没有 CSV 导出。真要做的时候，规则就是上面那条：给人用 Excel 打开的加 BOM，给程序读的不加。

## 延伸阅读

- Unicode 标准第 2 章（通用结构）里关于 BOM 的那一节
- RFC 3629（UTF-8）、RFC 8259（JSON）第 8.1 节
- 本站：[字符属性](/docs/unicode-character-properties#old-name)（旧名）、[码位与平面](/docs/unicode-codepoints#encodings)（UTF-8 与 UTF-16）
