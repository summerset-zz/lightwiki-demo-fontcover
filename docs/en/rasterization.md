---
title: Rasterising text
keywords: ClearType, 次像素, subpixel, 抗锯齿, antialiasing, 光栅化, rasterization, hinting, HiDPI, 字体渲染, screen rendering, colour fringing
description: How outlines become pixels, where grayscale antialiasing and ClearType differ, and why high-density screens made the whole thing matter less.
section: basics
order: 4
updated: 2026-11-07
draft: false
---

A font file stores **outlines**; a screen has **pixel cells**. The step in between is rasterisation, and it is why the same typeface does not look identical on every machine.

## Outlines are not pixels {#pipeline}

Outlines are Bézier curves (see [Glyphs and the em box](/docs/glyph-outline-and-em)) and have nothing to do with pixels. Rasterising means mapping those curves onto a pixel grid for the current font size, screen DPI and zoom, then deciding **how dark each cell should be**.

Three quantities that exist only at this stage:

- **how big the grid is**: 12px body text is a 24×24 device-pixel em on a 2× screen, 12×12 on a 1× screen;
- **where an edge falls inside a cell**: the same vertical stem lands very differently centred in a pixel or straddling two;
- **how much of each cell is covered**: this is what antialiasing is about.

<figure style="margin: 2rem 0">
  <svg viewBox="0 0 640 320" role="img" aria-label="The same stem rendered three ways: hard, grayscale, subpixel" style="display: block; width: 100%; max-width: 40rem; height: auto; color: var(--color-neutral-800); font-family: system-ui, sans-serif">
    <g font-size="11" fill="currentColor" text-anchor="end">
      <text x="150" y="104">no AA</text>
      <text x="150" y="184">grayscale AA</text>
      <text x="150" y="264">subpixel AA</text>
    </g>
    <rect x="170" y="72" width="60" height="56" fill="currentColor" />
    <rect x="230" y="72" width="60" height="56" fill="currentColor" />
    <rect x="170" y="152" width="60" height="56" fill="currentColor" />
    <rect x="230" y="152" width="60" height="56" fill="currentColor" fill-opacity=".62" />
    <rect x="170" y="232" width="20" height="56" fill="#ff2d2d" />
    <rect x="190" y="232" width="20" height="56" fill="#2dff2d" />
    <rect x="210" y="232" width="20" height="56" fill="#2d2dff" />
    <rect x="230" y="232" width="20" height="56" fill="#ff2d2d" />
    <rect x="250" y="232" width="20" height="56" fill="#2dff2d" fill-opacity=".86" />
    <g stroke="currentColor" stroke-width="1" fill="none" opacity=".28">
      <rect x="170" y="72" width="180" height="56" />
      <rect x="170" y="152" width="180" height="56" />
      <rect x="170" y="232" width="180" height="56" />
      <line x1="230" y1="72" x2="230" y2="128" /><line x1="290" y1="72" x2="290" y2="128" />
      <line x1="230" y1="152" x2="230" y2="208" /><line x1="290" y1="152" x2="290" y2="208" />
      <line x1="230" y1="232" x2="230" y2="288" /><line x1="290" y1="232" x2="290" y2="288" />
      <line x1="190" y1="232" x2="190" y2="288" /><line x1="210" y1="232" x2="210" y2="288" />
      <line x1="250" y1="232" x2="250" y2="288" /><line x1="270" y1="232" x2="270" y2="288" />
    </g>
    <g font-size="10" fill="currentColor" opacity=".65">
      <text x="380" y="104">a hard edge — count the steps</text>
      <text x="380" y="184">one cell turns grey: 62% covered</text>
      <text x="380" y="264">only the needed subpixels light up</text>
      <text x="380" y="278">1/3-pixel accuracy, paid for in fringing</text>
    </g>
    <g font-size="10" fill="currentColor" opacity=".5">
      <text x="170" y="304">one cell per pixel</text>
      <text x="380" y="304">bottom row: a pixel = R + G + B bars</text>
    </g>
  </svg>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    <strong>A diagram, not a render</strong>: real subpixels are far finer than this and are gamma-corrected; the drawing only explains the mechanism.
    The red / green / blue in the bottom row are <strong>subpixel channels</strong>, not decoration. One stem covering the second cell by 62%, drawn three ways.
  </figcaption>
