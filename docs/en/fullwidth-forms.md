---
title: Halfwidth and fullwidth
description: One character, two widths; Unicode encodes both, which is where failed searches and odd pastes come from.
keywords: 全角, 半角, fullwidth, halfwidth, 兼容字符, 标点, 全形和半形
section: unicode
order: 8
updated: 2026-11-07
sourceSite: en.wikipedia.org
sourceTitle: Halfwidth and fullwidth forms
sourceRevid: 1335634967
sourceUrl: https://en.wikipedia.org/w/index.php?oldid=1335634967
sourceLicense: Creative Commons Attribution-Share Alike 4.0
sourceLicenseUrl: https://creativecommons.org/licenses/by-sa/4.0/deed.en
sourceRetrieved: 2026-11-07
sourceChanges: 删除了全部图片、公式、引用角标、信息框、表格标题与“See also”类收尾小节；正文文字未改动。
hintTitle: Halfwidth and fullwidth
hint: One character, two widths and two code points — which is why a fullwidth letter does not match its halfwidth form in search.
---

In CJK (Chinese, Japanese, and Korean) computing, graphic characters are traditionally classed into **fullwidth** and **halfwidth** characters. Unlike [monospaced fonts](/docs/monospaced), a halfwidth character occupies half the width of a fullwidth character, hence the name.

*Halfwidth and Fullwidth Forms* is also the name of a Unicode block U+FF00–FFEF, provided so that older encodings containing both halfwidth and fullwidth characters can have lossless translation to and from Unicode.

## Rationale {#Rationale}

In the days of text mode computing, Western characters were normally laid out in a grid on the screen, often 80 columns by 24 or 25 lines. Each character was displayed as a small dot matrix, often about 8 pixels wide, and an SBCS (single-byte character set) was generally used to encode characters of Western languages.

For aesthetic reasons and readability, it is preferable for Chinese characters to be approximately square-shaped, therefore twice as wide as these fixed-width SBCS characters. As these were typically encoded in a DBCS (double-byte character set), this also meant that their width on screen in a duospaced font was proportional to their byte length. Some terminals and editing programs could not deal with double-byte characters starting at odd columns, only even ones (some could not even put double-byte and single-byte characters in the same line). So the DBCS sets generally included Roman characters and digits also, for use alongside the CJK characters in the same line.

On the other hand, early Japanese computing used a single-byte code page called JIS X 0201 for katakana. These would be rendered at the same width as the other single-byte characters, making them half-width kana characters rather than normally proportioned kana. Although the JIS X 0201 standard itself did not specify half-width display for katakana, this became the visually distinguishing feature in Shift JIS between the single-byte JIS X 0201 and double-byte JIS X 0208 katakana. Some IBM code pages used a similar treatment for Korean jamo, based on the N-byte Hangul code and its EBCDIC translation.

## In Unicode {#In_Unicode}

For compatibility with existing character sets that contained both half- and fullwidth versions of the same character, Unicode allocated a single block at U+FF00–FFEF containing the necessary "alternative width" characters. This includes a fullwidth version of all the ASCII characters and some non-ASCII punctuation such as the Yen sign, halfwidth versions of katakana and hangul, and halfwidth versions of some other symbols such as circles. Only characters needed for lossless round trip to existing character sets were allocated, rather than (for instance) making a fullwidth version of every Latin accented character.

Unicode assigns *every* code point an `East_Asian_Width` property. This may be:

| Abbreviation | Name | Description |
| --- | --- | --- |
| W   | Wide | Naturally wide character, e.g. Hiragana. |
| Na  | Narrow | Naturally narrow character, e.g. ISO Basic Latin alphabet. |
| F   | Fullwidth | Wide variant with compatibility normalisation to naturally narrow character, e.g. fullwidth Latin script. |
| H   | Halfwidth | Narrow variant with compatibility normalisation to naturally wide character, e.g. half-width kana. Includes U+20A9 (₩) as an exception. |
| A   | Ambiguous | Characters included in East Asian DBCS codes but also in European SBCS codes, e.g. Greek alphabet. Duospaced behaviour can consequently vary. |
| N   | Neutral | Characters which do not appear in East Asian DBCS codes, e.g. Devanagari. |

Terminal emulators can use this property to decide whether a character should consume one or two "columns" when figuring out tabs and cursor position.

## In OpenType {#In_OpenType}

[OpenType](/docs/opentype) has the `fwid`, `halt`, `hwid`, and `vhal` feature tags to be used to reproduce fullwidth or halfwidth form of a character. CSS provides control over these features using `font-variant-east-asian` and `font-feature-settings` properties.
