---
title: The OS/2 table
keywords: OS/2, 字重, 字宽, fsSelection, x 高度, 上下伸, usWeightClass, typo 度量
description: Weight, width, italic bit, x-height, extents — the table the inspector reads most, and the most patch-like table in the format.
section: fields
order: 2
updated: 2026-11-02
draft: false
---

`OS/2` began as a [Microsoft](/credits/maker/microsoft) addition to TrueType for Windows typography (named after an operating system that no longer exists). Today it is **the main table describing how heavy, how wide and how tall a font is**, and almost every layout program reads it.

It is also a classic "pile of compatibility patches": each version added fields, newer fields partly replaced the meaning of older ones, so the same concept often has two sets of values.

## Weight and width {#weight-width}

| Field | Range | Notes |
| --- | --- | --- |
| `usWeightClass` | 1–1000 | Conventionally multiples of 100: 100 Thin, 300 Light, 400 Regular, 500 Medium, 700 Bold, 900 Black |
| `usWidthClass` | 1–9 | 1 Ultra-condensed … 5 Normal … 9 Ultra-expanded |

`usWeightClass` is a **suggestion**, not a scale. A designer can call their Regular 400 or 350. So "this font looks heavier on one system than another" is sometimes not a rendering bug but a differently filled field.

Width is a separate axis: a Condensed face usually has a smaller `usWidthClass`, and `Condensed` in its family name too. Both need to agree, or width-aware matching picks the wrong face.

## fsSelection: the italic and bold switches {#selection}
<!-- hint: fsSelection | fsSelection holds the style flags for italic, bold and underline. Systems and browsers read these bits rather than the style name. -->

`fsSelection` is a bit field. The bits you will meet:

| Bit | Meaning |
| --- | --- |
| 0 | `ITALIC` — this face is italic |
| 5 | `BOLD` — this face is bold |
| 6 | `REGULAR` — the regular face (mutually exclusive with the two above) |
| 7 | `USE_TYPO_METRICS` — use the `sTypo*` metrics rather than `usWin*` |
| 8 | `WWS` — the names follow the WWS convention |

Bit 7 explains a lot of "why is the line height different on macOS and Windows": it tells the renderer which set of extents to trust. Without it, engines pick different defaults.

## Two sets of vertical metrics {#metrics}

`OS/2` carries two sets, and this is historical baggage:

| Field | Sign | Origin |
| --- | --- | --- |
| `sTypoAscender` / `sTypoDescender` / `sTypoLineGap` | ascender positive, descender usually **negative** | The metrics Microsoft and Apple agreed on for typesetting |
| `usWinAscent` / `usWinDescent` | **both positive** | Early Windows clipping and scrolling bounds, sized for the worst Latin glyph |

That is why the metrics drawing on this site negates `winDescent` before plotting it below the baseline. And if you see a positive descender, the table is not misread — that is the rule.

## x-height and cap height {#xheight}

Available from version 2:

- `sxHeight`: height of a lowercase `x`;
- `sCapHeight`: height of uppercase letters.

Both are **declarations**, not measurements taken from outlines. Some fonts fill them inaccurately, some leave 0. To make different fonts look the same size at the same pixel size, the reliable approach is the real x-height, not these fields.

## Declaring character coverage {#unicode-range}

`ulUnicodeRange1..4` is 128 bits declaring roughly which ranges a font covers (Latin, Greek, CJK…). `ulCodePageRange1..2` does the same per code page.

They **cannot** answer "does this font have this character": the bits are range-level and frequently over-declared. The only reliable answer comes from `cmap` — which is exactly how coverage is computed on this site.

## The odds and ends {#misc}

- `achVendID`: a four-byte vendor code (`APPL`, `GOOG`), not a trademark statement;
- `panose`: ten bytes of "style fingerprint" for similar-font suggestions, often all zero;
- `fsType`: embedding permission bits (PDF embedding, read-only embedding); older fonts often say "no embedding";
- `usFirstCharIndex` / `usLastCharIndex`: hints about the character range of non-symbol fonts — hints only.

## How this site uses it {#this-site}

- Weight: shows `usWeightClass` and says it may be approximate;
- Italic: reads bit 0 of `fsSelection` instead of looking for `Italic` in the family name;
- Metrics drawing: plots both the `hhea` and `OS/2` extents, because which one counts depends on the renderer.

## Further reading

- OpenType spec: the `OS/2` table — each version documents the fields it added
- OpenType spec: `fsSelection` bit definitions and `USE_TYPO_METRICS`
