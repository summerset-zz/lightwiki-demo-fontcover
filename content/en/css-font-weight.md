---
title: font-weight
keywords: font-weight, bold, 粗体, 字重, 数值, 合成粗体
description: normal is 400, bold is 700. The number says how heavy you want it; the browser then picks the closest declared face.
section: dev
order: 2
updated: 2026-11-02
draft: false
---

`font-weight` expresses "how heavy I want this", not "which file to use". Write 700, and the browser looks for a face declaring 700 among `@font-face` rules or system fonts. If there is none, it picks the closest by a fixed rule — and failing that, **synthesises** one.

## Keywords and numbers {#values}

| Keyword | Equivalent number |
| --- | --- |
| `normal` | 400 |
| `bold` | 700 |

The range is 1–1000 (how reliable those numbers are: [Weights and widths](/docs/weights-widths)). Traditionally only multiples of 100 were used (100 Thin … 900 Black); CSS Fonts 4 allows any integer, but **whether it can be drawn** depends on the font: static fonts have a few discrete weights, only variable fonts are continuous.

Same sentence, different weights:

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

System fonts do not always ship a 300 or a 900: if the step you picked looks stroked-on with unchanged width, the browser **synthesised** it (see [When there is no bold face](#synthesis)).

## bold is not "a bit heavier" {#aliases}

`bold` is an alias for 700, not "add weight to the current value". With a parent at 600, `font-weight: bold` still yields 700, not 800.

What really moves relative to the parent is `bolder` / `lighter`: they look at the parent's **computed value** and step through a lookup table. That table has a few fixed steps, so chaining `bolder` twice is not linear.

## How the browser picks the closest face {#matching}

Simplified to three rules (see the font matching section of CSS Fonts for the exact wording):

- request between 400 and 500: look upwards as far as 500, then downwards, then above 500;
- request below 400: look lighter first, then heavier;
- request above 500: look heavier first, then lighter.

The practical consequence: **with only 400 and 700 declared, `font-weight: 500` gets 400** (400 is inside the "look upwards" range and nearer). If you want a Medium, declare a real 500 face.

## Variable fonts {#variable}

```css
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
}
```

Now `font-weight: 350` or `427` both work — inside 100–900, the engine interpolates.

This is also why a **range** like `font-weight: 400 700` only appears inside `@font-face`: it means "this file covers 400 to 700", whereas in an ordinary rule `font-weight` takes a single value.

## When there is no bold face, it gets synthesised {#synthesis}

With only 400 declared and 700 requested, the browser may thicken the outlines on the fly — synthetic bold. The same happens for italics: synthetic oblique.

The result is usually poor: strokes bleed together, widths do not change, weight does not match. So:

```css
body {
  font-synthesis: none;
}
```

means "rather have no bold than a fake one". The type tester on this site sets exactly that — a preview should show the real font, not the browser's rework.

## Inheritance and computed values {#inherit}

`font-weight` inherits. `bolder` / `lighter` depend on the **parent's computed value**, so inside nested markup the result depends on the ancestor chain, not on the element you are looking at.

In devtools, read the Computed panel: that number is what gets used for matching.

## Further reading

- MDN: `font-weight`
- CSS Fonts: the font matching algorithm and `font-synthesis`
