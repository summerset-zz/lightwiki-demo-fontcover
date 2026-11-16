---
title: Character properties
keywords: 字符属性, general category, script, decomposition, 分解, compatibility, numeric, 数值, case mapping, 大小写, combining class, 组合类, bidi, 双向类, mirrored, 镜像, old name, 旧名, escapes
description: A code point carries more than a name. What category, decomposition, numeric value, case, combining class, bidi class and old name each mean, and how to read those lines in the dialog.
section: unicode
order: 2
updated: 2026-11-03
draft: false
---

Opening a character shows a name and a set of properties. They come from the Unicode Character Database (UCD), not from any font — the same properties apply to every font that draws the character.

## Name {#name}

Every assigned code point has an official name, fixed by the standard:

- `U+0041` → `LATIN CAPITAL LETTER A`
- `U+4E2D` → `CJK UNIFIED IDEOGRAPH-4E2D`
- `U+1F600` → `GRINNING FACE`

The name is an **identifier**, not a description: `GRINNING FACE` is just what it is called, with no claim about how it looks.

Control characters have no name (`<control>` and similar are placeholders), which is why this site does not count them as assigned — see [Blocks and "assigned"](/docs/unicode-blocks).

### Old name: what Unicode 1.0 called it {#old-name}

Field 11 of `UnicodeData.txt` holds the name used back in Unicode 1.0. Characters renamed after 1.1 keep the old one, so old texts and old code still line up:

| Code point | Current name | Old name |
| --- | --- | --- |
| `U+002E` | FULL STOP | PERIOD |
| `U+005C` | REVERSE SOLIDUS | BACKSLASH |
| `U+0028` | LEFT PARENTHESIS | OPENING PARENTHESIS |
| `U+FEFF` | ZERO WIDTH NO-BREAK SPACE | BYTE ORDER MARK |

The last row is worth a second look: everyone calls it the BOM today, and in the official table BOM is the **old** name; the current one is “zero width no-break space”.

For control characters the old names (`NULL`, `BELL`, `LINE FEED`) are really ISO 6429 names that Unicode simply kept.

## general category: what kind of character {#category}
<!-- hint: General category | The category comes from the Unicode Character Database, and the two-letter code is the field value. It is not translated. -->

Two-letter codes in seven groups:

| Group | Prefix | Meaning |
| --- | --- | --- |
| Letter | `L` | Letters |
| Mark | `M` | Marks (accents, combining signs) |
| Number | `N` | Numbers |
| Punctuation | `P` | Punctuation |
| Symbol | `S` | Symbols |
| Separator | `Z` | Separators (spaces) |
| Other | `C` | Control, format, private use, unassigned |

The common subcategories:

| Code | Meaning | Example |
| --- | --- | --- |
| `Lu` / `Ll` / `Lt` | Uppercase / lowercase / titlecase letter | `A` / `a` / `ǅ` |
| `Lo` | Other letter (Han, kana, …) | `中` |
| `Lm` | Modifier letter | `ʰ` |
| `Mn` | Nonspacing mark (stacks on others) | combining accent |
| `Nd` | Decimal number | `7` |
| `Po` | Other punctuation | `!` |
| `Zs` | Space separator | a normal space |
| `Cc` | Control character | newline |
| `Cf` | Format character (invisible) | zero-width space |

In the block section, the dialog shows a **category breakdown**: how many letters, punctuation marks and symbols the block holds. Blocks are mixed, so it gives a distribution rather than a fake single answer.

## script: which writing system {#script}
<!-- hint: Script | The script is the writing system a character belongs to, such as Latin, Cyrillic or Han. It differs from language: one script usually serves many languages. -->

**Script** says which writing system a character belongs to: `Latin`, `Han`, `Hiragana`, `Greek`, `Arabic`…

It is not the same as a block: Han characters are spread across many blocks (base plane, Extensions A–I, compatibility…), and a block can hold a single script.

Script matters for layout:

- line breaking (Chinese breaks between characters, Thai between words);
- font selection (fallback stacks often pick by script);
- the `locl` feature choosing forms per language (see [GSUB / GPOS](/docs/gsub-gpos)).

## Decomposition: one character, two spellings {#decomposition}
<!-- hint: Decomposition | Some characters can be written as a base character plus combining marks. A canonical decomposition is the same character written differently; a compatibility one merely looks alike. -->

