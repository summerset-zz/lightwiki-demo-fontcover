---
title: Emoji
keywords: emoji, code point, bytes, utf8mb4, length, grapheme cluster, rendering, ZWJ
description: Emoji are characters, not images. Why "how many characters" has three answers, and why they fail to insert into a database.
section: unicode
order: 4
updated: 2026-11-02
draft: false
---

There is one thing to get right about emoji: **they are characters, not images**. So they are governed by encoding, length, charset and font rules — and those rules count "one emoji" differently.

## A character, not a picture {#not-image}

`😀` is a code point (`U+1F600`) stored in the text like any other character. The coloured face you see is drawn by a **font**.

Consequences, all of which matter:

- the same text **looks different** on Apple, [Google](/credits/maker/google) and [Microsoft](/credits/maker/microsoft) systems — three different emoji fonts, three designs;
- a screenshot or a comp with an emoji in it will not reproduce elsewhere;
- a font may carry no emoji glyphs at all, in which case the browser falls back to the system emoji font (see [Shaping and fallback](/docs/unicode-shaping-fallback));
- colour emoji are implemented with bitmap or vector tables (`CBDT`, `sbix`, `COLR`…), but **to your code they are still one character**.

## Three kinds of "length" {#counts}

The same string gives three different numbers:

| Question | How | `"😀"` | `"👨‍👩‍👧"` |
| --- | --- | --- | --- |
| UTF-16 code units | JavaScript `.length`, HTML `maxlength` | 2 | 8 |
| code points | `[...str].length`, `Array.from(str).length` | 1 | 5 |
| grapheme clusters (what looks like one character) | `Intl.Segmenter` | 1 | 1 |

The family emoji is man + zero-width joiner + woman + zero-width joiner + girl: five code points, two of which take no width themselves but decide whether the neighbours merge.

```js
'😀'.length                                    // 2   ← code units
'😀'.codePointAt(0)                            // 128512
[...'😀'].length                               // 1   ← code points
[...new Intl.Segmenter().segment('👨‍👩‍👧')].length  // 1   ← grapheme clusters
```

Before building a character counter (remaining characters, nickname limits), decide which one you mean. Most products want **grapheme clusters**, while the implementation usually uses `.length`.

## Bytes {#bytes}

In UTF-8 an emoji is usually 4 bytes (everything outside the BMP takes 4):

| Text | Code points | UTF-16 units | UTF-8 bytes |
| --- | --- | --- | --- |
| `A` | 1 | 1 | 1 |
| `中` | 1 | 1 | 3 |
| `😀` | 1 | 2 | 4 |
| `👨‍👩‍👧` | 5 | 8 | 18 |

```js
new TextEncoder().encode('😀').length   // 4
Buffer.byteLength('😀', 'utf8')         // 4 (Node)
```

"Counted in bytes" and "counted in characters" can differ by 4× — most database surprises come from exactly this.

## Lengths in a database {#sql}

Two kinds of problem look alike and have different causes.

**One: the charset cannot hold the character.** MySQL's `utf8` is really `utf8mb3` (max 3 bytes per character), so a 4-byte emoji fails outright:

```
Incorrect string value: '\xF0\x9F\x98\x80' for column 'name' at row 1
```

That is not "the column is too short" — it is a 3-byte charset. The fix: use **`utf8mb4`** for the database, tables, columns and connection.

**Two: the length is counted differently.**

- `VARCHAR(n)` counts **characters** in MySQL (not bytes); PostgreSQL also counts characters; SQLite barely limits;
- but "character" there means **code point**, not grapheme cluster — a family emoji counts as 5;
- `LENGTH()` returns **bytes**, `CHAR_LENGTH()` returns characters (in Postgres, `OCTET_LENGTH()` and `LENGTH()`):
  ```sql
  SELECT LENGTH('😀'), CHAR_LENGTH('😀');   -- 4, 1
  ```
  Using `LENGTH()` for business rules blows up immediately on Chinese and emoji;
- index prefixes have byte limits: 767 bytes in the old (`COMPACT`) row format; with 4 bytes per `utf8mb4` character that is where `VARCHAR(191)` came from. `DYNAMIC` allows 3072 bytes (about `VARCHAR(768)`).

## Front end versus back end {#frontend}

The same sentence can be measured three ways:

| Layer | Counts | `"😀"` |
| --- | --- | --- |
| HTML `maxlength` / JS `.length` | UTF-16 code units | 2 |
| Database `VARCHAR(n)` | code points | 1 |
| Validation regex `.` without the `u` flag | code units | 2 |

Which produces "the form says one character left, the server says it is too long". The usual approach:

