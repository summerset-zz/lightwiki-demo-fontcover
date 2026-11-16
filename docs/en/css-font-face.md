---
title: "@font-face"
keywords: "@font-face", src, local, unicode-range, font-display, 网页字体
description: Every descriptor declares what the file is — not "make the text bold". Covers src, local(), unicode-range and multi-face families.
section: dev
order: 1
updated: 2026-11-04
draft: false
---

`@font-face` does one thing: **it gives a font file a family name** so `font-family` can refer to it. It does not load anything by itself and does not transform the font — it registers it.

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

## Descriptors are declarations {#declaration}
<!-- hint: @font-face | @font-face gives a font file a family name that font-family can reference. Its descriptors are declarations, not style settings. -->

This is the part that trips people up:

- `font-weight: 400` inside `@font-face` means "**this file is 400**", not "render it at 400";
- to make text bold you write `font-weight: 700` in a normal rule, and the browser comes back looking for the face that declares itself 700.

So "I set `font-weight: bold` and nothing got bolder" usually means there is no 700 face declared, and the browser had to synthesise one (see below).

## src and format {#src}

`src` is a candidate list; the browser takes the first it can use:

```css
src: url('/fonts/inter.woff2') format('woff2'),
     url('/fonts/inter.woff') format('woff');
```

- **Order**: newer formats first, older as fallback;
- `format()` lets the browser skip unsupported formats instead of downloading them for nothing;
- every current browser supports `woff2`; `woff` is for very old ones, and `ttf` / `otf` are large to ship to the web.

## local() — useful, with traps {#local}

```css
src: local('Inter'), url('/fonts/inter.woff2') format('woff2');
```

`local()` tries the installed font first, skipping a download.

The trap is the name: the argument may be a **full name** or a **PostScript name**, and browsers do not agree on which is more reliable. The installed copy may also be older than the one you want — or another font claiming the same name. **Where rendering must be consistent, skip `local()`** and go straight to `url()`.

## One family, several faces {#multi-face}

Declare multiple entries under the same name, distinguished by `font-weight` / `font-style`:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
}
```

Now `font-family: Inter; font-weight: 700` hits the second entry.

A variable font needs only one rule, with the range in the descriptor:

```css
@font-face {
  font-family: 'InterVariable';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

## unicode-range: subsetting {#unicode-range}

```css
@font-face {
  font-family: 'Noto Sans SC';
  src: url('/fonts/noto-sc-000.woff2') format('woff2');
  unicode-range: U+4E00-9FFF, U+3000-303F;
}
```

The browser downloads this file only when text falls inside the range. CJK fonts are megabytes; sliced by `unicode-range`, a page downloads only the slices it uses. The cost is many files and more configuration.

It is often confused with *subsetting*, but the two change different things: one changes the file's content, the other the amount downloaded. For the distinction and the cost of each, see [On-demand loading and subsetting](/docs/font-subsetting).

## font-display (in one line) {#display}

`block` / `swap` / `fallback` / `optional` decide what is shown during the few hundred milliseconds before the font arrives. It is a main cause of text jumping, covered in [Font loading and layout shift](/docs/css-font-loading).

## This site's position {#this-site}

This site **does not host font files**: the server stores fingerprints and metadata, never bytes. So there is no real `src` URL to copy from here — the paths above are placeholders.

The inspector can "temporarily load" a library font by fetching its bytes from the upstream CDN into browser memory and registering them there; nothing lands in this site's storage.

## Further reading

- MDN: `@font-face` — one page per descriptor
- CSS Fonts: the `@font-face` rule and descriptor definitions
