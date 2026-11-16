---
title: Whitespace and wrapping
keywords: white-space, overflow-wrap, word-break, text-wrap, 换行, 换行符, 软回车, 硬回车, 断词, 省略号, ellipsis, hyphens, 制表符, tab-size, 空白, 空格
description: What the six white-space values do, how the two breaking properties differ, and three combinations worth copying.
section: dev
order: 4
updated: 2026-11-02
draft: false
---

Line breaking is decided by three properties together: `white-space` controls how spaces and newlines are treated, while `overflow-wrap` and `word-break` decide where a line may break when it does not fit. They are often conflated because simple examples make them look identical.

## The six white-space values {#white-space}
<!-- hint: white-space | white-space controls two things at once: how whitespace collapses, and whether lines may wrap. -->

| Value | Runs of spaces | Newlines | Wrapping |
| --- | --- | --- | --- |
| `normal` | collapsed to one | treated as a space | allowed |
| `nowrap` | collapsed | treated as a space | **not allowed** |
| `pre` | preserved | preserved | **not allowed** |
| `pre-wrap` | preserved | preserved | allowed |
| `pre-line` | collapsed | preserved | allowed |
| `break-spaces` | preserved, including trailing | preserved | allowed, **and spaces can break** |

A way to remember: the `pre` family preserves whitespace like the `<pre>` element, `pre-wrap` also allows wrapping, and `pre-line` keeps only the newlines.

`pre-wrap` and `break-spaces` differ only in **trailing spaces**: the former hangs them outside the line, the latter treats them as breakable characters. Visible when rendering chat logs or code diffs.

Step through all six values and watch two things: `nowrap` runs straight past the dashed line on the right, and the `pre` family keeps the spaces and newlines from the source.

{{InteractiveExample("CSS Demo: white-space")}}

```css interactive-example-choice
white-space: normal;
```

```css interactive-example-choice
white-space: nowrap;
```

```css interactive-example-choice
white-space: pre;
```

```css interactive-example-choice
white-space: pre-wrap;
```

```css interactive-example-choice
white-space: pre-line;
```

```css interactive-example-choice
white-space: break-spaces;
```

```html interactive-example
<div id="example-element">
  One   two   three
  four five six seven eight nine ten eleven twelve
</div>
```

```css interactive-example
#example-element {
  max-width: 220px;
  border-right: 1px dashed currentColor;
}
```

## Soft and hard breaks {#breaks}

“A new line” can be made two ways in HTML, at very different costs:

| Approach | What it is | Which spacing applies |
| --- | --- | --- |
| a `<p>` (hard break) | two independent blocks | the paragraph's own `margin` + `padding` |
| a `<br>` (soft break) | a line break **inside one block** | only `line-height` |

So two `<br>`s in a row just add one more line box whose height comes from `line-height`. To get “a blank line between paragraphs” you need a separate `<p>` or a `margin` on the block. It is also why hand-made spacing collapses the moment the line height changes: it was never paragraph spacing to begin with.

A newline character `\n` in the source is not a `<br>` either: `\n` is **whitespace**, collapsed to a single space under `white-space: normal`. Making it actually break lines requires the `pre` family from the table above.

Word has the same two things under different marks:

- the grey `↵` (soft return, Shift+Enter): breaks the line, paragraph formatting unchanged;
- the `¶` (hard return): genuinely starts a new paragraph, with spacing before/after and paragraph styles in effect.

On the “does Unicode have this character” question: Word's `↵` and `¶` are **formatting marks**, and those characters are not stored in the document. The separator concepts do exist as real code points — `U+2028` LINE SEPARATOR and `U+2029` PARAGRAPH SEPARATOR — while `↵` (`U+21B5`) and `¶` (`U+00B6`) are themselves characters, borrowed here as marks rather than being the separators.

In the demo only the first paragraph is the `#example-element`: turn its `margin` off and the paragraph gap disappears; change `line-height` and you can see that the space between the two `<br>` lines depends only on the line height, not on paragraph spacing.

{{InteractiveExample("CSS Demo: soft and hard breaks")}}

```css interactive-example-choice
margin: 0 0 1.25em;
```

```css interactive-example-choice
margin: 0;
```

```css interactive-example-choice
margin: 0;
line-height: 2.4;
```

```html interactive-example
<p id="example-element">First paragraph.<br>This line is a soft break, one line height away.</p>
<p>Second paragraph (for reference): the gap above it comes from the first one's margin.</p>
```

```css interactive-example
#example-element {
  max-width: 22em;
}
```

## overflow-wrap: long words {#overflow-wrap}

By default an over-long word (a URL, a hash) **overflows** instead of breaking — Latin scripts only break at spaces and hyphens.

| Value | Behaviour |
| --- | --- |
| `normal` | break only at normal points; long words overflow |
| `break-word` | break anywhere when nothing else fits (does not affect `min-content`) |
| `anywhere` | break anywhere, **and** participate in `min-content` (the container can shrink further) |

`word-wrap` is the legacy name for `overflow-wrap`; write `overflow-wrap` in new code.

Squeeze the box to 200px: under `normal` the URL runs straight past the dashed edge, and `anywhere` lets the container shrink further.

⚠️ The string must not contain **hyphens**: `-` is itself a valid break point, so a hyphenated URL wraps even under `normal` — which makes the property look broken (the first version of this demo did exactly that).

