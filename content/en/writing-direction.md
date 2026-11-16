---
title: Writing direction
keywords: writing direction, vertical text, RTL, Arabic, joining, bidi, writing-mode, Mongolian, shaping, text engine
description: Left to right, right to left, upright or sideways, joined or not — three different things that get confused for one, which is why broken text is so hard to diagnose.
section: design
order: 7
updated: 2026-11-02
draft: false
---

The same text can come out right in one application and wrong in the next. Direction problems are the most common cause, and they are really three separate things.

## Three different things {#three}

1. **Character order**: left to right (LTR) or right to left (RTL);
2. **Line direction**: horizontal or vertical;
3. **Joining and shaping**: whether adjacent characters connect, and whether a character swaps form depending on its position.

When a tool says "no Arabic support", it usually means the third; "no vertical text" means the second. To the person looking at the screen the symptom is the same: the text looks wrong.

## Right to left {#rtl}

Arabic, Hebrew, Persian and Urdu run right to left. The key point: **text is stored in logical order** — the characters you typed first come first — and only the display is reversed.

That means copying, searching and character counting are all unaffected. Only rendering flips. Which also means that manually reversing a string in code to "simulate RTL" is always wrong: the moment someone copies it, the order is broken.

When RTL and LTR appear together (an English brand name or a number inside Arabic), the side each run lands on is decided by the Unicode bidirectional algorithm. Three counter-intuitive consequences:

- digits inside RTL text still run LTR, only their whole block moves;
- brackets and a trailing full stop are **mirrored** in an RTL run;
- when a pure LTR run (a URL, a code snippet) sits inside RTL text, which side the punctuation next to it belongs to is often not what you expect.

All of this is handled by the shaping engine; CSS only exposes `direction` and `unicode-bidi`.

<figure style="margin: 1.75rem 0">
  <div style="display: grid; gap: 0.5rem; font-size: 1.0625rem">
    <div style="display: grid; grid-template-columns: 3.5rem minmax(0, 1fr); gap: 0.75rem; align-items: baseline">
      <span style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">LTR</span>
      <div dir="ltr" style="border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: var(--color-neutral-800)">مرحبا، FontCover (2026).</div>
    </div>
    <div style="display: grid; grid-template-columns: 3.5rem minmax(0, 1fr); gap: 0.75rem; align-items: baseline">
      <span style="font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">RTL</span>
      <div dir="rtl" style="border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.5rem 0.75rem; color: var(--color-neutral-800)">مرحبا، FontCover (2026).</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    Same characters, only <code>dir</code> changed: the two runs swapped order and the full stop moved to the far left. But the Arabic reads right to left in <strong>both</strong> boxes — <code>dir</code> only sets the base direction.
  </figcaption>
</figure>

This is easy to misread: the Arabic is not being “reversed” in either box. What changed is **the order of the runs** and **which side the punctuation belongs to**. There are two layers of direction:

- **base direction** (`dir` / CSS `direction`): which side a line aligns to, which run comes first when directions differ, which edge the trailing punctuation sticks to;
- **the direction of each character**: decided by its Unicode property. Arabic letters are class R, so a run of them reads right to left inside any paragraph, LTR or RTL.

So `dir=ltr` does not reverse Arabic — it treats the Arabic as an RTL run embedded at the left. What actually breaks is everything at the **paragraph** level: a trailing full stop, where mixed-run punctuation lands, and line alignment.

One thing in the figure that looks like nothing changed: brackets are mirrored in an RTL run (`(` is drawn with the `)` glyph). The point of mirroring is exactly to keep `(2026)` looking like “open bracket on the left” in both directions — it looks unchanged because it was handled deliberately.

## Joining {#joining}
<!-- hint: Joining | In Arabic and similar scripts a letter changes form by position (isolated, initial, medial, final) and neighbours must connect. A font missing these forms shows broken words. -->

Arabic letters look different at the start, middle and end of a word, and different again in isolation. The text always stores the same code point; **changing form is something the renderer does**. The font's GSUB table carries the features for it (`isol` / `init` / `medi` / `fina`) and the shaping engine picks forms from context.

So "the letters do not connect" is rarely a character problem — usually **nothing is choosing forms**: either the application is not shaping at all, or the font has none of those features. More in [Shaping and fallback](/docs/unicode-shaping-fallback) and [GSUB / GPOS](/docs/gsub-gpos).

| Position | Sample | Meaning |
| --- | --- | --- |
| Isolated | ح | no neighbours |
| Initial | حـ | joins to the right only |
| Medial | ـحـ | joins on both sides |
| Final | ـح | joins to the left only |

