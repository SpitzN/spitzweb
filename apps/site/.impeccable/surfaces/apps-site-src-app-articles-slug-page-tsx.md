---
version: 1
slug: "apps-site-src-app-articles-slug-page-tsx"
primary_target: "apps/site/src/app/articles/[slug]/page.tsx"
related_targets: ["apps/site/src/app/articles/page.tsx"]
---

# Article page and Articles list

Scope: `/articles/[slug]` (an Article) and `/articles` (the Articles list). Visitor mode: Read (ADR 0010, professional register), in the established world of DESIGN.md.

Audience: developers reading to learn, hiring managers and clients judging how Nadav thinks; most arrive on one Article from a link. Job: read the piece comfortably, know when it was written, what it covers and how long it takes, and find a way onward. Constraints: dark first with the light theme; WCAG 2.2 AA; RTL-safe; Draft never reachable, Unlisted out of every list, Archived labelled (docs/conventions.md).

Nadav's answers (2026-11-04): the page carries quiet facts, contents for long pieces, a way onward at the end, and reading time. The list uses the Projects list's grammar. Wrong would be a Medium-style blog template or unstyled markdown. Body face: Funnel Sans, chosen from rendered proofs over Literata (rejected as ugly), Geist, Atkinson Hyperlegible Next, Source Serif 4 and Spectral.

## Direction contract

THESIS: An Article opens like a reference book's contents page: the title, then one ruled ledger holding its facts, its sections and the way onward, before the first paragraph. It refuses the centred blog column under a hero image, and the docs sidebar.

OWN-WORLD: The site's ultramarine, Funnel and hairlines. Ledger rows are body size on the 12-column grid: label in muted ink (two columns), value in ink (seven), an end note in muted ink (three). Rank comes from weight and rule, not size (raise from the timetable). A hovered or focused row lifts its ground and its value turns 800 in accent ink. The reading column stays calm: Funnel Sans at 18px, about 68 characters to the line, open leading; code on the lifted ground in a monospace.

STORY: A reader arriving by link sees what this is, when it was written, which Topics it belongs to, how long it takes and how it is built; reads; and at the end meets the next Article in the same ledger grammar, plus the way back to all Articles.

FIRST VIEWPORT: Site header. Title at statement scale over nine columns. The ledger full width beneath: an Archived row first when it applies; Published, date, reading time; Topics; Contents rows (only past three headings), each linking to its section; Next, the next Article's title. The body column starts below, columns three to nine.

FORM: Colophon ledger, position 6 on the ordered list of seven, dealt as the lead; seed: seed:e52c8c53778ccd42. Signature interaction: every ledger row is a link whose weight and accent mark it under pointer or focus; the way onward is the ledger's last row from the start (raise from airport signage). Motion grammar: the shared 450ms ease-out on weight and ground; nothing moves on its own; stilled under reduced motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

The end ledger closes with a Contact row linking Nadav's LinkedIn profile (Nadav, 2026-11-04).
