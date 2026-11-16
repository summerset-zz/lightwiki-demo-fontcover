---
title: Language, script and writing system
keywords: language tag, locale, BCP 47, zh-CN, en-US, zh-Hans, ISO 15924, script, writing system, language, inference, CLDR, lang attribute
description: “Chinese” is a language, “Han” is a script, “left to right” is a direction — three things that get treated as one. Also sorts out zh-CN / zh_CN / zhCN / zh-Hans.
section: unicode
order: 6
updated: 2026-11-04
draft: false
---

“Chinese” is a language, “Han” is a script, “left to right” is a direction. Mixing all three up in conversation is harmless; as soon as it reaches code it breaks: `lang` takes a language, fonts are grouped by script, and direction is a third property entirely.

## Three words, three things {#three-words}

| Word | What it names | Examples |
| --- | --- | --- |
| **Language** | What people speak; can be written more than one way | Chinese, English, Serbian |
| **Script** (writing system) | A set of characters plus the rules for writing them | Latin, Cyrillic, Han, Arabic |
| **Direction** | Which way a line runs, how a page is set | left-to-right, right-to-left, vertical |

They are not one-to-one, and that is the whole problem:

- one language can be written in **two scripts**: Serbian in Cyrillic (`српски`) or Latin (`srpski`); Chinese in simplified or traditional forms;
- one script serves **many languages**: Latin covers most of western Europe, Arabic covers Arabic, Persian and Urdu;
- direction can **change inside one script**: Chinese books ran vertically for centuries and run horizontally on the web (see [Writing direction](/docs/writing-direction)).

## Language tags: what `zh-CN` actually says {#language-tags}
<!-- hint: Language tags | A BCP 47 tag may name a region (zh-CN) or a script (zh-Hant). Region and script are separate dimensions. -->

The web uses language tags from **BCP 47** (RFC 5646). The pieces come in a fixed order:

```
language [-script] [-region] [-variant…]
  zh         -CN
  zh        -Hans  -CN
  sr        -Latn  -RS
```

| Piece | From | Convention | Examples |
| --- | --- | --- | --- |
| Language | ISO 639-1 (two letters) / 639-3 (three) | **lowercase** | `zh`, `en`, `sr`, `yue` (Cantonese) |
| Script | ISO 15924 (four letters) | **Titlecase** | `Latn`, `Hans`, `Hant`, `Cyrl` |
| Region | ISO 3166-1 (two letters) or UN M49 (three digits) | **UPPERCASE** | `CN`, `TW`, `GB`, `419` (Latin America) |

The case is a **convention**: BCP 47 matching is case-insensitive, so `zh-cn` and `zh-CN` are equivalent. Write it the conventional way anyway — that is how a human reading the code knows whether a given piece is the script or the region.

Some common tags:

| Tag | Meaning |
| --- | --- |
| `zh` | Chinese, with neither script nor region specified |
| `zh-CN` | Chinese as used in mainland China — **by convention** simplified, but the tag does not say so |
| `zh-TW` | Chinese as used in Taiwan — by convention traditional, again not stated |
| `zh-Hans` / `zh-Hant` | the **script** made explicit: simplified / traditional. This is the precise form |
| `zh-Hant-HK` | traditional plus Hong Kong (different vocabulary from Taiwan) |
| `en-US` / `en-GB` | American / British English (spelling and date formats differ) |
| `sr-Latn-RS` | Serbian, Latin script, Serbia |
| `und` | undetermined — use it rather than inventing a guess |

The distinction worth memorising: **`zh-CN` names a region, `zh-Hans` names a script.** They often coincide, but `zh-SG` (Singapore) and `zh-MY` (Malaysia) are also simplified — region and script are not the same question.

## Spellings that look like tags but are not {#other-spellings}

The same language is spelled several ways across systems. What you find in a config file is usually not BCP 47:

