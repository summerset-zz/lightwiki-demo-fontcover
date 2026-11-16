---
title: Code points
keywords: 码位, U+, 平面, 代理对, UTF-8, UTF-16, emoji, code point
description: A code point is a number, not a byte. Why "😀" has length 2 in JavaScript, and how to read U+1F600.
section: unicode
order: 0
updated: 2026-11-07
draft: false
---

The first job of Unicode is turning a character into a **number** — a code point. How that number is stored (bytes) is a separate layer. Get this straight and "why is the length 2" and "why is one character seven code points" both make sense.

## A code point is a number {#what}
<!-- hint: Code point | A code point is a character number in Unicode, written in the form U+4E00. One visible character may consist of several code points. -->

Every character has a number between 0 and `0x10FFFF`, written `U+` plus at least four hex digits:

| Character | Code point |
| --- | --- |
| `A` | `U+0041` |
| `中` | `U+4E2D` |
| `😀` | `U+1F600` |

The digit count is not fixed: four is conventional inside the BMP, five or six beyond it.

## Planes {#planes}
<!-- hint: Plane | Unicode divides its code points into 17 planes of 65536 each. Plane 0, the BMP, holds most characters in everyday use. -->

Divide 0–`0x10FFFF` into blocks of 65,536 and you get **planes**:

| Plane | Range | Contents |
| --- | --- | --- |
| 0 | `U+0000`–`U+FFFF` | **Basic Multilingual Plane (BMP)** — nearly all everyday characters |
| 1 | `U+10000`–`U+1FFFF` | Supplementary Multilingual: emoji, historic scripts |
| 2 | `U+20000`–`U+2FFFF` | Supplementary Ideographic: CJK Extension B and friends |
| 3–13 | — | Unassigned |
| 14 | `U+E0000`–`U+EFFFF` | Supplementary Special-purpose |
| 15–16 | `U+F0000`–`U+10FFFF` | Private use |

Private-use planes are for anyone's own definitions: a font may put any drawing there, and Unicode says nothing about what it is called.

## Surrogates are not characters {#surrogates}

`U+D800`–`U+DFFF` **never** correspond to characters. They exist for UTF-16: a character outside the BMP is spelled with two 16-bit code units, and those units land in this range.

So "is there a character in the surrogate range" is a meaningless question — they are only an encoding halfway house.

## UTF-8 and UTF-16 {#encodings}
<!-- hint: UTF-8 and UTF-16 | One code point takes 1 to 4 bytes in UTF-8 and 2 or 4 bytes in UTF-16, so a byte count has to say which encoding it means. -->

- **UTF-8** uses 1–4 bytes per code point and is ASCII-compatible; the default for files and the web;
- **UTF-16** uses 2 bytes (one code unit) inside the BMP and two units (a surrogate pair) outside it.

JavaScript strings are UTF-16 code unit sequences, hence:

```js
'😀'.length                  // 2  ← two code units
[...'😀'].length             // 1  ← one code point
'😀'.codePointAt(0)          // 128512 (0x1F600)
String.fromCodePoint(0x1F600) // '😀'
```

Likewise `slice(0, 1)` cuts an emoji into half a surrogate pair and yields garbage. To iterate "characters", use `for...of` or spread into an array, not indices.

## One "character" can be several code points {#sequences}

Code points are encoding units, not what the eye sees as one character:

- `é` can be `U+00E9`, or `U+0065` + `U+0301` (letter plus accent);
- the family emoji 👨‍👩‍👧 is man + zero-width joiner + woman + zero-width joiner + girl — five code points;
- flag emoji are two "regional indicator" code points.

The process that groups these into one visual character is the **grapheme cluster**, defined by Unicode segmentation rules — not by byte counts.

<figure style="margin: 1.75rem 0">
  <div style="font-size: 34px; line-height: 1.2">👨‍👩‍👧</div>
  <div style="margin-top: 0.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; opacity: 0.65">
    U+1F468 U+200D U+1F469 U+200D U+1F467
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">
    Five code points, eight UTF-16 code units, one visual character (grapheme cluster). The U+200D in between is a zero-width joiner: it takes no space itself but decides whether the emoji on either side merge into one.
  </figcaption>
</figure>

## Variation selectors {#variation-selectors}
<!-- hint: Variation selector | A variation selector follows a base character and selects a specific form, such as colour or monochrome emoji, or one variant of a Han character. -->

Some characters have several shapes (text-style versus emoji-style), chosen with a variation selector:

- `U+FE0E`: text presentation;
- `U+FE0F`: emoji presentation.

They render nothing themselves; they are modifiers attached to the preceding character. A font must declare support in `cmap`'s variation-sequence subtable, otherwise the selector is ignored.

## Compatibility characters: copies kept for legacy encodings {#compat}
<!-- hint: Compatibility character | A duplicate code point kept so text can round-trip through a legacy encoding, such as ﬁ for f plus i. NFKC folds it back. -->

<!-- source: en.wikipedia.org | Universal Character Set characters | 1384074310 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Compatibility characters section; added the NFC/NFKC guidance and our own examples, cut the character-versus-glyph discussion -->

A further group of code points exists not because a character was missing but because **other character sets drew a distinction** the Unicode model does not. These are **compatibility characters**, and there are thousands of them. They are there for one reason: so text can round-trip through a legacy encoding unchanged.

| Looks like | Code point | Equivalent to |
| --- | --- | --- |
| `ﬁ` ligature | `U+FB01` | `f` + `i` |
| `Ａ` fullwidth A | `U+FF21` | `A` |
| `²` superscript two | `U+00B2` | `2` |
| `①` circled digit one | `U+2460` | the digit 1 (plus a “list item” meaning) |

They all carry a `<compat>` decomposition pointing back at the ordinary character — that is the compatibility column in [character properties](/docs/unicode-character-properties#decomposition). Two rules follow:

1. **Do not type them into new text.** `ﬁ` and `fi` look the same, but searching for `fi` will not find `ﬁ`, and case mapping and collation treat them differently;
2. **Fold with NFKC.** `'ﬁ'.normalize('NFKC')` gives `fi`; `NFC` leaves it alone. Do not run that over passwords, identifiers or filenames, though — that quietly rewrites the user's data.

Arabic is where these code points cluster: Unicode contains 730 Arabic **presentation forms** that decompose to just 88 base letters. The reason is that an Arabic letter changes shape at the start, middle and end of a word, and legacy encodings assigned a code point to each shape. Unicode encodes the base letter only and leaves the shapes to fonts and layout engines — see [shaping and fallback](/docs/unicode-shaping-fallback).

## How this site shows it {#this-site}

The grid shows the characters themselves; clicking one opens a dialog with the standard `U+4E2D` form (`U+` plus at least four hex digits) and four step buttons at the bottom, so you can walk along neighbouring code points one at a time. Blocks use the names and ranges from Unicode's `Blocks.txt`.

## Further reading

- The Unicode Standard, chapter 2 (General Structure)
- UAX #29 (grapheme cluster boundaries)
- MDN: `String#codePointAt`, `String.fromCodePoint`
- This site: [Emoji](/docs/emoji) — why characters, bytes and grapheme clusters are three different numbers
