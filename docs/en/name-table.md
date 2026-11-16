---
title: The name table
keywords: name 表, 家族名, PostScript 名, 命名, 本地化, nameID, WWS
description: Family, subfamily, PostScript name, localised names and the licence — all of it comes from one table.
section: fields
order: 1
updated: 2026-11-02
draft: false
---

The name shown in an interface does not come from the file name, and it is not guessed by the system. It comes from the `name` table inside the font: a list of "number → string" records, where the number says **what kind of name** the string is.

## What the table contains {#what}
<!-- hint: name table | The name table holds family names, style names, vendor and licence text, grouped by platform and language. -->

The layout is plain:

- a header with a version and a record count;
- one record per string: platform, encoding, language, **name ID**, length, offset;
- the strings themselves, stored after the records.

Which means the same name can appear **many times**: one record in Chinese, one in English, one for the Macintosh platform, one for Windows. Which one wins depends on the program reading it.

## The name IDs that matter {#ids}

| nameID | Meaning | Typical value |
| --- | --- | --- |
| 0 | Copyright notice | `Copyright 2020 The Inter Project Authors` |
| 1 | Family name | `Inter` |
| 2 | Subfamily name | `Bold`, `Italic`, `Regular` |
| 4 | Full name | `Inter Bold` |
| 5 | Version string | `Version 3.019` |
| 6 | PostScript name | `Inter-Bold` |
| 13 / 14 | Licence description / licence URL | `SIL Open Font License 1.1` plus a link |
| 16 / 17 | **Typographic family / subfamily** | `Inter` / `Bold` |
| 21 / 22 | WWS family / subfamily | how the face groups by weight, width and slant |

The difference between 1 + 2 and 16 + 17 is the part people skip. Old software only knows 1 and 2, so a "Inter Bold" face may store family `Inter Bold` and subfamily `Regular`; 16 and 17 express the design intent instead — "this belongs to Inter, and it is the Bold member". The first pair is compatibility, the second is truth.

## Platforms and languages {#platforms}

Every record carries a platform / encoding / language triple. Two groups cover almost everything:

- **Windows (platformID 3)**: encoding 1 = BMP, 10 = full Unicode; language 0x0409 English, 0x0804 Simplified Chinese, 0x0404 Traditional Chinese;
- **Macintosh (platformID 1)**: language 0 for English, other Mac language codes otherwise.

Older fonts sometimes wrote names only for the Macintosh platform, leaving the Windows group with nothing but a copyright or licence string. **Picking one platform and reading only that will lose the name**; fall back field by field instead.

## Localised names {#localized}
<!-- hint: Localized names | The name table stores font names per language: 微软雅黑 in Chinese, Microsoft YaHei in English. -->

A Chinese user seeing `Microsoft YaHei` pauses for a second. The table usually contains a Chinese record already (a Chinese entry for nameID 1 or 16); many programs simply take the English one.

This site stores the localised entries of nameID 1 / 16 as `localizedNames`, shows the local name in family lists, and keeps the real name in the tooltip. Search, selection and favourites always use the **real** name — otherwise "雅黑" and "YaHei" would produce two different result sets.

## Three pitfalls {#pitfalls}

1. **The PostScript name is tightly restricted**: at most 63 characters, ASCII 33–126, no spaces and none of `[](){}<>/%`. It ends up in PDFs and system font caches; a bad value is accepted by some systems and quietly breaks others.
2. **WWS is not the typographic family**. WWS (weight, width, slant) exists so software can group faces mechanically; the typographic names preserve the designer's grouping. When the two disagree, different systems show different names.
3. **Names can lie.** The table is just text with no validation; a file can claim its family is `Arial`. That is why grouping also looks at other fields.

## How this site uses it {#this-site}

- Family list and detail heading: the family name from `name` (typographic family first, plain family as fallback);
- Localised display when the interface language changes: the other language records of the same nameID;
- Search aliases: localised names and common Chinese names flattened into one alias table;
- Numbers such as glyph count are **not** here — they come from `maxp` and `OS/2`.

## Further reading

- OpenType spec: the `name` table, including the full nameID list and platform encodings
- OpenType spec: the naming section covering WWS versus typographic names
