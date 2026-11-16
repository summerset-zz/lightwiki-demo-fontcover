---
title: 排版测试：那块面板做了什么
keywords: 排版测试, 排版面板, TypeTester, 字号, 行高, 字距, em, 对齐, 禁止合成粗体, font-synthesis, 生成 CSS
description: 七个开关各自对应哪条 CSS、为什么字距用 em 而不用 px、关掉合成粗体是在看什么，以及两件故意没做的控制。
section: tools
order: 3
updated: 2026-11-08
draft: false
---

检查器的「排版」面板只做一件事：把这一款字放进一段真实文本里，让你改字号、行高、字距、对齐，看它排起来是什么样。它不是设计工具，也不替你做判断 —— 它负责**把变量摆出来**，判断还是你的事。

## 七个控制，各自对应一条 CSS {#controls}

| 面板上的东西 | 写进去的 CSS | 范围 |
| --- | --- | --- |
| Size | `font-size` | 12–96 px，步长 1 |
| Line height | `line-height` | 0.8–2.6，无单位 |
| Tracking | `letter-spacing` | −0.05–0.3 em，步长 0.005 |
| left / center / right | `text-align` | 三选一 |
| Keep spaces | `white-space: pre-wrap` | 开 / 关 |
| Uppercase | `text-transform: uppercase` | 开 / 关 |
| No synthetic bold | `font-synthesis: none` | 开 / 关 |

还有一个文本框：舞台上那行字就是它，默认是 `The quick brown fox…` 那一句，可以整段换成你自己的文字（中文更好 —— 拉丁字母的观感不能代表汉字）。

## 字距为什么是 em 而不是 px {#why-em}

字距是**相对字号**的量。0.05em 在 12px 上是 0.6px，在 96px 上是 4.8px，比例一致；写成 px 的话，换个字号就得重算一遍，而且换完之后看起来的松紧是两回事。

行高也一样：`line-height: 1.35` 这种**无单位**的写法，是「字号的倍数」，子元素继承的是倍数而不是某一刻算出来的像素值。写成 `21px` 就会被继承成固定的 21px，字号一变大就挤在一起 —— 这也是行高那一条要专门写一篇的原因，见 [行高与 leading](/docs/line-height-leading)。

## 关掉合成粗体，是在看什么 {#no-synthesis}

字重、斜体在 CSS 里只是一句声明。如果这个字体**没有**那一档，浏览器通常会自己「合成」一个：把轮廓整体加粗一点、或者倾斜一下 —— 看着像粗体，其实不是设计师画的那一档，字距、笔画交接、细节全都没被重画。

勾上 No synthetic bold（`font-synthesis: none`），浏览器就只能老实交代：**这一档有没有真的字形，一眼看得出来**。所以这个开关不是审美选项，是**验收工具**：判断一个家族是「四个真字重」还是「两个字重 + 两次合成」，靠它最快。字重的概念见 [字重与宽度](/docs/weights-widths)。

## 面板不假装 {#not-ready}

还没载入字体时，舞台仍然渲染（用页面自己的字体），控件照样能动 —— 那是为了让你看清每个开关在做什么。但面板顶上那行状态会明说「还没载入，下面的预览用的是页面自己的字体」，不会让你以为看到的是目标字体。

这也是[哪些字体可以测试](/docs/which-fonts-can-be-tested)那篇的前提：库里的字体没有字节，本机字体要授权，两条路都走不通时，这块面板就只能摆着控件。

## 两件故意没做的事 {#not-included}

- **`vertical-align`**：它是**行内元素**相对基线对齐，单块文本里没有意义 —— 要有多栏或图文混排才有用；
- **`word-wrap`**：那是旧名，现在写 `overflow-wrap`。而且预览区固定按词断行，因为这里要测的是字距、行高、对齐，不是「长单词怎么断」。

## 生成的那段 CSS {#css}

面板底部会给出可以直接复制的声明。两个细节：

- **只写非默认值**：`text-transform: none` 这种「什么都没变」的声明不写，免得贴到项目里一堆废话；
- **名字用真实家族名**：远程字体在浏览器里的注册名是内部标识，贴到你自己项目里应该写这个字的**真名**。

## 延伸阅读 {#further}

- [行高与 leading](/docs/line-height-leading)
- [字距与字偶距](/docs/tracking-kerning)
- [字重与宽度](/docs/weights-widths)
- [哪些字体可以测试](/docs/which-fonts-can-be-tested)
- [CSS：font-weight](/docs/css-font-weight)、[CSS：行高](/docs/css-line-height)
