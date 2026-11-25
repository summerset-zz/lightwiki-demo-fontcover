---
title: font-weight
keywords: font-weight, bold, 粗体, 字重, 数值, 合成粗体
description: normal 是 400、bold 是 700；数值是想要的粗细，浏览器再按规则挑一个最接近的 face。
section: dev
order: 2
updated: 2026-11-02
draft: false
---

`font-weight` 表达的是想要多粗，不是选哪个文件。你写 700，浏览器去 `@font-face`（或系统字体）里找声明为 700 的 face；找不到，就按一套固定规则挑最接近的，再不行就**合成**一个。

## 关键字与数值 {#values}

| 关键字 | 等价数值 |
| --- | --- |
| `normal` | 400 |
| `bold` | 700 |

数值范围 1–1000（这些数字有多可靠，见[字重与字宽](/)weights-widths)）。传统上只用 100 的倍数（100 Thin … 900 Black），CSS Fonts 第 4 版起允许任意整数，但**能否真的画出来**取决于字体是否包含该粗细：静态字体只有离散的几个值，变量字体才有连续区间。

同一个句子换个字重看看：

{{InteractiveExample("CSS Demo: font-weight")}}

```css interactive-example-choice
font-weight: 300;
```

```css interactive-example-choice
font-weight: 400;
```

```css interactive-example-choice
font-weight: 700;
```

```css interactive-example-choice
font-weight: 900;
```

```html interactive-example
<div id="example-element">
  Grumpy wizards make toxic brew for the evil queen and jack.
</div>
```

```css interactive-example
#example-element {
  font-family: system-ui, sans-serif;
  font-size: 1.25rem;
}
```

系统字体不一定有 300 / 900 这两档：看到的那一档若是描边加粗、字宽没变，就是浏览器**合成**出来的（见[没有粗体时会合成](#synthesis)）。

## bold 不是更粗一点 {#aliases}

`bold` 就是 700 这个数值的别名，不是在当前基础上加粗。写了 `font-weight: bold` 而父级是 600，结果仍然是 700，不是 800。

真正相对父级变化的是 `bolder` / `lighter`：它们按父元素的**计算值**查一张映射表，跳一档。这张表在 CSS Fonts 规范里，写死几个档位，所以连续用 `bolder` 几次的效果并不是线性的。

## 浏览器怎么挑最接近的 face {#matching}

简化成三条（细节见 CSS Fonts 的 font matching 一节）：

- 请求在 400–500 之间：先往上找到 500 为止，再往下找，最后找 500 以上的；
- 请求小于 400：先往更细找，再从更粗找；
- 请求大于 500：先往更粗找，再往更细找。

关键结论：**声明 400 和 700 两个 face 时，`font-weight: 500` 会拿到 400**（因为 400 落在先往上找的范围内且更近）。所以想做 Medium，就得真的声明一个 500 的 face。

## 变量字体 {#variable}

```css
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
}
```

之后 `font-weight: 350`、`427` 都有效，因为它们落在 100–900 区间内，渲染引擎会插值。

这也是 `font-weight: 400 700` 这种**区间写法只出现在 `@font-face` 里**的原因：那是这个文件覆盖 400 到 700，而普通规则里的 `font-weight` 只能是单值。

## 没有粗体时会合成 {#synthesis}

如果只声明了 400 却要求 700，浏览器会按需加粗描边，称为合成粗体（synthetic bold）。没有斜体时同样会合成倾斜。

合成出来的效果通常很糟：笔画粘连、字宽不变、字重不协调。所以：

```css
body {
  font-synthesis: none;
}
```

表示“宁可不要粗体，也别合成”。本站的排版预览区就是这样设置的，预览需要显示字体的真实样子，而不是浏览器加工后的结果。

## 继承与计算值 {#inherit}

`font-weight` 会继承。`bolder` / `lighter` 依赖**父元素的计算值**，所以把它写在嵌套结构里时，结果取决于祖先链，而不是你眼前那个元素。

调试时看开发者工具的 Computed 面板：那里显示的才是最终用来匹配 face 的数值。

## 延伸阅读

- MDN：`font-weight`
- CSS Fonts 规范：font matching algorithm 与 `font-synthesis`
