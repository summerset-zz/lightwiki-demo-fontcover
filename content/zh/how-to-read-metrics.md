---
title: 度量图怎么读
keywords: 度量, metrics, unitsPerEm, 基线, ascender, descender, viewBox, em 方框, 百分比
description: 全部是字体单位、与字号无关。每条线对应哪个字段，以及两套 y 方向为什么容易画反。
section: tools
order: 2
updated: 2026-11-02
draft: false
---

检查器的度量面板画的是**一个字形在一个 em 方框里的位置**，加上字体声明的各种边界。它不是字体好不好看的评价图，而是这一行要留多少空间的施工图。

## 先说坐标：字体单位，向上为负 {#coordinates}
<!-- hint: 字体单位与 y 轴 | 度量值以字体单位记录，除以 unitsPerEm 才是比例。y 轴向上为正，因此上升值为正，基线以下为负。 -->

- 一切数值都是**字体单位**（`unitsPerEm` 分之一），不是像素；
- 基线是 y = 0；
- **向上是负**（这是 SVG 的方向）。

所以一条 ascender = 800（字体单位，向上）的线，在 SVG 里画成 `y = -800`。图上看起来在上面，数值是正的，这是同一个东西的两种说法。

因为不涉及像素，**图与字号无关**：12px 和 120px 画出来是同一张图。缩放全交给 SVG 的 `viewBox`。

## 九组图层 {#layers}
<!-- hint: 三套垂直度量 | hhea、OS/2 typo 与 OS/2 win 是三套并存的垂直度量。浏览器按平台选用其中一套，三者的数值经常不同。 -->

| 图层 | 画什么 | 来源 |
| --- | --- | --- |
| Baseline | 基线（y = 0） | - |
| hhea | 上伸、下伸 | `hhea.ascender` / `descender` |
| OS/2 typo | 排版用上下伸 | `OS/2.sTypoAscender` / `sTypoDescender` |
| OS/2 win | Windows 裁切边界 | `OS/2.usWinAscent` / `usWinDescent` |
| Cap height | 大写高度 | `OS/2.sCapHeight` |
| x-height | 小写 x 高度 | `OS/2.sxHeight` |
| Underline | 下划线位置 | `post.underlinePosition` |
| Advance / side bearings | 竖直的三条 | 字形自己的 `advanceWidth` 与 `leftSideBearing` |
| Glyph bounding box | 字形实际占的框（ink） | 字形包围盒 |

图层可以单独关闭，关闭只影响图的显示，数值表照样保留。

