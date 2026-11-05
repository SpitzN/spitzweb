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
  prose:
    fontFamily: "Funnel Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: "1.75rem"
    fontFeature: "pnum"
  prose-heading:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  prose-subheading:
    fontFamily: "Funnel Display, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.375
    letterSpacing: "-0.025em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.5rem"
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
  page-block-end: "6rem"
  grid-gap: "1.25rem"
  row-bleed: "0.75rem"
  row-bleed-narrow: "1rem"
  ledger-row-block: "0.75rem"
  open-cell-block: "1.25rem"
  list-row-block: "1rem"
  prose-measure: "36rem"
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
  project-row:
    textColor: "{colors.ink-muted}"
    padding: "1rem 0.75rem"
  project-row-hover:
    backgroundColor: "{colors.ground-raised}"
  title-block-open-cell:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    padding: "1.25rem 0.75rem"
  title-block-open-action:
    textColor: "{colors.on-accent}"
    typography: "{typography.title-selected}"
  title-block-runs-at:
    textColor: "{colors.on-accent-muted}"
  title-block-fact:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.75rem"
  title-block-label:
    textColor: "{colors.ink-muted}"
  title-block-status:
    textColor: "{colors.ink}"
    typography: "{typography.title-selected}"
  ledger-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.75rem"
  ledger-label:
    textColor: "{colors.ink-muted}"
  ledger-link-hover:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.accent-ink}"
  article-row:
    textColor: "{colors.ink-muted}"
    padding: "1rem 0.75rem"
  article-row-hover:
    backgroundColor: "{colors.ground-raised}"
  article-title:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
  article-title-hover:
    textColor: "{colors.accent-ink}"
    typography: "{typography.title-selected}"
  prose:
    textColor: "{colors.ink}"
    typography: "{typography.prose}"
    width: "36rem"
  prose-heading:
    textColor: "{colors.ink}"
    typography: "{typography.prose-heading}"
  prose-subheading:
    textColor: "{colors.ink}"
    typography: "{typography.prose-subheading}"
  code-block:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    padding: "1.25rem"
  code-inline:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
  featured-panel:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  text-selection:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
  text-selection-on-accent:
    backgroundColor: "{colors.on-accent}"
    textColor: "{colors.accent}"
---

# Design System: spitzweb

## Overview

**Creative North Star: "The Precision Instrument"**

spitzweb is a precise instrument for showing work. The world is typographic: no governing object or metaphor, no imagery doing the talking. A drenched ultramarine ground (not near-black) carries warm off-white ink, periwinkle secondary ink and hairline rules, and the work itself is the interface. Type does almost everything: Funnel Display for headings and Project and Article titles, Funnel Sans for everything else, Article body text included, with weight rather than decoration carrying state.

Dark is the default theme and was chosen first; light is a full alternative, switched by `data-theme="light"` on `<html>`, and swaps the ground and ink while keeping the same structure. One accent, lime, marks only the live or selected thing; everything else stays in ground, ink and rule. Density is calm and exact: tabular numerals outside running prose, hairlines instead of containers, one exponential ease-out for every change of state.

The system serves both UI registers from ADR 0010 on one set of tokens. Read and Experience surfaces (home, Projects, Articles, Activity) are custom-built on these tokens; the Admin panel in Operate mode is built from shadcn/ui on Base UI, with each primitive's variants mapped onto the same colour, type and motion tokens rather than shadcn's default palette. The accent keeps its meaning in both: in the Admin panel it marks the selected or live item, not every primary action.

**Key Characteristics:**

- Drenched ultramarine ground, warm off-white ink, periwinkle muted ink, ultramarine hairlines.
- One accent that marks only the live or selected thing.
- Funnel Display for headings and Project and Article titles, Funnel Sans for everything else, Article body text included.
- Weight carries state: Project titles go from 400 at rest to 800 when selected.
- Hairline rules, tabular numerals outside prose, no cards, no badges, no kickers or eyebrows.
- One exponential ease-out (450ms) for every change of state; all motion stills under reduced motion.
- Logical properties only, so RTL stays cheap.

