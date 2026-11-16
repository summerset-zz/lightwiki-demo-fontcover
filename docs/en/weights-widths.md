---
title: Weights and widths
keywords: 字重, 字宽, weight, width, Condensed, Thin, Black
description: 100–900 is a suggested scale. Light, Book, Medium and Demi do not map to fixed numbers — how to read these values.
section: design
order: 3
updated: 2026-11-02
draft: false
---

"How many weights does this font have" sounds simple, but three vocabularies are in play at once: numbers inside the font, words in the family name, and style names in design software. They disagree constantly.

## The numbers are a suggested scale {#scale}
<!-- hint: Weight class | usWeightClass in the OS/2 table is a whole number from 1 to 1000, conventionally in hundreds: 100 Thin, 400 Regular, 700 Bold. It is neither a percentage nor a font size. -->

OpenType stores weight in `OS/2.usWeightClass`, range 1–1000, **conventionally** multiples of 100:

| Value | Usual name |
| --- | --- |
| 100 | Thin / Hairline |
| 200 | Extra Light / Ultra Light |
| 300 | Light |
| 400 | Regular / Normal / Book |
| 500 | Medium |
| 600 | Semi Bold / Demi Bold |
| 700 | Bold |
| 800 | Extra Bold / Ultra Bold |
| 900 | Black / Heavy |

The names in the table are convention, not standard. One font calls its regular 400, another 350. One "Book" is 400, another has Book at 350 and Regular at 400.

## Names in the family are unreliable {#names}

The name and the number may disagree:

- family says `Medium` while `usWeightClass` is something other than 500;
- both `Demi` and `Semi Bold` appear across foundries;
- 900 is `Ultra` to one foundry, `Black` to another, `Heavy` to a third.

So between "pick by name" and "pick by number", **pick by how it renders**. The number is an approximate label for software.

## Width is a separate axis {#width}
<!-- hint: Width class | usWidthClass is a whole number from 1 to 9: 1 is narrowest, 5 normal and 9 widest. It is independent of weight. -->

Width and weight are **independent dimensions**:

| Word | `usWidthClass` | Usual name |
| --- | --- | --- |
| Very narrow | 1 | Ultra Condensed |
| Narrow | 3 | Condensed / Narrow |
| Normal | 5 | Normal |
| Wide | 7 | Expanded |
| Very wide | 9 | Ultra Expanded |

In CSS this is `font-stretch`, now more often written as a percentage: `font-stretch: 75%`.

## Variable fonts turn the scale into a range {#variable}

A static family offers a few discrete weights; a variable font makes `wght` continuous (usually 100–900) and renders any value in between.

Practically: you no longer "pick one of five weights" but may ask for 437 — though nothing guarantees the drawing is good there, since the designer only checked a handful of positions.

## Mapping to CSS {#css}

A CSS `font-weight` number (1–1000) looks for a face declaring the same value, falls back to the nearest by a fixed rule, and finally synthesises if nothing fits.

Which means **the same CSS can render differently across fonts**, because "nearest face" differs. See [font-weight and the bold alias](/docs/css-font-weight).

## How this site shows it {#this-site}

The inspector reads `usWeightClass` directly. When the value was estimated rather than declared by the font, it carries a `≈` with an explanation — readable, but not a precise fact.

Width is shown when present and left blank otherwise; nothing is guessed.

## Advice when choosing {#advice}

1. Judge by **actual rendering** (specimen or preview), not the name;
2. For weight contrast, make sure the weights really exist rather than being synthesised;
3. If Chinese and Latin come from different families, note that their 500 / 600 may differ visually;
4. For variable fonts, check whether a `wght` axis exists and its range (some only span 400–700).

## Further reading

- OpenType spec: `usWeightClass` and `usWidthClass` in `OS/2`
- MDN: `font-weight`, `font-stretch`
- This site: [font-weight and the bold alias](/docs/css-font-weight), [maxp and variable axes](/docs/maxp-fvar-stat)
