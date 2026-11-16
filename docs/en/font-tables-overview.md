---
title: Font tables
keywords: 字体表, 表目录, head, name, OS/2, cmap, maxp, sfnt
description: A TTF or OTF is an archive with a directory — one table per job. Here is the map, marked with where this site uses it.
section: fields
order: 0
updated: 2026-11-02
draft: false
---

A `.ttf` or `.otf` is not a blob of drawings. It is a **directory plus a stack of tables**: the header says which tables exist, where each one starts and how long it is, and then they follow.

This page is the entrance. Each key table has its own article.

## Why tables {#why-tables}
<!-- hint: Table | A font file is made of several tables. Character mapping, outlines, names and metrics each live in their own. -->

OpenType inherited the structure from TrueType. The big win is that tables are **optional**: a font can have `fvar` (variable axes) or none at all, and a program reads only the tables it understands, skipping the rest by length.

That is why "adding a capability" usually means "adding a table" rather than "changing the format" — and why one file can still open in software from the 1990s and in today's browser.

## The seven that matter most {#core-seven}

| Table | What it holds | Expanded in |
| --- | --- | --- |
| `head` | Global settings: `unitsPerEm` (how fine the font's grid is), bounding box, `macStyle` | [head / hhea / post](/docs/head-hhea-post) |
| `name` | Every name: family, subfamily, PostScript name, copyright and licence | [The name table](/docs/name-table) |
| `OS/2` | Weight, width, `fsSelection`, typographic ascender/descender, x-height, cap height | [The OS/2 table](/docs/os2-table) |
| `hhea` | The horizontal baseline trio: ascender / descender / lineGap | [head / hhea / post](/docs/head-hhea-post) |
| `cmap` | Code point → glyph index. **"Does this font have this character" is answered here** | [The cmap table](/docs/cmap-table) |
| `maxp` | How many glyphs there are | See "The rest" below |
| `post` | Italic angle, underline position and thickness, PostScript name | [head / hhea / post](/docs/head-hhea-post) |

Those seven answer most of what the inspector shows: what the font is called, how heavy it is, how far it reaches up and down, and which characters it knows.

## The rest {#others}

| Table | What it holds |
| --- | --- |
| `glyf` / `CFF` / `CFF2` | The actual outlines (TrueType uses `glyf`, OpenType/CFF uses `CFF`) |
| `GSUB` / `GPOS` / `GDEF` | Layout: ligatures, small caps, kerning, super/subscripts (see [GSUB / GPOS](/docs/gsub-gpos)) |
| `fvar` / `gvar` / `avar` / `STAT` | Variable fonts: axes, per-axis deltas, named instances |
| `cvt` / `fpgm` / `prep` | Hinting instructions |
| `DSIG` | A digital signature — in practice almost never used |
| `vhea` / `vmtx` | Vertical metrics for vertical writing |

Having a table is not the same as the table doing something: `GSUB` can describe ligatures that you only see if the renderer looks them up and the text happens to contain the right sequence.

## Where this site uses them {#where-in-site}

| Screen | Tables read |
| --- | --- |
| Inspector → basics | `name` (family and subfamily), `OS/2` (weight, italic bit), `maxp` (glyph count) |
| Metrics drawing | `head` (`unitsPerEm`), `hhea` and `OS/2` (baselines and extents), `post` (italic angle, underline) |
| Unicode coverage | `cmap` only |
| Specimen images | The outline tables, while avoiding `GSUB` substitutions |

## Who writes the tables {#who-writes}

Font editors (FontForge, RoboFont, Glyphs) fill them in and pack them on export. So the same design exported as `.ttf` and as `.otf` has completely different outline tables — while the other tables may be identical. **Format and design are separate things.**

## Further reading

- Microsoft Typography — the "Font Tables" section of the OpenType specification
- Apple TrueType Reference Manual — the original definitions of `head`, `hhea`, `post`
