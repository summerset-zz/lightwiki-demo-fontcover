---
title: Which fonts render
keywords: 本机字体, queryLocalFonts, 临时载入, FontFace, 样例图, 真渲染
description: Local fonts have bytes; library fonts have fingerprints and specimen images. That line explains everything else.
section: tools
order: 1
updated: 2026-11-05
draft: false
---

In the inspector some fonts can be drawn with their **real outlines** and measured character by character, while others only show a pre-rendered specimen. That is not an unfinished feature — the two groups simply hold different things.

## Two sources {#two-sources}

| Source | What it has | What you can do |
| --- | --- | --- |
| **Local fonts** (`src=device`) | The font file on your machine, once you grant access | Real rendering, measure any character, coverage, full metrics |
| **Library** (`src=library`) | Fingerprint, metadata, a few specimen images | Names / weight / metrics / coverage; rendering needs the specimen or a temporary load |

## Why library fonts have no bytes {#no-bytes}

The server **stores no font files**: only fingerprints (content hashes), metadata extracted from the font, and specimen SVGs rendered during analysis.

That is not laziness. Font files are megabytes, their licences differ, and hosting them means distributing them — which would turn this project into a font CDN, with legal and bandwidth costs it is not meant to carry.

## What "temporary load" does {#temporary}
<!-- hint: Loading temporarily | Loading temporarily fetches the font bytes into the current tab and registers them. A reload discards them, and nothing is installed. -->

Loading a library font:

1. `fetch` the bytes from the upstream mirror (GitHub / Google Fonts);
2. register them with `new FontFace(name, bytes)` on `document.fonts`, so the page can render with it;
3. if measuring is needed, hand the **same bytes** to the parser and build a measurer (a few kept, by recency — not an unbounded cache).

All of it lives in browser memory; nothing goes through this site's storage and nothing is written to disk. **A reload wipes it** — this is not an installation: nothing lands in the system font folder, other applications never see it, and it does not show up in the "fonts on this device" list (that list comes from a browser scan, unrelated to what was loaded here).

## Why not just `FontFace(url)` {#why-fetch}

`new FontFace(family, 'url(...)')` loads a font too, but the bytes stay **inside the browser** where scripts cannot reach them — so you cannot parse them or measure arbitrary characters. Fetching ourselves gives one copy that both registers and parses, with the same network traffic.

The price: a CJK font (tens of megabytes) means one extra copy in memory, and parsing happens on the main thread (hundreds of milliseconds). That is why the measurer is optional.

## Only the local side needs permission {#permission}

`queryLocalFonts()` is a Chromium-family API:

- listing local fonts (family, style, PostScript name) is a single full scan;
- getting a font's bytes needs a user gesture plus permission.

Permission is granted per origin, though a browser may ask again after a new page load — which is why nothing scans "in passing" when a page opens: every byte read happens on your click.

So when the interface says "installed on this device", the evidence is **the list this browser reports**, not a look at the system font folder. That list can be shorter than what the machine actually has (faces the system hides, faces blocked by policy) — it is a list of what the browser can see, not a list of what is installed.

Safari and Firefox do not implement the API, so the entire local side is unavailable there (the home and contribute pages word things according to support).

## The local archive: read once, remembered after {#archive}
<!-- hint: Local archive | A local font is read completely once, during a scan or a contribution, and the result is stored in this browser local archive. Without one, the only signal is a text width measurement, which tells you whether it is installed and nothing more. -->

Almost every "I have it installed, why is it not here?" is answered by this section. We have exactly three sources of information about the fonts on your machine, and they are separate:

1. **The list the browser reports** (`queryLocalFonts()`): family, style, PostScript name. Fast, but names only — no coverage, no metrics. That is what the inspector's "installed on this device" reads;
2. **The local archive**: once you have contributed (or scanned in `/my-fonts`), the fully parsed result lives in **this browser** (IndexedDB). The font detail page consults it first — exact, free, and no permission needed;
3. **A live probe**: when the family is not in the archive, we measure the width of a piece of text with canvas to see whether it changes. That answers "installed or not" and nothing else.

Which gives three ways to have a font installed yet not see it:

- another browser, another device, or cleared site data → the archive is gone and the interface falls back to installed/not-installed only;
- the archive belongs to **one browser**, not to your account: a second browser on the same machine has its own;
- a probe only ever yields a yes/no. To see coverage and metrics, the face has to reach the archive first (contribute, or scan once).


## Three cases where something cannot be shown {#cannot}

1. Safari / Firefox: the local entry point is unavailable;
2. A library font that has not been loaded: specimen only; type preview and metrics come after loading;
3. Local archive entries that were only probed: selectable and previewable, but `cmapRanges` is null, so coverage says "not analysed".

## What the specimen is {#specimen}

A specimen is an SVG drawn from the font's real outlines **during analysis** (one per language) and stored in object storage. It is not a screenshot and does not depend on anything installed on the visitor's machine — so everyone can see it. Which scripts get one, and when there is none, is covered in [how specimen images are made](/docs/how-specimen-images-are-made).

## Further reading


- MDN: Local Font Access API
- MDN: `FontFace`, `document.fonts`
