---
title: 码位与平面
keywords: 码位, U+, 平面, 代理对, UTF-8, UTF-16, emoji, code point
description: 码位是编号不是字节；为什么“😀”在 JavaScript 里长度是 2，以及 U+1F600 这种写法怎么读。
section: unicode
order: 0
updated: 2026-11-07
draft: false
---

Unicode 的第一件事是把字符变成一个**编号**，这个编号叫码位（code point）。它和字符在文件里怎么存（字节）是两回事。搞清楚这一层，后面那些长度为什么是 2、为什么一个字要 7 个码位才有解释。

## 码位就是编号 {#what}
<!-- hint: 码位 | 码位是字符在 Unicode 中的编号，写作 U+4E00 的形式。一个可见字符可能由多个码位组成。 -->

每个字符有一个 0 到 `0x10FFFF` 之间的编号。写作 `U+` 加至少四位十六进制：

| 字符 | 码位 |
| --- | --- |
| `A` | `U+0041` |
| `中` | `U+4E2D` |
| `😀` | `U+1F600` |

`U+` 后面的位数不是固定的：BMP 内的码位习惯写四位，超出时写五位或六位。

## 平面 {#planes}
<!-- hint: 平面 | Unicode 把码位划分成 17 个平面，每个平面包含 65536 个码位。0 号平面（BMP）包含日常使用的大部分字符。 -->

把 0–`0x10FFFF` 每 65,536 个码位切成一块，叫一个**平面**（plane）：

| 平面 | 范围 | 内容 |
| --- | --- | --- |
| 0 | `U+0000`–`U+FFFF` | **基本多文种平面（BMP）**，绝大多数日常字符 |
| 1 | `U+10000`–`U+1FFFF` | 补充多文种平面：emoji、古文字 |
| 2 | `U+20000`–`U+2FFFF` | 补充表意平面：CJK 扩展 B 等 |
| 3–13 | - | 未分配 |
| 14 | `U+E0000`–`U+EFFFF` | 补充特殊用途 |
| 15–16 | `U+F0000`–`U+10FFFF` | 私用区 |

私用区是留给各家自己定义的：字体可以在这里放任何图形，Unicode 不管它叫什么。

## 代理区不是字符 {#surrogates}

`U+D800`–`U+DFFF` 这一千多个码位**永远不对应字符**，它们是 UTF-16 的机制：一个 BMP 之外的字符用两个 16 位码元拼出来，这对码元就落在这个区间里。

所以代理区里有没有字符这个问题没有意义：它们只是编码的中转站。

## UTF-8 与 UTF-16 {#encodings}
<!-- hint: UTF-8 与 UTF-16 | 同一个码位在 UTF-8 中占 1 至 4 字节，在 UTF-16 中占 2 或 4 字节。讨论字节数时需要说明使用哪种编码。 -->

- **UTF-8** 用 1–4 个字节表示一个码位，ASCII 兼容；网页与文件默认用它；
- **UTF-16** 用 2 个字节（一个码元）表示 BMP，BMP 之外用两个码元（代理对）。

JavaScript 的字符串是 UTF-16 码元序列，于是：

```js
'😀'.length                  // 2  ← 两个码元
[...'😀'].length             // 1  ← 一个码位
'😀'.codePointAt(0)          // 128512 (0x1F600)
String.fromCodePoint(0x1F600) // '😀'
```

同样，`slice(0, 1)` 会把一个 emoji 砍成半个代理对，得到乱码。要按字符遍历，用 `for...of` 或展开成数组，而不是下标。

## 一个字可能是好几个码位 {#sequences}

码位是编码单位，不是看起来的一个字：

- `é` 可以是 `U+00E9` 一个码位，也可以是 `U+0065` + `U+0301`（字母 + 重音）；
- 家庭 emoji 👨‍👩‍👧 是男人 + 零宽连接符 + 女人 + 零宽连接符 + 女孩，五个码位；
- 国旗 emoji 是两个区域指示符拼出来的。

负责把这些码位组合成一个视觉字符的过程叫**字素簇**（grapheme cluster）。它由 Unicode 的分段规则决定，不是字节数。

