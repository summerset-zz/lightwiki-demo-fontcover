---
title: Tracking and kerning
keywords: 字距, 字间距, tracking, letter-spacing, 字偶距, kerning, AV
description: One loosens everything evenly, the other fixes specific pairs. Which one does a designer mean by "a bit tighter"?
section: design
order: 2
updated: 2026-11-07
draft: false
---

Both words are about the space between letters, but they work at completely different scopes: **tracking loosens or tightens everything evenly**, **kerning corrects specific pairs**. In design software they are usually two separate fields; in CSS they are `letter-spacing` and `font-kerning`.

## Tracking: uniform adjustment {#tracking}
<!-- hint: Tracking | Tracking adds or removes spacing across a whole run, unlike kerning, which adjusts specific pairs. -->

**Tracking** adds or removes space between all characters in a run. Its job is to compensate for size:

- large type (headlines, posters) usually wants **negative tracking**, because spacing designed for text looks loose when scaled up;
- small type (captions, footnotes) wants **positive tracking**, otherwise letters blur together.

In CSS that is `letter-spacing`:

```css
.display {
  font-size: 64px;
  letter-spacing: -0.02em;
}

.caption {
  font-size: 12px;
  letter-spacing: 0.01em;
}
```

Use `em`, not `px`, so the ratio survives a size change.

⚠️ A CSS detail: `letter-spacing` is added **after every character** (including the last), so centred or right-aligned text looks slightly off-centre — that extra space is really there.

Start with the overall looseness, then look at the pairs: the last option turns kerning off, and the gaps in `WAVE` and `To` open up.

{{InteractiveExample("CSS Demo: letter-spacing")}}

```css interactive-example-choice
letter-spacing: -0.04em;
```

```css interactive-example-choice
letter-spacing: 0;
```

```css interactive-example-choice
letter-spacing: 0.12em;
```

```css interactive-example-choice
font-kerning: none;
```

```html interactive-example
<div id="example-element">
  WAVE AVATAR To Yo
  <br>
  Chinese text is unaffected by kerning
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 26px;
  font-family: Georgia, serif;
}
```

## Kerning: pair corrections {#kerning}

**Kerning** adjusts only certain **pairs**. The classic cases are `AV`, `To`, `TA`, `yo`: their shapes naturally leave a large hole, so the designer writes a negative value for exactly that combination.

It lives in the `kern` feature of the `GPOS` table (see [GSUB / GPOS](/docs/gsub-gpos)); very old fonts put it in a separate `kern` table.

In CSS that is `font-kerning`:

```css
body {
  font-kerning: normal;   /* the default: use the font's kerning */
}
```

Turning it off generally makes typography worse, unless you are setting code or tables where strict equal spacing matters.

<figure style="margin: 1.75rem 0">
  <div
    style="display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.75rem 1.5rem; align-items: baseline; font-family: Georgia, 'Times New Roman', serif; font-size: 26px"
  >
    <div style="white-space: nowrap">AVATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">normal</div>
    <div style="letter-spacing: 9px; white-space: nowrap">AVATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">tracking: spaced evenly</div>
    <div style="white-space: nowrap"><span style="margin-right: 26px">A</span>VATAR</div>
    <div style="font-family: system-ui, sans-serif; font-size: 11px; opacity: 0.6">kerning: only A–V</div>
  </div>
  <figcaption style="margin-top: 0.75rem; font-size: 0.8125rem; opacity: 0.65">
    The second line opens every gap; the third only touches the one between A and V.
  </figcaption>
</figure>

## How pair kerning is stored {#kerning-values}

<!-- source: en.wikipedia.org | Kerning | 1383272575 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Kerning values, Kerning tables and Contextual kerning sections; kept the units, the two generations of storage and contextual adjustments -->

In a font, a kerning adjustment is **a number**: positive opens the pair up, negative closes it, and nearly all of them are negative. The unit is the font's own (one em split into 1000 or 2048 parts — see [glyphs and the em box](/docs/glyph-outline-and-em)), so the same value means different physical distances in different typefaces.

There are two generations of storage:

| Where | Era | What it is |
| --- | --- | --- |
| `kern` table | TrueType | One record per pair: two characters and a value; a few hundred pairs typically, over a thousand in some fonts |
| The `kern` feature in GPOS | OpenType | Far more elaborate — lookups, subtables, classes — and able to adjust by class and by context |

So "does this font kern" is not answered by looking for a `kern` table: CFF-flavoured OpenType has none at all, and recent [Adobe](/credits/maker/adobe-systems) fonts specify kerning through GPOS only.

One step further is **contextual kerning**, where the adjustment depends on more than the previous glyph. The textbook case is `f.”` at the end of a quotation — the period pulls the `f` and the closing quote together, even though those two characters on their own need nothing.

## When it applies in a browser {#kerning-browsers}

<!-- source: en.wikipedia.org | Kerning | 1383272575 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Kerning in browsers section; rewritten against the current CSS spec, browser version lists dropped -->

```css
/* Default: let the engine decide — some turn kerning off at small sizes for legibility */
font-kerning: auto;

/* Use the pairs the font declares, always */
font-kerning: normal;

/* Explicitly off */
font-kerning: none;
```

`text-rendering: optimizeLegibility` is the old trick. It does enable kerning, but it also changes other things (ligatures, performance), so there is no reason to use it for kerning today. `font-feature-settings: "kern"` asks for the feature by name; it behaves much like `font-kerning: normal`, but silently does nothing when the font lacks the feature.

## Telling them apart {#which}

A quick test:

- "the whole block looks too loose / too tight" → **tracking**;
- "the gap between these two letters is too big" → **kerning**.

Marking `AV` to be tightened on a layout is kerning; "body at -10" is tracking.

## Chinese and mixed setting {#cjk}

Chinese has no notion of kerning: Han characters sit in equal-width frames and need no pair corrections. What Chinese calls 字距 is closer to tracking, and it also has to consider:

- **full-width punctuation**: a full stop or comma carries half-width white space and looks hollow next to Latin letters;
- **mixed Chinese and Latin**: a little space between them is desirable (CSS `text-spacing-trim` / `text-autospace` do this, with uneven support);
- **line-start and line-end rules** (avoiding punctuation at the edges): a line-breaking rule, not a spacing one.

That is why copying Western tracking values into Chinese type looks bad.

## Adjusting it here {#this-site}

The type preview has a spacing control in `em` — exactly `letter-spacing`, so what you see is what CSS would do.

Kerning is baked into the font and has no switch here; it is on by default (`font-kerning: auto`, applied when the font has `kern` data).

## One easily missed consequence {#pitfall}

More `letter-spacing` means **fewer characters per line**, so every line break moves. When adjusting spacing, look at the whole paragraph, not one line — watch for ugly breaks at line ends.

## Further reading

- MDN: `letter-spacing`, `font-kerning`
- OpenType spec: the `kern` feature in `GPOS`
- This site: [GSUB / GPOS](/docs/gsub-gpos)
