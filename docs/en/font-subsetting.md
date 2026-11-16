---
title: On-demand loading and subsetting
keywords: font subsetting, pyftsubset, unicode-range, font slicing, on-demand fonts, IFT, incremental font transfer
description: Three ways to make a font file smaller and download less — subsetting, unicode-range slicing, and IFT — and what each of them breaks.
section: dev
order: 9
updated: 2026-11-04
draft: false
---

A CJK font weighs several megabytes, and a page often uses a few dozen characters from it. Several techniques exist for “don't download the whole font”, and they are routinely lumped together as “on-demand loading” — but they do **entirely different things**:

- **Subsetting**: cut the font down to only the characters you need, so the **file gets smaller**;
- **Slicing + `unicode-range`**: split the font into dozens or hundreds of pieces so the browser **downloads only the pieces it needs**;
- **IFT (Incremental Font Transfer)**: one file; the browser takes a small part first and asks for the rest as needed — still being standardised.

Each is covered below, followed by what they break.

## Two levers: fewer glyphs, or fewer files {#two-levers}

| Approach | What it changes | Who does it | Can the content change? |
| --- | --- | --- | --- |
| Subsetting | The glyph set inside the file | A build-time tool, or a server endpoint | A static subset cannot; a dynamic subset is regenerated per request |
| Slicing + `unicode-range` | Which code point range maps to which file | Just CSS; the split is prepared in advance | Yes — a new character simply triggers another piece |
| IFT | How the file is transferred (range requests + patches) | Browser and server; both must support it | Yes, with no pre-splitting |

In one sentence: **subsetting reduces the content, slicing reduces the download, IFT reduces the first download.**

## Subsetting: cut the font down to the characters you use {#subsetting}

The general-purpose tool is `pyftsubset` from fonttools:

```bash
pyftsubset NotoSansSC-Regular.otf \
  --text="FontCover" \
  --flavor=woff2 \
  --output-file=noto-subset.woff2
```

`--flavor=woff2` needs brotli installed. Beyond that there are tools that crawl a page and collect its characters automatically, and GUI wrappers around the same idea; underneath, all of them do one thing: **given a character set, emit a small font**.

The upside is decisive — megabytes become tens of kilobytes. The cost:

- **The character set must be known when you build it.** User input, text from an API, copy you edit next week — none of it is in there;
- A missing character **falls back** to the next font in the stack, and weight and skeleton jump mid-paragraph (see [Shaping and fallback](/docs/unicode-shaping-fallback));
- A subset font is only valid for that one page. **Do not expect to install it**: the characters that are gone are really gone.

## Dynamic subsetting: subsetting moved to the server {#dynamic}

The endpoint takes a piece of text and returns a freshly generated subset, usually like this:

```
/fonts/xxx.woff2?text=FontCover
```

The upside is that the content can change. The costs are on the engineering side:

- **Every distinct text is a new resource.** Caching and CDN still work (the same text always yields the same file), but the hit rate depends on how repetitive your text is;
- The text ends up **in a URL**: in access logs, proxy logs, `Referer` headers. Don't put anything in there you would rather not record;
- It requires **somebody hosting the font and having the right to generate subsets** — which is why this is mostly what commercial webfont services do. Self-hosting means owning that step.

## Slicing + `unicode-range`: download only the pieces you need {#slicing}

This one is pure CSS, with no server involvement:

```css
@font-face {
  font-family: 'Example SC';
  src: url('/f/ex-common.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;   /* the code points this piece covers */
}

@font-face {
  font-family: 'Example SC';
  src: url('/f/ex-ext.woff2') format('woff2');
  unicode-range: U+3400-4DBF;
}
```

One family name may have any number of `@font-face` rules, each carrying its own `unicode-range`. When laying out text, the browser decides **from the code points that actually appear** which of those files it needs to download. If none of a piece's characters occur on the page, that file is never requested — not one byte.

⚠️ The crucial distinction: `unicode-range` controls **whether a file is downloaded**, not “only these few characters inside it”. Once a piece is needed, all of it comes down — so the result depends entirely on **how you split**.

The usual CJK split: the few thousand most frequent characters in one piece (or in a few frequency tiers), everything else by code point range, a hundred or two hundred characters per piece. This is how CJK fonts on [Google Fonts](/credits/maker/google) are served — look at their CSS and a single font has a hundred-plus `@font-face` rules, each with a `unicode-range`.

The annoyance is **configuration and maintenance**: you have to generate the split yourself, the file count explodes, and changing the split means re-publishing everything. The payoff is that it is solid — natively supported by browsers, with no server-side capability required.

## IFT: one file, fetched incrementally {#ift}

Slicing guesses in advance which characters you will use. IFT (Incremental Font Transfer) tries not to guess: the browser uses **range requests** to ask the server for part of the font file, enough to show the first screen; when it meets a glyph it doesn't have, it requests a patch that appends those glyphs.

The W3C is standardising this (there is a separate draft specification), and Chrome has an experimental implementation that is off by default. It only works if **the server supports range requests and patches**, so for now its practical status is “a direction worth knowing about”, not “usable tomorrow”.

## What subsetting breaks {#costs}

| What breaks | Consequence |
| --- | --- |
| `GSUB` / `GPOS` / `GDEF` stripped along with the glyphs | Ligatures, contextual substitution and mark positioning disappear: Arabic and the Indic scripts render wrong, not merely ugly |
| `fvar` / `gvar` stripped from a variable font | The remaining glyphs still draw, but the weight axis is gone — a variable font that can only do one instance |
| Some glyphs dropped but the full `cmap` kept | Text has code points the file has no outline for; browsers report missing glyphs or quietly draw empty boxes |
| The character set doesn't cover the text | Fallback fonts mix in, weight and skeleton jump — very visible in CJK |
| Over-slicing | Every piece carries its own table overhead, so ten characters per file can mean *more* total bytes; HTTP/2 multiplexing hides the latency, not the bytes |
| `name` stripped | If you still want to install it as a system font, the system can no longer identify it and style names degrade |

One more concern that is **not technical**: whether you are allowed to subset is written into the font. The `OS/2` table's `fsType` has a bit that literally means “no subsetting” (`0x0100`); the other bits cover restricted-licence embedding, preview & print only, editable embedding, and bitmap-only embedding. Check that bit before shipping a web subset or embedding a font in a PDF — see [The OS/2 table](/docs/os2-table).

## When it isn't worth it {#when-not}

Ask three questions; if you can't answer one, don't do it:

1. **Is the text really known?** Text that changes can only use slicing or dynamic subsetting; a static subset is a missing-glyph bug you plant for yourself;
2. **Is the file really too big?** A Latin font is often tens of kilobytes once WOFF2'd; the saving isn't worth an extra build step;
3. **Does the licence allow it?** If `fsType` says no, the answer is no.

## How this site handles it {#this-site}

This site **serves no font files to the page at all**: the interface uses the system font stack, and the specimen images in the library are pre-rendered at ingest time. So none of the techniques above are used anywhere on this site.

The inspector's “load temporarily” doesn't count either — that registers the bytes of a font file from your own machine in the **current tab** via `FontFace`, it disappears on reload, and the bytes are never uploaded.

**This site does not offer a subsetting or slicing service**, and has no ready-made subset URLs to point `src` at. Everything above is general technique: to use it you run the tools in your own build, or stand up your own dynamic-subset endpoint.

## Further reading

- The `pyftsubset` documentation in fonttools (complete options, including which tables to keep)
- MDN: the `unicode-range` descriptor of `@font-face`
- CSS Fonts: the rules for `unicode-range` and when a font file is downloaded
- The W3C Incremental Font Transfer draft
