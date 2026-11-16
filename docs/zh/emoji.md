---
title: emoji
keywords: emoji, 表情, 码位, 字节, utf8mb4, 长度, 字素簇, 渲染, ZWJ
description: emoji 是字符不是图片。为什么“字符数”有三种算法，以及它为什么会插不进数据库。
section: unicode
order: 4
updated: 2026-11-11
draft: false
---

emoji 最容易让人误判的地方只有一个：**它是字符，不是图片**。所以它受编码、长度、字符集、字体这几套规则约束，而这几套规则对“一个 emoji”的计数方式各不相同。

## 它是字符 {#not-image}

`😀` 是一个码位（`U+1F600`），和其他字符一样存在文本里。你看到的那张彩色脸，是**字体**把它画出来的。

推论（都很关键）：

- 同一段文字，在 Apple、[Google](/credits/maker/google)、[Microsoft](/credits/maker/microsoft) 的系统上**长得不一样**，因为三家各自的 emoji 字体设计不同；
- 截图与设计稿里的 emoji 换台机器就不可复现；
- 字体可以完全不带 emoji 字形，那时浏览器会回退到系统的 emoji 字体（见 [整形与回退](/docs/unicode-shaping-fallback)）；
- 彩色 emoji 是用位图或矢量表实现的（`CBDT`、`sbix`、`COLR` 等），但**对使用它的代码来说，它仍然只是一个字符**。

## 三种长度 {#counts}

同一个字符串，三种算法给出三个数：

| 问法 | 怎么算 | `"😀"` | `"👨‍👩‍👧"` |
| --- | --- | --- | --- |
| 多少个 UTF-16 码元 | JavaScript 的 `.length`、HTML 的 `maxlength` | 2 | 8 |
| 多少个码位 | `[...str].length`、`Array.from(str).length` | 1 | 5 |
| 多少个字素簇（看起来的“一个字”） | `Intl.Segmenter` | 1 | 1 |

家庭 emoji 由“男人 + 零宽连接符 + 女人 + 零宽连接符 + 女孩”拼成：五个码位，其中两个 `U+200D` 自己不占宽度，但决定了前后要不要拼成一个。

```js
'😀'.length                                    // 2   ← 码元
'😀'.codePointAt(0)                            // 128512
[...'😀'].length                               // 1   ← 码位
[...new Intl.Segmenter().segment('👨‍👩‍👧')].length  // 1   ← 字素簇
```

要做“字符计数器”（输入框剩余字数、昵称长度限制），先想清楚要数哪一种。多数产品要的是**字素簇**，而实现里用的往往是 `.length`。

## 字节数 {#bytes}

UTF-8 下，每个 emoji 通常是 4 字节（BMP 之外的码位都是 4 字节）：

| 文本 | 码位 | UTF-16 码元 | UTF-8 字节 |
| --- | --- | --- | --- |
| `A` | 1 | 1 | 1 |
| `中` | 1 | 1 | 3 |
| `😀` | 1 | 2 | 4 |
| `👨‍👩‍👧` | 5 | 8 | 18 |

```js
new TextEncoder().encode('😀').length   // 4
Buffer.byteLength('😀', 'utf8')         // 4（Node）
```

“按字节算”与“按字符算”在这里能差 4 倍，数据库里的很多问题都源于此。

## 数据库里的长度 {#sql}

先区分两类问题，它们长得像、原因完全不同：

**一是字符集放不下。** MySQL 的 `utf8` 实际上是 `utf8mb3`（每字符最多 3 字节），存 4 字节的 emoji 会直接失败：

```
Incorrect string value: '\xF0\x9F\x98\x80' for column 'name' at row 1
```

这不是长度不够，是列（或连接）的字符集只支持 3 字节。解决：库、表、列、连接全部用 **`utf8mb4`**。

**二是长度口径不一致。**

- `VARCHAR(n)` 在 MySQL 里按**字符**计（`n` 个字符，不是字节）；PostgreSQL 同样按字符；SQLite 基本不限；
- 但“字符”在 MySQL 里指**码位**，不是字素簇，一个家庭 emoji 算 5 个；
- `LENGTH()` 返回**字节**，`CHAR_LENGTH()` 返回字符（Postgres 是 `OCTET_LENGTH()` 与 `LENGTH()`）：
  ```sql
  SELECT LENGTH('😀'), CHAR_LENGTH('😀');   -- 4, 1
  ```
  用 `LENGTH()` 去做业务判断，中文和 emoji 都会立刻超标；
- 索引前缀有字节上限：旧行格式（`COMPACT`）是 767 字节，`utf8mb4` 每字符 4 字节，于是 `VARCHAR(191)` 成了当年的标准写法；`DYNAMIC` 行格式下是 3072 字节（约 `VARCHAR(768)`）。

## 前端与后端的口径 {#frontend}

同一句话，三层给的数可能都不一样：

| 层 | 按什么算 | `"😀"` |
| --- | --- | --- |
| HTML `maxlength` / JS `.length` | UTF-16 码元 | 2 |
| 数据库 `VARCHAR(n)` | 码位 | 1 |
| 校验用的正则 `.`（没加 `u` 标志） | 码元 | 2 |

于是“前端说还能输 1 个字，后端说超长”这种情况会出现。通用做法：

- 前端用 `[...value].length` 或 `Intl.Segmenter` 计数，别直接用 `.length`；
- 后端按字符（`CHAR_LENGTH`）校验；
- 存之前统一 `normalize('NFC')`（见 [字符属性](/docs/unicode-character-properties)）；
- **永远不要按字节截断字符串**，那会切出半个代理对，得到乱码。