- count with `[...value].length` or `Intl.Segmenter` on the client, not `.length`;
- validate by characters (`CHAR_LENGTH`) on the server;
- `normalize('NFC')` before storing (see [Character properties](/docs/unicode-character-properties));
- **never truncate by bytes** — that cuts a surrogate pair in half and yields mojibake.

## Rendering: still not an image {#render}

Because emoji are characters, how they look is decided by **font plus system**:

- Apple Color Emoji, Segoe UI Emoji and Noto Color Emoji are three designs; the same code point is drawn differently;
- some characters have two presentations (text and emoji), chosen by variation selectors: `U+FE0F` for emoji, `U+FE0E` for text (see [Text or emoji](#variation-selectors) below);
- when a system or font lags behind Unicode, newer emoji show as tofu.

So "the emoji in the comp" may become a different shape elsewhere. Not a bug — normal behaviour for a character.

## Text or emoji {#variation-selectors}

Some characters are **legally both**: `✏` is a black-and-white pencil that follows the text colour, or a colour icon. `U+2139` ℹ is the same story — it has been in Unicode since 3.0 as the plain “information source” symbol, and only gained a colour presentation when emoji variation sequences arrived in Unicode 6.1 (2012).

Which one you get is decided by a **variation selector**, itself invisible with zero width:

| Code point | Formal name | Term in UTS #51 | Effect |
| --- | --- | --- | --- |
| `U+FE0E` | VARIATION SELECTOR-15 (VS15) | **text presentation selector** | requests text presentation: monochrome, follows the text colour |
| `U+FE0F` | VARIATION SELECTOR-16 (VS16) | **emoji presentation selector** | requests emoji presentation: colour |

Both live in the `Variation Selectors` block (`U+FE00–U+FE0F`, added in Unicode 3.2) and are general category Mn — they were introduced for CJK glyph variants; the text/emoji meaning came later, defined by UTS #51 from Unicode 6.1 on.

A **variation sequence** is a base character plus one selector, and it is not free-form: every character eligible for a selector is listed in [emoji-variation-sequences.txt](https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-variation-sequences.txt) (371 sequences in version 18.0), and the spec says only those are valid. Bolting `U+FE0E` onto anything else has no defined meaning and is usually ignored.

### Who decides the default {#variation-defaults}

- characters with `Emoji_Presentation=Yes` (`😀`, `⌚`) are emoji by default;
- characters with `Emoji_Presentation=No` (`©` `®` `™` `ℹ` `✏` `❤`) are **text by default** — colour takes an explicit `U+FE0F`;
- anything that is neither is text only.

### The odd behaviour on Windows {#variation-windows}

On Windows with Chromium, `U+2139` (ℹ) often ignores that default and shows as a colour icon. Unicode is not confused — this is **font matching**: Segoe UI Emoji also has the character, and UTS #51 §4.4 describes exactly this real-world approach: “if any font in the lookup list is an emoji font, then emoji presentation is used whenever possible”.

The recommendation is the opposite: **on web pages, text-default characters without a selector should render as text** (§4, the Emoji versus Text Display table). So this is an implementation choice, not a requirement.

Two things you can do:

1. **put the intent in the string**: `U+2139 U+FE0E`. It travels with the text — copy, paste, database — and does not depend on styling;
2. **order the font stack**: put a text font that has the character ahead of the emoji font (`font-family: "Segoe UI Symbol", system-ui, sans-serif`) — fixes this page only, not the string someone copies out.

```js
'\u2139\uFE0E'.length            // 2 — the selector is a code point too
[...'\u2139\uFE0E'].length       // 2
'\u2139\uFE0E'.normalize('NFC')  // unchanged: a variation sequence is not a combining pair
```

A third route is BCP 47's `-u-em-text` (`<html lang="en-u-em-text">`), defined in UTS #51 §4.2, but support is uneven and it cannot be the only mechanism.

⚠️ `U+FE0E` is a **request**, not a command: with no text glyph available you still get an emoji or tofu. Where the character has to look like an ordinary symbol (code comments, terminal output, logs), do not rely on it — an ASCII spelling is safer.

⚠️ It also **changes the count**: one more `U+FE0E` means one more code point, so when the three measures in the previous section disagree, look here first.

## What you can see here {#this-site}

- the character drawer shows any character's code point and the escape spellings in each language (astral characters like `\uD83D\uDE00` are easy to get wrong);
- coverage **usually shows nothing** for emoji: ordinary Latin or Chinese fonts carry no emoji glyphs, and the emoji you see on the page come from the system emoji font;
- measuring an emoji in the metrics panel tells you plainly when the font has no glyph for it.

## Further reading

- The Unicode Standard: the emoji chapters and `emoji-data.txt`
- UTS #51 (Unicode Emoji)
- MDN: `Intl.Segmenter`, `String#codePointAt`
- This site: [Code points](/docs/unicode-codepoints), [Character properties](/docs/unicode-character-properties)
