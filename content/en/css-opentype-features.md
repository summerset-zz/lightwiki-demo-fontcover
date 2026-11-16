---
title: Feature switches
keywords: font-feature-settings, font-variant, tnum, smcp, 特性, 等宽数字
description: Two spellings for the same thing. Which to prefer, and why font-feature-settings wins when both are present.
section: dev
order: 6
updated: 2026-11-02
draft: false
---

There are two families of CSS for turning on OpenType features: the semantic `font-variant-*` properties and the low-level `font-feature-settings`. Both end up at the same four-letter tags, but they behave differently.

## The semantic set {#variants}

| Property | Common values | Tags |
| --- | --- | --- |
| `font-variant-ligatures` | `no-common-ligatures`, `discretionary-ligatures` | `liga`, `dlig` |
| `font-variant-numeric` | `tabular-nums`, `oldstyle-nums`, `slashed-zero`, `diagonal-fractions` | `tnum`, `onum`, `zero`, `frac` |
| `font-variant-caps` | `small-caps`, `all-small-caps`, `petite-caps` | `smcp`, `c2sc`, `pcap` |
| `font-variant-position` | `sub`, `super` | `subs`, `sups` |
| `font-variant-east-asian` | `proportional-width`, `ruby` | `palt`, `ruby` |

They combine:

```css
.table-cell {
  font-variant-numeric: tabular-nums slashed-zero;
}

.quote {
  font-variant-caps: small-caps;
}
```

The advantages are real: they inherit, they stack, later rules override them, and they read as what they mean.

Flip the switches. ⚠️ When the font has no such feature, nothing changes — which is exactly what this section is about: CSS is only a switch, and it cannot conjure what the font lacks.

{{InteractiveExample("CSS Demo: font-variant-*")}}

```css interactive-example-choice
font-variant-numeric: normal;
```

```css interactive-example-choice
font-variant-numeric: tabular-nums;
```

```css interactive-example-choice
font-variant-numeric: slashed-zero;
```

```css interactive-example-choice
font-variant-caps: small-caps;
```

```css interactive-example-choice
font-variant-ligatures: none;
```

```html interactive-example
<div id="example-element">
  0123456789 · 100
  <br>
  Office affair fi fl
</div>
```

```css interactive-example
#example-element {
  max-width: 260px;
  font-size: 20px;
  font-family: system-ui, sans-serif;
}
```

## The low-level set {#feature-settings}

```css
.code {
  font-feature-settings: "liga" 0, "calt" 0;
}
```

Tags **must be quoted** (they are strings); `1` on, `0` off.

The problem is not syntax but **priority**: `font-feature-settings` is a direct instruction, and when present it overrides what `font-variant-*` expanded into. Hence:

```css
.a { font-variant-numeric: tabular-nums; }
.b { font-feature-settings: "ss01"; }   /* inherited tnum may stop working */
```

When both apply to the same element, `font-feature-settings` wins.

## Which to use {#which}

- If a `font-variant-*` value exists → **use it**;
- If not (`ss01`–`ss20`, `salt`, vendor tags) → `font-feature-settings` is the only way;
- When mixing on one element, keep `font-feature-settings` to tags the semantic properties cannot express.

## font-kerning and "kern" {#kern}
<!-- hint: Kerning | Kerning adjusts the spacing between two specific characters, such as A and V. font-kerning: none turns it off. -->

`font-kerning` is its own property, controlling the font's built-in pair corrections:

```css
body {
  font-kerning: normal;   /* the default: enabled */
}
```

It is the high-level spelling of `"kern"`. Do **not** also write `"kern"` inside `font-feature-settings` — when the two conflict, behaviour depends on the browser, and there is no reason to gamble.

## A common misunderstanding {#mistake}

"I set `font-variant-caps: small-caps`, why does it look like shrunken capitals?"

Because the font has no `smcp`, so the browser **synthesises**: scaling down and slightly thickening the capitals. It resembles small caps, but the stroke proportions differ from real ones.

How to check: look for `smcp` in the font's `GSUB`, or set `font-synthesis: none` and see whether it still displays.

## Support {#support}

`font-variant-*` and `font-feature-settings` are both well supported in modern browsers. The real limit is whether **the font has the feature** — CSS is only a switch; nothing appears out of thin air.

## Further reading

- MDN: `font-variant-*`, `font-feature-settings`, `font-kerning`
- CSS Fonts: the `font-variant` properties and their tag mapping
- This site: [GSUB and GPOS](/docs/gsub-gpos), [OpenType features](/docs/opentype-features-design)
