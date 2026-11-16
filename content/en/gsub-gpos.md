---
title: GSUB and GPOS
keywords: GSUB, GPOS, GDEF, 连字, 字偶距, kern, 特性, locl, 小型大写
description: Three layout tables decide how glyphs get substituted and repositioned. Having the table is not the same as seeing the effect.
section: fields
order: 6
updated: 2026-11-07
draft: false
---

`cmap` only answers "which glyph for this code point". Whether `f` and `i` become one ligature, whether `A` and `V` move closer, whether Chinese punctuation narrows — all of that lives in three other tables. Their structure is far more complex, but the ideas are only three.

## Division of labour {#three}

| Table | Full name | Job |
| --- | --- | --- |
| `GSUB` | Glyph Substitution | **Replace** one glyph with another |
| `GPOS` | Glyph Positioning | **Move** glyphs around |
| `GDEF` | Glyph Definition | **Classify** glyphs as base, ligature or mark for the two above |

## Shared structure {#structure}

Both tables use the same four levels:

1. **ScriptList**: grouped by writing system, tagged `latn` (Latin), `hani` (Han), `DFLT` (default);
2. **LangSys**: language variants inside a script, e.g. `ZHS ` (Simplified Chinese), `ZHT ` (Traditional), `JAN ` (Japanese);
3. **FeatureList**: which features each language has, tagged with four letters;
4. **LookupList**: the actual lookups a feature points at — substitution or positioning rules.

So "does this font support small caps" means "is there an `smcp` feature in some language system of `GSUB`".

## What GSUB can do {#gsub}

| Lookup type | Effect | Example |
| --- | --- | --- |
| Single substitution | One glyph becomes another | `a` → `a.alt` |
| Multiple substitution | One glyph becomes several | decompose a connected `æ` back to `a e` |
| Alternate substitution | Several candidates for one slot | stylistic alternates (`salt`) |
| Ligature substitution | Several glyphs merge into one | `f` + `i` → `fi` |
| Contextual substitution | Decide by surrounding glyphs | digits swapped inside a fraction |
| Chained contextual | More involved context rules | Indic conjuncts |

<figure style="margin: 1.75rem 0">
  <svg viewBox="0 0 320 120" width="100%" role="img" aria-label="Two glyphs replaced by one ligature">
    <g fill="none" stroke="currentColor" opacity="0.35">
      <rect x="16" y="24" width="44" height="56" rx="6" />
      <rect x="60" y="24" width="44" height="56" rx="6" />
      <rect x="168" y="24" width="88" height="56" rx="6" />
    </g>
    <g font-family="Georgia, serif" font-size="30" fill="currentColor">
      <text x="30" y="66">f</text>
      <text x="76" y="66">i</text>
      <text x="190" y="66">fi</text>
    </g>
    <text x="122" y="62" font-size="22" fill="currentColor" opacity="0.6">→</text>
    <g font-size="10" font-family="system-ui, sans-serif" fill="currentColor" opacity="0.6">
      <text x="16" y="102">two glyphs</text>
      <text x="168" y="102">one glyph (liga)</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; opacity: 0.65">A GSUB ligature substitution: two adjacent glyphs become one. The boxes stand for glyph slots, not design spacing.</figcaption>
</figure>

## What GPOS can do {#gpos}

| Lookup type | Effect | Example |
| --- | --- | --- |
| Single adjustment | Move a glyph as a whole | raising a superscript |
| Pair adjustment | Add or remove space between two glyphs | **kerning** (`kern`) |
| Attachment | Attach marks to a base | accents, Arabic vowel marks |
| Cursive attachment | Joining script forms | Arabic |
| Mark-to-mark | A mark on a mark | stacked diacritics |

## Common feature tags {#tags}
<!-- hint: Feature tag | Small caps and old-style figures are controlled by four-letter tags in GSUB and GPOS, which CSS enables with font-feature-settings. -->

