---
title: Typographic terms
keywords: 基线, x 高度, 大写高度, 升部, 降部, em 方框, 字碗, 字眼
description: Baseline, x-height, ascender, em square — one plain sentence each, plus the font field it comes from.
section: design
order: 0
updated: 2026-11-07
draft: false
---

When a designer says "the type looks too big" or "this line is cramped", there is a metric behind it inside the font file. This page walks the common terms from the baseline upwards and names the field each one comes from, so the numbers in the inspector mean something.

## Baseline: where everything starts {#baseline}
<!-- hint: Baseline | The baseline is the line the letters sit on. Together with ascent, descent and line gap it fixes how tall a line of text gets. -->

The **baseline** is the line Latin letters sit on: the bottom of `a`, `x`, `m` touches it, while the tails of `g`, `p`, `y` hang below.

Inside a font the baseline is y = 0. Every other metric is "how far above" or "how far below" it.

## x-height and cap height: how big it looks {#heights}
<!-- hint: x-height and cap height | x-height is the height of a lowercase x, cap height that of a capital. The larger the gap between two fonts here, the more their apparent size differs at the same font size. -->

- **x-height**: the height of a lowercase `x`. It decides how large a run of text **looks** — at the same 16px, a font with a large x-height reads bigger;
- **cap height**: the height of uppercase letters, usually a little taller.

In the font: `sxHeight` and `sCapHeight` in `OS/2`. ⚠️ Both are **declarations** and may be inaccurate or zero. For a reliable sense of visual size, look at real glyphs.

Which is why "both set to 16px, yet one looks much bigger" is normal: their x-heights differ. Font size fixes the em square, not the apparent size.

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 300 148" width="100%" role="img" aria-label="Baseline, x-height and cap height">
    <g stroke="currentColor" fill="none">
      <line x1="16" y1="125" x2="216" y2="125" stroke-width="2" opacity="0.85" />
      <line x1="16" y1="92" x2="216" y2="92" stroke-dasharray="5 4" opacity="0.45" />
      <line x1="16" y1="78" x2="216" y2="78" stroke-dasharray="2 3" opacity="0.45" />
    </g>
    <text x="56" y="125" font-size="68" font-family="Georgia, 'Times New Roman', serif" fill="currentColor">Hxp</text>
    <g fill="currentColor" opacity="0.6" font-size="10" font-family="system-ui, sans-serif">
      <text x="226" y="81">cap height</text>
      <text x="226" y="95">x-height</text>
      <text x="226" y="128">baseline</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">The proportions are schematic; the real values depend on the font — the inspector's metrics panel shows them for a specific font.</figcaption>
</figure>

## Ascender and descender: how far a line reaches {#extents}

- **ascender**: roughly how high `b`, `d`, `h` reach;
- **descender**: how low `g`, `j`, `p` go.

Two versions of this word exist, and they get confused:

| Meaning | What it is | In the font |
| --- | --- | --- |
| Actual glyph extent | How far this letter is drawn | Glyph bounding box (ink bbox) |
| Typographic extent | How much room the **line** needs | ascender / descender in `hhea` and `OS/2` |

Layout uses the second: reserving height for a headline or placing the next line uses the **declared** extents, not where one letter happens to end.

## Em square and ink box {#embox}

The **em square** is the design grid, its side equal to `unitsPerEm` (often 1000 or 2048). Every coordinate counts cells in that grid, not pixels.

The **ink box** is the area a glyph actually occupies, usually smaller. CJK glyphs are drawn close to a square, so Chinese spacing problems cannot be solved with Latin tricks.

## Letter parts {#parts}

| Term | 中文 | How to spot it |
| --- | --- | --- |
| stem | 字干 | The vertical stroke, as in `l`, `H` |
| crossbar | 横画 | The horizontal stroke, as in `H`, `A` |
| bowl | 字碗 | The enclosing curve, as in `b`, `o` |
| shoulder | 字肩 | The curve leaving the stem, as in `n`, `h` |
| counter | 字眼 | Enclosed white space, as in `o`, `e` |
| terminal | 收笔 | Where a stroke ends, as in `c`, `s` |
| ear | 字耳 | The small tab on `g` |

None of these affect metrics, but they are how you judge **pairing**: at the same weight, different counters and terminals give a completely different character.

## Stress and contrast {#stress}
<!-- hint: Stress | The direction in which stroke width changes, also called contrast. One o shows it; a monoline font has none. -->

<!-- source: en.wikipedia.org | Typeface anatomy | 1383441338 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Translated from the Stress or contrast section -->

When stroke widths vary, the variation has a **direction**: that is the stress, also called contrast. One `o` tells you the answer — thick sides with thin top and bottom is vertical stress, a diagonal shift is oblique stress.

- The more oblique the stress, the more it reads as a written stroke; a pen or a brush does this by nature;
- No variation at all is **monoline**, the mark of geometric sans-serifs;
- There is also **reverse contrast**, where the strokes that are normally thick are drawn thin — a flip that shows up in retro display faces.

So "does this face look written" is often a question about stress rather than about the shapes of the strokes.

## Single-storey and double-storey {#single-storey}

<!-- source: en.wikipedia.org | Typeface anatomy | 1383441338 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Character variants section; kept the a/g structures and schoolbook alternates, dropped the foundry anecdotes -->

`a` and `g` each come in two basic structures: **double-storey** (a small bowl over a larger one) and **single-storey** (a bowl with a stem). Scripts and some geometric sans-serifs use the single-storey forms; text serifs are almost always double-storey.

Books for children often swap in single-storey `a` and `g` (sometimes `t`, `y`, `l` and the digit `4` too) — **schoolbook** or infant alternates, on the theory that they resemble handwriting. These days they are usually a second set of glyphs in the same file, turned on through stylistic alternates (see [OpenType features](/docs/opentype-features-design#common)) rather than a separate family.

## Where to see this here {#how-to-see}

- **Inspector → metrics** draws the baseline, x-height, cap height and the hhea / typo / win extents together, with values and their percentage of one em;
- **Type preview** shows how x-height affects apparent size as you change the font size.

## Three common misreadings {#wrong}

1. **"Same font size means the same size"** — font size fixes the em square; apparent size comes from x-height;
2. **"The em square is the glyph boundary"** — it is not; glyphs often stick out (script faces especially);
3. **"ascender is the tallest stroke"** — it is a **layout declaration**, possibly higher than any glyph, possibly lower than some.

## Further reading

- OpenType spec: `sxHeight` / `sCapHeight` in `OS/2`
- This site: [head, hhea, post](/docs/head-hhea-post), [Reading the metrics](/docs/how-to-read-metrics)
