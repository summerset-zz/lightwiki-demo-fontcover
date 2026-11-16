---
title: Glyphs and the em square
keywords: 字形, 轮廓, em 方框, unitsPerEm, 贝塞尔, 复合字形, hinting
description: Glyphs are drawn as curves, in units of one em. This layer explains why the same font size looks different.
section: basics
order: 3
updated: 2026-11-02
draft: false
---

The most concrete thing in a font is the **outline**: straight lines and curves enclosing a shape; filled, they become the strokes. Every other table — names, metrics, coverage — describes these outlines.

## What an outline is {#outline}

A glyph consists of closed paths:

- straight segments (`L`);
- curves — TrueType uses **quadratic** Béziers (one control point), CFF uses **cubic** (two);
- each path has a direction (clockwise or counter-clockwise).

Direction is not decoration: it says which side is inside. Fonts are filled by the **nonzero winding rule** — nested paths in the same direction fill solid, opposite directions punch a hole, which is how the inside of an `o` is drawn in reverse.

## The coordinate system: the em square {#em}
<!-- hint: Units per em | The em square is the grid glyphs are drawn on, and the font divides its edge into a fixed number of units (usually 1000 or 2048). Every other metric is a whole number of those units, so divide before comparing two fonts. -->

Coordinates are in **font units**, whose scale comes from `unitsPerEm` in `head`:

- commonly 1000 (CFF fonts) or 2048 (TrueType fonts);
- **one em = `unitsPerEm` units**;
- the baseline is y = 0, and up is positive (note: the opposite of SVG).

So "x-height = 1062" only holds in a font with `unitsPerEm = 2048`; the same designer writing a 1000-unit font would put roughly 518. **Convert to percentages before comparing across fonts.**

## The em square is not the ink box {#box}

The **em square** is the design grid, its side equal to `unitsPerEm`. It is the unit of layout: a 16px font size means a 16px square.

The **ink box** is where the glyph actually sits — usually a bit smaller, sometimes larger:

- lowercase Latin letters are shorter than the square;
- script faces routinely overshoot it;
- Han characters essentially fill it (which is why Chinese type looks "fuller").

## Composite glyphs {#composite}

Accented characters (`é`, `ñ`) are usually not drawn separately; they are assembled by **referencing** the outlines of a base letter and a mark.

In TrueType that is a set of component records in `glyf`; in CFF it is `seac` or done by the layout engine.

Consequence: a font may have 800 glyphs but cover 1,200 code points — accented letters are composed.

## Hinting: compensation at small sizes {#hinting}
<!-- hint: Hinting | Hinting is the instruction set that aligns stems to the pixel grid at small sizes. Without it, glyphs look soft when rendered small. -->

On low-resolution screens, curves land between pixels and blur. The `cvt` / `fpgm` / `prep` tables plus per-glyph instructions nudge strokes so 12px text stays crisp.

With high-density displays, hinting matters less, and many recent fonts ship without instructions at all.

Hinting is only one part of "outlines become pixels": antialiasing and subpixel rendering (ClearType) live in the same step — see [Rasterising text](/docs/rasterization).

## Why the same font size looks different {#apparent-size}

Font size fixes the em square, **not how much of it is inked**:

- a large x-height reads bigger;
- a heavier weight reads bigger (more ink);
- Han characters fill the square and usually look more prominent than Latin at the same size.

So "make this font the same size as that one" cannot be done exactly by numbers — only by eye, or with compensation such as `font-size-adjust` (see [Synthesis and size compensation](/docs/css-text-misc)).

## Where to see it here {#this-site}

- Specimen images are SVGs drawn from the outlines;
- the "ink" box in the metrics drawing is exactly the area the glyph occupies;
- the type preview renders real outlines, not a diagram.

## Further reading

- OpenType spec: `glyf` (TrueType outlines and components), `CFF` / `CFF2`
- This site: [Font tables](/docs/font-tables-overview), [Reading the metrics](/docs/how-to-read-metrics)