</figure>

## Antialiasing: edge cells take partial coverage {#anti-aliasing}

With only "fully on" and "fully off" cells, diagonals and curves become staircases. Antialiasing gives edge cells **partial opacity**: a cell 62% covered by the outline is painted 62% dark. At normal viewing distance the eye averages that back into a smooth edge.

This is **grayscale** antialiasing: R, G and B all change together, producing grey.

## Subpixels: three per pixel {#subpixel}

An LCD "pixel" is really three subpixels side by side: red, green, blue. They emit independently, so you can light only some of them — the edge lands with **one-third of a pixel** of precision, effectively tripling horizontal resolution.

ClearType is the Windows implementation (macOS called its own version subpixel antialiasing). The costs:

- it only holds on screens whose **subpixel layout is known** (RGB or BGR, upright or tilted, differing per panel);
- turn it off, or let the system decide the panel does not match, and it falls back to grayscale;
- edges pick up visible **colour fringes** — invisible at reading distance, obvious once magnified;
- at any zoom other than 100%, subpixels no longer line up with CSS pixels and Windows often drops back to grayscale.

<figure style="margin: 2rem 0">
  <div style="display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 0.5rem 0.75rem; align-items: center; font-size: 0.8125rem; line-height: 1.4; color: var(--color-neutral-500)">
    <span>Grayscale</span>
    <a href="/img/cleartype-grayscale.png" target="_blank" rel="noopener" style="display: block; width: fit-content"><img src="/img/cleartype-grayscale.png" alt="The same word rendered with grayscale antialiasing: grey edges of varying depth" width="150" height="27" style="display: block; width: 300px; max-width: 100%; border: 1px solid var(--color-neutral-200); border-radius: 4px; image-rendering: pixelated"></a>
    <span>Subpixel (ClearType)</span>
    <a href="/img/cleartype-subpixel.png" target="_blank" rel="noopener" style="display: block; width: fit-content"><img src="/img/cleartype-subpixel.png" alt="The same word rendered with ClearType: left edges lean cyan, right edges lean orange" width="150" height="27" style="display: block; width: 300px; max-width: 100%; border: 1px solid var(--color-neutral-200); border-radius: 4px; image-rendering: pixelated"></a>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    <strong>Real renderer output, not a simulation</strong>: Segoe UI Bold at 30px, drawn on Windows once with grayscale antialiasing and once with ClearType, <strong>with no post-processing at all</strong>.
    Shown at 2× on this page (zoomed without smoothing, or the 1px fringes would be averaged away); the original is only 150 × 27, and you can keep zooming in on it once it is open.
    Which way the fringes lean depends on the panel's subpixel order: this one is RGB, so left edges lean cyan and right edges lean orange; on a BGR panel the two swap — so there is no single answer to "what colour are ClearType's fringes".
  </figcaption>
</figure>

Both images are deliberately kept on white: in the dark theme we do not invert them, because inverting would swap cyan and orange and say the opposite of what the figure is for.

## Who implements it {#implementations}

<!-- source: en.wikipedia.org | Subpixel rendering | 1379704885 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed from the Implementations section; kept ClearType / FreeType / CoolType / Quartz, dropped the Apple II archaeology -->

The same idea is implemented very differently from platform to platform:

| Implementation | Owner | Timeline |
| --- | --- | --- |
| ClearType | Microsoft | Announced at COMDEX in 1998, paper in 2000; shipped with Windows XP, on by default from Vista |
| FreeType | Open source | What essentially all X/Linux desktop software uses |
| CoolType | Adobe | Used across the Reader line |
| Quartz | Apple | Apple's own subpixel implementation, later removed in favour of grayscale antialiasing |

The last row is why "the same font looks thinner on a Mac": the font is the same, the rendering path is not.

## What became of hinting {#hinting}

