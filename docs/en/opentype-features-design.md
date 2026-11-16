---
title: OpenType features
keywords: OpenType, 特性, 小型大写, smcp, 旧式数字, 等宽数字, 连字
description: The optional shapes inside a font — what they are called, when they appear on their own, and how to mark them on a layout.
section: design
order: 5
updated: 2026-11-07
draft: false
---

Many fonts carry more than one set of letterforms: a shrunken set of capitals (small caps), digits that are level and digits that step up and down, an `fi` that joins… These optional shapes are controlled by OpenType features, each with a four-letter tag.

## The usual suspects {#common}

| Effect | Tag | Default | How to spot it |
| --- | --- | --- | --- |
| Standard ligatures | `liga` | on | `fi`, `fl` joined |
| Discretionary ligatures | `dlig` | off | showy `ct`, `st` joins |
| Small caps | `smcp` | off | capitals at roughly x-height |
| Oldstyle figures | `onum` | off | 3, 4, 7, 9 descend below |
| Lining figures | `lnum` | on | digits align to cap height |
| Tabular figures | `tnum` | off | every digit the same width, columns line up |
| Proportional figures | `pnum` | on | widths follow the shapes, better in text |
| Fractions | `frac` | off | `1/2` set as a real fraction |
| Super / subscript | `sups` / `subs` | off | footnotes, chemistry |
| Stylistic alternates | `salt` / `ss01`–`ss20` | off | a differently drawn letter |
| Localised forms | `locl` | per language | same code point, Chinese vs Japanese shapes |

## Small caps are not "scaled capitals" {#smcp}

Real **small caps** are drawn separately: stroke weight matches the capitals, height roughly matches the x-height.

Without them, software may "shrink the capitals" instead — synthetic small caps, with thinner strokes and wrong proportions. If a layout says "small caps", check that the font actually has `smcp`.

## Getting small caps into the browser {#small-caps-css}
<!-- hint: Small caps in CSS | font-variant-caps lets the browser synthesise them; font-feature-settings: "smcp" only works when the font really has the feature. -->

<!-- source: en.wikipedia.org | Small caps | 1382810803 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the "Support" and "CSS" sections; dropped the character tables and the demo markup, added the note on synthesis -->

You have three ways to ask for small caps in code, and they behave differently:

| Declaration | Font has `smcp` | Font lacks `smcp` |
| --- | --- | --- |
| `font-variant-caps: small-caps` | Real glyphs | The browser shrinks capitals to fake it (**synthesis**) |
| `font-feature-settings: "smcp"` | Real glyphs | Nothing happens |
| `font-variant-caps: all-small-caps` | Both cases become small caps | May synthesise too |

The difference is intent: `font-variant-caps` says "I want this effect" and lets the engine find a way; `font-feature-settings` says "please turn this feature on" and gives you the plain text if the font has none. The first looks more consistent, the second matches the artwork more closely — but fails **silently** when the feature is missing.

Real glyphs come from two features: `smcp` (lowercase to small caps) and `c2sc` (uppercase to small caps). Not every font has them: small caps were meant for running text, so they are rare in sans-serifs, and plenty of families ship them in the regular weight only. To stop the browser from faking it:

```css
.acronym {
  font-variant-caps: small-caps;
  font-synthesis-small-caps: none; /* keep the original if smcp is missing */
}
```

One more thing: all of this is **presentation only**. The text you copy is unchanged — the page shows Nato, the clipboard still has NATO.

A shorter variant exists too: **petite caps**, roughly x-height: `font-variant-caps: petite-caps`, or the `pcap` feature in OpenType.

## The four combinations of figures {#figures}

Digits vary along two independent dimensions, often confused:

| Dimension | Two options | Use |
| --- | --- | --- |
| Height | lining / oldstyle | lining aligns to cap height (tables); oldstyle steps up and down (text) |
| Width | tabular / proportional | tabular for columns; proportional for running text |

So "digits in a table" usually means lining + tabular, and "digits in a paragraph" means oldstyle + proportional. Not every font has all four.

## Marking it on a layout {#handoff}

Write the **tag**, not the prose:

```
Figures: tnum (tables) / onum (body)
Headline: smcp
```

It maps directly to both CSS and the font's own features. Also note what should happen if the feature is missing — otherwise implementation may quietly ship a synthesised version.

## What appears by itself {#defaults}

`liga` and `clig` are on by default, so `fi` usually joins without you doing anything; `dlig`, `smcp`, `onum`, `tnum` are off and must be asked for.

Which answers a common question: "the layout shows a joined `fi`, why does my setting not?" If the font has `liga` and the engine does not enable it, it will not join; if the font lacks it, enabling does nothing.

## Chinese-specific ones {#cjk}

| Tag | Effect |
| --- | --- |
| `palt` | proportional widths for punctuation (less white space) |
| `vert` / `vrt2` | vertical-writing forms |
| `locl` | regional forms (Simplified / Traditional / Japanese) |
| `hwid` / `twid` / `fwid` | half / third / full width forms |

`palt` is genuinely useful in Chinese: default full-width punctuation leaves large gaps on both sides; turning it on tightens things, at the cost of some alignment.

## Trying it here {#this-site}

The type preview currently offers size, line height, spacing and alignment; OpenType features are not exposed yet and are on the to-do list.

To check whether a font has a feature, look at its `GSUB` / `GPOS` capabilities or try it in the preview.

## Further reading

- OpenType spec: the feature tag registry
- MDN: `font-variant-*`, `font-feature-settings`
- This site: [GSUB / GPOS](/docs/gsub-gpos), [font-feature-settings and font-variant](/docs/css-opentype-features)
