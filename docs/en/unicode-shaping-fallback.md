---
title: Shaping and fallback
keywords: 整形, shaping, 回退, fallback, 豆腐块, 复杂文字
description: How a sequence of code points becomes a sequence of glyphs — and why you cannot decide which font draws which character.
section: unicode
order: 3
updated: 2026-11-02
draft: false
---

There is a middle layer people skip: the text holds **code points**, the screen shows **glyphs**, and the mapping is not one-to-one. Turning a code point sequence into a glyph sequence is called **shaping**.

## What shaping does {#shaping}
<!-- hint: Shaping | Shaping converts a character sequence into a glyph sequence by the font rules, covering ligatures, contextual substitution and mark positioning. Without it, Arabic renders as isolated letters. -->

At minimum four things:

1. **Map**: look up `cmap`, turning code points into glyphs;
2. **Substitute**: apply `GSUB` rules (ligatures, contextual forms, localised forms);
3. **Position**: apply `GPOS` rules (kerning, mark attachment, cursive joining);
4. **Reorder**: bidirectional scripts (Arabic, Hebrew) must be laid out in the right order.

For Latin text the first three often do nothing, which is why "shaping" sounds mysterious. Scripts that cannot live without it are Arabic, the Indic family, and anything with heavy joining.

## Why complex scripts need it {#complex-scripts}

Arabic letters have **initial, medial, final and isolated** forms; which one applies depends on position within the word. That cannot be expressed as "one character, one glyph" — it needs context.

Which is why the same code points can set completely differently depending on language environment — the reason the `locl` feature and contextual substitution exist in [GSUB / GPOS](/docs/gsub-gpos).

## Fallback: when the font lacks the character {#fallback}
<!-- hint: Fallback | When a font lacks a glyph for a character, the browser uses the next font in the font-family list. That is why one line can show two typefaces. -->

Before shaping, something must decide **which font to use**. The browser roughly does:

1. the first family in `font-family` that is installed / loaded;
2. if that font lacks a character (missing from `cmap`, or mapped to `.notdef`), **that one character** goes to the next family in the list that has it;
3. list exhausted: use the system default font;
4. system has none either: draw tofu.

Crucially, fallback happens **per character**. One line may come from three fonts, with different line heights, baselines and weights — that is why mixed Chinese and Latin looks jumpy.

## "Which font drew this" {#who-drew-it}

The most common misunderstanding: **CSS cannot say "this character must be drawn by that font"**. It only supplies a candidate list; the browser decides by the rules above.

Therefore:

- "it displays" does not mean "the selected font is what drew it";
- a font may map a code point but have an empty outline; the browser still falls back, so what you see is not from that font;
- the character drawer on this site distinguishes "in the font" from "what it looks like rendered with this font".

## Tofu and empty outlines {#tofu}
<!-- hint: Tofu | The box or question mark shown for a missing glyph is called tofu. It means the font has no such glyph, not that the encoding is wrong. -->

- **Tofu**: the box drawn when no font has the character (`U+FFFD` is the replacement character, which is something else again);
- **Empty outline**: the font declares a mapping but the glyph contains nothing. Looks like a missing character, causes differ.

The test is `cmap` (which is how coverage is computed here). But coverage only says "there is a mapping", never "it can be drawn" — a known limitation.

## Observing it here {#this-site}

- Local fonts: once bytes are registered with `FontFace`, what you see **is** that font drawing;
- Library fonts: before loading, the page font draws it (looks similar, is not the font); after loading, it is real;
- The drawer's side-by-side "default font / this font" pair exists to show exactly this.

## Further reading

- OpenType spec: shaping and `GSUB` / `GPOS`
- HarfBuzz documentation: one widely used shaping engine
- This site: [GSUB / GPOS](/docs/gsub-gpos), [Character properties](/docs/unicode-character-properties)