<figure style="margin: 2rem 0">
  <svg viewBox="0 0 360 260" role="img" aria-label="一个 em 方框里的度量线示意" style="display: block; width: 100%; max-width: 32rem; height: auto; color: var(--color-neutral-700); font-family: system-ui, sans-serif">
    <line x1="90" y1="76" x2="90" y2="226" stroke="currentColor" stroke-width="1" opacity=".45" />
    <line x1="100" y1="118" x2="100" y2="196" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity=".3" />
    <line x1="162" y1="76" x2="162" y2="226" stroke="currentColor" stroke-width="1" opacity=".45" />
    <line x1="210" y1="76" x2="210" y2="226" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity=".35" />
    <rect x="100" y="106" width="58" height="84" fill="currentColor" opacity=".08" stroke="currentColor" stroke-width="1" stroke-opacity=".5" />
    <line x1="68" y1="94" x2="236" y2="94" stroke="currentColor" stroke-width="1" opacity=".4" />
    <line x1="68" y1="106" x2="236" y2="106" stroke="currentColor" stroke-width="1" opacity=".2" />
    <line x1="68" y1="130" x2="236" y2="130" stroke="currentColor" stroke-width="1" opacity=".2" />
    <line x1="68" y1="190" x2="236" y2="190" stroke="currentColor" stroke-width="1.5" />
    <line x1="68" y1="202" x2="236" y2="202" stroke="currentColor" stroke-width="1" stroke-dasharray="5 3" opacity=".4" />
    <line x1="68" y1="214" x2="236" y2="214" stroke="currentColor" stroke-width="1" opacity=".4" />
    <g font-size="10.5" fill="currentColor">
      <text x="244" y="97">Ascender 800</text>
      <text x="244" y="109" opacity=".55">Cap 700</text>
      <text x="244" y="133" opacity=".55">x-height 500</text>
      <text x="244" y="193">Baseline 0</text>
      <text x="244" y="205" opacity=".65">Underline −100</text>
      <text x="244" y="217" opacity=".65">Descender −200</text>
    </g>
    <g font-size="9" fill="currentColor" text-anchor="middle">
      <text x="90" y="238">x = 0</text>
      <text x="210" y="238" opacity=".65">1 em</text>
      <text x="162" y="251" opacity=".65">advance 600</text>
    </g>
    <text x="96" y="116" font-size="9" fill="currentColor" text-anchor="end" opacity=".65">lsb</text>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    示意，不是某个具体字体：按 <code>unitsPerEm = 1000</code> 举例。右侧是<strong>原始字段值</strong>（注意符号方向，下伸和下划线都是负数），底部是三条<strong>横方向</strong>的线；灰框是字形墨迹（ink），与 <code>advance</code> 不是一回事，两者之差正是右侧边距。
  </figcaption>
</figure>

## 竖直的三条线 {#verticals}

- **原点**（x = 0）：字形的起点；
- **advance**：这个字形占的水平距离，下一个字从这里开始；
- **lsb**（左侧边距）：从原点到字形墨迹的距离；
- **1 em**：x = `unitsPerEm` 那条线，用来对照这个字形占了一 em 的多少。

右侧边距（rsb）在图上不画线，但表里有：`advance − lsb − 墨迹宽度`。

## 数值表 {#table}

表里每一行都给出**字体单位**与**占一 em 的百分比**（百分比 = 值 ÷ `unitsPerEm`）。百分比比绝对值更有用：不同字体的 `unitsPerEm` 可能是 1000 或 2048，绝对值没法直接比。

行包括：

- 基线与三组上下伸（hhea / typo / win）及各自的 line gap；
- cap height、x-height；
- 下划线位置与粗细；
- `unitsPerEm`；
- 字形的 advance、lsb、rsb；
- 墨迹的左右上下边界与高度。

## 三个符号方向，别读反 {#signs}

| 值 | 常见值 | 含义 |
| --- | --- | --- |
| `hhea.descender` | 负数 | 基线**以下**多少 |
| `OS/2.usWinDescent` | **正数** | 向下多少，不是坐标 |
| `post.underlinePosition` | 负数 | 下划线顶部在基线**以下**多少 |
| `post.italicAngle` | 负数 | 向右倾 |

本站已经把这些统一折算成“向上为负”再画，所以你看到的线是统一的；而表里给出的是**原始值**，表里出现正数并不表示图画错了。

## 两套 y 方向 {#two-directions}

这是实现上最容易出错的地方，也是你排查图反了时的第一嫌疑：

- **字形轮廓**（SVG path）是 SVG 方向：y 向下；
- **字形包围盒与度量值**是字体方向：y 向上。

画框时必须把 `top` 与 `bottom` 互换，否则整个框会翻过来。本站把这类换算收敛在一个文件里，就是为了避免某一条线独自翻了个身。

## 为什么有些字符画不出来 {#notdef}

如果字形索引是 0（`.notdef`，豆腐块），说明**这个字体没有这个字**。这时图上的度量属于 `.notdef`，不代表任何真实字形；面板会直接说明字体里没有这个字符，而不是画出一张有意义的图。

## 延伸阅读


- OpenType 规范：`hhea`、`OS/2`、`post`
- 本站：[head、hhea 与 post](/docs/head-hhea-post)
