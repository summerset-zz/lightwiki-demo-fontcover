---
title: line-height
keywords: line-height, 行高, 行距, 行间距, 无单位, 继承, half-leading, leading
description: Unitless numbers, lengths and percentages inherit in completely different ways — the reason a 1.5 on the parent stops working when a child grows.
section: dev
order: 3
updated: 2026-11-02
draft: false
---

`line-height` decides how tall one line of text is. Three of its four values look interchangeable, **but they inherit in completely different ways** — the most commonly stepped-on trap in CSS.

## The four values {#values}
<!-- hint: Unitless values | A unitless number is recalculated against each element own font size. An em value inherits as a fixed length, so the two differ. -->

| Value | Example | Meaning |
| --- | --- | --- |
| `normal` | `line-height: normal` | Whatever the browser derives from font metrics, usually around 1.2× the font size |
| number | `line-height: 1.5` | **A multiple of the font size**, computed against the current `font-size` |
| length | `line-height: 24px` | A fixed height, independent of font size |
| percentage | `line-height: 150%` | A percentage of the current `font-size`, **computed to a fixed value** |

Try the options below: the font size never changes, only the room each line takes.

{{InteractiveExample("CSS Demo: line-height")}}

```css interactive-example-choice
line-height: normal;
```

```css interactive-example-choice
line-height: 2.5;
```

```css interactive-example-choice
line-height: 3em;
```

```css interactive-example-choice
line-height: 150%;
```

```css interactive-example-choice
line-height: 32px;
```

```html interactive-example
<div id="example-element">
  Line height sets how much room each line takes. Pick another option on the left and the same
  paragraph loosens or tightens — the font size stays put.
</div>
```

```css interactive-example
#example-element {
  font-family: Georgia, serif;
  max-width: 200px;
}
```

## Inheritance is where it bites {#inherit}

Take a parent:

```css
.parent {
  font-size: 16px;
  line-height: 1.5;      /* or 24px, or 150% */
}
.child {
  font-size: 32px;
}
```

| Parent wrote | Child inherits | Child's line height |
| --- | --- | --- |
| `1.5` (number) | the number `1.5` itself | 32 × 1.5 = **48px** |
| `24px` (length) | 24px | **24px** — smaller than the text, lines collide |
| `150%` (percentage) | the already-computed 24px | **24px** — same collision |

Only a **unitless number** is passed down as a ratio. Lengths and percentages are resolved at the parent and inherited as absolute values.

So "the parent says `line-height: 1.5` but the headline looks wrong" has two causes: the parent actually wrote `150%` or `1.5em`, or the headline sets a fixed value of its own.

## How a line box is built {#box}

The height of a line is not the height of the letters; it is a **line box**:

1. Take the font's ascender and descender to get the natural content height;
2. Subtract that from `line-height` and split the remainder **evenly above and below** (half-leading);
3. Align inline boxes on the baseline by `vertical-align`, then take the tallest.

That is why increasing `line-height` pushes text apart both up and down, and why two fonts at the same `line-height` can still look differently spaced — their natural heights differ.

<figure style="margin: 1.75rem 0">
  <div style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.5rem 1rem; align-items: center">
    <div style="border: 1px dashed currentColor; font-size: 20px; line-height: 1">Hg</div>
    <div style="font-size: 11px; opacity: 0.6; font-family: system-ui, sans-serif">line-height: 1</div>
    <div style="border: 1px dashed currentColor; font-size: 20px; line-height: 1.8">Hg</div>
    <div style="font-size: 11px; opacity: 0.6; font-family: system-ui, sans-serif">line-height: 1.8</div>
  </div>
  <figcaption style="margin-top: 0.75rem; font-size: 0.8125rem; opacity: 0.65">
    The dashed box is the line box: its height equals `line-height`, and the surplus is split evenly above and below the content area (half-leading). The first line nearly touches its edges.
  </figcaption>
</figure>

## What normal actually is {#normal}
<!-- hint: normal | line-height: normal is not 100%. It equals ascent plus descent plus line gap, and the values come from the font. -->

`normal` is not "1.2"; it is "whatever the browser derives from the font metrics". The spec suggests an algorithm using ascender, descender and line gap, so the number varies by browser **and** by font.

Never treat `normal` as a constant: the same CSS can produce different leading in Chrome, Safari and Firefox, and changing the font changes it too.

## In practice {#practice}

```css
:root {
  --leading-tight: 1.25;
  --leading-normal: 1.6;
}

body {
  font-size: 1rem;
  line-height: var(--leading-normal);
}

h1,
h2,
h3 {
  line-height: var(--leading-tight);
}
```

- Use a **unitless number** on the root so the whole site scales together;
- Give large headings a tighter multiple (bigger text needs proportionally less leading);
- Use lengths only when you must hit a grid (say every line is exactly 24px) — and then compute it at every level that changes font size.

## Related to the font itself {#with-font}

`hhea.ascender` / `descender` / `lineGap` (and the two sets in `OS/2`) decide what "one line" naturally is. See [head / hhea / post](/docs/head-hhea-post).

## Further reading

- MDN: `line-height`
- CSS Inline Layout: line boxes and half-leading
