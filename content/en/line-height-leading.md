---
title: Line height
keywords: 行高, 行距, leading, line height, 单倍行距
description: A word from the days of metal type, meaning "how tall one line is". Why single spacing is not 100%, and why changing the font changes the spacing.
section: design
order: 1
updated: 2026-11-07
draft: false
---

**Line height** is the total height one line occupies; **leading** is the gap between lines. Same thing described two ways — designers say "4pt leading", front-end developers write `line-height: 1.5`.

## Where the word comes from {#etymology}

In metal typesetting, strips of lead were inserted between lines to open them up. Those strips were called leading (pronounced "ledding", because the metal is lead). Digital typesetting has no lead, but the word stayed.

So a designer saying "more leading" usually means **push the lines apart**, while `line-height: 1.5` changes the **height of each line box**. Same effect, different arithmetic.

## Single spacing is not 100% {#not-100}

`line-height: 1` means the line is exactly as tall as the font size, and text collides, because a font's extents usually **exceed** one em (the `b` reaches up, the `g` reaches down, and together they are taller than an em).

Which is why "single spacing" in most software is not 1.0 but around 1.15–1.2; the browser's `normal` lands in that range too.

## The same "1.5×" is not the same number {#multipliers}

<!-- source: en.wikipedia.org | Leading | 1372447358 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the measurement section; kept the Word multipliers and the drift between versions -->

A "multiple" means different things in different tools:

| What the tool says | Actual leading (relative to type size) |
| --- | --- |
| Word's "single" spacing | Roughly 1.17× |
| Word's "1.5 lines" | Roughly 1.75× |
| Word's "double" spacing | Roughly 2.33× |
| CSS `line-height: 1.5` | 1.5× |

Word's multiples are relative to its own baseline leading, and that baseline has moved: between Word 97 and Word 2010 the single-spacing default was about 1.15 em, after which it became about 1.08 em. So "this paragraph is set at 1.5 lines" stops meaning the same distance the moment you carry it into CSS.

When handing off across tools, state the **multiple of the type size** ("leading 1.6") rather than the name of a dropdown entry.

## Two layers of spacing {#two-layers}

| Layer | Decided by | Where |
| --- | --- | --- |
| Built into the font | The type designer | `hhea.lineGap`, the typo / win metric sets in `OS/2` |
| Used at layout time | Whoever sets the text | CSS `line-height`, the leading setting in design software |

The built-in layer is a **suggestion**: "this font, at normal spacing, roughly needs this much". Software usually overrides it.

That is why spacing looks different after switching fonts: your multiple did not change, but the font's extents did, so the natural height of the line box changed with it.

Same paragraph, opened up or tightened — the most frequently adjusted setting on a layout, and the most argued about.

{{InteractiveExample("CSS Demo: leading")}}

```css interactive-example-choice
line-height: 1.15;
```

```css interactive-example-choice
line-height: 1.4;
```

```css interactive-example-choice
line-height: 1.7;
```

```css interactive-example-choice
line-height: 2.2;
```

```html interactive-example
<div id="example-element">
  Leading is not a case of bigger or tighter being better. Open the lines up or close them and the same paragraph reads completely differently — which is why body text usually lands around 1.6–1.8.
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
}
```

## How much is right {#how-much}

No fixed answer, but some rules of thumb:

- **Body text**: 1.4–1.7; the longer the measure (characters per line), the more leading you need, or the eye loses its place returning to the next line;
- **Large headlines**: 1.05–1.25; bigger type wants proportionally less leading;
- **Small print / captions**: around 1.3 — too loose and it falls apart;
- **Narrow multi-column**: slightly tighter is fine, since the measure is already short.

A factor that gets overlooked: **x-height**. A font with a large x-height carries more ink, so the same 1.5 looks tighter than in a font with a small x-height.

## How to see it here {#this-site}

Three horizontal families in the metrics drawing relate to line height:

- `hhea ascender` / `descender`: the first set built into the font;
- `OS/2 typo ascender` / `descender`: the set Microsoft and Apple agreed on for typesetting;
- `OS/2 win ascent` / `descent`: early Windows clipping bounds.

Plus their line gaps, that is what the font itself can occupy. All values appear in the table, each with its percentage of one em.

To test it directly, use the type preview and change the line height — it renders real text, not a diagram.

## Mapping to CSS {#css}

Use a **unitless number** (`line-height: 1.5`); it scales with font size. `150%` or `24px` is resolved to a fixed value at the parent, so a child that grows its font size keeps the old spacing.

The details are in [The four kinds of line-height](/docs/css-line-height).

## Further reading

- OpenType spec: the extents in `hhea` and `OS/2`
- This site: [head, hhea, post](/docs/head-hhea-post), [Reading the metrics](/docs/how-to-read-metrics)
