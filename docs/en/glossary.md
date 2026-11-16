---
title: Glossary
keywords: 术语, 词汇, 中英对照, glossary, terminology, 名词
description: The words that keep coming up in fonts, Unicode and CSS — one line each, with a pointer to the article that expands it.
section: basics
order: 0
updated: 2026-11-02
draft: false
---

Typography is an old trade with too many words: the same thing is "leading" to a designer, "line-height" to a front-end developer, and `lineGap` inside the font file. This page collects every term the articles on this site use.

The English column is there for **searching**: with the original word you can find the specification. The last column is a one-liner — follow the link when you want the full story.

## Fonts and faces {#type}

| Term | 中文 | In one line |
| --- | --- | --- |
| font (colloquial) | 字体 | Sometimes one face, sometimes a whole family — depends on context |
| font family | 字体家族 | One design with several weights and styles, e.g. "Inter" |
| font face | 字款 | One specific member: Inter Bold, Inter Italic. **Usually one file per face** |
| weight | 字重 | Thickness grade, 100–900 (400 is usually Regular, 700 Bold) |
| width / stretch | 字宽 | Narrower or wider versions of the same design, e.g. Condensed |
| italic | 斜体 | Genuinely drawn as slanted letterforms |
| oblique | 伪斜体 | The upright design slanted by a transform, no separate drawing |
| variable font | 变量字体 | One file with continuous axes — endless weights and widths |
| optical size | 光学尺寸 | A design redrawn per size: heavier and looser at small sizes (see [the opsz axis](/docs/variable-fonts-design#opsz)) |
| static font | 静态字体 | One file per weight (the traditional arrangement) |

Why the distinction matters: [Fonts, families and faces](/docs/fonts-families-faces).

## Glyphs and outlines {#glyph}

| Term | 中文 | In one line |
| --- | --- | --- |
| glyph | 字形 | What one character looks like when drawn; a character can have several |
| outline | 轮廓 | The Bézier curves of a glyph — filled, they become the stroke |
| font unit | 字体单位 | The font's internal coordinate grid, **not** pixels |
| em square | em 方框 | The design grid whose side equals `unitsPerEm` |
| hinting | 表意指令 | Instructions that nudge strokes at small sizes; less common now |
| tofu | 豆腐块 | The box shown when a glyph is missing (`.notdef`) |
| glyph ID / GID | 字形索引 | The font's internal number for each glyph; `0` is always `.notdef` |

## Vertical metrics {#metrics}

| Term | 中文 | In one line |
| --- | --- | --- |
| baseline | 基线 | The line Latin letters sit on — also y = 0 |
| x-height | x 高度 | Height of a lowercase `x`; strongly affects apparent size |
| cap height | 大写高度 | Height of uppercase letters |
| ascender / descender | 升部 / 降部 | How far glyphs reach above / below the baseline |
| leading | 行距 | The space between lines (designer's word) |
| line height | 行高 | Total height one line occupies (CSS's word) |
| line gap | 字体自带行距 | A suggested gap stored in the font file |

## Horizontal spacing {#spacing}

| Term | 中文 | In one line |
| --- | --- | --- |
| tracking / letter-spacing | 字距 | Loosening or tightening all characters evenly |
| kerning | 字偶距 | Corrections for specific **pairs**, typically "AV" or "To" |
| advance width | 字符宽度 | The horizontal distance a glyph takes up |
| side bearing | 侧边距 | Gap from the outline to the character's left / right edge |

## Unicode and characters {#unicode}

| Term | 中文 | In one line |
| --- | --- | --- |
| code point | 码位 | A character's number, written `U+0041` |
| block | 区块 | A contiguous range of code points, e.g. Basic Latin |
| assigned | 已分配 | The code point has an official name (**not** that a font has its glyph) |
| combining mark | 组合字符 | A mark attached to the preceding character, e.g. an accent |
| variation selector | 变体选择符 | An extra code point choosing *which* glyph to use |
| shaping | 整形 | Turning a code point sequence into a glyph sequence |
| fallback | 回退 | When the current font lacks a glyph, the browser tries the next font |

## Writing systems {#scripts}

| Term | 中文 | In one line |
| --- | --- | --- |
| writing system / script | 书写系统（文字）| The system a language is written in; one language can switch systems |
| alphabet | 字母表 | Separate letters for vowels and consonants (Latin, Greek, Cyrillic) |
| abjad | 辅音音素文字 | Consonants are written, vowels left to the reader (Arabic, Hebrew) |
| abugida | 元音附标文字 | A consonant letter carries a default vowel; change it with a mark (Devanagari, Thai) |
| syllabary | 音节文字 | One sign per syllable, not per phoneme (kana, Cherokee) |
| cursive joining | 连写 | Neighbouring letters take positional forms and join up (initial / medial / final) |
| bidirectional text | 双向文字 | Left-to-right and right-to-left on the same line (Arabic beside Latin and digits) |
| diacritic | 变音符 | A dot, stroke or hook attached to a letter, as in é |
| grapheme cluster | 字素簇 | What a reader calls “one character”, possibly several code points stacked |

See [writing systems at a glance](/writing-systems) for the four families, [direction and joining](/docs/writing-direction) for the traps, and [combining characters](/docs/combining-character) for marks and clusters.

## CSS and the web {#css}

| Term | 中文 | In one line |
| --- | --- | --- |
| font stack | 回退栈 | The list of names in `font-family`, ending with a generic family |
| generic family | 通用族 | `serif` / `sans-serif` / `monospace` / `system-ui` — the browser picks the font |
| OpenType feature | 字体特性 | Optional font behaviour behind a four-letter tag, e.g. `liga`, `kern`, `tnum` |
| subset | 子集 | Keeping only the characters you need, to shrink the file |
| layout shift / CLS | 布局位移 | Text jumping when a webfont arrives late |

## Related articles {#related}

- [Which tables a font file contains](/docs/font-tables-overview) — where each field comes from
- [Code points, U+ and planes](/docs/unicode-codepoints), [Blocks and "assigned"](/docs/unicode-blocks) — the Unicode half
- [Line height (leading)](/docs/line-height-leading), [Tracking and kerning](/docs/tracking-kerning) — the designer's two words
- [font-family and the fallback stack](/docs/css-font-family), [font-weight and the bold alias](/docs/css-font-weight) — the front-end set
- [Reading the metrics](/docs/how-to-read-metrics) — putting those numbers on one picture

## Further reading

- Microsoft Typography — the OpenType specification, one section per table
- MDN — CSS Fonts and CSS Text modules
- The Unicode Standard and UAX documents — the authority on code points, blocks and properties
