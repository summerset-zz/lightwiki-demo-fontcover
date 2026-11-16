---
title: vertical-align
keywords: vertical-align, baseline, line box, inline-block, image gap, middle
description: It only positions inline boxes against the baseline — it is not a centring tool. And it explains the gap under images.
section: dev
order: 8
updated: 2026-11-02
draft: false
---

`vertical-align` is badly named: it suggests "align anything vertically", while it only affects **inline boxes and table cells**, and it measures against the **baseline**, not the centre of a container.

Writing `vertical-align: middle` on a block-level `div` does nothing — the most common misuse.

## Inline boxes only {#inline-only}
<!-- hint: vertical-align | vertical-align only affects inline elements and table cells. It aligns to the line box and baseline, not to the container. -->

It applies to:

- inline elements;
- inline-blocks and replaced elements (`img`, `<video>`, `<input>`);
- table cells (`td` / `th`) — different semantics, out of scope here.

It does **not** apply to block-level elements, nor to flex / grid **items** (those use `align-items` / `align-self`).

So before using it, check that the target is "a small thing inside a line".

## The values {#values}

| Value | Meaning |
| --- | --- |
| `baseline` | default; the element's own baseline aligns to the parent line box's baseline |
| `middle` | the element's midpoint aligns to "baseline + half the x-height" |
| `text-top` / `text-bottom` | align to the top / bottom of the parent's **content area** |
| `top` / `bottom` | align to the top / bottom of the **line box** |
| `sub` / `super` | shift down / up a little (exact offset is browser- and font-dependent) |
| `<length>` | shift from the baseline (positive is up) |
| `<percentage>` | shift by a percentage of `line-height` |

The `top` / `bottom` versus `text-top` / `text-bottom` distinction gets skipped often: the first pair is measured against the **line box** (including the space leading creates), the second against the **content area** (the font's extents). With a large line height they differ a lot.

## Where the baseline comes from {#baseline}

The line box's baseline is not a fixed height; it is computed from what participates in that line:

- with text present, the baseline of the text's font;
- with only an `inline-block`, the baseline of its **last line box**;
- if the `inline-block` has no content (or its `overflow` is not `visible`), its baseline is its **bottom edge**.

That last rule causes a good share of "why is this thing offset" surprises.

## middle is not vertical centring {#middle}

`middle` means "the element's vertical midpoint aligns to the parent's baseline plus half an x-height". It makes icons look aligned with text; it does **not** centre anything in a container.

To centre inside a container, use flex (`align-items: center`) or grid. Which is why in modern layout `vertical-align` is only for **inline alignment**.

## The gap under images {#image-gap}

The classic:

```html
<div><img src="photo.jpg" alt=""></div>
```

A few pixels of blank space appear below the image. Because `<img>` is an inline replaced element with `vertical-align: baseline`: it sits on the baseline, and below the baseline there is still **descender space** (for the tails of `g`, `p`).

Three fixes:

```css
img { display: block; }              /* cleanest: take it out of inline layout */
img { vertical-align: top; }         /* or middle / bottom */
div { line-height: 0; }              /* or zero the line height (careful with other content) */
```

`display: block` is the recommendation: an image is not text, so do not make it participate in a line box.

## Trying it here {#example}

The two squares below are `inline-block` and sit on the baseline by default. Switch the option and watch them move relative to the text:

{{InteractiveExample("CSS Demo: vertical-align")}}

```css interactive-example-choice
.box { vertical-align: baseline; }
```

```css interactive-example-choice
.box { vertical-align: middle; }
```

```css interactive-example-choice
.box { vertical-align: text-bottom; }
```

```css interactive-example-choice
.box { vertical-align: top; }
```

```css interactive-example-choice
.box { vertical-align: bottom; }
```

```html interactive-example
<div id="example-element">
  <span class="box"></span><span class="box"></span>text x
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 15px;
  line-height: 2.2;
}

.box {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-right: 6px;
  background: currentColor;
  opacity: 0.25;
}
```

Note that the options are **complete rules** (`.box { … }`): `vertical-align` has to act on the squares, not on the outer `div`.

## Why the type tester does not offer it {#this-site}

Phase 1's type preview renders **one block of text** with no inline elements inside, so `vertical-align` has nothing to act on, which is why the option was not implemented.

Where it is actually needed (aligning icons with text, images with captions) belongs in components, not in a type test.

## Further reading

- MDN: `vertical-align`
- CSS Inline Layout: line boxes, baselines and `vertical-align`
- This site: [line-height](/docs/css-line-height), [Synthesis and misc](/docs/css-text-misc)
