---
title: How the type panel works
keywords: type tester, type panel, font size, line height, letter spacing, em, text align, font-synthesis, synthetic bold, generated CSS
description: Which CSS each control writes, why tracking is in em and not px, what turning off synthetic bold actually shows you, and the two controls we deliberately left out.
section: tools
order: 3
updated: 2026-11-08
draft: false
---

The inspector's **type panel** does one thing: it puts the typeface into a block of real text so you can change size, line height, tracking and alignment, and see how it sets. It is not a design tool and it does not make choices for you — it puts the variables on the table.

## Seven controls, one CSS declaration each {#controls}

| Control | Declaration | Range |
| --- | --- | --- |
| Size | `font-size` | 12–96 px, step 1 |
| Line height | `line-height` | 0.8–2.6, unitless |
| Tracking | `letter-spacing` | −0.05–0.3 em, step 0.005 |
| left / center / right | `text-align` | one of three |
| Keep spaces | `white-space: pre-wrap` | on / off |
| Uppercase | `text-transform: uppercase` | on / off |
| No synthetic bold | `font-synthesis: none` | on / off |

There is also a text box: whatever is on the stage comes from it. The default is the usual quick-brown-fox line, but replace it — and if you read Chinese or Japanese, replace it with that, because a Latin pangram says very little about how CJK sets.

## Why tracking is in em {#why-em}

Tracking is a **relative** quantity. 0.05em is 0.6px at 12px and 4.8px at 96px — the same proportion. Written in px, changing the size means recomputing the number, and the apparent tightness changes anyway.

Line height is the same story: a unitless `line-height: 1.35` means "a multiple of the font size", and that multiple is what children inherit. A value like `21px` is inherited as a fixed 21px and looks cramped the moment the type gets bigger. See [line height and leading](/docs/line-height-leading).

## What turning off synthetic bold shows {#no-synthesis}

Weight and italic are just declarations. If the font does not have that weight, the browser usually **synthesises** one: thickening the outline, or shearing it. It looks bold, but it is not the weight the designer drew — spacing, joints and details were never redrawn.

Ticking No synthetic bold (`font-synthesis: none`) leaves the browser no room to fake it, so **whether the real weight exists becomes obvious at a glance**. That makes it an inspection tool rather than a taste option, and the fastest way to tell a family with four real weights from one with two weights and two fakes. See [weights and widths](/docs/weights-widths).

## The panel does not pretend {#not-ready}

Before a font is loaded the stage still renders — in the page's own font — and the controls still move, so you can see what each one does. But the status line at the top says plainly that the preview is using the page font, so you never mistake it for the target typeface.

That is also the premise of [which fonts can be tested](/docs/which-fonts-can-be-tested): library fonts have no bytes on the server, local fonts need permission, and when neither route works the panel can only offer the controls.

## Two controls we left out on purpose {#not-included}

- **`vertical-align`** — it aligns an **inline element** against the baseline, which means nothing in a single block of text; you need columns or mixed image-and-text layout for it to matter.
- **`word-wrap`** — the old name; modern CSS writes `overflow-wrap`. The stage also always breaks at word boundaries, because what is being tested here is tracking, line height and alignment, not long-word breaking.

## The CSS it generates {#css}

At the bottom the panel prints the declarations, ready to copy. Two details:

- **Only non-default values** — no `text-transform: none` lines that change nothing, so what you paste into a project is not padded with noise;
- **The real family name** — a remote font is registered in the browser under an internal name, but what belongs in your own project is the typeface's actual name.

## Further reading {#further}

- [Line height and leading](/docs/line-height-leading)
- [Tracking and kerning](/docs/tracking-kerning)
- [Weights and widths](/docs/weights-widths)
- [Which fonts can be tested](/docs/which-fonts-can-be-tested)
- [CSS: font-weight](/docs/css-font-weight), [CSS: line height](/docs/css-line-height)
