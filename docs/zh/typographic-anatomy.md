---
title: 排印术语
keywords: 基线, x 高度, 大写高度, 升部, 降部, em 方框, 字碗, 字眼
description: 基线、x 高度、升部降部、em 方框，每个词一句说明，外加它在字体文件里对应哪个字段。
section: design
order: 0
updated: 2026-11-07
draft: false
---

设计师说的字大了、挤了、不齐，在字体文件里都有对应的度量。这一页把最常出现的几个词按垂直方向从下往上排一遍，并指出每个词在字体里叫什么，这样你在检查器里看到的那几个数字才有意义。

## 基线：一切从这条线开始 {#baseline}
<!-- hint: 基线 | 基线是字母底部对齐的那条线。基线与上升、下降、行距共同决定一行文字占用的高度。 -->

**基线**（baseline）是拉丁字母坐的那条线：`a`、`x`、`m` 的底部贴着它，`g`、`p`、`y` 的尾巴垂到它下面。

在字体文件里，基线就是 y = 0。所有别的度量都是相对它说的往上多少、往下多少。

## x 高度与 cap height：看起来有多大 {#heights}
<!-- hint: x 高度与 cap height | x 高度是小写 x 的高度，cap height 是大写字母的高度。同一字号下这两个值差别越大，两种字体看起来的大小差别越明显。 -->

- **x 高度（x-height）**：小写 `x` 的高度。它决定了一段文字**看起来**有多大。同样 16px 时，x 高度大的字体显得更大；
- **cap height（大写高度）**：大写字母的高度，通常比 x 高度高一些。

字体文件里对应 `OS/2` 表的 `sxHeight` 与 `sCapHeight`。⚠️ 这两个值是**声明**，可能填得不准，甚至填 0。真要比视觉大小，更可靠的是看实际字形。

这也解释了为什么两个字体都设 16px，摆在一起大小差很多：它们的 x 高度不一样，字号只规定了 em 方框，不保证视觉大小。

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 300 148" width="100%" role="img" aria-label="基线与 x 高度、大写高度的示意图">
    <g stroke="currentColor" fill="none">
      <line x1="16" y1="125" x2="216" y2="125" stroke-width="2" opacity="0.85" />
      <line x1="16" y1="92" x2="216" y2="92" stroke-dasharray="5 4" opacity="0.45" />
      <line x1="16" y1="78" x2="216" y2="78" stroke-dasharray="2 3" opacity="0.45" />
    </g>
    <text x="56" y="125" font-size="68" font-family="Georgia, 'Times New Roman', serif" fill="currentColor">Hxp</text>
    <g fill="currentColor" opacity="0.6" font-size="10" font-family="system-ui, sans-serif">
      <text x="226" y="81">大写高度</text>
      <text x="226" y="95">x 高度</text>
      <text x="226" y="128">基线</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">比例是示意，实际数值取决于字体，具体一款字体的真实值在检查器的度量面板里。</figcaption>
</figure>

## 升部与降部：一行字能伸多高多低 {#extents}

- **升部（ascender）**：`b`、`d`、`h` 的最高点大致到哪；
- **降部（descender）**：`g`、`j`、`p` 的最低点到哪。

这个词有两个版本，容易混：

| 说法 | 指什么 | 在字体里 |
| --- | --- | --- |
| 字形的实际高度 | 这个字母画到哪 | 字形包围盒（ink bbox） |
| 排版的上下界 | 这一行**应该**留多少空间 | `hhea` 与 `OS/2` 的 ascender / descender |

排版要用后者：给一幅标题留高度、算两行之间的位置，用的是声明的上下界，不是某个字母恰好画到哪。

## em 方框与字面框 {#embox}

**em 方框**（em square）是设计的参考方格，边长等于 `unitsPerEm`（常见 1000 或 2048）。所有坐标都是这个方格里第几格，和像素无关。

**字面框**是字形自己占的那块（ink bbox），通常比方框小一圈。中文字面框更特殊：汉字设计在接近方形的框里，所以中文间距问题不能照搬西文的办法。

## 笔画部位（看字形时会用到的词）{#parts}

| 中文 | English | 一眼认法 |
| --- | --- | --- |
| 字干 | stem | 竖的那根，如 `l`、`H` |
| 横画 | crossbar | 横的那根，如 `H`、`A` |
| 字碗 | bowl | 围起来的圆弧，如 `b`、`o` |
| 字肩 | shoulder | 从字干弯出去的弧，如 `n`、`h` |
| 字眼 | counter | 被笔画围住的空白，如 `o`、`e` |
| 收笔 | terminal | 笔画的末端，如 `c`、`s` 的开口处 |
| 字耳 | ear | `g` 右上那个小凸起 |

这些不影响度量，但**做字体搭配**时是判断像不像的主要依据：同样的字重，字眼大小与收笔形状不同，气质就完全不同。

## 轴线与对比 {#stress}
<!-- hint: 轴线 | 笔画粗细变化的方向，也叫对比；看一个 o 就够了。粗细处处相同的字体没有轴线（等线）。 -->

<!-- source: en.wikipedia.org | Typeface anatomy | 1383441338 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 译自 Stress or contrast 一节 -->

笔画粗细有变化时，这个变化是有**方向**的：叫轴线（stress），也叫对比（contrast）。看 `o` 一个字母就够了：左右粗、上下细是竖轴；粗的地方斜着排，就是斜轴。

- 轴线越斜，越像是一支扁头笔写出来的 —— 钢笔与毛笔天然如此；
- 粗细处处相同叫**等线**（monoline），这是几何风格无衬线体的特征；
- 还有**反对比**（reverse contrast）：把通常该粗的地方做细，看起来像反了，常见于复古展示字体。

所以“这个字体像不像手写”很多时候看的就是轴线，而不是笔画的形状。

## 单层与双层 {#single-storey}

<!-- source: en.wikipedia.org | Typeface anatomy | 1383441338 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 译自 Character variants 一节；只保留 a/g 的单双层与 schoolbook 替代字，删去各家字体的逸事 -->

`a` 与 `g` 各有两种基本结构：**双层**（double-storey：上面一个小碗 + 下面一个大碗）与**单层**（single-storey：一个碗加一根尾巴）。手写体与部分几何无衬线体用单层，正文衬线体几乎都是双层。

儿童读物常整套换成单层的 `a`、`g`（有时还有 `t`、`y`、`l` 与数字 `4`），叫 **schoolbook** 或 infant 替代字形，理由是它们更像手写。这类替代字现在通常是同一个文件里的另一组字形，靠样式替代特性打开（见 [OpenType 特性](/docs/opentype-features-design#common)），而不是另买一套字体。

## 在本站哪里看 {#how-to-see}

- **检查器 → 度量**：把基线、x 高度、cap height、hhea / typo / win 上下伸一起画出来，逐项给数值与占一 em 的百分比；
- **排版预览**：换字号时能直接看出 x 高度差异带来的视觉大小变化。

## 三个常见误解 {#wrong}

1. **字号相同 = 一样大**：字号只决定 em 方框，视觉大小由 x 高度决定；
2. **em 方框就是字形的边界**：不是，字形常常伸出方框（有些手写体特别明显）；
3. **ascender 就是最高的那笔**：不是，它是**排版用的声明**，可能比任何字形都高，也可能比某些字形低。

## 延伸阅读

- OpenType 规范：`OS/2` 的 `sxHeight` / `sCapHeight`
- 本站：[head、hhea 与 post](/docs/head-hhea-post)、[度量图怎么读](/docs/how-to-read-metrics)
