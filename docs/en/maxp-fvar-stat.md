---
title: maxp and axes
keywords: maxp, 字形数, fvar, 变量轴, STAT, 命名实例, wght, opsz
description: Why the glyph count is not "how many characters", and how one file holds endless weights.
section: fields
order: 5
updated: 2026-11-02
draft: false
---

`maxp` does one job: tell software how many glyphs the font contains. `fvar` and `STAT` exist only in variable fonts and describe which axes there are, their ranges, and what the named instances are called.

They are covered together because all three answer "how much stuff is in here" — one counts glyphs, the others count variations.

## maxp: the glyph count {#maxp}
<!-- hint: Glyph count | numGlyphs in maxp counts glyphs in the file, not characters it can show. Ligatures and alternates take slots, and several code points may share one glyph; coverage itself comes from the cmap. -->

Two versions:

| Version | Contents | Used by |
| --- | --- | --- |
| 0.5 | Just `numGlyphs` | CFF-outline fonts |
| 1.0 | `numGlyphs` plus maxima per point type and hinting counters | TrueType-outline fonts |

**`numGlyphs` is not "how many characters it knows"**, for three reasons:

1. One glyph may be mapped from several code points (many-to-one in `cmap`), so code points ≥ glyphs;
2. Ligatures, small caps, super/subscripts are alternative glyphs that take a slot but no code point;
3. `.notdef` (glyph 0) is in there too.

So a 2,000-glyph font might cover 3,000 code points — or only 800. To know coverage, read `cmap`.

## fvar: the axes {#fvar}

`fvar` lists the dimensions the font can vary along. Four numbers per axis matter most:

| Field | Meaning |
| --- | --- |
| `min` / `default` / `max` | The range, and the position used when nothing is specified |
| `tag` | The axis name, four characters |

Common axes:

| tag | Meaning | Units |
| --- | --- | --- |
| `wght` | Weight | Same scale as `usWeightClass` (100–900) |
| `wdth` | Width | Percentage, 100 = normal |
| `opsz` | Optical size | Roughly the font size the design was drawn for |
| `slnt` | Slant | Degrees |
| `ital` | Italic | 0 or 1 |

Custom axes start with an uppercase letter (`GRAD`, `XTRA`); lowercase prefixes are reserved for standard axes. So `wght` needs no documentation, `GRAD` does.

## Named instances {#instances}
<!-- hint: Named instances | A named instance is a combination of axis positions with a name (Thin, Bold). Only variable files contain them; a static font is one file per style. -->

`fvar` also carries **named instances**: combinations of axis positions with a name (Regular, Bold, Display), stored in the `name` table.

That is why one variable font file can appear as several entries in a system font list: they are not separate files but presets inside one.

## STAT: how the system groups the variants {#stat}

`STAT` is newer and tells the operating system which axes exist and what a given position should be called, so variable fonts get grouped into the right family and labelled correctly in menus.

The division of labour: `fvar` is for **rendering** (values interpolate here), `STAT` is for **naming and grouping** (what this position should be called). When the two disagree, different systems show different names.

## Related tables {#related}

- `gvar`: per-axis glyph deltas in TrueType variable fonts;
- `CFF2`: the CFF equivalent;
- `avar`: axis mapping, remapping user-facing values into design space (common for non-linear `wght` distributions);
- `HVAR` / `VVAR` / `MVAR`: metrics that vary along axes.

## How this site handles variable fonts {#this-site}

Conservatively: **one file is one entry**, recording only the default weight and width. Axes are not expanded into multiple faces.

The reason is the data model: archives and favourites are keyed by "one face, one identifier", and a variable font's "one face" is not a discrete object. Picking a position on an axis belongs to the type tester.

## Further reading

- OpenType spec: `maxp`, `fvar`, `gvar`, `avar`, `STAT`
- OpenType spec: registered axis tags (the full list of standard axes)
