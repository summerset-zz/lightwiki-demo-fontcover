---
title: Blocks
keywords: 区块, block, 已分配, assigned, 覆盖率, 未分配
description: A block is a range, not a list. Why the coverage denominator is "assigned" rather than the block size.
section: unicode
order: 1
updated: 2026-11-07
draft: false
---

Unicode divides code points into **blocks**: contiguous ranges with a name — Basic Latin is `U+0000`–`U+007F`, CJK Unified Ideographs is `U+4E00`–`U+9FFF`. The list lives in the official `Blocks.txt` and currently holds some 350 entries, growing with each version.

## A block is an administrative range, not a category {#not-a-category}
<!-- hint: Unicode block | A block is a contiguous range of code points that Unicode has named, such as Basic Latin. It tells you which range a code point belongs to, not what the character is. -->

A block says "this range belongs to this group", not what the characters are:

- one block can contain letters, digits, punctuation and symbols;
- one category of characters can be scattered across dozens of blocks;
- between blocks there are **gaps** — code points belonging to no block at all.

Actual classification comes from general category (letter / digit / punctuation / symbol / control…) and script (Latin / Greek / Han…), which are different axes entirely.

## Unassigned code points {#unassigned}

A block is a **reservation**, not necessarily a full house:

| Block | Range | Code points | Assigned |
| --- | --- | --- | --- |
| Basic Latin | `U+0000`–`U+007F` | 128 | 95 |
| CJK Unified Ideographs | `U+4E00`–`U+9FFF` | 20,992 | effectively full, still growing |

The 33 missing from Basic Latin are the control characters (`U+0000`–`U+001F` and `U+007F`): legal in encoding, but **without a formal name**, so not counted as assigned. That is why the coverage figure on this site is 95, not 128.

## Unassigned, reserved, noncharacter, surrogate {#kinds}
<!-- hint: Noncharacter | A code point that will never be assigned — 66 of them. Allowed in data, not in text meant to be exchanged. -->

<!-- source: en.wikipedia.org | Universal Character Set characters | 1384074310 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Types of code point section; kept only the four identities and lined them up with our own definition of assigned -->

"Not assigned" sounds like one category. It is four, and only one of them really means "not reached yet":

| Identity | What it is | Example |
| --- | --- | --- |
| Assigned | a character with a name | `U+4E2D` 中 |
| Reserved | left blank, may be assigned one day | `U+0378`, `U+0379` |
| Noncharacter | a code point that will **never** be assigned, kept for internal signalling | `U+FDD0`–`U+FDEF`, plus `U+xFFFE` / `U+xFFFF` in every plane |
| Surrogate | not a character at all, a UTF-16 assembly unit | `U+D800`–`U+DFFF` |

There are 66 noncharacters: the 32 in `U+FDD0`–`U+FDEF`, plus two in each of the 17 planes. They may turn up inside data, but they **must not appear in text meant to be exchanged**, and programs should not treat them as ordinary characters.

Our coverage denominator counts assigned characters only; the other three never count — they are not supposed to have glyphs. Control characters are the odd case: they *are* assigned (general category Cc) but have no name, so under our "has a proper name" rule they stay out of the denominator too.

## How "assigned" is computed {#assigned}
<!-- hint: Assigned code points | This denominator counts code points with a formal name; control characters, private use and surrogates are excluded. That is why Basic Latin shows 95 rather than 128. -->

The rule here: **a code point with a formal name**.

Concretely, read `extracted/DerivedName.txt` (Unicode's derived names, already computing things like `CJK UNIFIED IDEOGRAPH-4E00`), merge it with the general category from `UnicodeData.txt` into small same-category segments, then count, per block, how many code points fall inside those segments.

Therefore:

- control characters: encoded, unnamed → **not** counted;
- CJK ideographs: derived names → counted;
- private use: no names → not counted;
- surrogate range: not characters → not counted.

## How this site displays it {#this-site}

A block row reads `covered / assigned`: **how many of the characters that should exist in this block the font can draw**.

The progress bar, however, is scaled by the **block size**. Two different denominators, which can feel odd: for a 20,000-code-point CJK block the bar stays short while the number may look healthy.

Why not use one denominator everywhere? Using the block size is unfair to fonts — nobody can cover unassigned code points, and the result is a column of single-digit percentages that shows no difference. Using only assigned instead skews towards small, fully-assigned blocks and loses the "how much of this range do I occupy" reading of the bar.

## Favouriting blocks {#favorites}

Favourites are per **block**, never per character: a CJK block holds 20,000 code points and storing them one by one is neither useful nor affordable. Only the block index is stored; contents are fetched fresh each time.

## Further reading

- Unicode: `Blocks.txt`
- Unicode: `extracted/DerivedName.txt`
- The Unicode Standard, chapter 4 (Character Properties)