`À` has two code points to choose from: `U+00C0` on its own, or `U+0041` + `U+0300` (an `A` plus a combining accent). Unicode records that relationship as a **decomposition mapping** — field 6 of `UnicodeData.txt`. The dialog shows it on two lines:

- **decomposition**: the canonical one — another spelling of *the same* character;
- **compatibility decomposition**: plausible in typesetting, but **not the same character**.

### Canonical: genuinely the same character {#canonical}

| Character | Code point | Decomposes to |
| --- | --- | --- |
| `À` | `U+00C0` | `A` + `◌̀` |
| `Å` | `U+00C5` | `A` + `◌̊` |
| `Ω` | `U+2126` (ohm sign) | `Ω` (`U+03A9`) |

The third row is the one people miss: the ohm sign and the Greek capital omega are **the same character**, encoded twice in Unicode's early days, and canonical decomposition admits it.

### Compatibility: looks the same, is not the same character {#compatibility}

| Character | Code point | Decomposes to | Tag |
| --- | --- | --- | --- |
| `ﬁ` | `U+FB01` | `f` `i` | `<compat>` |
| `µ` | `U+00B5` | `μ` (Greek letter) | `<compat>` |
| `½` | `U+00BD` | `1` `⁄` `2` | `<fraction>` |
| `①` | `U+2460` | `1` | `<circle>` |
| `㎏` | `U+338F` | `kg` | `<square>` |
| `Ａ` | `U+FF21` | `A` | `<wide>` |

The tag answers *why* it is not the same character:

| Tag | What it says |
| --- | --- |
| `<compat>` | generic compatibility variant, nothing more specific (ligatures, legacy spellings) |
| `<fraction>` | fraction typesetting |
| `<circle>` `<square>` | circled or boxed abbreviations |
| `<wide>` `<narrow>` | full-width / half-width (ideographic space `U+3000` decomposes to a plain space) |
| `<super>` `<sub>` | superscript / subscript |
| `<small>` | small variant |
| `<noBreak>` | the unbreakable version (no-break space `U+00A0` decomposes to a plain space) |
| `<vertical>` | a form made for vertical setting |
| `<font>` | a legacy variant that only changed the font style |
| `<initial>` `<medial>` `<final>` `<isolated>` | the four joining forms of an Arabic letter |

### What it decides is NFC / NFKC, not whether a font can compose {#decomposition-forms}

The split between canonical and compatibility decomposition is exactly the split between NFC and NFKC — the latter folds compatibility mappings too:

```js
'ﬁ'.normalize('NFC')   // 'ﬁ'  — unchanged
'ﬁ'.normalize('NFKC')  // 'fi' — folded
```

Two rules follow:

- **store and compare with NFC**; use NFKC for “these look alike, treat them as one” work (search, deduplication, slug generation);
- **NFKC must not be used for display**: `½` becomes `1⁄2`, full-width `Ａ` goes half-width, and the typographic intent is gone.

One more thing that is easy to get wrong: the decomposition table says *Unicode considers these code points equivalent*; it is **not the shaper's substitution table**. When a font has no `À`, the engine will not glue `A` and an accent together by itself — that only happens if the font carries the positioning rules for the mark (`mark` / `ccmp`, see [GSUB / GPOS](/docs/gsub-gpos)). So if a combined spelling has to work everywhere, run `normalize('NFC')` first and leave the engine a single glyph to find.

## Numeric value {#numeric}

Fields 7–9 of `UnicodeData.txt` are three tiers of number, most specific first:

| Field | Name | Meaning |
| --- | --- | --- |
| 7 | Decimal | a decimal digit, `0`–`9` style |
| 8 | Digit | a number, but not necessarily a decimal digit |
| 9 | Numeric | the value itself — can be a fraction or a Roman numeral |

The dialog shows `1/2 (Numeric)`; the bracket names **whichever tier matched** (Decimal wins when present):

| Character | Three tiers | Shown as |
| --- | --- | --- |
| `7` | Decimal 7 / Digit 7 / Numeric 7 | `7 (Decimal)` |
| `５` (full-width) | Decimal 5 / Digit 5 / Numeric 5 | `5 (Decimal)` |
| `①` | — / Digit 1 / Numeric 1 | `1 (Digit)` |
| `½` | — / — / `1/2` | `1/2 (Numeric)` |
| `Ⅷ` | — / — / 8 | `8 (Numeric)` |