<figure style="margin: 1.75rem 0">
  <div style="font-size: 34px; line-height: 1.2">👨‍👩‍👧</div>
  <div style="margin-top: 0.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; opacity: 0.65">
    U+1F468 U+200D U+1F469 U+200D U+1F467
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">
    五个码位、八个 UTF-16 码元、一个视觉字符（字素簇）。中间的 U+200D 是零宽连接符，自己不占宽度，却决定了前后两个 emoji 要不要拼成一个。
  </figcaption>
</figure>

## 变体选择符 {#variation-selectors}
<!-- hint: 变体选择符 | 变体选择符跟在基础字符之后，用来指定具体的字形形式，例如 emoji 的彩色或单色、汉字的不同写法。 -->

有些字符有多个字形：同一个码位可以对应不止一个字形，用哪一个由变体选择符决定。例如下面这两个（在支持的环境里分别显示为文本式与 emoji 式；不支持时可能看起来一样、或都是空白）：︎ 与 ️

- `U+FE0E`：要文本样式；
- `U+FE0F`：要 emoji 样式。

它们本身不显示，只是附在前一个字符上的修饰。字体要在 `cmap` 的变体序列表里声明支持，否则选择符会被忽略。

## 兼容字符：为跟旧编码对齐而收的副本 {#compat}
<!-- hint: 兼容字符 | 为跟旧编码一一对应而收的重复码位，例如 ﬁ 等于 f 加 i；NFKC 会把它们折回普通写法。 -->

<!-- source: en.wikipedia.org | Universal Character Set characters | 1384074310 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 译自 Compatibility characters 一节；补了 NFC/NFKC 的用法与本站的例子，删去对字形与字符区别的展开 -->

还有一类码位，存在的理由不是“缺一个字符”，而是“别的字符集把它和基本字符区分开了”。它们叫**兼容字符**（compatibility character），Unicode 里这样的码位有几千个。收录它只有一个目的：转码时能原样转回去。

| 看起来 | 码位 | 它等于 |
| --- | --- | --- |
| `ﬁ` 连字 | `U+FB01` | `f` + `i` |
| `Ａ` 全角拉丁 A | `U+FF21` | `A` |
| `²` 上标 2 | `U+00B2` | `2` |
| `①` 带圈数字 1 | `U+2460` | 数字 1（但多一层“列表项”的意思） |

它们都带一条 `<compat>` 分解，指回普通写法 —— 就是 [字符属性](/docs/unicode-character-properties#decomposition) 里那列“兼容分解”。由此有两条规矩：

1. **新写的文本里不要用**：`ﬁ` 与 `fi` 看着一样，但搜 `fi` 搜不到 `ﬁ`，排序、大小写转换也各走各的；
2. **要折叠就用 NFKC**：`'ﬁ'.normalize('NFKC')` 得到 `fi`，而 `NFC` 不会动它。反过来，别拿它处理密码、标识符、文件名 —— 那是在静默改用户的数据。

这类码位最集中的地方是阿拉伯文：Unicode 里有 730 个阿拉伯文**呈现形式**，它们分解回 88 个基本字母。原因是阿拉伯字母在词首、词中、词尾、单独出现时形状不同，而旧编码把每种形状都编成了码位。Unicode 的做法是只编基本字母，形状交给字体与排版引擎算（见 [整形与回退](/docs/unicode-shaping-fallback)）。

## 本站怎么展示 {#this-site}

字符格上是字符本身；点开后弹窗里给的是 `U+4E2D` 这种标准写法（`U+` 加至少四位十六进制），底下还有四个翻字符按钮，可以顺着相邻码位一个个看过去。区块用的是 Unicode 官方 `Blocks.txt` 的名字与范围。

## 延伸阅读

- Unicode 标准第 2 章（General Structure）
- UAX #29（字素簇边界）
- MDN：`String#codePointAt`、`String.fromCodePoint`
- 本站：[emoji](/docs/emoji)（字符数、字节数与字素簇为什么是三个数）