Those four cells are themselves a test: **if they render as four visibly different shapes, the font has joining features**; if they all look like the same letter plus a few strokes, the font probably only has isolated forms.

## Why letters stop connecting {#broken}

In rough order of frequency:

1. **The application lays out text itself instead of using the system shaper.** Each letter is drawn on its own, so everything is isolated;
2. **The font has no such features.** Render Arabic with a Latin-only font and the fallback may know only isolated forms;
3. **It is no longer text.** After converting to outlines, exporting as graphics, or tracing an image, there are no forms to choose from (see [Text to outlines](/docs/outline-conversion));
4. **It has been split into separate objects.** One text frame per letter, or a per-character SVG `<text>` — nothing is adjacent to anything;
5. **It went through a screenshot or OCR round trip.** Joining information is gone by the time pixels come back.

The quickest test: **can this be selected, copied, searched?** If not, it is not text, and none of the direction or joining discussion applies.

## Vertical text {#vertical}

Vertical Chinese, Japanese and Korean is not horizontal text rotated 90 degrees:

- punctuation needs different glyphs (the full stop, comma, brackets and corner quotes all have vertical forms), supplied by the font's `vert` / `vrt2` features;
- two-digit numbers usually lie on their side, occupying one full width — `text-combine-upright` in CSS;
- ruby annotations move to the right of the character;
- Latin runs can be rotated as a block or set upright per letter, a design decision exposed as `text-orientation`.

If the font has no `vert`, punctuation stays in its horizontal position — it looks "crooked", but what actually failed is one GSUB substitution. Chinese has other direction-related rules; see [Chinese typography](/docs/cjk-typography).

<figure style="margin: 1.75rem 0">
  <div style="display: flex; gap: 1.5rem; align-items: flex-start">
    <div>
      <p style="margin: 0 0 0.375rem; font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">Horizontal</p>
      <div style="writing-mode: horizontal-tb; border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.625rem 0.75rem; font-size: 1rem; line-height: 1.75; color: var(--color-neutral-800)">标点会转向，数字躺着。</div>
    </div>
    <div>
      <p style="margin: 0 0 0.375rem; font-family: system-ui, sans-serif; font-size: 0.75rem; color: var(--color-neutral-500)">Vertical</p>
      <div style="writing-mode: vertical-rl; height: 11rem; border: 1px solid var(--color-neutral-200); border-radius: 0.5rem; padding: 0.75rem 0.625rem; font-size: 1rem; line-height: 1.75; color: var(--color-neutral-800)">标点会转向，数字躺着。</div>
    </div>
  </div>
  <figcaption style="margin-top: 0.5rem; font-size: 0.8125rem; line-height: 1.6; color: var(--color-neutral-500)">
    Both boxes hold identical text. In vertical mode the comma and full stop move to the top right of the character — that is the font swapping glyphs via <code>vert</code>, not a rotation.
  </figcaption>
</figure>

## Why support varies so much {#software}

Because this is **not in the font, it is in the text engine**:

- browsers (HarfBuzz) handle shaping, bidi and vertical text completely;
- Word uses the system's DirectWrite and is, oddly, one of the most reliable for complex scripts;
- InDesign needs the Middle Eastern edition for full RTL support;
- in vector software, point text, area text and type on a path are often different engines, each with its own bugs.

That explains a workaround common in studios: **typeset in Word, take a screenshot, trace it into vectors**. What it really works around is a missing text engine — at the price of turning text into a picture.

## Fallback workflow {#fallback}

If the output really has to come from a tool that cannot shape:

1. typeset where **shaping works** (Word, a browser, InDesign with RTL support);
2. export PDF and check the text is still selectable — selectable means it is still text;
3. if you do need curves, convert then, and record the font name and its licence (see [Text to outlines](/docs/outline-conversion));
4. keep screenshot-plus-trace as the last resort: it is the only path whose information loss cannot be undone.

## Checklist {#checklist}

- Can this be selected, copied, searched? (decide first whether it is text at all)
- Does the font have `init` / `medi` / `fina` (joining) and `vert` / `vrt2` (vertical)?
- `dir` sets the **base direction** of a paragraph, it does not “reverse the text” — do not conflate the two.
- Is the RTL text stored in logical order, or was it reversed by hand in code?
- In vertical mode, is the punctuation orientation and the posture of digits correct?
- Is this application using the system shaper, or its own engine?