| Tag | Meaning | Default |
| --- | --- | --- |
| `liga` | Standard ligatures (`fi`, `fl`) | on |
| `clig` | Contextual ligatures | on |
| `dlig` | Discretionary ligatures | off |
| `smcp` | Small caps | off |
| `onum` / `lnum` | Oldstyle / lining figures | off / on |
| `tnum` / `pnum` | Tabular / proportional figures | off / on |
| `frac` | Fractions | off |
| `subs` / `sups` | Subscript / superscript | off |
| `salt` / `ss01`–`ss20` | Stylistic alternates / sets | off |
| `locl` | Localised forms (per language) | language-driven |
| `kern` | Kerning (in GPOS) | on |
| `palt` | Proportional widths for CJK punctuation | off |

The "default" column reflects usual engine behaviour, not a hard requirement; engines differ, especially around `dlig`.

## More than one kind of tag {#tag-kinds}
<!-- hint: Baseline tag | Decides which baseline mixed scripts align to. It lives in the BASE table, not in GSUB or GPOS. -->

<!-- source: en.wikipedia.org | OpenType | 1382890363 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the layout-tags section; kept the four tag kinds and the baseline table, dropped the editor and see-also links -->

The `smcp` in the table above is a **feature** tag. OpenType uses four kinds of tags, all four characters at most, each meaning something different:

| Kind | Where it lives | Examples |
| --- | --- | --- |
| Script | ScriptList, groups by writing system | `latn`, `cyrl`, `arab`, `hani` |
| Language | LangSys, a language inside a script | `ZHS` Simplified Chinese, `JAN` Japanese |
| Feature | FeatureList, the optional effects | `smcp`, `liga`, `tnum` |
| Baseline | The `BASE` table, for aligning mixed scripts | `romn` Roman, `ideo` ideographic |

The last one is easy to forget: baseline tags decide **which line mixed Latin and Chinese text actually sits on**.

| Tag | Horizontal | Vertical |
| --- | --- | --- |
| `romn` | Baseline of simple alphabetic text (Latin, Cyrillic, Greek) | Same, rotated 90° clockwise |
| `ideo` | Bottom edge of the ideographic em box | Left edge of the em box |
| `icfb` / `icft` | Bottom / top edge of the ideographic box | Left / right edge |
| `math` | Baseline centring maths symbols | Centring baseline in vertical setting |
| `hang` | Baseline for Tibetan stacked signs | The same in vertical setting |

So when a font "has Chinese but will not line up" with Latin, the table to look at is `BASE`, not `GSUB` — specifically whether `ideo` / `icfb` are present.

## One character, different shapes {#locl}
<!-- hint: locl | locl substitutes glyphs by language. Where CJK languages share a code point, the same character takes a different form depending on lang. -->

`locl` makes the same code point draw differently in Simplified Chinese, Traditional Chinese and Japanese contexts.

Classic cases are characters like 骨, 直, 门: the standard stroke order differs between Chinese and Japanese, but the **code point is identical**. So "this font looks like this in Chinese and like that in Japanese" is not a bug; `locl` swapped the glyph according to the language system.

Which is why, in multilingual typesetting, the `lang` attribute is not only for spell checking.

## Having the table is not enough {#not-enough}

Rules in `GSUB` need three things before you see anything:

1. the renderer actually consults the table (some simplified engines ignore it);
2. the text contains the sequence;
3. the feature is on by default, or turned on explicitly.

So "this font has ligatures" and "this paragraph shows ligatures" are two different claims.

## Why this site sidesteps them {#this-site}

Building specimen images needs glyph outlines. Some older libraries throw when they meet `GSUB` (the glyph data is post-substitution and no longer matches the raw outlines), so this site falls back to fetching each glyph individually when that happens.

Which also means **specimens do not show ligatures** — they show what the glyphs look like, not how a paragraph sets.

## Further reading

- OpenType spec: `GSUB`, `GPOS`, `GDEF`
- OpenType spec: the full feature tag registry
- This site: [The cmap table](/docs/cmap-table)
