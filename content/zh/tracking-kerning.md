---
title: 字距与字偶距
keywords: 字距, 字间距, tracking, letter-spacing, 字偶距, kerning, AV
description: 一个整体加宽、一个成对修正。设计师说“松一点”时，指的是哪一个？
section: design
order: 2
updated: 2026-11-07
draft: false
---

这两个词都跟字与字之间的距离有关，但作用范围完全不同：**tracking 是整体均匀地加减**，**kerning 是只修正特定的字符对**。在软件里它们常常是两个不同的输入框，在 CSS 里则是 `letter-spacing` 与 `font-kerning`。

## tracking：整体松紧 {#tracking}
<!-- hint: tracking | tracking 对整段文字统一增减字距，与调整特定字符对的 kerning 不同。 -->

**字距**（tracking）把一段文字里所有字之间的距离一起加大或减小。它的用途是补偿字号：

- 大字号（标题、海报）通常需要**负 tracking**，因为字大了之后，原本的设计间距看起来会变松；
- 小字号（注释、图注）需要**正 tracking**，否则字会糊在一起。

CSS 里对应 `letter-spacing`：

```css
.display {
  font-size: 64px;
  letter-spacing: -0.02em;
}

.caption {
  font-size: 12px;
  letter-spacing: 0.01em;
}
```

用 `em` 而不是 `px`，这样换字号时比例不变。

⚠️ 一个 CSS 的细节：`letter-spacing` 是加在**每个字符之后**（包括最后一个），所以居中或右对齐的文本会显得偏左或偏右一点，多出来的那点空隙确实存在。

先在几行字上看整体松紧，再看成对修正：最后一条关掉 kerning，`WAVE`、`To` 里的缝隙会变大。

{{InteractiveExample("CSS Demo: letter-spacing")}}

```css interactive-example-choice
letter-spacing: -0.04em;
```

```css interactive-example-choice
letter-spacing: 0;
```

```css interactive-example-choice
letter-spacing: 0.12em;
```

```css interactive-example-choice
font-kerning: none;
```

```html interactive-example
<div id="example-element">
  WAVE AVATAR To Yo
  <br>
  中文字距不受 kerning 影响
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 26px;
  font-family: Georgia, serif;
}
```

## kerning：成对修正 {#kerning}

**字偶距（kerning）**只调整某些**特定的字符对**。最典型的是 `AV`、`To`、`TA`、`yo`：它们的形状天然会形成一块过大的空白，字体设计师会为这些组合单独写一个负值。

它在字体文件里存在 `GPOS` 表的 `kern` 特性里（见 [GSUB / GPOS](/docs/gsub-gpos)），也有极老的字体把它放在单独的 `kern` 表里。

CSS 里对应 `font-kerning`：

```css
body {
  font-kerning: normal;   /* 默认，启用字体自带的 kerning */
}
```

关掉它一般只会让排版更差，除非你在做代码或表格这类需要严格等距的场景。

<figure style="margin: 1.75rem 0">
  <div
    style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.75rem 1.5rem; align-items: baseline; font-family: Georgia, 'Times New Roman', serif; font-size: 26px"
  >
    <div style="white-space: nowrap">AVATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">正常</div>
    <div style="letter-spacing: 9px; white-space: nowrap">AVATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">tracking：整体加宽</div>
    <div style="white-space: nowrap"><span style="margin-right: 26px">A</span>VATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">kerning：只拉开 AV</div>
  </div>
  <figcaption style="margin-top: 0.75rem; font-size: 0.8125rem; opacity: 0.65">
    第二行把每个字的间距一起加大；第三行只动了 A 与 V 那一处。
  </figcaption>
</figure>

## 字偶距是怎么存的 {#kerning-values}

<!-- source: en.wikipedia.org | Kerning | 1383272575 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 摘译 Kerning values / Kerning tables / Contextual kerning 三节；只保留单位、两代存法与上下文调整 -->

字偶距在字体里就是**一个数**：正数加大距离，负数收紧，而且绝大多数是负数。单位是字体自己的单位（一 em 分成 1000 或 2048 份，见 [字形与 em 方框](/docs/glyph-outline-and-em)），所以同一个数值在不同字体里代表的实际距离并不相同。

存的地方有两代：

| 位置 | 出现年代 | 说明 |
| --- | --- | --- |
| `kern` 表 | TrueType 时代 | 一条记录 = 一对字符 + 一个数值；典型几百对，多的上千对 |
| GPOS 的 `kern` 特性 | OpenType | 结构复杂得多（查找、子表、类别），能表达按类别成组、看上下文的规则 |

所以判断一个字体“做没做字偶距”不能只看有没有 `kern` 表：CFF 轮廓的 OpenType 根本没有这张表，[Adobe](/credits/maker/adobe-systems) 近年的字体也只走 GPOS。

再进一步是**上下文字偶距**（contextual kerning）：调整不只依赖前一个字，还依赖后一个字。典型例子是引文结尾的 `f.”` —— 中间那个句点会把 `f` 与右引号的间距压掉，单看这两个字符反而是合适的。

## 浏览器里什么时候生效 {#kerning-browsers}

<!-- source: en.wikipedia.org | Kerning | 1383272575 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | 摘译 Kerning in browsers 一节；按现行 CSS 重写，删去原文的浏览器版本罗列 -->

```css
/* 默认值：让浏览器自己决定 —— 小字号下有的引擎会关掉字偶距保可读性 */
font-kerning: auto;

/* 字体有声明的成对调整就一律用 */
font-kerning: normal;

/* 明确不要 */
font-kerning: none;
```

`text-rendering: optimizeLegibility` 是老办法，确实能开字偶距，但也顺带改别的（连字、性能），如今没必要再拿它管字偶距。`font-feature-settings: "kern"` 是“直接点名特性”的写法，效果接近 `font-kerning: normal`，但字体没有该特性时它会静默无效。

## 怎么听出别人在说哪一个 {#which}

一句简单的判据：

- 整段看起来太松/太紧 → **tracking**；
- 这两个字母之间的缝太大 → **kerning**。

设计稿里标 `AV` 需要收紧，是 kerning；说正文 -10 是 tracking。

## 中文与混排 {#cjk}

中文没有 kerning 的概念：汉字是等宽的字面框，不需要成对修正。中文排版里说的字距更接近 tracking，而且还要考虑：

- **全角标点**：句号、逗号自带半角空白，和西文字符挤在一起时会显得空；
- **中西混排**：需要在汉字与西文之间加一点空隙（CSS 的 `text-spacing-trim` / `text-autospace` 在做这件事，但支持度不一）；
- **避头尾**：标点不能出现在行首或行尾，属于换行规则，与间距无关。

这也是中文排版照抄西文的 tracking 数值会很难看的原因。

## 在本站怎么调 {#this-site}

排版预览里有字距控制，单位是 `em`，作用就是 `letter-spacing`，所以在那里看到的效果就是 CSS 里写 `letter-spacing` 的效果。

kerning 是字体自带的，本站不提供开关；它默认开着（浏览器默认 `font-kerning: auto`，对有 `kern` 数据的字体生效）。

## 一个容易忽略的点 {#pitfall}

`letter-spacing` 加得越多，**每行容纳的字符就越少**，于是换行位置全变。调字距时不要只看一行，要看整段的行尾是否出现难看的断法。

## 延伸阅读

- MDN：`letter-spacing`、`font-kerning`
- OpenType 规范：`GPOS` 的 `kern` 特性
- 本站：[GSUB / GPOS](/docs/gsub-gpos)
