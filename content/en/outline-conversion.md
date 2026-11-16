---
title: Text to outlines
keywords: convert to outlines, outline, vectorise, trace, embedding, licence, EULA, commercial use, curves, PDF
description: Converting text to outlines solves "the other side has no such font", at the price of it no longer being text — and the licence does not get any looser either.
section: design
order: 8
updated: 2026-11-02
draft: false
---

Converting text to outlines is the most common insurance policy in a production workflow. It does solve a real class of problems, and it quietly takes away a lot of things — one of which is "it is still text".

## What it does {#what}
<!-- hint: Converting to outlines | Converting to outlines turns text into vector paths. The layout engine no longer applies, the text cannot be edited or selected, and the result does not depend on installed fonts. -->

A text object holds a string of characters, a reference to a font, and a set of layout parameters. Outlining **evaluates that reference on the spot**: glyph outlines are expanded into a pile of Bézier paths, and the font is forgotten.

What goes away at the same time:

- the characters themselves (not searchable, not copyable, not readable by a screen reader);
- glyph names and attribution (which typeface this shape came from is no longer in the file);
- layout parameters (tracking, kerning, OpenType features, hinting);
- editability (change one word and you go back to the layout application).

## When you really need it {#when}

- the output side **does not have the font and may not embed it** (see the note on embedding bits below);
- the headline has to be distorted, masked or given an effect — the outlines have to move;
- it goes into an old pipeline that only accepts curves (laser cutting, some RIPs, certain 3D tools);
- a logo is being finalised: it should no longer be affected by "the font" at all.

Outside of these, most "just to be safe" outlining is unnecessary.

## What it costs {#cost}

The result is still vector, so it scales without limit — which is often mistaken for "no loss". The real losses are elsewhere:

- **no search, no copy, no reading out loud**. Accessibility and findability disappear together;
- **the file may get bigger**. A Han glyph has hundreds of nodes; outlining a paragraph is often bulkier than the font file itself;
- **small text degrades**. The finer the detail, the more visible the approximation — especially from a low-resolution source;
- **it cannot be changed**. "Please swap that one word in the headline" means going back and redoing it.

## Screenshot and trace {#trace}

One variant deserves its own section: **typeset in an application that works, take a screenshot, then "image trace" it into vectors**.

It is usually a workaround for a text engine that cannot shape (Arabic letters not connecting, vertical layout done badly — see [Writing direction](/docs/writing-direction)). The trouble is that it conflates two problems:

- it fixes **the application cannot shape**, not **the font is missing**;
- the traced curves are an **approximation of pixel edges**: anti-aliasing is treated as real contour, corners round off, nodes explode;
- the text becomes graphics, and every loss listed above is paid at once.

If the goal is simply to get the text to display correctly, try the fallback workflow in [Writing direction](/docs/writing-direction) first: typesetting in an engine that can shape is far more reliable than tracing.

## The licence does not change {#license}

The most common misunderstanding: **outlining does not change the licence**. Turning glyphs into paths is still *using the typeface*, not "now it is free".

A few general points (**not legal advice**; for commercial work follow the actual EULA and professional advice):

- font files are generally protected as **computer programs**; glyph designs are not protected by copyright in some jurisdictions but may be covered by design patents, and some regions have specific protection for typeface libraries;
- courts have reached different conclusions on single characters versus whole libraries, so "it is only a few characters" is not a safety argument;
- commercial use, trademark use, embedding in software and redistribution with a product are usually **separate** clauses;
- free fonts are no different: the OFL allows commercial use and modification, but if a Reserved Font Name is declared, a modified version may not keep that name; copyright notices still have to travel with redistribution.

Searching a EULA for these words is more useful than searching for "can I use it commercially": `embedding`, `outline`, `convert to curves`, `broadcast`, `logo`, `trademark`, `app`.

## Safer alternatives {#alternatives}

1. **Embed a font subset.** A subset embedded in a PDF keeps the text while requiring no font installation on the other side; whether and how far you may embed is stated by the font itself in the `fsType` bits of its `OS/2` table (see [The OS/2 table](/docs/os2-table));
2. **Keep the text layer.** When exporting a PDF, check the text is still selectable — selectable means searchable, readable and copyable;
3. **Use `@font-face` on the web.** Where the licence allows it, keeping `<text>` in SVG or HTML is far easier to maintain than outlines;
4. **Outline only what must be outlined.** Keep body text as text; outline just the finished headline artwork.

## Checklist {#checklist}

- Is outlining solving "font missing" or "application cannot shape"? The second one calls for a different tool;
- After outlining, can the client still search this text?
- Have the font name and licence details been recorded (somewhere other than the outlined file — it no longer contains them)?
- What do the `embedding` / `outline` / `logo` clauses of the EULA actually say?
- Is the text in this PDF still selectable? If not, was that intended?