Full-width `５` is a decimal digit too (same `Nd` category, just a different code point); `①` is a number but not a decimal digit. That is the whole difference between the tiers.

This bites in code: `Number('½')` and `Number('５')` are both `NaN`, and so is `parseInt`, because JS numeric literals only accept ASCII. The regex `\d` matches ASCII digits only; to cover Unicode decimals you need `\p{Nd}` with the `u` flag.

## Case mapping {#case}

Fields 13–15 hold **single-character** mappings: one code point each for uppercase, lowercase and titlecase. The dialog shows them as `A / a`, with the code points on hover.

This is “the simple mapping in UnicodeData”, not `toUpperCase()`:

- `ß` (`U+00DF`) has **no** uppercase mapping in those fields, yet `'ß'.toUpperCase()` is `'SS'` — two characters. Multi-character mappings live in another file (`SpecialCasing.txt`), which this site does not read;
- language-specific exceptions (Turkish `i` uppercases to `İ`; Lithuanian reorders accents) are in that same file;
- so read this line as “this character's one-to-one replacement”, not “what it becomes when uppercased”.

## Combining class and normalisation {#normalize}

`é` can be one code point (`U+00E9`) or two (`U+0065` + `U+0301`). They look identical, yet **string comparison disagrees**:

```js
'é' === 'é'        // false — one precomposed, one a sequence
'é'.normalize('NFC') === 'é'.normalize('NFC')  // true
```

Unicode defines four normalisation forms (NFC / NFD / NFKC / NFKD). Before comparing user input, searching or storing in a database, `normalize('NFC')` is the standard move.

Combining class values decide which mark stacks on top when several are attached — important to layout engines, usually irrelevant to application code.

When several marks land on one character, which goes above and which below is decided by the **combining class** (field 4 of `UnicodeData.txt`). It is not a priority; it is a coarse position number:

| Value | Meaning | Example |
| --- | --- | --- |
| `0` | does not stack — a free-standing character | ordinary letters |
| `1` | overlays the character itself | `U+0334` tilde overlay |
| `220` | goes below | `U+0323` dot below |
| `230` | goes above | `U+0301` acute accent |

Canonical ordering rearranges marks by this value (non-zero, ascending) and only falls back to written order when the values are equal. So `◌́` and `◌̣` produce the same result whichever you type first — that stable reordering is required by the standard, not a shaper's whim.

<figure style="margin: 2rem 0">
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1px; overflow: hidden; border: 1px solid var(--color-neutral-200); border-radius: 6px; background-color: var(--color-neutral-200)">
    <div style="grid-column: 1 / -1; padding: 0.375rem 0.625rem; background-color: var(--color-neutral-50); font-size: 0.75rem; line-height: 1.5; color: var(--color-neutral-500)">One character: one code point, or two</div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#xE9;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+00E9</div>
    </div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x301;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0301</div>
    </div>
    <div style="grid-column: 1 / -1; padding: 0.375rem 0.625rem; background-color: var(--color-neutral-50); font-size: 0.75rem; line-height: 1.5; color: var(--color-neutral-500)">Both marks sit above (combining class 230 in both cases): written order decides</div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x301;&#x308;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0301 U+0308</div>
    </div>
    <div style="padding: 0.75rem 0.5rem; background-color: var(--color-white); text-align: center">
      <div style="font-size: 2.75rem; line-height: 1.2">&#x65;&#x308;&#x301;</div>
      <div style="margin-top: 0.375rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 11px; color: var(--color-neutral-500)">U+0065 U+0308 U+0301</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    The two cells in the first row <strong>look identical</strong>, yet in code they are two different strings: <code>length</code> is 1 and 2, and <code>===</code> is <code>false</code>.
    The second row swaps the written order of two marks: both have the same combining class (<code>U+0301</code> and <code>U+0308</code> are both 230), so the standard will not reorder them for you — whichever you write first ends up closer to the base letter.
    If those two cells look like a smudge on your screen, that font has no mark positioning (the <code>mark</code> feature); the rule is not wrong.
  </figcaption>
</figure>