## Colors

A drenched ultramarine world with warm paper ink and a single lime accent kept for the live or selected thing.

### Primary

- **Live Lime** (accent): the only accent. It fills the Featured panel and the cell that opens a Project in its Title block, colours the selected Project title, draws the focus ring and backs text selection. The accent is the same in both themes.
- **Lime Ink** (accent-ink, accent-ink-light): the accent when it colours text on the ground. In dark it is the accent itself; in light it deepens to a dark olive so selected text keeps AA contrast on paper.
- **Accent Shadow Ink** (on-accent): text and marks set on an accent fill, and the focus ring and selection ground inside one.
- **Accent Shadow Muted** (on-accent-muted): secondary text, underlines and quiet fills inside an accent fill, such as where a Hosted project runs, an External project's link underlines, or the track of a live readout.

### Neutral

- **Drenched Ultramarine** (ground): the page in dark. Never swapped for near-black.
- **Lifted Ultramarine** (ground-raised): the selected or hovered row in dark; the only tonal step above the ground.
- **Warm Paper** (ink): primary text in dark.
- **Periwinkle** (ink-muted): secondary text in dark: nav links at rest, summaries, years and Status.
- **Ultramarine Hairline** (rule): every rule and divider in dark.
- **Paper Ground** (ground-light), **Lavender Lift** (ground-raised-light), **Ultramarine Ink** (ink-light), **Slate Periwinkle** (ink-muted-light), **Lavender Hairline** (rule-light): the same roles in the light theme, where ground and ink trade places.

### Named Rules

**The Live Thing Rule.** The accent marks only the live or selected thing: the running Featured Project, the cell that opens a Project, the selected row, focus, selection. It never decorates, never fills a primary button by default, and never colours a heading for emphasis.

**The Token-Only Rule.** Every colour comes from a theme token defined for both themes. The Tailwind palette is reset (`--color-*: initial`) and lint rejects arbitrary values and raw palette colours (apps/site/eslint.config.js, docs/tooling.md). Components use the generated utilities (`bg-ground`, `text-ink-muted`, `border-rule`), never the CSS variables directly.

**The Two Themes Rule.** Every token has a dark value and a light value, and both themes meet WCAG 2.2 AA. A new token is not done until it has both.

## Typography

