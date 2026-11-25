---
title: 行高
keywords: 行高, 行距, leading, line height, 单倍行距
description: 铅条时代的词，今天说的是一行占多高。为什么单倍行高不是 100%，以及换字体行距为什么会变。
section: design
order: 1
updated: 2026-11-07
draft: false
---

**行高**（line height）是一行文字占的总高度；**行距**（leading）是行与行之间的空隙。两者说的是同一件事的两种记法：设计师习惯说行距 4pt，前端习惯说行高 1.5。

## 这个词从哪来 {#etymology}

铅字排版时，行与行之间要塞铅条来撑开距离，那根铅条叫 leading（读作“ledding”，因为铅是 lead）。数字排版里没有铅条了，但词留了下来。

于是设计师说加大行距，通常指**把行与行分开**；而前端写 `line-height: 1.5` 时，改的是**每次行盒的总高度**，效果一样，算法不同。

## 单倍行高不是 100% {#not-100}

`line-height: 1` 意味着行高等于字号，但文字会挤在一起，因为字体的上下伸加起来通常**超过**一 em（`b` 往上伸、`g` 往下伸，两者相加比一个 em 高）。

所以单倍行距在绝大多数软件里不是 1.0，而是约 1.15–1.2；浏览器 `normal` 大致落在这一带。

## 同样是「1.5 倍」，各家不一样 {#multipliers}

<!-- source: zh.wikipedia.org | 行距 | 94967753 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/deed.zh | 摘译“计量方式”一节；只保留 Word 的换算与版本差异 -->

同一个“倍”，在不同软件里指的不是同一个数：

| 说法 | 实际行距（相对字号） |
| --- | --- |
| Word 的“单倍行距” | 约 1.17 倍 |
| Word 的“1.5 倍行距” | 约 1.75 倍 |
| Word 的“双倍行距” | 约 2.33 倍 |
| CSS 的 `line-height: 1.5` | 1.5 倍 |

原因是 Word 的倍数以它自己的“基准行距”为单位，而基准随版本变过：Word 97 到 Word 2010 之间单倍行距默认约 1.15 em，之后改成约 1.08 em。所以“这段是 1.5 倍行距”这句话，从 Word 抄到 CSS 里就不再是原来的距离。

跨软件交付时稳当的做法是写**相对字号的倍数**（“行距 1.6”），而不是写软件里那个下拉项的名字。

## 两层行距 {#two-layers}

| 层 | 谁决定 | 在哪 |
| --- | --- | --- |
| 字体自带 | 字体设计师 | `hhea.lineGap`、`OS/2` 的 typo / win 两组度量 |
| 使用时的行高 | 排版的人 | CSS 的 `line-height`、设计软件的行距设置 |

字体自带的那一层是**建议值**：它告诉软件这个字体正常行距大概要留多少。软件通常会覆盖它。

换字体之后行距看起来变了，原因就在这里：你设的倍数没变，但字体的上下伸变了，行盒的自然高度跟着变。

同一段话，把行与行之间的距离拉开或收紧。这是设计稿上最常调整的一项，也是最有争议的一项。

{{InteractiveExample("CSS Demo: leading")}}

```css interactive-example-choice
line-height: 1.15;
```

```css interactive-example-choice
line-height: 1.4;
```

```css interactive-example-choice
line-height: 1.7;
```

```css interactive-example-choice
line-height: 2.2;
```

```html interactive-example
<div id="example-element">
  行高不是越大越好，也不是越小越紧凑。把行与行之间的距离拉开或收紧，同样一段话读起来的感觉就完全不同，这正是正文通常要 1.6–1.8 的原因。
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
}
```

## 要多大才合适 {#how-much}

没有固定答案，但有几条经验：

- **正文**：1.4–1.7；行长（每行字符数）越大，需要的行距越大，否则眼睛回到下一行会串行；
- **大标题**：1.05–1.25；字号越大，相对行距应该越小；
- **小字 / 注释**：1.3 左右，太松会失去整体感；
- **多栏窄栏**：行距可以略小，因为行长已经短了。

另一个常被忽略的因素是 **x 高度**：x 高度大的字体自带更多墨，同样 1.5 倍看起来会比 x 高度小的字体更挤。

## 在本站怎么看 {#this-site}

度量图里与行高有关的是三条水平线：

- `hhea ascender` / `descender`：字体自带的第一组；
- `OS/2 typo ascender` / `descender`：微软与苹果商定的排版用那组；
- `OS/2 win ascent` / `descent`：早期 Windows 的裁切边界。

加上各自的 line gap，就是这个字体自己能撑多高。数值都在表里，并附占一 em 的百分比。

想直接试效果，用排版预览调整行高最直观，它真的在渲染文字，不是示意图。

## 和 CSS 的对应 {#css}

CSS 里推荐用**无单位数字**（`line-height: 1.5`），它会随字号缩放；写成 `150%` 或 `24px` 则会在父元素处算成固定值，子元素放大字号后行距不跟着变。

具体的坑见 [line-height 的四种值](/)css-line-height)。

## 延伸阅读

- OpenType 规范：`hhea` 与 `OS/2` 的上下伸字段
- 本站：[head、hhea 与 post](/)head-hhea-post)、[度量图怎么读](/)how-to-read-metrics)
