---
title: vertical-align
keywords: vertical-align, 基线, 行盒, inline-block, 图片底部, baseline, middle
description: 该属性影响行内元素相对基线的位置，不能用于垂直居中。也解释了图片底部那道缝。
section: dev
order: 8
updated: 2026-11-02
draft: false
---

`vertical-align` 的名字起得很糟：它让人以为能“垂直对齐任何东西”，实际上它**只对行内元素与表格单元格**起作用，而且参照的是**基线**，不是容器的中心。

给块级 `div` 写 `vertical-align: middle` 不会产生任何效果，这是最常见的误用。

## 只管行内元素 {#inline-only}
<!-- hint: vertical-align | vertical-align 只对行内元素和表格单元格有效。它对齐的是行框与基线，不是容器。 -->

生效的对象：

- 行内元素（`inline`）；
- 行内块（`inline-block`）与替换元素（图片、`<video>`、`<input>`）；
- 表格单元格（`td` / `th`），这是另一套语义，本文不展开。

不生效的：块级元素、flex / grid 的**子项**（那些用 `align-items` / `align-self`）。

所以判断它有没有用，先看目标是不是“一行里的小东西”。

## 取值 {#values}

| 值 | 含义 |
| --- | --- |
| `baseline` | 默认。元素自己的基线对齐到父级行盒的基线 |
| `middle` | 元素的中线对齐到“基线 + x 高度的一半” |
| `text-top` / `text-bottom` | 对齐到父级**内容区**的顶 / 底 |
| `top` / `bottom` | 对齐到**行盒**的顶 / 底 |
| `sub` / `super` | 下移 / 上移一点（具体偏移由浏览器与字体决定） |
| `<length>` | 相对基线上下移动（正数向上） |
| `<percentage>` | 相对 `line-height` 的百分比移动 |

`top` / `bottom` 与 `text-top` / `text-bottom` 的区别经常被忽略：前者看**行盒**（包含行高撑出来的空白），后者看**内容区**（字体上下伸围出的那块）。行高很大时，两者差得很远。

## 基线在哪，由谁决定 {#baseline}

行盒的基线不是一个固定高度的线，而是由**参与这一行**的内容算出来的：

- 有文字时，取文字所在字体的基线；
- 只有 `inline-block` 时，取它**内部最后一个行盒**的基线；
- 如果 `inline-block` 里没有内容（或 `overflow` 不是 `visible`），它的基线就是**底边**。

最后一条是很多“莫名其妙的偏移”的来源。

## middle 不是垂直居中 {#middle}

`middle` 的定义是“元素的垂直中点对齐父级基线 + 半个 x 高度”。它让图标与文字看起来对齐，但**不是**让元素在容器里居中。

想在容器里垂直居中：用 flex（`align-items: center`）或 grid。这也是为什么现代布局里 `vertical-align` 基本只用来做**行内对齐**。

## 图片底部那道缝 {#image-gap}

最经典的坑：

```html
<div><img src="photo.jpg" alt=""></div>
```

图片下方会出现几像素的空白。原因：`<img>` 是行内替换元素，默认 `vertical-align: baseline`，它坐在基线上，而基线下方还留有**降部空间**（供 `g`、`p` 的尾巴使用）。

三种消法：

```css
img { display: block; }              /* 最干脆，图片不再参与行内排版 */
img { vertical-align: top; }         /* 或者 middle / bottom */
div { line-height: 0; }              /* 或者把行高归零（小心影响其它内容） */
```

推荐 `display: block`：图片本来就不是文字，别让它参与行盒。

## 在本站怎么试 {#example}

下面两个方块是 `inline-block`，默认坐在基线上。换选项看它们相对文字移动：

{{InteractiveExample("CSS Demo: vertical-align")}}

```css interactive-example-choice
.box { vertical-align: baseline; }
```

```css interactive-example-choice
.box { vertical-align: middle; }
```

```css interactive-example-choice
.box { vertical-align: text-bottom; }
```

```css interactive-example-choice
.box { vertical-align: top; }
```

```css interactive-example-choice
.box { vertical-align: bottom; }
```

```html interactive-example
<div id="example-element">
  <span class="box"></span><span class="box"></span>文字 x
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
  line-height: 2.2;
}

.box {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 6px;
  background: currentColor;
  opacity: 0.25;
}
```

注意选项里写的是 `.box { … }` 这种**完整规则**：`vertical-align` 要作用在方块上，而不是外层那个 `div`。

## 本站的排版预览为什么没有这一项 {#this-site}

一期的排版预览只渲染**一整块文本**，里面没有行内元素，`vertical-align` 无从作用，因此当时没有实现这一项。

要用到它的地方（图标与文字对齐、图片与说明文字对齐），本来也不该在排版测试里调，而是在组件里写死。

## 延伸阅读

- MDN：`vertical-align`
- CSS Inline Layout 规范：行盒、基线与 `vertical-align`
- 本站：[line-height](/)css-line-height)、[合成与杂项](/)css-text-misc)