<!-- source: en.wikipedia.org | Font hinting | 1305053204 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Condensed: kept the two approaches and the platform stances -->

Hinting is a set of instructions that snap a glyph to the pixel grid at low resolution. There are two approaches:

- **TrueType instructions**: a small program shipped inside the font and run by the rasteriser. Precise, but expensive to write and easy to behave differently across engines;
- **Auto-hinting**: the rasteriser analyses the outlines itself and needs nothing from the font. FreeType's auto-hinter is the canonical example.

Platforms disagree about it. Windows has always valued hinting — before high-DPI it was the only thing keeping small text legible — whereas Apple chose to skip hinting and rely on antialiasing alone: truer shapes, but small text leans on dense screens.

So "the same font looks slightly different on different systems" has a second source: not just subpixels, but whether hinting moved the strokes onto different pixels.

## Why it matters less today {#today}

- **HiDPI**: phones and laptops are commonly 2–3×. One CSS pixel covers 2–3 device pixels, so a single edge cell is already two-thirds smaller and "winning back another third" is worth less;
- **macOS dropped subpixel antialiasing in Mojave (10.14)** and went back to grayscale — precisely because at high density it stopped paying for itself while the fringes fought the type design;
- Windows keeps ClearType, but it quietly gives up under fractional scaling, tablet mode and some drivers;
- web fonts often ship no hinting instructions at all, so where stems land changes too (see [hinting](/docs/glyph-outline-and-em#hinting)).

## So "it looks different on the two platforms" is normal {#why-different}

Same typeface, same sentence, same size, and the width can differ by a few pixels between Windows, macOS and phones — with line breaks following. The cause is not the font but the steps above: grid size, antialiasing mode, hinting, and the way metrics are rounded.

It is also why design files and implementations "always differ by half a line" at small Chinese sizes.

## What a front-end developer can control {#css}

Almost nothing. Here is what the usual "switches" actually do:

| What people write | What actually happens |
| --- | --- |
| `-webkit-font-smoothing: antialiased` | **macOS Safari / Chrome only** (disables subpixel rendering); a no-op on Windows |
| `-moz-osx-font-smoothing: grayscale` | The same, for Firefox on macOS |
| `font-smooth` | Non-standard, unevenly implemented — do not rely on it |
| `text-rendering: optimizeLegibility` | Unrelated to antialiasing; it is about ligatures and kerning (see [Synthesis and misc](/docs/css-text-misc)) |

What actually helps is the old advice: avoid sizes like 11px that sit on a critical boundary, give figures enough room, and choose a typeface that is designed to be legible when small.

## Why this site does not "simulate" ClearType {#not-simulated}

Every specimen here is **SVG drawn from the font's own outlines**. It shows the shape of a glyph, not what some operating system makes of it:

- SVG carries no antialiasing decision and no subpixels; on its way to your screen it gets rasterised **again, by your system**;
- so the three pixel rows at the top of this page **only explain the mechanism**, and are deliberately coarse: the point is that the same coverage can be drawn three ways, not that your display does this.

The two bitmaps in the previous section are the one exception, and what separates them from a simulation is **provenance**: they are output from a real renderer, with the system, mode and size stated, so anyone can reproduce or contradict them.

What we do not do is **hand-build** a "this is Windows, this is macOS" pair from the mechanism. Such a figure looks more authoritative, but every pixel in it was placed by hand: it presents a precision that does not exist, and readers take it as what their own screen is doing.

## Checklist {#checklist}

- Is this a question about the **glyph** or about **rendering**? (outlines vs system settings and zoom)
- How many device pixels does this size get on the target screen?
- Are you looking at a magnified screenshot as if it were the normal experience? (magnification is for explaining)
- Will this text reflow on another platform or zoom level — and whose fault is that?

## Further reading

- Microsoft: ClearType and DirectWrite antialiasing notes
- Apple: the macOS Mojave release note that removed subpixel antialiasing
- This site: [Glyphs and the em box](/docs/glyph-outline-and-em), [How to read the metrics figure](/docs/how-to-read-metrics)
