---
title: font-family
keywords: font-family, 回退栈, 字体回退, 通用族, sans-serif, system-ui, 字体列表
description: 它是一串候选，不是一个字体名。为什么末尾必须写通用族，以及本机装了为什么不等于网页会生效。
section: dev
order: 0
updated: 2026-11-02
draft: false
---

`font-family` 的值是一个**有序的候选列表**。浏览器从第一个开始找：找得到就用，找不到就试下一个，直到撞上末尾那个由浏览器决定的类别。

## 它是一个列表 {#list}
<!-- hint: font-family | font-family 是一个列表。浏览器按顺序使用第一个可用的字体，末尾的通用族（如 sans-serif）负责兜底。 -->

```css
body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}
```

这条声明读作：“如果有 Inter 就用 Inter；没有就用苹方；再没有就用微软雅黑；系统界面字体也行；实在不行用任意无衬线字体。”

顺序就是优先级，**不要**把它理解成这些字体混排。混排是回退机制在**字符级**做的事（见下）。

## 末尾的通用族 {#generic}

`serif`、`sans-serif`、`monospace`、`cursive`、`fantasy`、`system-ui`、`ui-monospace` 这些不是字体名，而是**类别**，由浏览器或操作系统挑一个具体字体。

不写通用族的后果不是没效果，而是回退到了浏览器的默认值。这个默认值在不同浏览器里不一样，于是排版的行高与字宽也跟着变。所以列表**永远**以通用族收尾。

具体字名可能不存在，但通用族一定存在。下面四条把类别换一遍，看字形怎么变。

{{InteractiveExample("CSS Demo: font-family")}}

```css interactive-example-choice
font-family: serif;
```

```css interactive-example-choice
font-family: sans-serif;
```

```css interactive-example-choice
font-family: monospace;
```

```css interactive-example-choice
font-family: system-ui;
```

```html interactive-example
<div id="example-element">
  同一句话，四种类别。The quick brown fox jumps over the lazy dog.
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
}
```

## 引号与名字 {#quoting}

- 字体名里有空格（`Microsoft YaHei`）或数字开头时，要加引号；
- 没有空格也可以加引号（`'Arial'`），加引号不会错，只是多余；
- 名字匹配**大小写不敏感**，但不要依赖这一点去写 `arial`；
- 别在名字里写 Bold：`font-family: 'Inter Bold'` 只在系统真把它注册成独立家族时才有效。粗细用 `font-weight` 表达。

## 本机装了 ≠ 网页会生效 {#local}

`font-family: 'Inter'` 只在两种情况下生效：

1. 访客机器上装了 Inter；
2. 或者你的页面用 `@font-face` 定义了一个叫 Inter 的字体族（见 [@font-face 逐项](/docs/css-font-face)）。

你自己电脑上装了，不代表访客装了。这也是本站“生成 CSS”的提示所讲的：那里生成的 `font-family` 写的是**你本机的字体名**，只能参考，直接粘到线上页面，访客机器上多半没有那个字体。

## 回退是按字符发生的 {#fallback}

如果 Inter 里没有“中”这个字，浏览器不会整行换成别的字体，而是**只把这一个字符**交给列表里下一个有它的字体。于是同一行里可能同时出现两种字体，行高与基线也可能对不上。

这解释了两种常见现象：

- 中英混排时中文看起来跳或挤。中文来自回退字体，它的上下伸与西文不同；
- 某个生僻字或 emoji 突然变了样子。那是回退链里某个字体接住了它。

## 一个能用的写法 {#example}

```css
:root {
  --font-sans: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
}

body {
  font-family: var(--font-sans);
}

code, pre {
  font-family: var(--font-mono);
}
```

把栈定义成自定义属性，全站只有一处需要改；等宽字体单独一条，别让代码块跟着正文一起换。

## 延伸阅读

- MDN：`font-family`
- CSS Fonts 规范：family name matching 与 generic font families
