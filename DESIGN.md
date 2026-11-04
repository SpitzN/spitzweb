---
name: spitzweb
description: What Nadav Spitzer builds, writes and is doing, set as a precise typographic instrument on drenched ultramarine.
colors:
  ground: "#141a52"
  ground-raised: "#1b226a"
  ink: "#f4f1ea"
  ink-muted: "#aeb2d6"
  rule: "#2c3482"
  accent: "#c8f25a"
  on-accent: "#18210a"
  on-accent-muted: "#2f4114"
  accent-ink: "#c8f25a"
  ground-light: "#f4f1ea"
  ground-raised-light: "#e8e6f2"
  ink-light: "#141a52"
  ink-muted-light: "#4a4f86"
  rule-light: "#cfcde3"
  accent-ink-light: "#3b5c00"
typography:
  display:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 4.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  wordmark:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title-selected:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Funnel Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
rounded:
  focus: "2px"
spacing:
  page-inline: "1rem"
  page-inline-wide: "2rem"
  nav-gap: "1.5rem"
  header-gap: "3rem"
  header-block-start: "1.5rem"
  header-block-end: "1.25rem"
  section-block: "4rem"
components:
  site-header:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    padding: "1.5rem 0 1.25rem"
  wordmark:
    textColor: "{colors.ink}"
    typography: "{typography.wordmark}"
  nav-link:
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
  nav-link-hover:
    textColor: "{colors.ink}"
  statement:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
    width: "56rem"
  project-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  project-title-selected:
    textColor: "{colors.accent-ink}"
    typography: "{typography.title-selected}"
  project-row-selected:
    backgroundColor: "{colors.ground-raised}"
  featured-panel:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  text-selection:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
---

# Design System: spitzweb

## Overview

**Creative North Star: "The Precision Instrument"**

spitzweb is a precise instrument for showing work. The world is typographic: no governing object or metaphor, no imagery doing the talking. A drenched ultramarine ground (not near-black) carries warm off-white ink, periwinkle secondary ink and hairline rules, and the work itself is the interface. Type does almost everything: Funnel Display for headings and Project titles, Funnel Sans for everything else, with weight rather than decoration carrying state.

Dark is the default theme and was chosen first; light is a full alternative, switched by `data-theme="light"` on `<html>`, and swaps the ground and ink while keeping the same structure. One accent, provisionally lime, marks only the live or selected thing; everything else stays in ground, ink and rule. Density is calm and exact: tabular numerals everywhere, hairlines instead of containers, one exponential ease-out for every change of state.

The system serves both UI registers from ADR 0010 on one set of tokens. Read and Experience surfaces (home, Projects, Articles, Activity) are custom-built on these tokens; the Admin panel in Operate mode is built from shadcn/ui on Base UI, with each primitive's variants mapped onto the same colour, type and motion tokens rather than shadcn's default palette. The accent keeps its meaning in both: in the Admin panel it marks the selected or live item, not every primary action.

**Key Characteristics:**

- Drenched ultramarine ground, warm off-white ink, periwinkle muted ink, ultramarine hairlines.
- One provisional accent that marks only the live or selected thing.
- Funnel Display for headings and Project titles, Funnel Sans for everything else.
- Weight carries state: Project titles go from 400 at rest to 800 when selected.
- Hairline rules, tabular numerals, no cards, no badges, no kickers or eyebrows.
- One exponential ease-out (450ms) for every change of state; all motion stills under reduced motion.
- Logical properties only, so RTL stays cheap.

## Colors

A drenched ultramarine world with warm paper ink and a single provisional accent kept for the live or selected thing.

### Primary

