---
title: 'The BOM: three bytes at the head of a file'
keywords: BOM, byte order mark, 字节序标记, endianness, U+FEFF, ZWNBSP, UTF-8 BOM, EF BB BF, CSV, Excel, mojibake, utf-8-sig, JSON.parse
description: It does not show up and has no width, yet it decides whether Excel reads Chinese correctly — and it can make JSON.parse fail outright. What the BOM is, why it has two names, and when to add it.
section: unicode
order: 5
updated: 2026-11-03
draft: false
---

There may be three bytes at the very front of a text file that you cannot see in your editor. They can make Excel read Chinese correctly, and they can make a perfectly ordinary-looking JSON document fail to parse. That is the BOM.

## What it is {#what}

The BOM is the handful of bytes at the head of a file (or stream) that tells the reader which encoding it is and how the bytes are ordered:

| Encoding form | Leading bytes |
| --- | --- |
| UTF-8 | `EF BB BF` |
| UTF-16 big-endian (BE) | `FE FF` |
| UTF-16 little-endian (LE) | `FF FE` |
| UTF-32 big-endian | `00 00 FE FF` |
| UTF-32 little-endian | `FF FE 00 00` |

The crucial point: **the BOM is not metadata in a file header — it is a character**, code point `U+FEFF`, encoded as those bytes. Which means any code that reads the file as text will read it too, as character 0 of the string. Everything awkward about it follows from that.

## Why it has two names {#two-names}

The official name of `U+FEFF` is `ZERO WIDTH NO-BREAK SPACE`; `BYTE ORDER MARK` is its **old name** (see [Character properties](/docs/unicode-character-properties#old-name)). Everyone calls it the BOM today, and in the official table that is the former name.

Why it was needed: UTF-16 and UTF-32 split a code point across several bytes, and historically both orders were in use. The same bytes `00 41` read big-endian give `U+0041` (`A`); read little-endian they give `U+4100`. Put a `U+FEFF` at the front and the order is self-evident — which is the literal meaning of “byte order mark”.

## UTF-8 does not need it {#utf8}

UTF-8 is read byte by byte, so there is no “which byte comes first” problem; a BOM in UTF-8 carries no ordering information. All it can do is **announce “this is UTF-8”**.

The standards are cool about it:

- the Unicode Standard says a BOM for UTF-8 is **neither required nor recommended**;
- RFC 8259 (JSON) is blunter: producers **must not** add one, parsers may ignore it;
- the HTML and CSS parsing rules both say outright: strip a leading BOM.

In other words, a UTF-8 BOM is not “the standard way”, it is a **compromise made for certain tools**.

## CSV and Excel: the classic trap {#csv}

This is the main reason it is still in use. Excel does not guess the encoding when it opens a `.csv`: **without a BOM it decodes using the system locale** (GBK / CP936 on a Chinese Windows). So a UTF-8 spreadsheet full of Chinese arrives as garbage in Excel while looking perfectly fine in an editor.

Add a BOM and Excel recognises UTF-8. Hence the advice that sounds contradictory:

- **a CSV meant for Excel**: add the BOM;
- **a CSV meant for a program**: do not.

Because on the program side the BOM arrives together with the first field of the first row: the header `id` is really `\ufeffid`, so `row['id']` finds nothing — the file clearly has that column, and the code says it does not. That error is hard to connect to encoding, because the file looks completely normal.

When you need both, write two files, or use `.xlsx` — it handles encoding itself and does not rely on a BOM to decide.

## Where it bites in code {#gotchas}

“Read a file” means different things to different APIs:

| Situation | Strips a leading BOM? |
| --- | --- |
| `JSON.parse(text)` | **No** — throws `Unexpected token` |
| Node `readFileSync(p, 'utf8')` | **No** |
| Node `require('./a.json')` | Yes (stripped internally) |
| Browser `await res.text()` | Yes (when decoding as UTF-8) |
| Python `open(p, encoding='utf-8')` | **No** |
| Python `open(p, encoding='utf-8-sig')` | Yes |
| A PHP file with a BOM before `<?php` | No — it becomes output, then `headers already sent` |

So when reading a format where a single wrong character is fatal — JSON above all — do `text.replace(/^\uFEFF/, '')` first; better still, do not write it in the first place.

Conversely, a JavaScript source file with a BOM is harmless: `U+FEFF` counts as whitespace in ECMAScript. What actually breaks is **data files** — JSON, CSV, config.

## An invisible character, while we are here {#invisible}

`\uFEFF` in the middle of a text still nominally carries its old “zero width no-break space” job, but today's layout engines mostly ignore that; its more common role is an **invisible junk character**:

```js
'a\uFEFFb' === 'ab'   // false — looks the same, compares unequal
```

Copying a command off a web page, pasting headers out of Excel, or any exporter that “helpfully” adds it — all of them can deliver one. When two strings that look identical compare unequal, or an ID that matches by eye cannot be found, suspect it first.

## How to check {#inspect}

- Look at the first three bytes: `xxd -l 3 file` (macOS / Linux), `Format-Hex -Count 3 file` (PowerShell), `od -c file | head -1`;
- the editor: VS Code shows `UTF-8 with BOM` in the status bar, and lets you change it there;
- `file file` says `with BOM` in its output.

## What this site does {#this-site}

Every file and every response here is UTF-8 **without** a BOM: markdown is saved with editor defaults, JSON goes through `JSON.stringify` (which never adds one), and API responses declare `charset=utf-8` in `Content-Type`, so readers do not have to guess.

This site has no CSV export today. If one is added, the rule above applies: BOM for the copy people open in Excel, none for the copy a program reads.

## Further reading

- The Unicode Standard, chapter 2 (General Structure), the section on byte order marks
- RFC 3629 (UTF-8); RFC 8259 (JSON), section 8.1
- This site: [Character properties](/docs/unicode-character-properties#old-name) (old names), [Code points and planes](/docs/unicode-codepoints#encodings) (UTF-8 and UTF-16)
