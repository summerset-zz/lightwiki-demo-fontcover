---
title: Variable fonts
keywords: 变量字体, 可变字体, variable font, 轴, 光学尺寸, opsz
description: One file, endless weights — sounds like all upside. How it changes handoff, and where it goes wrong.
section: design
order: 4
updated: 2026-11-07
draft: false
---

A static family is "one file per weight". A variable font replaces that with "one file containing a continuous axis". That changes the design workflow more than it sounds: it changes what a "weight" even is.

## Axes and named instances {#axes}
<!-- hint: Axis | An axis is a dimension a variable font can vary, such as wght, wdth or opsz. Named instances are a few positions chosen on it, not every possible value. -->

An **axis** is a dimension with a minimum, a default and a maximum. The usual ones:

| Axis | Meaning | Typical range |
| --- | --- | --- |
| `wght` | Weight | 100–900 |
| `wdth` | Width | 75–125 (percent) |
| `opsz` | Optical size | 8–144 |
| `slnt` | Slant | −10–0 (degrees) |
| `ital` | Italic | 0–1 |

A **named instance** is a combination of axis positions with a name (Regular, Bold, Display). The style list in design software is usually these instances.

Crucially, instances are **presets**, not the whole space. Any position in the file can technically be used.

## Registered and custom axes {#registered-axes}
<!-- hint: Registered axis | An axis whose meaning and scale the specification defines (wght, wdth, opsz, slnt, ital). Axes a font invents are not registered. -->

<!-- source: en.wikipedia.org | Variable font | 1374197988 | CC BY-SA 4.0 | https://creativecommons.org/licenses/by-sa/4.0/ | Translated from the Registered axes section; dropped the platform adoption timeline, kept the axis definitions and fvar -->

The ranges in the table above are **the font's own choice** — the specification does not fix how far an axis may go. It only defines a set of **registered axes** with a shared meaning and scale, which is what makes `wght` comparable across typefaces:

| Tag | Axis | As defined by the spec |
| --- | --- | --- |
| `wght` | Weight | A continuous scale from 1 to 1000, with 400 being Regular |
| `wdth` | Width | A percentage of the normal width, 100 being normal |
| `opsz` | Optical size | Values in typographic points, letting the design adapt to size |
| `slnt` | Slant | Degrees counter-clockwise from upright; a rightward slant is negative |
| `ital` | Italic | 0 to 1, upright to italic. A different axis from `slnt` |

Why `ital` and `slnt` are separate: sometimes “italic” just means the upright is slanted, and sometimes it is a genuinely different design that needs its own glyphs. Conflating the two is how you end up setting an italic and seeing nothing change.

A font may cover only part of a registered axis, and its default need not be the scale's standard value — a font whose `wght` defaults to 300 is a design decision, not a bug. Beyond the registered set, a font can define **custom axes** (also four-character tags, meaning defined by the font itself); those are not comparable across fonts.

All of this lives in the `fvar` table: one record per axis (tag, minimum, default, maximum), plus the named instances. That is what the inspector's axis panel reads — see [maxp and variable axes](/docs/maxp-fvar-stat).

## Optical size is the axis worth understanding {#opsz}

`opsz` is not "scale up or down"; it is **a separate design for a different size**:

- small sizes: thicker strokes, wider spacing, fuller frames, or the text smears;
- large sizes: thinner strokes, tighter spacing, more detail, or it looks clunky.

Traditionally this was done with two static families (Text / Display); a variable font turns it into one continuous axis. So `opsz=12` and `opsz=72` are not scaled copies — the stroke proportions change.

One CSS property makes it follow the font size:

```css
h1 {
  font-optical-sizing: auto;
}
```

The browser picks `opsz` from the current `font-size`.

## How to hand off {#handoff}

With a variable font, "specify a weight" has three possible spellings, and handoff must pick one:

1. **Named instance**: "SemiBold" — safest, because the name travels with the file;
2. **Number**: `font-weight: 600`, matched by CSS;
3. **Axis coordinate**: `font-variation-settings: "wght" 600` — most precise, least portable.

Recommendation: **use named instances for body and UI**, and axis coordinates only when you genuinely need a value between instances ("a touch lighter than SemiBold") — with a note on the layout saying why.

## Where it goes wrong {#pitfalls}

- **In-between positions are not necessarily good** — designers check a handful of positions; `wght: 437` is interpolation;
- **PDF export / image export**: some tools instantiate variable fonts into static outlines; if the instance is wrong, output differs from screen;
- **Chinese variable fonts are rare** — the glyph count makes continuous axes expensive, so far fewer exist than in Latin;
- **`font-variation-settings` overrides `font-weight`** — when both are present the axis coordinate wins, which is hard to debug.

## How this site records it {#this-site}
<!-- hint: How this site records them | This site records one entry per file, at its default weight, without expanding axes into extra styles. A variable font therefore usually appears as a single style; use the type tester to move along an axis. -->

Conservatively: **one file is one entry**, recording default weight and width only. Axes are not expanded into faces.

Because a "face" here is the identity used by favourites and archives, and a variable font's "face" is not a discrete object. Trying positions on an axis belongs to the type tester.

## Further reading

- OpenType spec: `fvar`, `gvar`, `STAT`
- MDN: `font-variation-settings`, `font-optical-sizing`, `font-stretch`
- This site: [maxp and variable axes](/docs/maxp-fvar-stat), [Weights and widths](/docs/weights-widths)