{{InteractiveExample("CSS Demo: overflow-wrap")}}

```css interactive-example-choice
overflow-wrap: normal;
```

```css interactive-example-choice
overflow-wrap: break-word;
```

```css interactive-example-choice
overflow-wrap: anywhere;
```

```html interactive-example
<div id="example-element">
  https://example.com/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnop
</div>
```

```css interactive-example
#example-element {
  max-width: 200px;
  border-right: 1px dashed currentColor;
}
```

## word-break: a blunter instrument {#word-break}

| Value | Behaviour |
| --- | --- |
| `normal` | break by language rules (CJK between characters, Latin between words) |
| `break-all` | break between any two characters, **including inside Latin words** |
| `keep-all` | do not break CJK between characters (Latin unchanged) |

`break-all` suits a fixed-width column of digits or codes; the price is Latin words cut in half. `break-word` as a `word-break` value is deprecated — do not use it.

Chinese does **not** need `break-all`: CJK text may break between characters by default, as part of the language rules.

`keep-all` only shows its hand in mixed text: Chinese stops breaking, and the long Latin word pushes the box wide.

{{InteractiveExample("CSS Demo: word-break")}}

```css interactive-example-choice
word-break: normal;
```

```css interactive-example-choice
word-break: break-all;
```

```css interactive-example-choice
word-break: keep-all;
```

```html interactive-example
<div id="example-element">
  中文混排 Supercalifragilisticexpialidocious 结尾
</div>
```

```css interactive-example
#example-element {
  max-width: 200px;
  border-right: 1px dashed currentColor;
}
```

## hyphens {#hyphens}

- `none`: never hyphenate;
- `manual`: only where a soft hyphen `&shy;` appears in the source;
- `auto`: the browser hyphenates using a dictionary, which requires a correct `lang` attribute.

`hyphens: auto` is meaningless for Chinese (no hyphenation) and useful for English typesetting, subject to language packs in the target browser.

## text-wrap: making short blocks look better {#text-wrap}

| Value | Use |
| --- | --- |
| `wrap` | default |
| `nowrap` | like `white-space: nowrap`, but affecting only wrapping, not whitespace |
| `balance` | make the lines of a short block **roughly equal**, good for headings |
| `pretty` | avoid a single word alone on the last line |

`balance` suits a few lines only (headings, card titles). Browsers ignore it on long paragraphs because it has a line limit.

`balance` only shows up with two or more lines: switch back to `wrap` and the last line is left with a word or two.

{{InteractiveExample("CSS Demo: text-wrap")}}

```css interactive-example-choice
text-wrap: wrap;
```

```css interactive-example-choice
text-wrap: balance;
```

```css interactive-example-choice
text-wrap: pretty;
```

```html interactive-example
<div id="example-element">
  A short headline that is meant to break into two lines of similar length
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 20px;
  border-right: 1px dashed currentColor;
}
```

## Tabs and spaces {#tabs}

A tab (`\t`) is **just whitespace** by default: under `white-space: normal` it is collapsed like a space. To show it at all, the `pre` family from the table above is the prerequisite.

Once it does render, its width comes from `tab-size`:

```css
pre {
  tab-size: 4;   /* a number = that many space widths; a length such as 2em also works */
}
```

The initial value in the spec is `8`. But it is computed from **the space width of the current font**, so a different typeface gives a different tab width — writing it out explicitly saves surprises.

One thing needs saying: CSS has **no** equivalent of Word's tab stops (left / centre / right / decimal alignment, plus leader dots). To get that behaviour you change the tool:

| What you want | How to do it in CSS |
| --- | --- |
| columns lined up | a `<table>`, or `display: grid` with `grid-template-columns` |
| digits lined up | `font-variant-numeric: tabular-nums` + right alignment |
| decimal alignment | no property; split integer and fraction into two columns, right- and left-aligned |
| leader dots filling the gap | no property; `flex` to stretch the gap + `border-bottom: 1px dotted` to draw the rule |

Two things that are usually missed:

- **runs of spaces**: ten spaces still occupy one under `normal`; preserving them needs `pre-wrap` (see the combinations below for comment fields);
- **tabular figures**: in proportional digits `1` is narrower than `8`, so columns never line up; `tabular-nums` (or the font's own `tnum` feature) equalises them — turn it on for money and version numbers in tables.

## Three combinations worth copying {#recipe}

Single-line ellipsis:

```css
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

Long URLs and hashes that must not burst the container:

```css
.break-anywhere {
  overflow-wrap: anywhere;
}
```

Preserve user-typed newlines and spaces (comments, notes):

```css
.user-text {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
```

The three recipes side by side: the first flattens everything onto one line, the second lets a long run break, the third keeps the source's newlines and spaces.

{{InteractiveExample("CSS Demo: whitespace recipes")}}

```css interactive-example-choice
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```

```css interactive-example-choice
overflow-wrap: anywhere;
```

```css interactive-example-choice
white-space: pre-wrap;
overflow-wrap: anywhere;
```

```html interactive-example
<div id="example-element">First line    with four spaces after it
  Second line comes from a source newline
  https://example.com/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnop</div>
```

```css interactive-example
#example-element {
  max-width: 220px;
  border-right: 1px dashed currentColor;
}
```

## Further reading

- MDN: `white-space`, `overflow-wrap`, `word-break`, `hyphens`, `text-wrap`
- CSS Text: white space processing and line breaking
