---
title: The cmap table
keywords: cmap, 覆盖, 码位, 字形索引, notdef, 豆腐块, 子表, format 4, format 12
description: Only this table can answer "does the font have this character" — and it explains why "it has it" sometimes still draws nothing.
section: fields
order: 4
updated: 2026-11-02
draft: false
---

Glyphs inside a font are stored by **number**, not by character. `cmap` is the cross-reference: give it a character's code point and it tells you which glyph to use. Every "does this font know this character" question is answered here.

## What is inside {#what}
<!-- hint: cmap | The cmap maps code points to glyphs. It determines which characters the font supports. -->

Three levels:

1. A header with a version and a subtable count;
2. **Encoding records**: `platformID` + `encodingID` + subtable offset;
3. **Subtables**, each storing "code point → glyph index" with a different compression scheme.

A font usually carries several subtables: one for the BMP, one for full Unicode, one for an old symbol encoding. Programs pick the one matching their platform and capability.

## The formats you will meet {#formats}

| Format | Purpose |
| --- | --- |
| 0 | A 256-byte lookup table, single-byte encodings only, old fonts |
| 4 | **Segmented mapping for the BMP** — the most common format, storing runs as segments |
| 6 | A direct lookup over one contiguous range |
| 12 | **Segmented coverage** with 32-bit code points, including beyond the BMP (emoji, CJK extensions) |
| 13 | Many-to-one: a whole span of code points pointing at one glyph (fallback fonts) |
| 14 | Unicode variation sequences: choosing a specific variant glyph |

The platform combinations you will bump into most are Windows `3/1` (BMP) and `3/10` (full Unicode), plus Unicode platform `0/3` and `0/4`.

## Symbol fonts and the F000 offset {#symbol}
<!-- hint: Private use area | Icon fonts usually place glyphs in the private use area starting at U+F000, then use a cmap offset so those glyphs answer to regular code points. -->

Some older fonts are "symbol fonts": platform 3, encoding 0, with a subtable mapping ASCII codes to pictures but requiring that **the code point be offset by `0xF000`** at use time. The same glyph is then reached as `U+0041` by one piece of software and as `U+F041` by another.

That is not a bug; it is the convention of its era. New fonts rarely do it, but old ones — icon fonts especially — still do.

## "Mapped" is not the same as "drawable" {#empty-glyphs}
<!-- hint: cmap and glyphs | The cmap maps code points to glyphs. A mapping does not guarantee that the glyph has outlines; an empty glyph draws nothing. -->

`cmap` only says "which glyph number". Three situations make it look like a lie:

1. **Mapped to glyph 0.** Glyph 0 is always `.notdef`, the tofu box. Some fonts point all unfinished characters at 0 instead of omitting the mapping.
2. **The glyph exists but the outline is empty** (or contains zero-length paths). The browser cannot draw anything, so it **falls back** to the next font — and you see another font's shape, not proof that this font has it (see [Shaping and font fallback](/docs/unicode-shaping-fallback)).
3. **Variation selectors.** The base character maps fine, but the requested variant (`U+FE0F` and friends) is missing from format 14, so you get the default glyph.

The character drawer on this site warns about case 2, because "looks present" and "actually drawn by this font" are different claims.

## How this site uses it {#coverage}

- When analysing a font, only `cmap` is read; its mappings are compressed into code point ranges stored in the archive (`cmapRanges`) — a full CJK font lands in a few hundred ranges, well under a few dozen kilobytes;
- The coverage panel tests "is this code point present" against those ranges;
- The denominator is **assigned** code points, not range length: a CJK block spans tens of thousands of code points, many unassigned, and using the block size would report single-digit percentages.

## One easy misunderstanding {#pitfall}

The ranges come from mappings, **not proof of a good shape**. A font may map a code point to a bare placeholder outline. What a character looks like lives in the outline tables (`glyf` / `CFF`), not in `cmap`.

## Further reading

- OpenType spec: the `cmap` table — binary layout of every subtable format
- OpenType spec: symbol fonts and the platform / encoding combination table
