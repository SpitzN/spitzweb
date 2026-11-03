# Product

<!-- impeccable:product-schema 1 -->

Vocabulary follows `GLOSSARY.md`; decisions are recorded in `docs/adr/`.

## Platform

web

## Stack

A pnpm + Turborepo monorepo (ADR 0001), starting with one Next.js app (App Router, TypeScript, Tailwind v4) in `apps/site`. Articles and Project write-ups are MDX in the repo; dynamic data lives in Postgres (Neon) via Drizzle. Deployed on Vercel at `spitzweb.dev`. A Hosted project that needs isolation moves into its own app at `<name>.spitzweb.dev` (ADR 0002). Next.js was chosen over Astro because Hosted projects may be full apps (ADR 0003).

## Users

Nadav Spitzer is a full-stack product engineer. spitzweb serves three audiences equally:

- **Fellow developers** read Articles and Project write-ups, try Hosted projects, and borrow ideas or code.
- **Hiring managers and recruiters** judge how Nadav thinks and builds.
- **Potential clients** decide whether to bring Nadav in for freelance or consulting work.

Visitors never sign in. Nadav is the only signed-in user and works through the Admin panel, often from a phone.

## Product Purpose

spitzweb is where Nadav publishes what Nadav builds, writes and is doing. It is not a résumé.

It is made of **Entries** and **Features**:

- **Entries** are dated content. The first Entry types are:
  - **Projects**: things Nadav built, each with the story of how and why. A Hosted project runs on spitzweb; an External project lives elsewhere and is shown as a case study.
  - **Articles**: written pieces that stand on their own.
  - **Updates**: one or two lines on what Nadav is doing right now.
- **Features** are standing parts of the site. The first is **Activity**, the chronological stream of Updates and Events (an Entry published, a Project's Status changing, activity on GitHub).

Entries share Topics, can be Featured, and can link to each other as Related entries. More Entry types and Features will be added over time; a new idea is either a new Entry type or a new Feature.

Success is a mix with no single winner: visitors see how Nadav thinks, the right people reach out, visitors use or learn something, and Nadav keeps enjoying publishing on it.

## Positioning

Open. To be written in Nadav's own words.

## Operating Context

- Visitors often arrive on a single Entry from a link (GitHub, social posts, job applications, client conversations), not on the home page.
- Nadav publishes Articles and Project write-ups by committing MDX, and posts Updates from the Admin panel, usually on a phone.
- Unlisted Entries let Nadav test and share work on the real site before it is listed.
- Hosted projects may call paid APIs (for example AI models). Public use is rate-limited per visitor, and each Hosted project can be switched off from the Admin panel.

## Capabilities and Constraints

- Every Entry has a publication state: Draft, Unlisted, Published or Archived. Updates are always Published and can only be edited or deleted.
- Projects also have a Status, In progress or Complete, so work can be published while it is still being built.
- Each Hosted project is self-contained (its own folder, and its own database schema if it needs data) so it can move into its own app later.
- English only for now. Layout must not assume left-to-right, so Hebrew (RTL) stays cheap to add later.
- Undecided: the visual direction, voice and tone, how visitors learn who Nadav is (home page and any "about" content), and which Entry types and Features come next.

## Brand Commitments

- Name: **spitzweb**, at `spitzweb.dev` (`spitzweb.com` redirects there).
- Author: Nadav Spitzer; GitHub `SpitzN`.
- No inherited visual identity. The v1 aurora color system was dropped on purpose.

## Evidence on Hand

None yet. No Projects, Articles, testimonials, client names, metrics or photos exist. Never invent them; use clearly marked placeholders until Nadav supplies real content.

## Product Principles

1. **Show, don't list.** A working thing with honest reasoning beats any claim about skills.
2. **Every Entry stands alone.** Each Entry makes sense on its own, so the site never depends on a publishing rhythm.
3. **Write for developers, guide the deciders.** Give developers real depth, and make it obvious to hiring managers and clients who Nadav is and how to get in touch.
4. **Cheap to publish.** Posting an Update, Article or Project takes minutes.
5. **Honest about state.** In-progress Projects, Archived Entries and outages are labelled, never hidden.

## Accessibility & Inclusion

WCAG 2.2 AA for every public page, checked automatically. Motion respects `prefers-reduced-motion`. The Admin panel must be fully usable on a phone.
