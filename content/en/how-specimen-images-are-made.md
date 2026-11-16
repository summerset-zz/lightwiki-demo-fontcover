---
title: How specimen images are made
keywords: specimen, specimen image, SVG, outlines, writing unit, letter set, coverage, code point grid, shaping, placeholder font, cache
description: SVGs drawn from the font's own outlines. Which scripts get one is decided by "90% of the letter set", scripts that need shaping get a code point grid instead — and when there is no image at all.
section: tools
order: 4
updated: 2026-11-08
draft: false
---

Every font here has specimen images, and they are **not screenshots**: each one is an SVG drawn from that font's own outlines. Viewing one needs no font file, no download, and nothing installed on the visitor's machine.

## Why SVG rather than a screenshot {#why-svg}

Three reasons, all hard:

- **A list page shows dozens of fonts.** Loading each font file to render it would mean hundreds of megabytes per screen, most of it for fonts nobody looks at twice.
- **The image is derived.** Its content depends only on the outlines, a fixed specimen list and a render version — so it can be content-addressed and cached forever; drawing the same font again produces byte-identical output.
- **The size is known.** The SVG carries `width` / `height`, so it never pushes the page around while loading.

The price is that it shows **the things we chose to draw**, not "this font set in any text you like". For that, use the [type panel](/docs/how-the-type-tester-works).

## The test: 90% of the letter set {#threshold}

First question: **which scripts should this font get an image for?**

The early answer was "look at which Unicode blocks it covers", which does not work. Blocks mix historical characters, cantillation marks, punctuation and symbols from other scripts. Hebrew is the classic case: sixty of the ninety code points in the main block are cantillation marks, so a perfectly good Hebrew font measured by block coverage looks like it does not support Hebrew.

The test is now a **letter set**: each unit — a writing system, or a language — carries a hand-reviewable list of letters, and a font that covers **90%** of it counts as supporting that unit. The last ten percent is slack, because missing a few rare letters is normal — and **missing letters are left blank in the image**, which is information in itself rather than a reason to drop the whole image.

Both the letter sets and the specimen list are constants, versioned together: change them and the version has to go up, or new images collide with old keys.

## Text or grid {#text-or-grid}

Once a unit passes, the image is drawn one of two ways:

| Drawing | For | Shows |
| --- | --- | --- |
| **Sample sentences** | Latin, Greek, Cyrillic, Han (simplified and traditional), kana, Hangul | A few lines of real text in that language, set character by character |
| **Code point grid** | Everything else: Arabic, Hebrew, Indic, Thai, Khmer, Myanmar, Tibetan, Yi… | One glyph per cell, with a `U+XXXX` caption |

Why the second group cannot be set as sentences: this renderer is not HarfBuzz. Ligatures, contextual substitution and mark positioning — anything that **reorders or reshapes** — are not implemented here, so setting them would produce something wrong, and readers would conclude the font is broken. The grid shows the font's glyphs as they are, which is honest and is exactly what someone comparing "what does this font actually draw in this block" wants to see.

One thing worth stating plainly: **Arabic in the grid is in isolated forms**, not joined. That is not a defect — a grid shows single glyphs by definition. For how joining works, see [direction and joining](/docs/writing-direction).

## How the 48 cells are picked {#grid-picks}

A grid is 12 columns × 4 rows = 48 cells, and a font gets at most four script grids. Three rules:

- **Only letters the font actually has** — nothing is padded in;
- **Even sampling**, not the first 48. Letter sets are ordered by code point, so taking the first 48 would always show the opening letters; Arabic has over 150, and you would learn nothing;
- **Frozen in the unit table**, not picked at render time, so that two fonts sample the same characters and can be compared.

## When there is no image {#missing}

Three cases, and the card says "no specimen yet":

1. **Under 90%** — the font largely does not support that script, and drawing it would mislead;
2. **Placeholder fonts**, where the `cmap` claims an order of magnitude more code points than the font has glyphs — thousands of characters sharing one empty glyph. In the data they "cover everything"; drawn, they are blank. We do not count them as supporting the script, and we do not draw them;
3. **Colour and bitmap fonts** — the glyphs are bitmaps (CBDT / sbix) with no `glyf` / `CFF` outlines, and drawing outlines yields a blank page. The font is fine; our drawing method is not.

## One ink, content-addressed {#cache}

The stored image carries **a single ink colour**; the page uses it as a CSS mask and paints it in the current theme colour, so one file works in light and dark alike.

The key is a hash of the SVG content: identical content is reused and never expires, different content is a new key and the old one falls away. That is also why changing the layout or the sample sentences has to bump the version.

## Where to see them {#this-site}

- The first image is the cover on font cards;
- The font detail page has the full set, click to zoom;
- The inspector's **basics** panel shows the same images next to the language and writing-system labels — the place to check which script an image belongs to.

## Further reading {#further}

- [How coverage is calculated](/docs/how-coverage-is-calculated)
- [Writing systems at a glance](/writing-systems), [Languages and scripts](/docs/language-script)
- [Glyphs, outlines and the em box](/docs/glyph-outline-and-em)
- [Direction and joining](/docs/writing-direction)
- [Which fonts can be tested](/docs/which-fonts-can-be-tested)
