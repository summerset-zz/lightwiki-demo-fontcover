---
title: Reading the metrics
keywords: 度量, metrics, unitsPerEm, 基线, ascender, descender, viewBox, em 方框, 百分比
description: All font units, independent of size. Which line comes from which field, and why two y directions flip so easily.
section: tools
order: 2
updated: 2026-11-02
draft: false
---

The inspector's metrics panel draws **one glyph inside one em square**, plus the boundaries the font declares. It is not a judgement of the typeface; it is a working drawing for how much room a line needs.

## Coordinates first: font units, up is negative {#coordinates}
<!-- hint: Font units and the y axis | Metrics are recorded in font units; dividing by unitsPerEm gives a ratio. The y axis points up, so ascenders are positive and descenders negative. -->

- Every number is in **font units** (fractions of `unitsPerEm`), never pixels;
- the baseline is y = 0;
- **up is negative** (the SVG convention).

So an ascender of 800 font units is drawn at `y = -800`. On screen it sits above; as a value it is positive. Two ways of saying the same thing.

Because pixels never enter, the drawing is **size-independent**: identical at 12px and 120px. Scaling is entirely the SVG `viewBox`.

## The nine layers {#layers}
<!-- hint: Three metric sets | hhea, OS/2 typo and OS/2 win are three parallel sets of vertical metrics. Browsers pick one per platform, so the numbers often differ. -->

| Layer | Draws | Source |
| --- | --- | --- |
| Baseline | The baseline (y = 0) | — |
| hhea | Typographic ascent and descent | `hhea.ascender` / `descender` |
| OS/2 typo | The typesetting set | `OS/2.sTypoAscender` / `sTypoDescender` |
| OS/2 win | Windows clipping bounds | `OS/2.usWinAscent` / `usWinDescent` |
| Cap height | Uppercase height | `OS/2.sCapHeight` |
| x-height | Lowercase x height | `OS/2.sxHeight` |
| Underline | Underline position | `post.underlinePosition` |
| Advance / side bearings | The vertical lines | the glyph's `advanceWidth` and `leftSideBearing` |
| Glyph bounding box | What the glyph actually occupies (ink) | glyph bounding box |

Layers can be switched off individually — that only declutters the drawing; the table keeps every row.
<figure style="margin: 2rem 0">
  <svg viewBox="0 0 360 260" role="img" aria-label="Schematic of the metric lines inside one em box" style="display: block; width: 100%; max-width: 32rem; height: auto; color: var(--color-neutral-700); font-family: system-ui, sans-serif">
    <line x1="90" y1="76" x2="90" y2="226" stroke="currentColor" stroke-width="1" opacity=".45" />
    <line x1="100" y1="118" x2="100" y2="196" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" opacity=".3" />
    <line x1="162" y1="76" x2="162" y2="226" stroke="currentColor" stroke-width="1" opacity=".45" />
    <line x1="210" y1="76" x2="210" y2="226" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity=".35" />
    <rect x="100" y="106" width="58" height="84" fill="currentColor" opacity=".08" stroke="currentColor" stroke-width="1" stroke-opacity=".5" />
    <line x1="68" y1="94" x2="236" y2="94" stroke="currentColor" stroke-width="1" opacity=".4" />
    <line x1="68" y1="106" x2="236" y2="106" stroke="currentColor" stroke-width="1" opacity=".2" />
    <line x1="68" y1="130" x2="236" y2="130" stroke="currentColor" stroke-width="1" opacity=".2" />
    <line x1="68" y1="190" x2="236" y2="190" stroke="currentColor" stroke-width="1.5" />
    <line x1="68" y1="202" x2="236" y2="202" stroke="currentColor" stroke-width="1" stroke-dasharray="5 3" opacity=".4" />
    <line x1="68" y1="214" x2="236" y2="214" stroke="currentColor" stroke-width="1" opacity=".4" />
    <g font-size="10.5" fill="currentColor">
      <text x="244" y="97">Ascender 800</text>
      <text x="244" y="109" opacity=".55">Cap 700</text>
      <text x="244" y="133" opacity=".55">x-height 500</text>
      <text x="244" y="193">Baseline 0</text>
      <text x="244" y="205" opacity=".65">Underline −100</text>
      <text x="244" y="217" opacity=".65">Descender −200</text>
    </g>
    <g font-size="9" fill="currentColor" text-anchor="middle">
      <text x="90" y="238">x = 0</text>
      <text x="210" y="238" opacity=".65">1 em</text>
      <text x="162" y="251" opacity=".65">advance 600</text>
    </g>
    <text x="96" y="116" font-size="9" fill="currentColor" text-anchor="end" opacity=".65">lsb</text>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    A schematic, not a specific typeface: it assumes <code>unitsPerEm = 1000</code>. On the right are <strong>raw field values</strong> (watch the signs — descender and underline are negative); along the bottom are the three <strong>horizontal</strong> references. The grey box is the glyph's ink, which is not the same thing as <code>advance</code>: the difference is the right side bearing.
  </figcaption>
</figure>

## The vertical lines {#verticals}

- **Origin** (x = 0): where the glyph starts;
- **advance**: the horizontal distance it takes; the next glyph starts here;
- **lsb** (left side bearing): from the origin to the ink;
- **1 em**: the line at x = `unitsPerEm`, for comparing how much of an em the glyph uses.

Right side bearing has no line but does have a row: `advance − lsb − ink width`.

## The table {#table}

Every row gives **font units** and **percentage of one em** (value ÷ `unitsPerEm`). Percentages compare across fonts; absolute numbers do not, because `unitsPerEm` may be 1000 or 2048.

Rows include:

- baseline plus the three extent sets (hhea / typo / win) and their line gaps;
- cap height, x-height;
- underline position and thickness;
- `unitsPerEm`;
- the glyph's advance, lsb, rsb;
- the ink box's left, right, top, bottom and height.

## Three sign conventions {#signs}

| Value | Typical | Meaning |
| --- | --- | --- |
| `hhea.descender` | negative | how far **below** the baseline |
| `OS/2.usWinDescent` | **positive** | "how far down", not a coordinate |
| `post.underlinePosition` | negative | underline top **below** the baseline |
| `post.italicAngle` | negative | leaning right |

This site normalises all of it to “up is negative” before drawing, so the drawing is consistent; the table shows **raw values** — a positive number in the table does not mean the drawing is wrong.

## Two y directions {#two-directions}

The most error-prone part of the implementation, and the first suspect when a drawing looks flipped:

- **glyph outlines** (SVG path) are SVG-oriented: y increases downwards;
- **bounding boxes and metrics** are font-oriented: y increases upwards.

Boxes need their `top` and `bottom` swapped, or the whole box flips. Collecting that conversion in one file is exactly how this site avoids "one line quietly mirrored".

## Why some characters cannot be drawn {#notdef}

If the glyph index is 0 (`.notdef`, the tofu box), the font **does not have this character**. The metrics shown are `.notdef`'s, meaning nothing about any real glyph — so the panel says "this font has no such character" instead of drawing a meaningless diagram.

## Further reading


- OpenType spec: `hhea`, `OS/2`, `post`
- This site: [head / hhea / post](/docs/head-hhea-post)
