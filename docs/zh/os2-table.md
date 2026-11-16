---
title: OS/2 表
keywords: OS/2, 字重, 字宽, fsSelection, x 高度, 上下伸, usWeightClass, typo 度量
description: 字重、字宽、斜体位、x 高度、上下伸，最常被检查器读取的一张表，也是最像兼容补丁合集的一张。
section: fields
order: 2
updated: 2026-11-02
draft: false
---

`OS/2` 原本是[微软](/credits/maker/microsoft)为了 Windows 排版给 TrueType 加的补充表（名字来自那个已经消失的操作系统）。今天它成了**描述一款字体有多重、多宽、多高的主表**，几乎所有排版软件都会读。

它也是一张典型的兼容补丁合集：不同版本往里加字段，旧字段的含义被新字段部分取代，所以同名概念往往有两套值。

## 字重与字宽 {#weight-width}

| 字段 | 取值 | 说明 |
| --- | --- | --- |
| `usWeightClass` | 1–1000 | 惯例是 100 的倍数：100 Thin、300 Light、400 Regular、500 Medium、700 Bold、900 Black |
| `usWidthClass` | 1–9 | 1 Ultra-condensed … 5 Normal … 9 Ultra-expanded |

`usWeightClass` 是**建议值**，不是刻度尺：字体设计师可以把 Regular 写成 400，也可以写成 350。所以同一款字体在不同系统里看起来粗细不一致，有时不是渲染问题，而是这个字段本来就填得不一样。

字宽是另一个维度：Condensed 版本通常 `usWidthClass` 更小，但家族名里也会写 `Condensed`。两个地方都要对得上，否则按字宽匹配的程序会挑错。

## fsSelection：斜体与粗体的开关 {#selection}
<!-- hint: fsSelection | fsSelection 保存斜体、粗体、下划线等样式标志位。系统和浏览器据此判断样式，不看名称。 -->

`fsSelection` 是一个位字段，常用的几位：

| 位 | 含义 |
| --- | --- |
| 0 | `ITALIC`：这一款是斜体 |
| 5 | `BOLD`：这一款是粗体 |
| 6 | `REGULAR`：常规字款（与上面两位互斥） |
| 7 | `USE_TYPO_METRICS`：请用 `sTypo*` 那组度量，而不是 `usWin*` |
| 8 | `WWS`：名字符合 WWS 规则 |

第 7 位是理解为什么同一个字体在 Mac 和 Windows 上行高不一样的关键：它明确告诉渲染器该信哪一组上下伸。没设这一位时，不同引擎的默认选择不同。

## 两组上下伸 {#metrics}

`OS/2` 里同时存在两套垂直度量，这是历史包袱：

| 字段 | 符号 | 来源 |
| --- | --- | --- |
| `sTypoAscender` / `sTypoDescender` / `sTypoLineGap` | 通常 ascender 正、descender **负** | 微软与苹果商定的排版用度量 |
| `usWinAscent` / `usWinDescent` | **都是正数** | 早期 Windows 用来裁切与滚动的边界，按最坏的拉丁字形取 |

所以本站度量图里，`winDescent` 要先取负才能画到基线以下。反过来说，看到下降部是正数不必以为读错了，那是这张表的规定。

## x 高度与大写高度 {#xheight}

版本 2 之后才有：

- `sxHeight`：小写 `x` 的高度；
- `sCapHeight`：大写字母的高度。

这两个值是**声明**，不是从轮廓量出来的。有的字体填得不准，有的干脆填 0。要让不同字体在同一字号下看起来一样大，正规做法是看真实的 x 高度，而不是信任这两个字段。

## 声明支持哪些字符 {#unicode-range}

`ulUnicodeRange1..4` 是 128 个位，用来大致声明这个字体覆盖了哪些区段（拉丁、希腊、CJK……）。`ulCodePageRange1..2` 类似，按代码页声明。

它们**不能**用来判断具体某个字符：位是区段级的，而且经常填得过宽。真要判断有没有这个字，只能读 `cmap`，本站的覆盖率就是这么算的。

## 其它零碎 {#misc}

- `achVendID`：四字节厂商代码（如 `APPL`、`GOOG`），不是商标声明；
- `panose`：十字节的风格指纹，用来做相似字体推荐，实践里常常全填 0；
- `fsType`：嵌入权限位（能否嵌入 PDF、是否只读嵌入），老字体里很常见禁止嵌入；
- `usFirstCharIndex` / `usLastCharIndex`：非符号字体的字符范围提示，同样只是提示。

## 本站怎么用它 {#this-site}

- 字重：直接显示 `usWeightClass`，并且在界面上标明它可能只是近似值；
- 斜体：看 `fsSelection` 的第 0 位，而不是看家族名里有没有 `Italic`；
- 度量图的上下伸：同时画 `hhea` 与 `OS/2` 两组，因为哪一组算数取决于渲染器。

## 延伸阅读

- OpenType 规范：`OS/2` 表（每个版本加了哪些字段写得很清楚）
- OpenType 规范：`OS/2` 表的 `fsSelection` 位定义与 `USE_TYPO_METRICS`
