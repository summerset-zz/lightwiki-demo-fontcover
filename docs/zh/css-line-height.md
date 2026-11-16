---
title: line-height
keywords: line-height, 行高, 行距, 行间距, 无单位, 继承, half-leading, leading
description: 无单位数字、长度、百分比在继承上完全不同，这就是父级 1.5、子级字号变大后行距反而不对的原因。
section: dev
order: 3
updated: 2026-11-02
draft: false
---

`line-height` 决定一行文字占多高。它的四个取值里，有三个看起来接近，**但在继承时行为完全不同**。这是 CSS 中最常被踩到的问题之一。

## 四种值 {#values}
<!-- hint: 无单位数值 | 无单位数值按每个元素自身的字号重新计算；em 会随继承变成固定长度，两者结果不同。 -->

| 值 | 例子 | 含义 |
| --- | --- | --- |
| `normal` | `line-height: normal` | 由浏览器按字体度量给一个值，通常约 1.2 倍字号 |
| 数字 | `line-height: 1.5` | **字号的倍数**，计算时乘当前 `font-size` |
| 长度 | `line-height: 24px` | 固定高度，与字号无关 |
| 百分比 | `line-height: 150%` | 当前 `font-size` 的百分比，**计算成固定值** |

改一改下面这几条，就能看出前四种取值的差别：字号始终相同，变化的只有行高。

{{InteractiveExample("CSS Demo: line-height")}}

```css interactive-example-choice
line-height: normal;
```

```css interactive-example-choice
line-height: 2.5;
```

```css interactive-example-choice
line-height: 3em;
```

```css interactive-example-choice
line-height: 150%;
```

```css interactive-example-choice
line-height: 32px;
```

```html interactive-example
<div id="example-element">
  行高决定一行文字占多高。换左边的选项，同一段文字的行距就会松开或收紧，而字号一点没变。
</div>
```

```css interactive-example
#example-element {
  font-family: Georgia, serif;
  max-width: 200px;
}
```

## 继承上的差别才是重点 {#inherit}

假设父元素：

```css
.parent {
  font-size: 16px;
  line-height: 1.5;      /* 或 24px，或 150% */
}
.child {
  font-size: 32px;
}
```

| 父级写法 | 子元素继承到的 | 子元素最终行高 |
| --- | --- | --- |
| `1.5`（数字） | 数字 `1.5` 本身 | 32 × 1.5 = **48px** |
| `24px`（长度） | 24px | **24px**（比字号还小，会挤在一起） |
| `150%`（百分比） | 已算好的 24px | **24px**（同上） |

也就是说：**只有无单位数字是按比例传下去的**，长度与百分比在父元素那里就被算成了绝对值，再原样继承。

这就是父级写 `line-height: 1.5` 而标题放大字号后行距却不对的两种成因：要么父级写的是 `150%` / `1.5em`，要么标题自己又设了一个固定值。

## 行框是怎么搭出来的 {#box}

一行文字的高度不是字形的实际高度，而是一个**行框**（line box）：

1. 取字体的上伸与下伸，得到内容的自然高度；
2. 用 `line-height` 减掉这个高度，剩下的空隙**上下各分一半**（叫 half-leading）；
3. 所有行内盒按 `vertical-align` 对齐到基线上，行框取最高者。

所以 `line-height` 变大时，文字是**上下各撑开一点**，而不是只向下推。这也是两个不同字体混排时，即使 `line-height` 相同，视觉行距也可能不同的原因：它们的分母（字体上伸下伸）不一样。

<figure style="margin: 1.75rem 0">
  <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.5rem 1rem; align-items: center">
    <div style="border: 1px dashed currentColor; font-size: 20px; line-height: 1">Hg</div>
    <div style="font-size: 11px; opacity: 0.6; font-family: system-ui, sans-serif">line-height: 1</div>
    <div style="border: 1px dashed currentColor; font-size: 20px; line-height: 1.8">Hg</div>
    <div style="font-size: 11px; opacity: 0.6; font-family: system-ui, sans-serif">line-height: 1.8</div>
  </div>
  <figcaption style="margin-top: 0.75rem; font-size: 0.8125rem; opacity: 0.65">
    虚线框就是行框：高度等于 `line-height`，多出来的部分在内容区上下各分一半（half-leading）。第一行的字几乎贴着边框。
  </figcaption>
</figure>

## normal 到底是什么 {#normal}
<!-- hint: normal | line-height 的 normal 不是 100%，它等于上升、下降与行距之和，具体数值由字体决定。 -->

`normal` 不是 1.2，而是由浏览器按字体度量算一个值。规范给的是一个推荐算法（用字体的升部、降部与 lineGap），具体数值因浏览器与字体而异。

所以别把 `normal` 当常量：同一份 CSS 在 Chrome、Safari、Firefox 上可能得到不同的行距；换字体也会变。

## 实践写法 {#practice}

```css
:root {
  --leading-tight: 1.25;
  --leading-normal: 1.6;
}

body {
  font-size: 1rem;
  line-height: var(--leading-normal);
}

h1,
h2,
h3 {
  line-height: var(--leading-tight);
}
```

- 根元素用**无单位数字**，全站比例一致；
- 大标题单独给一个更紧的倍数（字号越大，需要的相对行距越小）；
- 需要精确对齐网格时（比如设计稿要求每行 24px），才用长度，并且要在**所有**影响字号的层上一起算。

## 和字体的关系 {#with-font}

字体文件里的 `hhea.ascender` / `descender` / `lineGap`（以及 `OS/2` 里的两组度量）决定了 1 倍行高的自然高度。想弄清为什么某个字体在高行高下显得松散，看 [head、hhea 与 post](/docs/head-hhea-post)。

## 延伸阅读

- MDN：`line-height`
- CSS Inline Layout 规范：行框与 half-leading
