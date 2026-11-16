---
title: Font formats
keywords: TTF, OTF, WOFF, WOFF2, TTC, 字体格式, sfnt, 文件头
description: The extension is a habit, not a spec. OTF is not "CFF only", and WOFF is not a new format.
section: basics
order: 2
updated: 2026-11-02
draft: false
---

File extensions are **convention**, not specification. `.ttf` and `.otf` can be the same container holding different outlines; `.woff` and `.woff2` are not new formats at all but compressed wrappers for the web.

## Read the header, not the extension {#header}

The first four bytes (`sfntVersion`) say what the file really is:

| First bytes | What it is |
| --- | --- |
| `00 01 00 00` | TrueType container |
| `OTTO` | OpenType container (usually CFF outlines) |
| `true` / `typ1` | Very old Apple variants |
| `ttcf` | Font collection (several faces in one file) |
| `wOFF` | WOFF wrapper |
| `wOF2` | WOFF2 wrapper |

So neither "starts with `OTTO` means it must be `.otf`" nor "`.otf` can never hold TrueType outlines" is true — the convention says so, the spec does not.

## TrueType and CFF: two outline flavours {#outlines}

The real difference is how outlines are stored:

- **TrueType**: quadratic Béziers, in `glyf` plus `loca`;
- **CFF / CFF2**: cubic Béziers, in `CFF ` (note the trailing space) or `CFF2`.

Both live inside the same table framework, so `name`, `OS/2` and `cmap` look identical. Which is why the same design exported in both formats keeps almost everything except the outlines.

## Font collections {#collection}

`.ttc` / `.otc` pack several faces of one family into a single file, sharing parts of `cmap` and `name` to save space. Common among system fonts (many macOS system fonts, for instance).

To software this is not "one font" but a **container**: pick a face by index. When this site meets a collection, it prefers the face matching the requested family.

## WOFF and WOFF2 {#woff}
<!-- hint: WOFF2 | WOFF2 is a compressed container for web fonts. It uses Brotli and reorders some tables, and unpacks to an ordinary font file. -->

Both are **containers**: the original font, compressed, plus metadata and private-data slots. Unwrapped, what remains is an ordinary TrueType/OpenType font.

- WOFF: zlib compression;
- WOFF2: Brotli, plus a restructured table layout — substantially smaller.

Browsers support WOFF2, with older ones falling back to WOFF. Shipping WOFF2 first is not laziness; it is genuinely smaller.

## Variable fonts are extra tables, not a format {#variable}

A variable font has the same extension as a static one; what differs is the presence of `fvar` (axes), `gvar` or `CFF2` (per-axis deltas) and `STAT` (style attributes). So:

- a `.ttf` may contain endless weights (`fvar` + `gvar`);
- or just one (static).

The extension cannot tell you; the table directory can.

## This site's position {#this-site}

This site **does not host or offer downloads** of font files: the server keeps fingerprints and metadata. What you see here is "this font exists, this is what it looks like, these are its metrics" — not "click to download".

Loading a library font in the inspector fetches its bytes from the upstream CDN into **browser memory** for temporary registration; nothing lands in this site's storage.

## Further reading

- OpenType spec: the sfnt container, `glyf` and `CFF`
- W3C: the WOFF and WOFF2 specifications
- OpenType spec: `fvar`, `gvar`, `STAT`
