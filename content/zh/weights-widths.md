---
title: 字重与字宽
keywords: 字重, 字宽, weight, width, Condensed, Thin, Black
description: 100–900 只是建议刻度，Light / Book / Medium / Demi 对不上固定数字。设计师该怎么读这些值。
section: design
order: 3
updated: 2026-11-02
draft: false
---

这个字体有几个字重，看起来是个简单问题，实际有三套说法同时在用：字体文件里的数值、家族名里的词、以及设计软件里显示的样式名。它们经常对不上。

## 数值是建议刻度 {#scale}
<!-- hint: 字重（usWeightClass） | usWeightClass 是 OS/2 表中 1 至 1000 的整数，惯例取 100 的倍数：100 为 Thin，400 为 Regular，700 为 Bold。它不是百分比，也不是字号。 -->

OpenType 用 `OS/2.usWeightClass` 表示粗细，范围 1–1000，**惯例**是 100 的倍数：

| 数值 | 常见叫法 |
| --- | --- |
| 100 | Thin / Hairline |
| 200 | Extra Light / Ultra Light |
| 300 | Light |
| 400 | Regular / Normal / Book |
| 500 | Medium |
| 600 | Semi Bold / Demi Bold |
| 700 | Bold |
| 800 | Extra Bold / Ultra Bold |
| 900 | Black / Heavy |

表里的叫法是惯例，不是标准。有的字体把 Regular 写成 400，有的写 350；有的 Book 是 400，有的 Book 是 350 而 Regular 是 400。

## 家族名里的词靠不住 {#names}

同一款字体的名字与数值可能不一致：

- 家族名写 `Medium`，`usWeightClass` 却是 500 以外的值；
- 名字里有 `Demi` 和 `Semi Bold` 两种写法；
- 有的厂商把 900 叫 `Ultra`，有的叫 `Black`，还有的叫 `Heavy`。

所以在按名字挑字体和按数值挑字体之间，**按实际渲染挑**最可靠。数值只是给程序用的近似标签。

## 字宽是另一根轴 {#width}
<!-- hint: 字宽（usWidthClass） | usWidthClass 是 1 至 9 的整数：1 最窄，5 为正常，9 最宽。它与字重是两个独立的维度。 -->

字宽（width / stretch）与字重是**两个独立的维度**：

| 说法 | `usWidthClass` | 常见名 |
| --- | --- | --- |
| 极窄 | 1 | Ultra Condensed |
| 窄 | 3 | Condensed / Narrow |
| 正常 | 5 | Normal |
| 宽 | 7 | Expanded |
| 极宽 | 9 | Ultra Expanded |

CSS 里对应 `font-stretch`（现在更多用百分比写法 `font-stretch: 75%`）。

## 变量字体让刻度变成连续区间 {#variable}

静态字体的字重是离散的几个点；变量字体在 `wght` 轴上是连续区间（通常是 100–900），任意数值都能渲染。

这带来一个实践变化：设计师不再需要从 5 个字重里挑，而是可以指定 437 这种值，但它**不保证**那个位置的形状好看，因为设计师只在几个关键点上校过。

## 与 CSS 的对应 {#css}

CSS 的 `font-weight` 数值（1–1000）会去找声明了同一数值的 face；找不到就按规则挑最近的，再不行就合成。

也就是说：**同一份 CSS 在不同字体上得到的粗细可能不同**，因为最近的 face 不一样。详见 [font-weight](/docs/css-font-weight)。

## 本站怎么显示 {#this-site}

检查器里的字重直接读 `usWeightClass`。如果这一项是从别处估算出来的（不是字体明确声明的），界面上会带一个 `≈` 号并给出说明。数值可以看，但不要当成精确事实。

字宽同理：有就显示，没有就留空，不猜。

## 选字体时的建议 {#advice}

1. 先看**实际渲染**（样例图或预览），不要只看名字；
2. 需要粗细对比时，确认家族里真的有这些字重，而不是靠浏览器合成；
3. 中文与西文字重若来自两个不同字体，注意它们的 500 / 600 未必对应同一视觉重量；
4. 变量字体优先看它有没有 `wght` 轴，以及轴的范围（有些只有 400–700）。

## 延伸阅读

- OpenType 规范：`OS/2` 的 `usWeightClass` 与 `usWidthClass`
- MDN：`font-weight`、`font-stretch`
- 本站：[font-weight 与 bold 的对应](/docs/css-font-weight)、[maxp 与变量轴](/docs/maxp-fvar-stat)