| Spelling | Where it comes from | BCP 47? |
| --- | --- | --- |
| `zh-CN` | HTML `lang`, HTTP `Accept-Language`, JSON-LD, Windows Runtime, modern Android `values-b+zh+CN` | ✅ |
| `zh-Hans-CN` | same places, with the script spelled out | ✅ |
| `zh_CN` | POSIX env (`LANG=zh_CN.UTF-8`); Java `Locale.toString()`; ICU / CLDR resource names | ❌ just a different separator |
| `zh_Hant` | ICU resource names, older CLDR data directories | ❌ |
| `zh-rCN` | legacy Android resource folder `values-zh-rCN` (now `values-b+zh+Hans+CN`) | ❌ |
| `zhCN` | whatever enum a given SDK invented (some also change case, e.g. `zhCN`, `enUS`) — **no standard governs it** | ❌ |

Two practical conclusions:

1. **Anything that talks to a standard — `lang`, `Accept-Language`, search engines, JSON-LD — takes BCP 47.** Everywhere else, check what the other side wants first;
2. **Never prefix-match `zhCN`-style strings.** It has no definition, so the next SDK may write `zh-cn`, `zh_CN` or `zhHansCN`. Normalise to BCP 47 before comparing.

## Script codes: the four letters of ISO 15924 {#script-codes}

Scripts have codes too — four letters, Titlecase:

| Code | Script | Note |
| --- | --- | --- |
| `Latn` | Latin | English, French, Turkish… |
| `Cyrl` | Cyrillic | Russian, Ukrainian, Bulgarian… |
| `Arab` | Arabic | Arabic, Persian, Urdu |
| `Hani` | Han (Hanzi / Kanji / Hanja) | one code; **no simplified/traditional, no zh/ja/ko split** |
| `Hans` / `Hant` | Han (simplified / traditional variant) | see below |
| `Hira` / `Kana` | Hiragana / Katakana | |
| `Hang` | Hangul | Korean |
| `Thai`, `Deva`, `Hebr`… | Thai, Devanagari, Hebrew… | |
| `Zyyy` | Common | digits, spaces, most punctuation |
| `Zinh` | Inherited | combining marks: they follow whatever came before |
| `Zzzz` | Unknown | placeholder for a gap in the data |

Two things that get missed:

- **`Jpan` / `Kore` / `Hrkt` are composite aliases.** `Jpan` is defined as “Han + Hiragana + Katakana”, `Kore` as “Hangul + Han”. Japanese is not one set of characters but a combination — which is why “pick a font by script” is especially awkward for Japanese;
- **`Hans` / `Hant` exist in ISO 15924 but not in Unicode's `Script` property.** A simplified and a traditional Han character both have `Script=Hani`. `Script` cannot tell them apart.

## One-to-many and many-to-one {#many-to-many}

| Relationship | Example | What it means for a product |
| --- | --- | --- |
| one language → several scripts | Serbian (Cyrillic / Latin), Kazakh (moving from Cyrillic to Latin), Chinese (simplified / traditional) | a language tag alone **cannot pick glyphs**; you also need the script |
| one script → many languages | English, German, Turkish… all under `Latn` | a script tag alone **cannot pick the details**; you also need the language |
| one language + script → several regions | `zh-Hant` differs in vocabulary between Taiwan and Hong Kong | region changes words and formats rather than glyphs — but it does decide which `locl` set gets used |

So “does this font support Chinese?” really splits into two questions: **does it map the Han code points** (`cmap` coverage), and **does it ship variants selected by `zh-Hans` / `zh-Hant` / `ja`** (the `locl` feature). The first is coverage; the second is the feature table.

## Three kinds of “different” for Han characters {#han-variants}

The everyday word for these is “variant characters”, but three completely different mechanisms hide under it. Telling them apart is what decides whether you change the font, add a variation selector, or change the code point.

### One: same code point, glyph per language {#glyph-variant}

One code point, and each of China, Japan and Korea has its own customary form. The browser picks the glyph by the element's `lang` — below is **the same string of characters**, only `lang` differs:

<figure style="margin: 2rem 0">
  <div style="display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.5rem 1rem; align-items: center; padding: 0.875rem 1rem; border: 1px solid var(--color-neutral-200); border-radius: 6px; background-color: var(--color-white)">
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">lang="ja"</div>
    <div lang="ja" style="font-size: 2.25rem; line-height: 1.35">骨直草者</div>
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">lang="zh-CN"</div>
    <div lang="zh-CN" style="font-size: 2.25rem; line-height: 1.35">骨直草者</div>
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">lang="zh-HK"</div>
    <div lang="zh-HK" style="font-size: 2.25rem; line-height: 1.35">骨直草者</div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    All three rows are <strong>the same string</strong> (<code>U+9AA8 U+76F4 U+8349 U+8005</code>); only <code>lang</code> differs, and the browser picks what it thinks is the right font for each tag.
    How many different renderings you see depends on how many of those fonts this machine has — two identical rows usually mean they landed on the same font. <strong>Seeing no difference does not mean there is none.</strong>
  </figcaption>