Combining class is also part of the normalisation rules: it is what NFC / NFD sort marks by. Which code points make up “one visible character” is a different question — that is the **grapheme cluster**, see [Code points and planes](/docs/unicode-codepoints#sequences).

## Bidi class and mirroring {#bidi}

Field 5 is the bidi class (Bidi_Class) and field 10 is “mirrored”. Both are **properties of the character**, not settings on a paragraph:

| Code | Full name | Example |
| --- | --- | --- |
| `L` | Left-to-Right | Latin letters |
| `R` | Right-to-Left | Hebrew letters |
| `AL` | Arabic Letter | Arabic letters |
| `EN` | European Number | `7` |
| `AN` | Arabic Number | `٧` (`U+0667`) |
| `ON` | Other Neutral | brackets, commas |
| `NSM` | Nonspacing Mark | combining accents |

`٧` and `7` make a good pair: same value, but one is an Arabic number (`AN`) and the other a European number (`EN`) — and they behave differently in the bidi algorithm.

Mirroring is for right-to-left text: `(` `)` `<` `>` need the opposite form inside an RTL run. `U+0028` left parenthesis has its mirrored flag set to `Y`.

Which side anything lands on, and how brackets swap, is the bidi algorithm's job (UAX #9) — see [Writing direction](/docs/writing-direction). What matters here is that **it is a property of the character, and the dialog shows it**.

## One character, seven spellings {#escapes}
<!-- hint: Escapes | One code point has a different spelling in HTML, C, JavaScript, CSS and URLs. The %XX form in URLs encodes bytes, not code points. -->

The table at the bottom of the dialog is not enumeration for its own sake. The first four rows are the same number with different prefixes:

| Spelling | What it is |
| --- | --- |
| `&#201;` | HTML character reference, decimal (hex form: `&#x00C9;`) |
| `0x00C9` | a C-family hex literal — the code point written as a **number** |
| `\u00C9` | JavaScript / JSON string escape |
| `\00C9` | CSS backslash escape (up to six hex digits, then an optional space) |

The rest each have their own syntax: `\u{00C9}` (Ruby, PHP), `\x{00C9}` (Perl), `%C3%89` (URL encoding).

Why they diverge: none of these syntaxes were designed together. `0x` comes from C in the 1970s; CSS uses a backslash so a stylesheet can carry any character; HTML character references predate Unicode, from the character-set switching era; and URL `%XX` escapes are **byte-level**, unrelated to code points — which is why one Han character takes three `%XX` and one emoji takes four.

The astral plane is where this table earns its keep: `U+1F600` has no single-character escape in JavaScript, so it must be written as the surrogate pair `\uD83D\uDE00`. Writing `\u1F600` reads as `\u1F60` followed by a `0`.

## What the dialog shows {#this-site}

Clicking a character in the coverage panel opens a dialog with three parts:

1. **head** — the title and the code point, with a close button;
2. **body** (may scroll):
   - glyph preview — the loaded font's glyph once one is loaded, otherwise the fallback's;
   - official name, code point, whether the current font covers it;
   - the **property table**: category, decomposition / compatibility decomposition, numeric value, case, combining class, bidi class, mirrored, old name;
   - the **escape table**: the seven spellings above;
   - the **block section**: block name, range, `assigned / block size`, category breakdown.
3. **footer** — four step buttons: previous / next (adjacent code points), and previous available / next available (only code points this font has).

Three details worth knowing:

- the property table lists **only the rows that have a value**. An `A` does not get four empty lines, and a Han character shows “category / bidi class” only — because ideographs are stored as compressed ranges in `UnicodeData.txt` (`<CJK Ideograph, First>`), so those columns really are empty. It is not missing data on our side;
- the decomposition and case cells are truncated; **hover** shows the raw code points, because whether `À` is `0041 0300` cannot be seen from the glyph;
- category is shown as `Uppercase Letter (Lu)`: the full name to read, the two-letter code to match against the standard. The code is **not translated** — Chinese references write `Lu` too.

## Further reading

- The Unicode Standard, chapter 4 (Character Properties)
- UAX #15 (normalisation), UAX #9 (bidi algorithm), UAX #29 (grapheme cluster boundaries)
- Unicode: `UnicodeData.txt` (the meaning of all 15 fields is in its header), `extracted/DerivedName.txt`