- **Live Lime** (accent): the only accent. It fills the Featured panel, colours the selected Project title, draws the focus ring and backs text selection. Provisional: pink (#ff8ad8) is the alternative, and Nadav decides between them. The accent is the same in both themes.
- **Lime Ink** (accent-ink, accent-ink-light): the accent when it colours text on the ground. In dark it is the accent itself; in light it deepens to a dark olive so selected text keeps AA contrast on paper.
- **Accent Shadow Ink** (on-accent): text and marks set on an accent fill.
- **Accent Shadow Muted** (on-accent-muted): secondary text and quiet fills inside an accent fill, such as the track of a live readout.

### Neutral

- **Drenched Ultramarine** (ground): the page in dark. Never swapped for near-black.
- **Lifted Ultramarine** (ground-raised): the selected or hovered row in dark; the only tonal step above the ground.
- **Warm Paper** (ink): primary text in dark.
- **Periwinkle** (ink-muted): secondary text in dark: nav links at rest, summaries, years and Status.
- **Ultramarine Hairline** (rule): every rule and divider in dark.
- **Paper Ground** (ground-light), **Lavender Lift** (ground-raised-light), **Ultramarine Ink** (ink-light), **Slate Periwinkle** (ink-muted-light), **Lavender Hairline** (rule-light): the same roles in the light theme, where ground and ink trade places.

### Named Rules

**The Live Thing Rule.** The accent marks only the live or selected thing: the running Featured Project, the selected row, focus, selection. It never decorates, never fills a primary button by default, and never colours a heading for emphasis.

**The Token-Only Rule.** Every colour comes from a theme token defined for both themes. The Tailwind palette is reset (`--color-*: initial`) and lint rejects arbitrary values and raw palette colours (apps/site/eslint.config.js, docs/tooling.md). Components use the generated utilities (`bg-ground`, `text-ink-muted`, `border-rule`), never the CSS variables directly.

**The Two Themes Rule.** Every token has a dark value and a light value, and both themes meet WCAG 2.2 AA. A new token is not done until it has both.

## Typography

**Display Font:** Funnel Display (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Funnel Sans (with ui-sans-serif, system-ui, sans-serif)

**Character:** One family in two cuts: Funnel Display is tight, heavy and confident at the top of a page and quiet at 400 in a list; Funnel Sans is plain and even for everything that reads. Both are self-hosted at build through next/font.

### Hierarchy

- **Display** (800, fluid from 2.75rem to 6rem, line-height 0.95, tracking -0.035em): the statement on the home page and other page-opening headings. Balanced wrapping, capped at 56rem.
- **Wordmark** (Funnel Display 700, 1.25rem, tracking -0.025em): the spitzweb wordmark in the header.
- **Title** (Funnel Display 400, 1.5rem, line-height 1.15, tracking -0.015em): a Project title in a list, at rest.
- **Title, selected** (Funnel Display 800, same size): the selected or hovered Project title, in the accent ink.
- **Body** (Funnel Sans 400, 1rem, line-height 1.5): everything else, including nav, summaries and metadata. Tabular numerals are on for the whole document.

### Named Rules

**The Weight Carries State Rule.** State is shown by weight, not by boxes or badges. A Project title sits at 400 at rest and moves to 800 with the accent ink when selected, through the shared ease-out.

**The Tabular Rule.** Numerals are tabular everywhere (set on `html`), so years, times and readouts never jitter.

## Layout

The page has an inline padding of 1rem, widening to 2rem from the `sm` breakpoint (40rem). Spacing comes from Tailwind's 0.25rem scale; the steps in use are recorded in the frontmatter. The header wraps its wordmark and nav on a shared baseline, with 3rem between them inline and 0.75rem when they wrap, 1.5rem between nav links, and a hairline below. Page content opens with 4rem of block padding.

All layout uses logical properties and utilities only (`pbs-*`, `pbe-*`, `border-be`, `max-inline-*`, `min-block-dvh`), so an RTL locale needs no layout rewrite. Lint enforces this.

**Intended home composition (designed, not yet built).** The tracked mock (`.impeccable/mocks/typographic/e-funnel-accent.html`) sets the home page on a strict 12-column grid: the header rule spans all columns; the statement in heavy Funnel Display takes the start seven columns with the latest Update beneath it; the Featured panel takes the end five, filled with the accent and holding the Project's title, a live readout of the Hosted project and one line on what it is; the Projects list runs full width from just above the fold, each row on the same 12 columns (title in four, one-line summary in five, year and Status in three, aligned to the end), divided by hairlines. Below the small breakpoint everything collapses to one column and each row stacks its summary under the title. Selection moves by pointer or by J and K, and Enter opens. The exact grid gap and breakpoint are not yet tokens.

## Elevation & Depth

The system is flat. There are no shadows. Depth is one tonal step: the lifted ground behind a selected or hovered row. Hairline rules separate; nothing floats.

### Named Rules

**The Hairline Rule.** Structure is drawn with 1px rules in the rule colour, never with containers, cards or shadows.

## Shapes

Square by default. The only radius in the build is the 2px corner on the focus ring. The intended Featured panel has soft corners in the mock, but no radius token exists yet; one is added when the panel is built.

## Components

### Navigation

The site header: quiet, exact, on a hairline.

- **Structure:** the wordmark, then the sections Projects, Articles and Activity, on a shared baseline with a hairline below.
- **Default:** links in muted ink, body type.
- **Hover:** links move to full ink through the shared ease-out.
- **Focus:** the global ring (2px accent outline, 3px offset).
- **Narrow screens:** the row wraps; no menu toggle.

### Statement

The page-opening heading: heavy Display type in full ink, balanced, capped at 56rem. On the home page its wording is a stand-in until Nadav writes it.

### Project list row (designed, not yet built)

The signature component. A full-width row between hairlines; the title in Title type, the summary, year and Status in muted ink. Selected or hovered, the row takes the lifted ground and the title turns heavy in the accent ink. Long titles need a rule (wrap, or truncate with the full title reachable) before this ships.

### Featured panel (designed, not yet built)

The one accent fill on a page, marking the Featured Project that is running live. Accent ground, accent shadow ink; the live readout sits in the muted accent tones and is the only thing on the page that moves on its own.

### Focus and selection

- **Focus:** every focusable element shows a 2px accent outline at a 3px offset, with 2px corners.
- **Text selection:** accent background with accent shadow ink.

### Motion

One exponential ease-out, `cubic-bezier(0.16, 1, 0.3, 1)`, at 450ms is the default for every transition, so weight and colour changes share one grammar. Under `prefers-reduced-motion` every transition and animation drops to zero duration.

### Admin panel primitives

Built from shadcn/ui on Base UI (ADR 0010). Each primitive's variants map onto these tokens: ground and ground-raised for surfaces, ink and ink-muted for text, rule for borders and dividers, the shared focus ring and ease-out. Targets are at least 44 by 44 px there. None are built yet.

## Do's and Don'ts

### Do:

- **Do** use only theme utilities generated from the tokens; add a token, for both themes, when one is missing.
- **Do** keep the accent for the live or selected thing.
- **Do** show state with weight: Project titles at 400 at rest, 800 with the accent ink when selected.
- **Do** separate with hairline rules in the rule colour.
- **Do** keep numerals tabular.
- **Do** use logical properties and utilities only.
- **Do** run every transition on the shared ease-out and let reduced motion still it.
- **Do** meet WCAG 2.2 AA in both themes.

### Don't:

- **Don't** use cards or boxed containers to group content.
- **Don't** use badges or pills for Status, Topics or counts; set them as muted text.
- **Don't** put kickers or eyebrows above headings.
- **Don't** add shadows.
- **Don't** use arbitrary Tailwind values or raw palette colours.
- **Don't** replace the ultramarine ground with near-black.
- **Don't** use the accent as decoration, emphasis or a default button fill.
