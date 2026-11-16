---
title: Chinese typography
keywords: 中文排版, 中英混排, 避头尾, 标点, 字面框, 竖排, 地区字形
description: Full-width punctuation, line-start rules, character frames, regional forms — where Chinese differs from Latin.
section: design
order: 6
updated: 2026-11-07
draft: false
---

Chinese typography cannot copy Latin rules, because a "character" plays a different role than a Latin "word": Han characters nearly fill a square, may break between any two of them, and punctuation has its own rules for the space it occupies.

## Character frames and full width {#frame}

Han characters are drawn inside a roughly square **character frame** with a little space on each side. Each occupies **one full-width** (equal to the font size).

Punctuation is also full-width, but **the ink covers only half**: a full stop or comma sits in one corner and the rest is white space. So:

- several marks in a row look very loose;
- the gap between a mark and the next character looks exaggerated;
- marks at the start or end of a line leave ugly holes unless handled.

That is what `palt` (proportional widths) solves — the mark takes its ink width instead of a full square.

## Line-start and line-end rules {#line-break}

Chinese has two hard rules:

- **line-start prohibition**: full stops, commas, enumeration commas, closing quotes and closing brackets may not start a line;
- **line-end prohibition**: opening quotes and opening brackets may not end a line.

The handling is called **kinsoku**: either squeeze the previous character in, or push the mark to the next line.

Browsers apply basic rules by default, but mixed Chinese-Latin text, runs of punctuation and bracketed quotations are often handled poorly — the most commonly criticised part of Chinese typesetting.

## Mixed Chinese and Latin {#mixed}

Four things to watch when they sit side by side:

1. **Spacing**: a little air (about a quarter em) between Han and Latin, otherwise they collide; CSS `text-autospace` / `text-spacing-trim` aim at this, with uneven support, so in practice people add spaces or rely on layout software;
2. **Baseline**: the Latin midline and the Han centre are not at the same height, so baseline alignment makes Latin look low;
3. **Size**: many Chinese designs set the Latin slightly smaller (about 95%), because Latin's larger x-height makes it look heavier at the same size;
4. **Font choice**: a Chinese family for the body, a separate Latin family for the Latin, expressed through the order of `font-family`.

## Line height and tracking {#spacing}

Chinese needs more room between lines:

- Han characters fill their frames, so lines have no natural gap and tight leading smears them together;
- body line height is usually **1.6–1.8**, wider than the 1.4–1.7 typical for Latin;
- tracking is normally 0 — Han characters are equal width, and extra tracking destroys the block texture; it belongs to headlines and posters.

## Regional forms {#locl}

The same code point can have different standard drawings in Simplified Chinese, Traditional Chinese and Japanese. Classic examples:

- the top of 骨 points left in Chinese fonts, right in Japanese ones;
- the number of inner strokes in 直 and 值;
- the first stroke of 门.

`locl` switches these per language. So:

- a Japanese font on a Chinese page looking "off" is not a broken font — it follows Japanese standards;
- on a multilingual site, the `lang` attribute affects glyph choice (see [GSUB / GPOS](/docs/gsub-gpos)).

Switch the direction: in vertical writing punctuation rotates and brackets flip, and whether that works depends on the font having `vert`.

{{InteractiveExample("CSS Demo: writing-mode")}}

```css interactive-example-choice
writing-mode: horizontal-tb;
```

```css interactive-example-choice
writing-mode: vertical-rl;
```

```html interactive-example
<div id="example-element">
  Vertical writing mainly serves CJK: 标点会转向。
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  min-height: 160px;
  font-size: 18px;
  line-height: 1.8;
}
```

## Vertical writing {#vertical}

Vertical setting uses `vert` / `vrt2` to rotate or replace glyphs (brackets, dashes, ellipses) and places text top-to-bottom, right-to-left.

In CSS that is `writing-mode: vertical-rl`. Note that **the font must support vertical forms**, or brackets point the wrong way.

## The four basic faces of East Asian text {#type-families}
<!-- hint: East Asian type families | The four faces Chinese text is usually set in: Ming, Gothic, Fangsong and Kaiti; Japanese calls the first two Mincho and Gothic. -->

<!-- source: en.wikipedia.org | East Asian typography | 1319485066 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Type families section (Ming / Gothic / Fangsong / Kaiti), with the Chinese and Japanese names mapped to each other -->

Chinese text — and Japanese and Korean along with it — is set in one of four basic kinds of face:

| Kind | Chinese | Japanese | What it looks like | Where it is used |
| --- | --- | --- | --- | --- |
| Ming | 明体 / 宋体 | 明朝体 (Mincho) | Thin horizontals, thick verticals; small triangular *uroko* at the stroke ends, the local analogue of serifs | Books, newspapers |
| Gothic | 黑体 | ゴシック体 (Gothic) | Even stroke width, no decoration; comes in round-ended and square-ended varieties | Headings, on-screen text |
| Fangsong | 仿宋 | — | Modelled on Southern Song printing, essentially regular script in printed form | Official documents, engineering drawings |
| Kaiti | 楷体 | 楷書体 | Directly imitates handwritten regular script | Quotations, children's books |

A quick way to tell them apart in practice: newspaper body text is Ming, phone UI text is Gothic — on low-resolution screens the thin Ming horizontals break up.

## Ruby {#ruby}
<!-- hint: Ruby | Small annotative text above or beside the base characters, carrying the reading; HTML has ruby, rt and rp for it. -->

<!-- source: en.wikipedia.org | East Asian typography | 1319485066 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Ruby text section; added the HTML elements and ruby-position -->

**Ruby** is small annotative text set above the base characters (horizontal writing) or to their right (vertical writing), carrying the reading: pinyin for Chinese, furigana for Japanese, bopomofo in Taiwan.

It is not a character but a **relationship between two lines of text**, which is why it needs its own treatment: the annotation line may force the base line to open up, and the ruby size has a floor below which it just smudges. HTML has `<ruby>`, `<rt>` and `<rp>` for exactly this, and CSS can move it with `ruby-position`.

## Observing it here {#this-site}

- Specimens exist in Chinese and Latin versions, so weight and style differences are visible side by side;
- when coverage renders with a real font, Chinese blocks show that font's actual glyphs;
- the type preview accepts Chinese text, so you can try line height and tracking — but kinsoku and mixed-script spacing are the browser's business, not something this site controls.

## Further reading

- W3C: Chinese Layout Requirements
- CSS Text: `text-autospace`, `text-spacing-trim`
- This site: [GSUB / GPOS](/docs/gsub-gpos), [Line height (leading)](/docs/line-height-leading)