</figure>

A few differences that get cited: the grass radical of `草` (`U+8349`) takes four strokes in traditional Chinese (⺿) and three in simplified Chinese and Japanese (⺾); the inner box of `骨` reads as a mirror image in some regional forms; `者` gains or loses a stroke depending on the convention. Small as they look, to a local reader they are the signal for “that is not my character”.

All of them are **one code point**, and the font picks the form via its `locl` feature according to the language system. So “this font supports Chinese” is not the same as “it draws it correctly” — covering the code point is not the same as following the local convention.

Traditional Chinese is not one block either: Taiwan and Hong Kong follow different references (the standard character forms of Taiwan, and Hong Kong's 常用字字形表), so on some characters `zh-Hant-TW` and `zh-Hant-HK` part ways as well. And a `lang` tag is only a **request** — whether it is honoured depends on having a font on this machine that answers it.

⚠️ The figure above mixes two things: **`lang` picks a font first, not a glyph**. The fonts available for different languages need not come from one family — style, stroke shapes and x-height can all differ — so part of the difference you see is glyph convention and the rest is two different typefaces. To compare conventions fairly you need one family that switches by `locl`, the way Source Han / Noto CJK ships SC / TC / JP / KR / HK inside a single family.

### Two: two code points in Unicode {#two-codepoints}

Some variants were split apart at the encoding stage:

| Characters | Code points | Note |
| --- | --- | --- |
| 內 / 内 | `U+5167` / `U+5185` | the same “inside”, two characters |
| 丟 / 丢 | `U+4E1F` / `U+4E22` | same story |
| 個 / 个 | `U+500B` / `U+4E2A` | traditional / simplified |
| 兌 / 兑 | `U+514C` / `U+5151` | either mechanism can show the difference: another code point, or another font |
| 佛 / 仏 | `U+4F5B` / `U+4ECF` | the Japanese shinjitai form became its own code point |

The consequences are concrete: **character counts differ, search differs, comparison differs**. `'內' === '内'` is `false`, `indexOf` finds nothing, database deduplication misses it. So for cross-region text, decide up front what counts as “the same character” — Unicode offers no general answer, and only guarantees the equivalence described in the next part.

### Three: compatibility ideographs — same character, two code points, **forced equal** {#compatibility-ideographs}

Part of the CJK Compatibility Ideographs block (`U+F900`–`FAFF`) exists only so that legacy encodings can round-trip byte for byte:

| Character | Primary | Compatibility copy |
| --- | --- | --- |
| 車 | `U+8ECA` | `U+F902` |
| 漢 | `U+6F22` | `U+FA9A` |
| 海 | `U+6D77` | `U+FA45` |

They carry a **canonical decomposition** (see [Character properties](/docs/unicode-character-properties#canonical)): `U+F902` decomposes to `U+8ECA`. Any form of `normalize()` folds them back onto the primary.

⚠️ But **without normalising** they are two different characters in a string comparison — common in text exported from old systems or copied out of a PDF. Run `normalize('NFC')` on user input and the whole class of problems goes away.

### Four: when it must be explicit — variation selectors {#ivs}

When one code point has several glyphs and you have to say **exactly** which one (personal names, classical texts, trademarks), append a variation selector: `U+FE00`–`FE0F` or `U+E0100`–`E01EF`. The font has to declare the combinations it supports in the `cmap` variation sequence table; the mechanism is called IVS (Ideographic Variation Sequence).

It is the same variation selector described in [Code points and planes](/docs/unicode-codepoints#variation-selectors); Han characters are simply where it is used most.

## Inferring the script from a piece of text {#inferring}

Sooner or later something has to take a user's string and guess what script it is in — to choose a font, to pick line-breaking rules, to pick a specimen. Reading Unicode's `Script` property (`Scripts.txt`) is the cheap first step:

1. take the `Script` value of every code point;
2. drop `Zyyy` (digits, spaces, punctuation) and `Zinh` (combining marks) — they say nothing about which script this is;
3. take whichever value dominates what is left.

That works, and it has **three blind spots**:

- **no simplified/traditional**: `Script` has no `Hans` / `Hant`; both are `Hani`;
- **no zh/ja/ko**: a line of pure Han characters is `Hani` whether it is Chinese, Japanese or Korean. Kana and Hangul give the game away when present, but a two-character sentence does not;
- **no language within a script**: a run of Latin letters can be English, French, German or Turkish; Cyrillic spans Russian, Ukrainian and Bulgarian just as widely.

There is another layer: **some characters are `Common` yet clearly belong to particular scripts.** The prolonged sound mark `ー` (`U+30FC`) is `Common` in `Scripts.txt`; only `ScriptExtensions.txt` says it belongs to Hiragana *and* Katakana. The Devanagari danda `।` (`U+0964`) belongs to a whole family of Indic scripts. So “drop every `Zyyy`” throws those away too — whether to consult `Script_Extensions` depends on whether you are guessing “roughly which script” or “which font could actually set this”.

**To infer the *language*, you need different data.** The only thing with real discriminating power is each language's **common character set**: a given Han character appearing in the Chinese frequent-character list but not the Japanese one says far more than its `Script` value. That list is CLDR's `exemplarCharacters`, maintained by each language's localisation community; comparing “whose list do these characters fall into” is what separates `zh-Hans` / `zh-Hant` / `ja` / `ko`.

Cyrillic has a useful trick of its own: individual alphabets differ (Russian has no `ў`, Ukrainian does; Bulgarian has no `ы`), so take the **intersection of several Cyrillic languages** as the “core Cyrillic set”, accept characters inside it, and deal with the edge letters separately.

⚠️ All of this is inference. Short strings, proper nouns and mixed text (a Chinese sentence with an English brand name in it) will fool it. **Show the result and let the user override it**; never quietly switch fonts on the strength of it.

## What a front-end developer can control {#css}

| What you write | What it changes |
| --- | --- |
| `<html lang="zh-Hant">`, `lang` on an element | **`locl` picks glyphs by it** (one font, different simplified/traditional/Japanese forms for characters like 直 or 骨); screen readers pick a pronunciation; the browser picks hyphenation and line-breaking rules |
| `:lang(zh)` | **prefix matching** per RFC 4647: `zh` matches `zh-CN` and `zh-Hant-TW`; `:lang(zh-Hant)` only matches tags carrying `Hant` |
| `unicode-range` in `@font-face` | splits a font into slices by code point (a CJK font can ship as thousands of slices, only the used ones download) — **the modern way to split resources by script** |
| the `font-family` fallback list | the browser picks the next font **per character**, by who maps that code point — fallback works character by character, not per paragraph |
| getting `lang` wrong | all three of the above go wrong: wrong glyphs, wrong pronunciation, wrong line breaks. **Cheapest attribute with the biggest payoff** |

## How this site uses the two concepts {#this-site}

- **Specimens by script**: a font's detail page shows sample lines for the handful of languages that have one, and then a line per script, so a Thai or Arabic font does not get a Latin cover image;
- **only standard BCP 47 spellings**: `<html lang>` is `zh-CN`, and JSON-LD's `inLanguage` is `zh-CN` / `en` — the spellings that line up with other tools;
- the docs centre takes the **article language from the path** (`/docs` English, `/zh/docs` Chinese), not from a cookie: that is content, not a UI preference. The price is that the interface language and the article language can disagree, which is a deliberate trade.

## Further reading

- BCP 47 (RFC 5646, language tags), RFC 4647 (matching and prefix fallback)
- ISO 15924 (the script code list, `unicode.org/iso15924/`)
- UAX #24 (Unicode Script Property), `Scripts.txt` / `ScriptExtensions.txt`
- CLDR's `exemplarCharacters` (each language's common character set)
- This site: [Character properties](/docs/unicode-character-properties#script) (`script` as a character property), [Writing direction](/docs/writing-direction)
