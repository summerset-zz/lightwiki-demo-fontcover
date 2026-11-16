---
title: Font loading
keywords: font-display, preload, CLS, 布局位移, 字体加载, FOUT, FOIT
description: What each font-display value shows and when, why preload must carry crossorigin, and how to stop text jumping.
section: dev
order: 5
updated: 2026-11-02
draft: false
---

A web font is a **separate resource**: HTML arrives first, the font later. What is shown in the gap is decided by `font-display`; whether text jumps when it arrives is decided by the difference in metrics between the two fonts.

## Two classic symptoms {#foit-fout}

- **FOIT** (flash of invisible text): nothing is shown until the font arrives — the page seems blank for a moment.
- **FOUT** (flash of unstyled text): the fallback shows first, then gets replaced — the text seems to jump.

`font-display` picks one, or something in between.

## The five font-display values {#display}
<!-- hint: font-display | font-display decides what is shown before the font has loaded, and is one of the main causes of text jumping. -->

| Value | Invisible period | Swap period |
| --- | --- | --- |
| `auto` | browser-defined (usually close to `block`) | as chosen by the browser |
| `block` | long (the spec suggests about 3s) | none — the fallback stays after that |
| `swap` | very short (about 100ms) | unlimited; swap whenever the font arrives |
| `fallback` | very short (about 100ms) | limited (about 3s), then no further swap |
| `optional` | very short | none; missed this time means not used (unless cached) |

Those millisecond figures are **suggestions** in the spec; browsers may differ.

Rules of thumb: body text with `swap` (better a fallback than no text); never `swap` for icon fonts (a fallback renders completely wrong glyphs, splitting words into icons); brand headlines may use `optional` (rather not use it than jump).

## preload: stop the queue {#preload}

Fonts are usually discovered only after CSS is parsed — already late. Declare the fonts the first screen actually uses:

```html
<link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin />
```

Three things not to omit:

- `as="font"`: tells the browser the resource type, otherwise priority is wrong;
- `type`: unsupported formats are skipped instead of downloaded;
- **`crossorigin`**: font requests are CORS requests; without it the browser downloads the file **twice** (the preloaded copy is unusable).

Preload only the one or two files the first screen really uses. Preloading every weight just steals bandwidth.

## Why text jumps {#cls}

Fallback and web font have different metrics: x-height, advance widths, line spacing. When the swap happens, a line that fitted in two may become three, and everything below shifts — one of the most common sources of CLS.

Three mitigations:

1. **Make the fallback closer**: `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` tweak the metrics of an `@font-face`, so "fallback" and "target" occupy the same height;
2. **`font-display: optional`**: no swap if it is late — no jump, but possibly no target font this time;
3. **Accept one swap but reserve space**: give the headline block a `min-height` so the page does not reflow as a whole.

## Knowing when the font has arrived {#script}

```js
await document.fonts.load('16px Inter');   // actively load a font
document.fonts.check('16px Inter');        // synchronous availability check
await document.fonts.ready;                // wait for all declared fonts
```

The inspector on this site does exactly this: fetch the bytes, `new FontFace(...).load()`, then `document.fonts.add()`. That way the same bytes can also be measured, which `FontFace(url)` cannot do.

When swapping fonts, delete the old face (`document.fonts.delete(oldFace)`); otherwise same-named faces pile up in `document.fonts` and the browser may pick any of them.

## Caching {#cache}

Font files rarely change. Put a content hash in the filename (`inter-400.9f2c1a.woff2`) and send `Cache-Control: public, max-age=31536000, immutable`, and the second visit costs nothing.

With a fixed name (`inter.woff2`) you need `?v=` style busting on every upgrade — easy to forget.

## Further reading

- CSS Fonts: the font-display time periods
- MDN: `font-display`, `FontFace`, `document.fonts`
- web.dev: font best practices (preload and CLS)