**Display Font:** Funnel Display (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Funnel Sans (with ui-sans-serif, system-ui, sans-serif), roman and true italic
**Code Font:** the platform monospace stack (ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace), for code only

**Character:** One family in two cuts: Funnel Display is tight, heavy and confident at the top of a page and quiet at 400 in a list; Funnel Sans is plain and even for everything that reads, long-form Articles included. Both are self-hosted at build through next/font; Funnel Sans loads its italic too, so emphasis is never a synthesized slant.

### Hierarchy

- **Display** (800, fluid from 2.75rem to 6rem, line-height 0.95, tracking -0.035em): the statement on the home page and other page-opening headings. Balanced wrapping, capped at 56rem.
- **Wordmark** (Funnel Display 700, 1.25rem, tracking -0.025em): the spitzweb wordmark in the header.
- **Title** (Funnel Display 400, 1.5rem, line-height 1.15, tracking -0.015em): a Project title in a list, at rest.
- **Title, selected** (Funnel Display 800, same size): the selected or hovered Project or Article title, in the accent ink. The same cut, in the ink of its ground, sets a Project's Status and the action in its Title block's accent cell.
- **Body** (Funnel Sans 400, 1rem, line-height 1.5): everything else, including nav, summaries, metadata and ledger rows. Tabular numerals are on for the whole document.
- **Prose** (Funnel Sans 400, 1.125rem, line-height 1.75rem, proportional figures): Article body text in the Read register. Capped at 36rem, about 68 characters to the line, with pretty wrapping.
- **Prose heading** (Funnel Display 700, 1.875rem, line-height 1.25, tracking -0.025em): a second-level heading inside an Article, balanced, with more space above (2.5rem) than below (0.75rem).
- **Prose subheading** (Funnel Display 700, 1.25rem, line-height 1.375, tracking -0.025em): a third-level heading inside an Article, 1.5rem above and 0.5rem below.
- **Code** (monospace, 0.875rem, line-height 1.5rem in blocks; 1rem inline): code samples, always on the lifted ground.

### Named Rules

**The Weight Carries State Rule.** State is shown by weight, not by boxes or badges. A Project title sits at 400 at rest and moves to 800 with the accent ink when selected, through the shared ease-out.

**The Tabular Rule.** Numerals are tabular everywhere (set on `html`), so years, times and readouts never jitter. Running prose is the one exception: Article body text switches to proportional figures, because numbers there are read, not compared.

**The One Family Rule.** Funnel is the only family on the site, Article body text included. Literata, Geist, Atkinson Hyperlegible Next, Source Serif 4 and Spectral were proofed for Article body text and rejected. A monospace sets code and nothing else.

## Layout

The page has an inline padding of 1rem, widening to 2rem from the `sm` breakpoint (40rem). Spacing comes from Tailwind's 0.25rem scale; the steps in use are recorded in the frontmatter. The header wraps its wordmark and nav on a shared baseline, with 3rem between them inline and 0.75rem when they wrap, 1.5rem between nav links, and a hairline below. Page content opens with 4rem of block padding; Article pages close with 6rem.

Built surfaces sit on a 12-column grid from the `sm` breakpoint, with a 1.25rem column gap, and collapse to one column below it. Rows that lift their ground (ledger rows, list rows, the Title block) bleed past the page column and pad inline by the same amount, so the hairlines span the lifted ground while the text stays on the page column: the full 1rem page padding below `sm`, so they run to the screen edges, and 0.75rem from `sm`. The Article body and a Project's write-up start at column three and are capped at the 36rem measure.

A Project page sets the title (a Statement) with its summary in muted ink beneath over the start seven columns and the Title block over the end five; below `sm` they stack, 2.5rem apart. The write-up follows 4rem below, and the end ledger 2.5rem after it.

All layout uses logical properties and utilities only (`pbs-*`, `pbe-*`, `border-be`, `max-inline-*`, `min-block-dvh`), so an RTL locale needs no layout rewrite. Lint enforces this.

**Intended home composition (designed, not yet built).** The tracked mock (`.impeccable/mocks/typographic/e-funnel-accent.html`) sets the home page on a strict 12-column grid: the header rule spans all columns; the statement in heavy Funnel Display takes the start seven columns with the latest Update beneath it; the Featured panel takes the end five, filled with the accent and holding the Project's title, a live readout of the Hosted project and one line on what it is; the Projects list runs full width from just above the fold, each row on the same 12 columns (title in four, one-line summary in five, year and Status in three, aligned to the end), divided by hairlines. Below the small breakpoint everything collapses to one column and each row stacks its summary under the title. Selection moves by pointer or by J and K, and Enter opens. The Projects list, Articles list, Article page and Project page now carry this grid as built (above); J and K selection is part of the home composition and is not built on the Projects list.

## Elevation & Depth

The system is flat. There are no shadows. Depth is one tonal step: the lifted ground behind a selected or hovered row. Hairline rules separate; nothing floats.

### Named Rules

**The Hairline Rule.** Structure is drawn with 1px rules in the rule colour, never with containers, cards or shadows.

## Shapes

Square by default. The only radius in the build is the 2px corner on the focus ring. The intended Featured panel has soft corners in the mock, but no radius token exists yet; one is added when the panel is built.

## Components

### Navigation

The site header: quiet, exact, on a hairline.

- **Structure:** the wordmark, then the sections that ship (Projects, Articles), on a shared baseline with a hairline below. A section joins the nav with the ticket that builds its route; Activity arrives with its own.
- **Default:** links in muted ink, body type.
- **Hover:** links move to full ink through the shared ease-out.
- **Focus:** the global ring (2px accent outline, 3px offset).
- **Narrow screens:** the row wraps; no menu toggle.

### Statement

The page-opening heading: heavy Display type in full ink, balanced, capped at 56rem. On the home page its wording is a stand-in until Nadav writes it. The Articles list opens with it ("Articles"), followed by one line in muted ink at 1.125rem (capped at 42rem) and 3rem of space before the list. The Projects list opens the same way ("Projects"). An Article's title is a Statement too, capped wider at 64rem, with 2.5rem before the ledger. A Project's title is a Statement over the start seven columns, followed 1.25rem below by its summary in muted ink at 1.125rem (capped at 42rem).

### Ledger

The Article page's signature: a ruled ledger of facts, contents and the way onward, set before the first paragraph and repeated at the end. A Project page carries only the end ledger.

- **Structure:** full-width rows on the 12-column grid between hairlines, a hairline above the first. Each row: a label in muted ink (two columns), the value in ink (seven), an optional end note in muted ink (three, end-aligned). Body type throughout; rank comes from weight and rule, not size.
- **Bleed:** the ledger bleeds past the page column by the row bleed (1rem below `sm`, 0.75rem from `sm`) and each row pads the same inline and 0.75rem block, so hairlines span the lifted ground.
- **Rows, in order (top):** Archived (Archived Articles only, first: "No longer maintained."; Status is a Project word); Published (the date, reading time as the end note); Topics; Contents (only when an Article has more than three headings; one row per heading, the label on the first row only, third-level headings indented 1.25rem); Next (the next Article's title, its date as the end note); Related (one row per Related entry, the label on the first row only, the end note "<Entry type> · <date>", a Project's date shown as its year, and "Archived · " before it when the Entry is Archived).
- **Rows (end):** Next again, Related again, then Articles ("All Articles"), then Contact (Nadav on LinkedIn).
- **Rows (Project page, end only):** Related, then Projects ("All Projects"), then Contact.
- **Link rows:** the whole row is the target and its name is the value alone. Under pointer or focus the row takes the lifted ground and the value turns 800 in the accent ink, through the shared ease-out.
- **Never:** section numbers, arrows or glyphs.
- **Narrow screens:** each row stacks label, value and end note in one column.

### Article list row

The Projects list row grammar applied to Articles, built.

- **Structure:** full-width rows on the 12-column grid between hairlines, a hairline above the first: the title in Title type (four columns), the summary in muted ink (five), the date and Topics in muted ink on two lines (three, end-aligned). Rows pad 1rem block and the row bleed inline (1rem below `sm`, 0.75rem from `sm`) and bleed by the same amount.
- **Featured:** Featured Articles lead the list and carry "Featured ·" in semibold ink before the date. No badge, no accent.
- **Hover / Focus:** the whole row is the link; the row takes the lifted ground and the title turns 800 in the accent ink, through the shared ease-out.
- **Empty:** "No Articles yet." in muted ink, 1.5rem under the top hairline.
- **Narrow screens:** one column; summary and meta stack under the title.

### Prose

Article body text in the Read register: a calm column, not a blog template.

- **Column:** Prose type, 36rem measure, starting at column three; paragraphs 1.5rem apart, pretty wrapping, proportional figures.
- **Headings:** Prose heading and subheading, more space above than below; anchored headings stop 1.5rem clear of the top when a Contents row scrolls to them.
- **Links:** ink text underlined in muted ink (4px offset); the underline turns ink on hover.
- **Lists:** 1.5rem start indent, markers in muted ink, 0.5rem between items.
- **Blockquote:** text in muted ink behind a 1px start rule in the rule colour, with 1.5rem start padding.
- **Inline code:** monospace at 1rem on the lifted ground.
- **Code blocks:** monospace 0.875rem on the lifted ground, 1.25rem padding; they scroll sideways instead of wrapping and are a focusable, labelled region ("Code sample").
- **Thematic break:** a hairline in the rule colour.
- **Emphasis:** Funnel Sans true italic; strong is 700.

### Project list row

The signature list row, built on the Projects list.

- **Structure:** full-width rows on the 12-column grid between hairlines, a hairline above the first: the title in Title type (four columns), the summary in muted ink (five), then the year and Status in muted ink on two lines (three, end-aligned). Rows pad 1rem block and the row bleed inline, and bleed by the same amount.
- **Long titles:** wrap with balanced lines; never truncate, so the whole title stays in the row.
- **Featured:** Featured Projects lead the list and carry "Featured ·" in semibold ink before the year. No badge, no accent.
- **Dates:** a Project is dated by its year, here and everywhere it appears.
- **Hover / Focus:** the whole row is the link; the row takes the lifted ground and the title turns 800 in the accent ink, through the shared ease-out.
- **Empty:** "No Projects yet." in muted ink, 1.5rem under the top hairline.
- **Narrow screens:** one column; summary and meta stack under the title.

### Title block

The Project page's signature: the ledger grammar turned sideways into the end five columns, like the title block of an engineering drawing sheet. It holds the way to the thing and every fact.

- **Structure:** no outer frame; open hairline rows, a hairline above the first, each on the block's own 12 columns: a label in muted ink (four), the value in ink (eight). Rows pad 0.75rem block and the row bleed inline, and the block bleeds by the same amount, so below `sm` the accent fill runs to the screen edges.
- **Rows, in order:** Archived (Archived Projects only, first: "No longer maintained."); the accent cell; Status; Year; Made with; Topics.
- **Accent cell:** the page's one accent fill, padded 1.25rem block, its label ("Hosted" or "External") in accent shadow muted. A Hosted project shows "Open <title>" in Title type at 800 in accent shadow ink with where it runs beneath in accent shadow muted; the whole cell is the target, and under pointer or focus the action takes a 2px underline (4px offset) while the cell keeps its fill. An External project lists its links in Title type at 800, underlined 2px in accent shadow muted, the underline turning accent shadow ink on hover.
- **Focus inside the fill:** the ring switches to accent shadow ink. On a Hosted cell it is drawn on the cell's cover: 2px, inset 4px, 2px corners, so it rings the whole target. External links take the global ring in accent shadow ink.
- **Selection inside the fill:** accent shadow ink ground with accent text.
- **Status:** Funnel Display 800 at Title size in ink, never fine print.
- **Year:** the year alone. **Made with** and **Topics:** comma-separated text, no pills.

### Featured panel (designed, not yet built)

The one accent fill on a page, marking the Featured Project that is running live. Accent ground, accent shadow ink; the live readout sits in the muted accent tones and is the only thing on the page that moves on its own.

### Focus and selection

- **Focus:** every focusable element shows a 2px accent outline at a 3px offset, with 2px corners. Inside an accent fill the ring is accent shadow ink instead (see Title block).
- **Text selection:** accent background with accent shadow ink; inside an accent fill, accent shadow ink background with accent text.

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
- **Do** keep numerals tabular, except in running prose, which takes proportional figures.
- **Do** date a Project by its year everywhere it appears.
- **Do** let long list titles wrap; never truncate them.
- **Do** set Article body text in Funnel Sans at 1.125rem on a 36rem measure.
- **Do** give rows that lift their ground the row bleed and matching inline padding (1rem below `sm`, 0.75rem from `sm`), so hairlines span the lift.
- **Do** use logical properties and utilities only.
- **Do** run every transition on the shared ease-out and let reduced motion still it.
- **Do** meet WCAG 2.2 AA in both themes.

### Don't:

- **Don't** use cards or boxed containers to group content.
- **Don't** use badges or pills for Status, Topics or counts; set them as muted text.
- **Don't** put kickers or eyebrows above headings.
- **Don't** number ledger rows or sections, or add arrows or glyphs to rows.
- **Don't** bring in a second text family for long-form reading.
- **Don't** add shadows.
- **Don't** use arbitrary Tailwind values or raw palette colours.
- **Don't** replace the ultramarine ground with near-black.
- **Don't** use the accent as decoration, emphasis or a default button fill.
