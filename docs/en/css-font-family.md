---
title: font-family
keywords: font-family, 回退栈, 字体回退, 通用族, sans-serif, system-ui, 字体列表
description: It is an ordered list of candidates, not "the font name" — and why the generic family at the end is not optional.
section: dev
order: 0
updated: 2026-11-02
draft: false
---

The value of `font-family` is an **ordered list of candidates**. The browser starts at the first one: if it finds it, it uses it; if not, it tries the next, until it reaches the final entry, which is a category the browser resolves itself.

## It is a list {#list}
<!-- hint: font-family | font-family is a list. The browser uses the first family it can find, with a generic family such as sans-serif as the backstop. -->

```css
body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}
```

Read as: "Inter if available; otherwise PingFang SC; then Microsoft YaHei; the system UI font is fine; failing everything, any sans-serif."

The order is priority. It does **not** mean "these fonts get mixed" — mixing is what the fallback mechanism does per character (see below).

## The generic family at the end {#generic}

`serif`, `sans-serif`, `monospace`, `cursive`, `fantasy`, `system-ui`, `ui-monospace` are not font names but **categories**, resolved by the browser or the operating system.

Omitting one does not mean "no effect": it means falling back to the browser's default, which differs between browsers — so line height and character width differ between environments. Always end the list with a generic family.

The named font may not exist, but a generic family always does — switch the category and watch the shapes change.

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
  One sentence, four categories. 中文也一样。
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
}
```

## Quotes and names {#quoting}

- Quote names containing spaces (`Microsoft YaHei`) or starting with a digit;
- Quoting a name without spaces (`'Arial'`) is harmless, just redundant;
- Matching is case-insensitive, but do not rely on it — write `Arial`, not `arial`;
- Never put "Bold" in the family name: `font-family: 'Inter Bold'` only works if the system registers that as its own family. Weight belongs in `font-weight`.

## Installed locally is not the same as used on the web {#local}

`font-family: 'Inter'` works in exactly two situations:

1. the visitor's machine has Inter installed;
2. or the page defines a family named Inter through `@font-face` (see [@font-face, descriptor by descriptor](/docs/css-font-face)).

Having it on your own machine proves nothing about visitors. That is exactly what this site's "generate CSS" note says: the `font-family` it produces names **your local fonts**, which is fine as a reference but wrong pasted into a live page.

## Fallback happens per character {#fallback}

If Inter lacks the character "中", the browser does not swap the whole line — it hands **that one character** to the next font in the list that has it. A single line can therefore mix two fonts, with different line heights and baselines.

Which explains two familiar symptoms:

- mixed Chinese and Latin text looks jumpy or cramped — the Chinese comes from a fallback font whose extents differ;
- a rare character or emoji suddenly changes shape — some font further down the stack caught it.

## A stack that works {#example}

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

Defining the stacks as custom properties leaves one place to change; keep the monospace stack separate so code blocks do not follow the body font.

## Further reading

- MDN: `font-family`
- CSS Fonts: family name matching and generic font families
