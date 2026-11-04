---
version: 1
slug: "apps-site-src-app-page-tsx"
primary_target: "apps/site/src/app/page.tsx"
related_targets: []
---

# Home page

Scope: `/`, the site's home. Visitor mode: Experience (the work leads). The same world carries every surface: Articles and Activity in Read mode, the Admin panel in Operate mode (ADR 0010).

Audience: developers, hiring managers and potential clients, often arriving from a link. Job: see what Nadav builds, poke at it, and know how to go further. Proof: real Projects, Hosted ones running live. Constraints: dark first with a full light theme; WCAG 2.2 AA; RTL-safe layout; no invented claims (stand-in copy is labelled).

Nadav's steer: typographic, no governing object or metaphor; feels bold and curious; references rauno.me (precision, interaction craft) and frankchimero.com (typographic voice). Four rolled hands were rejected as "not me"; the chosen direction is a mix Nadav assembled from three typographic proofs (`.impeccable/mocks/typographic/`, final: `d-mix.html`).

## Direction contract

THESIS: A precise instrument for showing work: a strict 12-column grid on drenched ultramarine where the Projects themselves are the interface and one live panel proves they run. It refuses the dark-mode card grid with a neon accent and the name-plus-tagline hero.

OWN-WORLD: Ultramarine ground (not near-black) with a lifted ultramarine for selection, warm off-white ink, periwinkle secondary ink, and one lime accent that only ever marks the live or selected thing. Funnel Display for headings and Project titles, Funnel Sans for everything else; weight carries state: titles sit light at rest and turn heavy when selected. Hairline rules, tabular numerals, no cards, no badges.

STORY: A visitor reads one line about what Nadav does, sees a Featured Project actually running, scans the Projects list, and moves through it by pointer or keyboard; the latest Update says this is a person working now.

FIRST VIEWPORT: Header rule with wordmark and nav (Projects, Articles, Activity). Left seven columns: the statement in heavy Funnel Display, then the latest Update beneath. Right five columns: the lime Featured panel with its title, a live readout of the Hosted project and one line on what it is. The Projects list starts just above the fold, full width: title, one-line summary, year and Status.

FORM: user-pinned typographic mix (proof C's grid, ground and live panel, set in Funnel, with a lime accent, provisional against pink), not a rolled world; seed: seed:c4b7fbbe4fe7a06a. Signature interaction: weight carries state (titles turn heavy when selected, J/K moves the selection, Enter opens). Motion grammar: one exponential ease-out for weight and colour changes; the live readout is the only thing that moves on its own; all of it stills under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Nadav's local time: a candidate Feature (a clock relative to the visitor's own time), to be named in GLOSSARY.md before it is built.
- Accent: lime (provisional) or pink; Nadav decides on the tracked mock.
- Light theme: designed alongside dark in the build, not yet proven.
- Article body text: Funnel Sans or a paired text face; decide on the first Article page.
- The statement's wording is a stand-in until Nadav writes it.
- Titles longer than the title column need a rule (wrap or truncate with the full title reachable).
