---
title: head, hhea, post
keywords: head, hhea, post, unitsPerEm, 行距, lineGap, 斜体角, 下划线, 符号方向
description: Where unitsPerEm lives, how many sets of extents exist, and how italic angle and underline are defined.
section: fields
order: 3
updated: 2026-11-02
draft: false
---

`head`, `hhea` and `post` hold a dozen fields each, and their names do not look as tidy as `OS/2`. But they decide how fine the grid is, how tall a line is, how far italic leans and where the underline sits. They are covered together because they are usually read together.

## head: global settings {#head}

| Field | Meaning |
| --- | --- |
| `unitsPerEm` | **The scale of font units.** Usually 1000 (CFF) or 2048 (TrueType); valid range 16–16384 |
| `xMin` / `yMin` / `xMax` / `yMax` | Overall bounding box of all outlines |
| `macStyle` | Bits: 0 bold, 1 italic, 2 underline, 3 outline, 4 shadow, 5 condensed, 6 extended |
| `fontRevision` | Numeric revision (unrelated to the version string in `name`) |
| `indexToLocFormat` | Whether `loca` uses short or long offsets |
| `magicNumber` | Fixed `0x5F0F3CF5`, used to confirm this really is a font |
| `created` / `modified` | Timestamps, seconds since 1904 |

`unitsPerEm` is the first key to reading any metrics drawing: every coordinate in the font is counted in these units, **not pixels**. At 16px, one unit in a font with `unitsPerEm = 2048` is 16 / 2048 of a pixel.

`macStyle` and `OS/2`'s `fsSelection` say the same things in two dialects: the old Mac way and the Windows way. Read `fsSelection` first and keep `macStyle` as a fallback.

## hhea: the horizontal baseline trio {#hhea}

| Field | Meaning |
| --- | --- |
| `ascender` | Typographic ascent (positive) |
| `descender` | Typographic descent (usually negative) |
| `lineGap` | Suggested extra gap between lines |
| `advanceWidthMax` | Widest advance in the font |
| `numberOfHMetrics` | Entries in `hmtx`; the rest repeat the last one |
| `caretSlopeRise` / `Run` | Caret angle, used to draw a slanted insertion bar in italics |

Many renderers treat `ascender + |descender| + lineGap` as "the font's own line height". But `OS/2` carries two more sets (`sTypo*` and `usWin*`) — **which one counts depends on bit 7 of `fsSelection`**. Different line heights on macOS and Windows usually come from exactly that choice.

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 320 230" width="100%" role="img" aria-label="The three extents sets: hhea, OS/2 typo and OS/2 win">
    <g stroke="currentColor" fill="none">
      <line x1="16" y1="145" x2="200" y2="145" stroke-width="2" opacity="0.85" />
      <line x1="16" y1="45" x2="200" y2="45" stroke-dasharray="6 4" opacity="0.5" />
      <line x1="16" y1="195" x2="200" y2="195" stroke-dasharray="6 4" opacity="0.5" />
      <line x1="16" y1="60" x2="200" y2="60" stroke-dasharray="2 4" opacity="0.5" />
      <line x1="16" y1="182" x2="200" y2="182" stroke-dasharray="2 4" opacity="0.5" />
      <line x1="16" y1="30" x2="200" y2="30" stroke-dasharray="9 3 2 3" opacity="0.5" />
      <line x1="16" y1="210" x2="200" y2="210" stroke-dasharray="9 3 2 3" opacity="0.5" />
    </g>
    <text x="56" y="145" font-size="52" font-family="Georgia, 'Times New Roman', serif" fill="currentColor">Hxp</text>
    <g fill="currentColor" opacity="0.6" font-size="10" font-family="system-ui, sans-serif">
      <text x="210" y="34">OS/2 win</text>
      <text x="210" y="49">hhea</text>
      <text x="210" y="64">OS/2 typo</text>
      <text x="210" y="149">baseline</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">
    The upper three lines are the ascents, the lower three the matching descents (same dash pattern = same set). Which set counts depends on bit 7 of `fsSelection`.
  </figcaption>
</figure>

## post: italics and underlines {#post}

| Field | Meaning |
| --- | --- |
| `italicAngle` | Slope in degrees, **counter-clockwise positive**; a forward-leaning italic is negative (often −12) |
| `underlinePosition` | Distance from baseline to the **top** of the underline; **negative means below** the baseline |
| `underlineThickness` | How thick the underline is |
| `isFixedPitch` | Whether the font is monospaced |
| Glyph names | Only in version 2.0 — names such as `A` or `uni4E2D` |

`italicAngle` is often used as circumstantial evidence for "is this a real italic": true italics almost always write a non-zero angle, while a slanted upright might write 0 or something arbitrary. It cannot be the only test, but combined with `fsSelection` it beats reading the name.

## Three sign conventions not to flip {#signs}

This is where [metrics drawings](/docs/how-to-read-metrics) most often go wrong:

| Value | Actual direction |
| --- | --- |
| `hhea.descender` | Negative (below baseline) |
| `OS/2.sTypoDescender` | Negative |
| `OS/2.usWinDescent` | **Positive** — it is "how far down", not a coordinate |
| `post.underlinePosition` | **Negative** (below baseline) |
| `post.italicAngle` | Negative = leaning right |

This site normalises all of these into one “y up is negative” font coordinate system before drawing, so nothing is flipped twice. Mixing the two conventions flips or mirrors the whole drawing.

## What these three do not cover {#not-here}

- Whether a character exists: `cmap`;
- How many glyphs: `maxp`;
- Weight and x-height: `OS/2`.

## Further reading

- OpenType spec: the `head`, `hhea` and `post` sections
- Apple TrueType Reference Manual: the original `head` / `post` definitions
