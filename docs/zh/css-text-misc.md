---
title: 合成与杂项
keywords: font-synthesis, font-size-adjust, letter-spacing, word-spacing, 词距, text-indent, 缩进, 首行缩进, 悬挂缩进, indent, vertical-align, text-rendering, text-decoration, 下划线, underline, 字体合成
description: font-synthesis、font-size-adjust、word-spacing、vertical-align 等几个相互独立但常被混用的属性。
section: dev
order: 7
updated: 2026-11-02
draft: false
---

这篇文章收几个零碎但常用的属性。它们没有共同主题，唯一的共性是**经常被误用**。

## font-synthesis：别让浏览器造假 {#synthesis}
<!-- hint: 合成粗体 | 字体没有粗体时，浏览器会自行加粗。加粗结果是计算出来的，笔画容易粘连。 -->

字体没有粗体、没有斜体时，浏览器可以现场合成：

```css
body {
  font-synthesis: none;
}
```

含义是宁可不要粗体，也别合成。合成出来的粗体是描边加粗，字宽不变、笔画粘连；合成斜体是整体倾斜，字重与光学尺寸都不对。

本站的排版预览区设置了 `font-synthesis: none`，预览需要显示字体的真实样子，而不是浏览器加工后的结果。

反过来，如果某个页面**必须有**粗体而字体只有 400（比如中文只有 Regular），那就得手动指定一个更粗的字体，而不是指望合成。

## font-size-adjust：按 x 高度对齐字号 {#size-adjust}

不同字体的 x 高度差异很大，同一字号看起来大小不同。`font-size-adjust` 按 x 高度归一：

```css
.fallback {
  font-size-adjust: 0.5;
}
```

数值 = x 高度 ÷ 字号。浏览器会把实际字号调整到 x 高度与这个比例一致。

实际用途：**回退字体与网页字体视觉大小不一致**时，给它一个接近网页字体的值，减少文字跳动。但它只调整字号，不调整字宽，所以只能缓解、不能消除布局位移。

（`font-size-adjust` 与 `@font-face` 里的 `size-adjust` 描述符不同：后者缩放的是字体本身。）

## word-spacing 与 letter-spacing {#spacing}

- `letter-spacing`：字符之间（实际是每个字符之后）；
- `word-spacing`：**词**之间（按空格计）。

中文没有空格，所以 `word-spacing` 对纯中文文本几乎无效；`letter-spacing` 对中文有效，但会破坏方块感，只适合标题。

两者都会影响每行的字符数，调完之后要重新看换行。

## text-indent：首行缩进与悬挂缩进 {#indent}

`text-indent` 只作用于**块的第一行**：

```css
p {
  text-indent: 2em;
}
```

- 用 `2em` 而不是 `32px`：换字号时它自己跟着变；
- 想“缩进两个**字符**”（中文的习惯说法），准确的单位是 `ic`（水字宽），`2ic` 在中文里就是两个字。`ic` 比较新，支持不稳时退回 `2em`；
- 英文排版的惯例是**不缩进 + 段间留白**，中文是**缩进两字 + 段间不留白**。两种不要混着用，混了会显得两边都不对。

悬挂缩进（第一行顶格、其余行缩进）CSS 没有专门的属性，用两个值拼出来：

```css
.hanging {
  padding-left: 2em;
  text-indent: -2em;   /* 第一行往左顶回去 */
}
```

负值的绝对值不要大于 `padding-left`，否则第一行会跑到内容框外。列表、定义、参考文献条目都在用这个组合。

三档对比：0 是正文，`2em` 是中文段落，第三档是悬挂缩进，注意**第一行**与其余行的区别。

{{InteractiveExample("CSS Demo: text-indent")}}

```css interactive-example-choice
text-indent: 0;
```

```css interactive-example-choice
text-indent: 2em;
```

```css interactive-example-choice
padding-left: 2em;
text-indent: -2em;
```

```html interactive-example
<div id="example-element">首行缩进只作用于块的第一行：其余各行仍然从左边缘开始。悬挂缩进正好相反：第一行顶格，其余各行整体向右缩进，条目式排版常用它。</div>
```

```css interactive-example
#example-element {
  max-width: 20em;
  outline: 1px dashed currentColor;
  outline-offset: 6px;
}
```

名字很像但不是一回事的：`hanging-punctuation` 让标点悬挂到行外（避头尾的一种做法），目前只有 Safari 支持，不能当排版手段用。

## vertical-align：只对行内元素有意义 {#vertical-align}

`vertical-align` 调整**行内元素相对于基线的位置**，不是布局工具：

```css
sup { vertical-align: super; font-size: 0.75em; }
.icon { vertical-align: -0.125em; }
```

想让一个块垂直居中，用 flex / grid；`vertical-align: middle` 对一个 `div` 通常什么也不会发生。
一期做排版测试时这一项是**故意没做**的：单块文本里没有行内元素，它无从作用。

取值、`inline-block` 的基线怎么定、图片底部那道缝怎么消，展开在 [vertical-align](/docs/css-vertical-align)。

## text-rendering：基本别碰 {#text-rendering}

```css
body {
  text-rendering: optimizeLegibility;
}
```

这个属性历史上被用来“开启更好看的排版”，但：

- 它的行为没有规范定义，各浏览器不同；
- 可能触发性能开销（旧版 Safari 上有明显案例）；
- 连字、字偶距现在都有专门的属性，不需要它。

新项目里不写它是最稳的选择。

## 下划线 {#underline}

```css
a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

`text-underline-offset` 让下划线与文字拉开一点，`text-decoration-thickness` 控制粗细。它们比用 `border-bottom` 模拟下划线更正确，因为后者不随字体度量变化，行高改变时会错位。

## 小结 {#summary}

| 想做的事 | 用什么 | 别用 |
| --- | --- | --- |
| 没有粗体时不造假 | `font-synthesis: none` | 指望合成 |
| 回退字体大小不一致 | `font-size-adjust` | 手动改字号 |
| 字距 / 词距 | `letter-spacing` / `word-spacing` | `padding` 挤字 |
| 图标与文字对齐 | `vertical-align` | `position: relative` 手调 |
| 下划线 | `text-decoration-*` | `border-bottom` |
| 垂直居中 | flex / grid | `vertical-align` |

## 延伸阅读

- MDN：`font-synthesis`、`font-size-adjust`、`vertical-align`、`text-decoration`
- CSS Fonts 规范：`@font-face` 的 `size-adjust` 与 `font-size-adjust`
- 本站：[font-weight 与 bold 的对应](/docs/css-font-weight)
