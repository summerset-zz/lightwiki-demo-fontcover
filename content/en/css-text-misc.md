---
title: Synthesis and misc
keywords: font-synthesis, font-size-adjust, letter-spacing, word-spacing, 词距, text-indent, 缩进, 首行缩进, 悬挂缩进, indent, vertical-align, text-rendering, text-decoration, 下划线, underline, 字体合成
description: font-synthesis, font-size-adjust, word-spacing, vertical-align — unrelated properties that get mixed up a lot.
section: dev
order: 7
updated: 2026-11-02
draft: false
---

A collection of small but frequently used properties. They share no theme except one: they are easy to misuse.

## font-synthesis: stop the browser faking it {#synthesis}
<!-- hint: Synthesised bold | When a font has no bold face, the browser thickens it. The result is computed rather than designed, and strokes tend to smear. -->

When a font has no bold or no italic, the browser can synthesise one:

```css
body {
  font-synthesis: none;
}
```

Meaning "rather have no bold than a fake one". Synthetic bold is an outline smeared on top: widths unchanged, strokes blotted. Synthetic italic is a plain slant, with the wrong weight and optical size.

The type preview on this site sets `font-synthesis: none` — a preview should show the real font, not the browser's rework.

Conversely, if a page **must** have bold and the font only ships 400 (common with Chinese), pick a heavier family rather than hoping for a good synthesis.

## font-size-adjust: matching by x-height {#size-adjust}

x-heights differ a lot between fonts, so the same font size looks different. `font-size-adjust` normalises by x-height:

```css
.fallback {
  font-size-adjust: 0.5;
}
```

The number is x-height ÷ font size; the browser scales the size so the x-height matches that ratio.

The real use: when a **fallback and a web font look different in size**, give the fallback a value close to the web font to reduce jumping. It adjusts size only, not width, so it mitigates layout shift rather than removing it.

(Not to be confused with the `size-adjust` descriptor inside `@font-face`, which scales the font itself.)

## word-spacing and letter-spacing {#spacing}

- `letter-spacing`: between characters (technically after each one);
- `word-spacing`: between **words**, counted by spaces.

Chinese has no spaces, so `word-spacing` does almost nothing on pure Chinese text; `letter-spacing` does apply, but it breaks the block texture and belongs to headlines.

Both change how many characters fit per line, so re-check the line breaks afterwards.

## text-indent: first-line and hanging indents {#indent}

`text-indent` affects **the first line of a block** only:

```css
p {
  text-indent: 2em;
}
```

- use `2em` rather than `32px`: it follows the font size;
- for “two **characters**” (how Chinese describes it), the precise unit is `ic` (the width of 水) — `2ic` is two Han characters. `ic` is newer; fall back to `2em` where support is uncertain;
- the English convention is **no indent + space between paragraphs**; the Chinese convention is **two characters of indent + no extra space**. Do not mix the two — mixed, both look wrong.

A hanging indent (first line flush, the rest indented) has no dedicated property; two values build it:

```css
.hanging {
  padding-left: 2em;
  text-indent: -2em;   /* pulls the first line back out */
}
```

Keep the negative value no larger than `padding-left`, otherwise the first line escapes the content box. Lists, definitions and bibliography entries all use this combination.

Three settings side by side: `0` is plain body text, `2em` is a Chinese paragraph, the third is a hanging indent — watch the difference between **the first line** and the rest.

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
<div id="example-element">A first-line indent moves only the first line of a block; every other line still starts at the left edge. A hanging indent does the opposite: the first line sits flush while the rest are pushed in, which is what list and bibliography styles use.</div>
```

```css interactive-example
#example-element {
  max-width: 20em;
  outline: 1px dashed currentColor;
  outline-offset: 6px;
}
```

The similarly named but unrelated one: `hanging-punctuation` lets punctuation hang outside the line (a form of kinsoku), supported in Safari only today — not a typesetting tool you can rely on.

## vertical-align: inline elements only {#vertical-align}

`vertical-align` moves **inline boxes relative to the baseline**; it is not a layout tool:

```css
sup { vertical-align: super; font-size: 0.75em; }
.icon { vertical-align: -0.125em; }
```

To centre a block, use flex or grid; `vertical-align: middle` on a `div` usually does nothing.
When the type tester was built this was deliberately omitted: a single block of text has no inline elements.

Values, how an `inline-block` gets its baseline, and how to close the gap under images: [vertical-align](/docs/css-vertical-align).

## text-rendering: mostly leave it alone {#text-rendering}

```css
body {
  text-rendering: optimizeLegibility;
}
```

Historically sold as "nicer typography", but:

- its behaviour is not fully specified and differs per browser;
- it can cost performance (well-documented in older Safari);
- ligatures and kerning now have dedicated properties, so it is unnecessary.

The safest choice in a new project is not to write it.

## Underlines {#underline}

```css
a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}
```

`text-underline-offset` pushes the line away from the text; `text-decoration-thickness` sets its weight. Both beat faking an underline with `border-bottom`, which ignores font metrics and drifts when the line height changes.

## One-line summary {#summary}

| Goal | Use | Avoid |
| --- | --- | --- |
| No fake bold | `font-synthesis: none` | relying on synthesis |
| Fallback looks the wrong size | `font-size-adjust` | hand-tuning font sizes |
| Letter / word spacing | `letter-spacing` / `word-spacing` | `padding` to squeeze text |
| Aligning icons to text | `vertical-align` | manual `position: relative` |
| Underline | `text-decoration-*` | `border-bottom` |
| Vertical centring | flex / grid | `vertical-align` |

## Further reading

- MDN: `font-synthesis`, `font-size-adjust`, `vertical-align`, `text-decoration`
- CSS Fonts: the `size-adjust` descriptor and `font-size-adjust`
- This site: [font-weight and the bold alias](/docs/css-font-weight)
