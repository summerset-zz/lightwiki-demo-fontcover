---
title: head、hhea 与 post
keywords: head, hhea, post, unitsPerEm, 行距, lineGap, 斜体角, 下划线, 符号方向
description: unitsPerEm 在哪、上下伸有几个来源、斜体角与下划线怎么算：这三张表各自只有几个字段，却决定了很多显示结果。
section: fields
order: 3
updated: 2026-11-02
draft: false
---

`head`、`hhea`、`post` 各自只有十来个字段，名字也不像 `OS/2` 那样成体系，但它们决定了一格有多细、一行有多高、斜体倾多少、下划线画在哪。三张表合起来讲，是因为它们经常被一起读。

## head：全局参数 {#head}

| 字段 | 说明 |
| --- | --- |
| `unitsPerEm` | **字体单位的刻度**。常见 1000（CFF）或 2048（TrueType），有效范围 16–16384 |
| `xMin` / `yMin` / `xMax` / `yMax` | 所有字形轮廓的整体包围盒 |
| `macStyle` | 位字段：0 粗体、1 斜体、2 下划线、3 描边、4 阴影、5 窄体、6 宽体 |
| `fontRevision` | 数字版本号（与 `name` 里的版本字符串无关） |
| `indexToLocFormat` | `loca` 表用短格式还是长格式 |
| `magicNumber` | 固定值 `0x5F0F3CF5`，用来确认这确实是个字体文件 |
| `created` / `modified` | 时间戳，从 1904 年起算的秒数 |

`unitsPerEm` 是理解度量图的第一把钥匙：字体里所有坐标都是每 em 分成多少格的格数，**和像素没有关系**。字号 16px 时，一个 `unitsPerEm = 2048` 的字体里，1 格 = 16 / 2048 像素。

`macStyle` 与 `OS/2` 的 `fsSelection` 说的是同一件事的两套写法：前者是老 Mac 的做法，后者是 Windows 的做法。读的时候优先 `fsSelection`，把它当兜底。

## hhea：水平排版的三条基准 {#hhea}

| 字段 | 说明 |
| --- | --- |
| `ascender` | 排版的升部（正数） |
| `descender` | 排版的降部（通常是负数） |
| `lineGap` | 建议的行间空隙 |
| `advanceWidthMax` | 最宽那个字形的步进宽度 |
| `numberOfHMetrics` | `hmtx` 里有多少条完整记录（其余复用最后一条） |
| `caretSlopeRise` / `Run` | 插入符的倾斜方向，斜体时用来画竖线 |

很多渲染器把 `ascender + |descender| + lineGap` 当作这个字体自带的行高。但 `OS/2` 里还有一组 `sTypo*` 与 `usWin*`，**哪一组生效取决于 `fsSelection` 的第 7 位**。同一款字体在 Mac 和 Windows 上行高不同，多半就是这里的选择不同。

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 320 230" width="100%" role="img" aria-label="hhea、OS/2 typo 与 OS/2 win 三组上下伸">
    <g stroke="currentColor" fill="none">
      <line x1="16" y1="145" x2="200" y2="145" stroke-width="2" opacity="0.85" />
      <line x1="16" y1="45" x2="200" y2="45" stroke-dasharray="6 4" opacity="0.5" />
      <line x1="16" y1="195" x2="200" y2="195" stroke-dasharray="6 4" opacity="0.5" />
      <line x1="16" y1="60" x2="200" y2="60" stroke-dasharray="2 4" opacity="0.5" />
      <line x1="16" y1="182" x2="200" y2="182" stroke-dasharray="2 4" opacity="0.5" />
      <line x1="16" y1="30" x2="200" y2="30" stroke-dasharray="9 3 2 3" opacity="0.5" />
      <line x1="16" y1="210" x2="200" y2="210" stroke-dasharray="9 3 2 3" opacity="0.5" />
    </g>
    <text x="56" y="145" font-size="52" font-family="Georgia, 'Times New Roman', serif" fill="currentColor">Hxp</text>
    <g fill="currentColor" opacity="0.6" font-size="10" font-family="system-ui, sans-serif">
      <text x="210" y="34">OS/2 win</text>
      <text x="210" y="49">hhea</text>
      <text x="210" y="64">OS/2 typo</text>
      <text x="210" y="149">baseline</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">
    上方三条是三组的上伸，下方三条是对应的下伸 / descent（虚线样式相同的是一组）。哪一组算数取决于 `fsSelection` 的第 7 位。
  </figcaption>
</figure>

## post：斜体与下划线 {#post}

| 字段 | 说明 |
| --- | --- |
| `italicAngle` | 斜体倾角，单位是度，**逆时针为正**；右倾的斜体是负值（常见 −12） |
| `underlinePosition` | 下划线**顶部**到基线的距离，**负数表示在基线以下** |
| `underlineThickness` | 下划线粗细 |
| `isFixedPitch` | 是否等宽字体 |
| Glyph names | 版本 2.0 才有，字形名字（`A`、`uni4E2D` 这类） |

`italicAngle` 常被当作是不是真斜体的旁证：真斜体几乎都写了非零角度，而从正体直接倾斜的伪斜体会写 0 或者随便写一个值。它不能当唯一依据，但和 `fsSelection` 一起看比只看名字可靠。

## 三个符号方向别搞反 {#signs}

这是[度量图](/docs/how-to-read-metrics)里最容易画错的地方：

| 值 | 实际方向 |
| --- | --- |
| `hhea.descender` | 负（基线以下） |
| `OS/2.sTypoDescender` | 负 |
| `OS/2.usWinDescent` | **正**（这是向下多少，不是坐标） |
| `post.underlinePosition` | **负**（基线以下） |
| `post.italicAngle` | 负 = 向右倾 |

本站把这些符号统一折算成同一套“y 向上为负”的字体坐标再画，所以只翻一次。两套方向混着用，图就会整体上下颠倒或者镜像。

## 三张表都不管的事 {#not-here}

- 有没有某个字符：看 `cmap`；
- 一共有多少字形：看 `maxp`；
- 字重、x 高度：看 `OS/2`。

## 延伸阅读

- OpenType 规范：`head`、`hhea`、`post` 三节
- Apple TrueType Reference Manual：`head` / `post` 的原始定义
