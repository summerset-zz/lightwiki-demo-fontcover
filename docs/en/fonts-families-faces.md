---
title: Fonts and faces
keywords: 字体家族, 字款, face, family, 静态字体, 命名, 别名
description: Why "Inter Bold" and "Inter" are two different things, and how this site identifies one face for a URL but a family for search.
section: basics
order: 1
updated: 2026-11-07
draft: false
---

"Have I got this font installed" depends on what "font" means. What you install is a **face**; what you see in a picker is a **family**; what you download is a **file**. They are three different things, and mixing them breaks pickers, search and favourites.

## Three words, three sizes {#three-words}
<!-- hint: Family, style, face | A family is the whole design, a style is one of its weights or slopes (Regular, Bold), and a face is one file fixed by family and style. -->

| Word | What it is | Example |
| --- | --- | --- |
| font family | One design with several weights and italics | Inter |
| font face | One specific member, **usually one file** | Inter Bold, Inter Italic |
| font file | The `.ttf` / `.otf` / `.woff2` on disk | `Inter-Bold.woff2` |

So "is Inter Bold installed" and "is Inter installed" are different questions: you may have the Regular and not the Bold.

## How the names map onto those concepts {#naming}

A font file has no "family" field and no "face" field — only a list of name records (see [the name table](/docs/name-table)): family name, subfamily name, PostScript name, each possibly repeated per language and platform.

Software assembles the two concepts from them:

- **family** = the family name (or the typographic family name);
- **face** = family + subfamily (`Bold`, `Italic`, `Regular`…).

Which is why the same face can read `Inter Bold` on one system (family "Inter Bold", subfamily "Regular") and `Inter` + `Bold` on another (family "Inter", subfamily "Bold"). Both are legal; the first form exists for old software.

## Static and variable fonts {#static-variable}

Traditionally: one weight, one file. Regular, Medium and Bold are three files, three faces.

Variable fonts break that equation: **one file** carries continuous axes (weight, width, optical size) and can produce endless weights. A "face" is then no longer "a file" but a point inside one.

This site stays conservative for now: one file is one entry, and a variable font records only its default weight. Picking a value along an axis belongs to the type tester.

## Style classification is not structure {#dimensions}

<!-- source: en.wikipedia.org | Typeface | 1382396174 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the serif, proportion, optical size and display-type sections; kept four style dimensions and set them against the structural distinction on this page -->

The three words above describe **structure**: which faces belong to one family, and how many faces a family has. Typefaces also get classified by **style**, which is a different axis entirely — one family can sit at different points on all of them:

| Dimension | Ends | What it means |
| --- | --- | --- |
| Serifs | Serif / sans-serif | Whether the stroke ends carry feet; in Chinese, Ming versus Gothic |
| Proportion | Condensed / extended | Narrower or wider than normal — what the `wdth` axis controls |
| Intended size | Text / display | Display faces are drawn for large sizes: thinner strokes, tighter spacing, more detail. Set them small and they clog |
| Contrast | Normal / reverse | The thick-thin relationship flipped; see [type anatomy](/docs/typographic-anatomy#stress) |

A family normally fixes one combination. That is why "Source Serif" is not one font but "a serif design plus a set of weights", and "Source Serif Condensed" is the same design at a different point on the proportion axis.

The usual mix-up is using a **style word** to ask for a **specific face**: "I want a serif" picks a style, "I want Regular" picks a face. Those are two different questions.

## How this site uses the two concepts {#this-site}

| Where | Which concept | Why |
| --- | --- | --- |
| Detail page URL | one face slug | Each face has its own names, metrics and licence |
| Family sidebar | family | Thousands of faces flat is unusable; group them first |
| Search box | family and subfamily names, plus aliases | People look for "that typeface", not a weight |
| Favourites | family (local) or face (library) | Local favourites mean "I have this family"; library favourites mean "this face" |

That is also why the favourites page carries a caveat: a local family favourite records "this family was installed on that machine at that time". After importing elsewhere, it may simply not be there — and nothing can verify it silently.

## A common misjudgement {#pitfall}

"I have [Arial](/fonts/arial-regular) on my computer" does not mean `Arial` in a web page renders Arial: that also depends on the visitor's machine, `@font-face`, and the fallback stack. Covered in [@font-face, descriptor by descriptor](/docs/css-font-face).

## Further reading

- OpenType spec: the `name` table (family and typographic family names)
- OpenType spec: the `fvar` table (variable fonts and named instances)
