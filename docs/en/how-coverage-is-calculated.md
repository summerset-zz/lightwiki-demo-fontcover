---
title: How coverage works
keywords: 覆盖率, coverage, assigned, 分母, 归并, cmapRanges
description: Two plain-data inputs, one merge pass, two denominators — plus what it cannot tell you.
section: tools
order: 0
updated: 2026-11-03
draft: false
---

"Which characters does this font cover" is computed **on the fly** here: no re-parsing, no network call, no re-running the sync. The reason is simple — both inputs are already available and both are plain data.

## The two inputs {#inputs}
<!-- hint: Coverage | The first number is how many code points the cmap declares, and the second is how many contiguous ranges those points were merged into. -->

1. **The font's code point ranges** (`cmapRanges`): ranges copied out of the `cmap` table during analysis, compressed into a flat `[start, end, start, end, …]` array and stored in the archive. A CJK font lands in a few hundred ranges;
2. **The block table**: the 350-odd blocks parsed from Unicode's `Blocks.txt`, each with its assigned count, cached on the server.

One lives in the browser (local font archive) or an API response, the other behind `/api/unicode/blocks`. Both are arrays and numbers; one pass produces the result.

## Numerator: intersecting ranges with blocks {#numerator}

For each block, count code points that fall both inside the font's ranges and inside the block.

The implementation is a single **merge pass**: blocks and ranges are both ascending, so a cursor walks the range array forwards, and each block continues where the previous one stopped. The cost is "blocks + ranges", not "blocks × ranges".

(Client and server share one implementation.)

## Two denominators {#denominators}

| Figure | Denominator | Used for |
| --- | --- | --- |
| `covered / assigned` | assigned code points in the block | the number on the row |
| `ratio` | the block's total size | the width of the bar |

Why two: see [Blocks and "assigned"](/docs/unicode-blocks). A CJK block spans 20,000 code points, most unassigned; scaling by total size makes the bar look irrelevant, while scaling by assigned shows how many real characters the font is missing.

## The two figures above the list {#panel-totals}

The numbers above the block list use another pair of denominators — neither is a single block:

| Shown as | Numerator | Denominator |
| --- | --- | --- |
| `Code points 30,890 / 172,808` | code points the font's `cmap` ranges declare | **all assigned code points across every block** |
| `Blocks 61 / 353` | blocks the font covers | **total number of blocks** (353 today) |

Both read as “share of everything”, not “share of this block” — that one is the `covered / assigned` on a row.

Three honest notes:

- do not conflate a **block** with a `cmap` **range**: one block can hold many ranges, while “blocks” only counts blocks. The number of contiguous `cmap` ranges is a different figure, and we do not show it;
- the numerator of the first is the sum of range widths, so it includes code points the font declares but that have no name (private use and not-yet-assigned ranges can both be declared), while the denominator counts assigned ones only. The two are not strictly aligned, so treat the ratio as an order of magnitude;
- both denominators move with the Unicode version (blocks get added, code points get assigned), so these figures compare fonts with each other, not across years.

## Three limits, stated honestly {#limits}

1. **"Mapped to a non-zero glyph" counts as covered.** Analysis already drops code points mapped to `.notdef` (glyph 0), but a glyph with an **empty outline** still counts — it has a mapping, it is that glyph, it just draws nothing. So "100% coverage" does not mean "every character looks good".
2. **Variation sequences are not counted.** Variation selectors (`U+FE0E` / `U+FE0F` and friends) live in a separate `cmap` subtable and are not part of the ranges, so "does it have the colour emoji" is invisible here.
3. **Local fonts that were only probed have no coverage.** Their `cmapRanges` is `null`, the page has no ranges to work with, and it shows "not analysed".

## Why not precompute {#why-live}

Precomputing would mean storing one row per font × block, growing linearly with the collection, to replace a single traversal. Computing live is simpler and never goes stale when Unicode updates its blocks.

The price is recomputing on every page view — measured in milliseconds for 353 blocks against a few hundred ranges.

## Further reading


- Unicode: `Blocks.txt`, `extracted/DerivedName.txt`
