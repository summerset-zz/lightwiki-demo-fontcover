---
title: 特性开关
keywords: font-feature-settings, font-variant, tnum, smcp, 特性, 等宽数字
description: 两套写法做同一件事。优先用哪一套，以及为什么 font-feature-settings 会把 font-variant 覆盖掉。
section: dev
order: 6
updated: 2026-11-02
draft: false
---

开启 OpenType 特性有两套 CSS：语义化的 `font-variant-*` 家族，和底层的 `font-feature-settings`。它们最终都落到同一批四个字母的标签上，但行为不同。

## 语义化的一套 {#variants}

| 属性 | 常用值 | 对应标签 |
| --- | --- | --- |
| `font-variant-ligatures` | `no-common-ligatures`、`discretionary-ligatures` | `liga`、`dlig` |
| `font-variant-numeric` | `tabular-nums`、`oldstyle-nums`、`slashed-zero`、`diagonal-fractions` | `tnum`、`onum`、`zero`、`frac` |
| `font-variant-caps` | `small-caps`、`all-small-caps`、`petite-caps` | `smcp`、`c2sc`、`pcap` |
| `font-variant-position` | `sub`、`super` | `subs`、`sups` |
| `font-variant-east-asian` | `proportional-width`、`ruby` | `palt`、`ruby` |

它们可以组合：

```css
.table-cell {
  font-variant-numeric: tabular-nums slashed-zero;
}

.quote {
  font-variant-caps: small-caps;
}
```

语义化的好处：可继承、可叠加、可被后面的规则覆盖，读起来也自解释。

开关换一换。⚠️ 字体没有实现某个特性时，点下去**看不出变化**，这本身就是要说明的一点：CSS 只是开关，字体里没有的替换不会凭空出现。

{{InteractiveExample("CSS Demo: font-variant-*")}}

```css interactive-example-choice
font-variant-numeric: normal;
```

```css interactive-example-choice
font-variant-numeric: tabular-nums;
```

```css interactive-example-choice
font-variant-numeric: slashed-zero;
```

```css interactive-example-choice
font-variant-caps: small-caps;
```

```css interactive-example-choice
font-variant-ligatures: none;
```

```html interactive-example
<div id="example-element">
  0123456789 · 100
  <br>
  Office affair fi fl
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 20px;
  font-family: system-ui, sans-serif;
}
```

## 底层的一套 {#feature-settings}

```css
.code {
  font-feature-settings: "liga" 0, "calt" 0;
}
```

标签**必须加引号**（是字符串），值 `1` 开、`0` 关。

它的问题不是语法，而是**优先级**：`font-feature-settings` 是直接指定，一旦写了，它就会覆盖由 `font-variant-*` 展开出来的设置。于是容易出现：

```css
.a { font-variant-numeric: tabular-nums; }
.b { font-feature-settings: "ss01"; }   /* 继承自 .a 的 tnum 可能失效 */
```

同一个元素上两者都写时，以 `font-feature-settings` 为准。

## 该用哪个 {#which}

- 有对应的 `font-variant-*` 值 → **用它**；
- 没有的（`ss01`–`ss20`、`salt`、厂商自定义标签） → 只能用 `font-feature-settings`；
- 在一个元素上混用两者时，把 `font-feature-settings` 限制在语义化写法表达不了的标签上。

## font-kerning 与 "kern" {#kern}
<!-- hint: kerning | kerning 是两个特定字符之间的字距微调，例如 A 与 V。font-kerning: none 会关闭它。 -->

`font-kerning` 是独立属性，控制字体自带的字偶距：

```css
body {
  font-kerning: normal;   /* 默认，启用 */
}
```

它相当于 `"kern"` 的高层写法，但**不要**在 `font-feature-settings` 里重复写 `"kern"`。两者冲突时的行为取决于浏览器实现，不必冒险。

## 一个常见误解 {#mistake}

“我写了 `font-variant-caps: small-caps`，为什么看起来是缩小的大写？”

因为字体里没有 `smcp`，浏览器做了**合成**：把大写字母按比例缩小、加粗一点。它看起来像小型大写，但笔画比例与真正的小型大写不同。

确认方法：查这个字体的 `GSUB` 里有没有 `smcp`；或者 `font-synthesis: none` 关掉合成，看它是否还能显示。

## 支持度 {#support}

`font-variant-*` 与 `font-feature-settings` 在现代浏览器里都支持良好；差别在于**字体是否包含那些特性**：CSS 只是开关，字体里没有的替换不会凭空出现。

## 延伸阅读

- MDN：`font-variant-*`、`font-feature-settings`、`font-kerning`
- CSS Fonts 规范：`font-variant` 属性与特性标签的映射
- 本站：[GSUB 与 GPOS](/docs/gsub-gpos)、[OpenType 特性](/docs/opentype-features-design)
