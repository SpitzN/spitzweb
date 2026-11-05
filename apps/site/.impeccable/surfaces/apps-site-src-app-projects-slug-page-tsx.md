---
version: 1
slug: "apps-site-src-app-projects-slug-page-tsx"
primary_target: "apps/site/src/app/projects/[slug]/page.tsx"
related_targets: ["apps/site/src/app/projects/page.tsx"]
---

# Project page and Projects list

Scope: `/projects/[slug]` (a Project) in Experience mode, the creative register (ADR 0010), and `/projects` (the Projects list) in Read mode, both in the established world of DESIGN.md.

Audience: developers who want to try or borrow the work, hiring managers and clients judging how Nadav builds; most arrive on one Project from a link. Job: meet the thing itself (run the Hosted project, or follow the External project's links), see at a glance whether it is In progress or Complete, when it is from and what it is made with, then read how and why it was built and move on to Related entries. Constraints: dark first with the light theme; WCAG 2.2 AA; RTL-safe; Draft never reachable, Unlisted out of every list and every Related link, Archived labelled (docs/conventions.md).

Nadav's answers (2026-11-05): the thing itself leads, before the write-up; same family as the Article page's colophon ledger, with a signature of its own; wrong would be a portfolio-card case study (hero image, tag pills, Challenge/Solution/Results boxes) or a Status that reads soft or hidden. The list uses the Project list row already designed in DESIGN.md.

## Direction contract

THESIS: A Project opens like an engineering drawing sheet: the title at the start of the first viewport and, at the end, one ruled title block holding the way to run it and every fact. It refuses the portfolio case study under a hero image and the README with a badge wall.

OWN-WORLD: The site's ultramarine, Funnel and hairlines. The title block is the ledger grammar turned sideways into five end columns: open hairline rows, muted labels, values in ink, no outer frame. Its first cell is the page's one accent fill, the live thing: Hosted shows "Open <title>" and where it runs; External lists its links. Status sits second in Title-size Funnel Display at 800, never fine print.

STORY: A visitor arriving by link sees what it is and runs or visits it in one move, reads its Status, year and stack, reads how and why it was built, and leaves through Related entries, all Projects, or contact.

FIRST VIEWPORT: Site header. Start seven columns: the title at statement scale and the summary in muted ink. End five columns: the title block (Archived row first when it applies; the accent run or links cell; Status; Year; Made with; Topics). The write-up starts below at column three, prose measure.

FORM: Title block, position 6 on the ordered list of seven, dealt as the lead; seed: seed:0f24bfd956f9b99a. Signature interaction: the accent cell is the whole target; under pointer or focus its title turns to the accent shadow ink's underline and the cell keeps its fill, the only accent on the page. Status reads from the board like a departure state (raise from the split-flap concourse). Motion grammar: the shared 450ms ease-out on weight and ground; nothing moves on its own; stilled under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

The end of the page repeats the way onward in the Article page's ledger: Related entries, then Projects ("All Projects"), then Contact (Nadav on LinkedIn).