## 渲染：它不是一张图片 {#render}

因为 emoji 是字符，它的样子由**字体 + 系统**决定：

- Apple Color Emoji、Segoe UI Emoji、Noto Color Emoji 是三家各自的设计，同一个码位画法不同；
- 有的字符有两个“样子”（文本式与 emoji 式），用变体选择符指定：`U+FE0F` 要 emoji 式，`U+FE0E` 要文本式（见下文 [文本式还是 emoji 式](#variation-selectors)）；
- 系统或字体没跟上 Unicode 版本时，新 emoji 会显示成豆腐块。

所以“设计稿上是这个 emoji”在别的机器上可能变成另一个形状。这不是 bug，是字符的正常行为。

## 文本式还是 emoji 式 {#variation-selectors}

有些字符**两种样子都合法**：`✏` 既可以是一支黑白铅笔（跟随文字颜色），也可以是彩色图标。`U+2139` ℹ 同理 —— 它 Unicode 3.0 就有，本来是“信息源”这个普通符号；到 Unicode 6.1（2012）引入 emoji 变体序列时，它才多出“可以显示成彩色”这重身份。

选哪一种由**变体选择符**（variation selector）指定，它本身不可见、宽度为 0：

| 码位 | 正式名称 | UTS #51 里的术语 | 作用 |
| --- | --- | --- | --- |
| `U+FE0E` | VARIATION SELECTOR-15（VS15） | **text presentation selector** | 请求文本呈现：单色，跟随文字颜色 |
| `U+FE0F` | VARIATION SELECTOR-16（VS16） | **emoji presentation selector** | 请求 emoji 呈现：彩色 |

两个字符都在 `Variation Selectors` 区块（`U+FE00–U+FE0F`，Unicode 3.2 加入）里，类别是 Mn（非间距记号，本来用于 CJK 字形变体）；“文本式 / emoji 式”这层语义是后来的事 —— Unicode 6.1 起由 UTS #51《Unicode Emoji》定义。

**变体序列**（variation sequence）= 基础字符 + 一个选择符。它不是随便写的：有资格挂选择符的字符全在 [emoji-variation-sequences.txt](https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-variation-sequences.txt) 里（18.0 版共 371 条），规范原话是“只有这些序列是合法的”。给别的字符硬加 `U+FE0E` 没有定义的语义，多半被忽略。

### 谁决定“默认”是哪一种 {#variation-defaults}

- `Emoji_Presentation=Yes` 的字符（`😀`、`⌚`）默认就是 emoji 式；
- `Emoji_Presentation=No` 的字符（`©` `®` `™` `ℹ` `✏` `❤`）**默认是文本式**，想要彩色得自己加 `U+FE0F`；
- 两者都不是的字符，永远只有文本式。

### Windows 上遇到的怪事 {#variation-windows}

在 Windows + Chromium 里，`U+2139`（ℹ）常常不按这个默认规矩来，直接显示成彩色图标。这不是 Unicode 乱了，而是**字体匹配**的结果：Segoe UI Emoji 里也有这个字符，而 UTS #51 §4.4 提到过一种真实存在的实现方式 —— “字体栈里只要有一个 emoji 字体，就尽量用 emoji 呈现”。

规范的推荐恰好相反：**网页里 text-default 字符不带选择符时应该按文本显示**（§4 的 Emoji versus Text Display 表）。所以这是实现取舍，不是标准要求。

手上有两个办法：

1. **把意图写进字符串**：`U+2139 U+FE0E`。好处是它能跟着文本一起复制、粘贴、进数据库，不依赖样式；
2. **把字体栈排好**：让一个含该字符的文本字体排在 emoji 字体前面（`font-family: "Segoe UI Symbol", system-ui, sans-serif`）—— 只管这一页，管不了别人复制走的那串字。

```js
'\u2139\uFE0E'.length            // 2 —— 选择符也是一个码位
[...'\u2139\uFE0E'].length       // 2
'\u2139\uFE0E'.normalize('NFC')  // 不变：变体序列不是组合字符
```

还有一条路是 BCP 47 的 `-u-em-text`（`<html lang="zh-u-em-text">`），UTS #51 §4.2 定义了它，但支持面还不齐，不能当唯一手段。

⚠️ `U+FE0E` 是**请求**不是命令：字体与系统没有对应的文本字形时，照样可能显示 emoji 或豆腐块。字符必须长得像个普通符号时（代码注释、终端输出、日志），别指望它 —— 换成 ASCII 写法更稳。

⚠️ 它也会**影响计数**：加了一个 `U+FE0E`，按码位算的长度就多一，与前一节那三种口径对不上时先想到它。

## 在本站能看到什么 {#this-site}

- 字符抽屉里能查到任意字符的码位与各语言转义（星平面字符的 `\uD83D\uDE00` 写法尤其容易写错）；
- 覆盖率里**通常看不到** emoji：普通西文/中文字体不含 emoji 字形，页面上那些 emoji 是系统 emoji 字体画的；
- 度量面板测 emoji 时，如果字体没有它的字形，会明确告诉你“字体里没有这个字符”。

## 延伸阅读

- Unicode 标准：emoji 相关章节与 `emoji-data.txt`
- UTS #51（Unicode Emoji）
- MDN：`Intl.Segmenter`、`String#codePointAt`
- 本站：[码位与平面](/docs/unicode-codepoints)、[字符属性](/docs/unicode-character-properties)
