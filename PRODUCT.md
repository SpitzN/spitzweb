# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript), one app. Tailwind v4. Content as MDX in the repo; dynamic data in Postgres (Neon) via Drizzle. Hosted on Vercel; domain `spitzweb.dev`. Chosen by Nadav after weighing Astro, because experiments may be full mini-apps with server code, data and auth. Decision records live in `docs/adr/`.

## Users

Nadav Spitzer is a full-stack product engineer, and spitzweb is Nadav's home on the web. It serves three audiences together; none of them is secondary:

- **Fellow developers**: read the write-ups, try the experiments, and borrow ideas or code.
- **Hiring managers and recruiters**: judge how Nadav thinks and builds. The site does the job a résumé can't.
- **Potential clients**: decide whether to bring Nadav in for freelance or consulting work.

Visitors never sign in. The only signed-in user is Nadav (admin), who uses the private sandbox and posts updates, often from a phone.

## Product Purpose

A living workshop rather than a résumé. It holds:

- **Lab**: finished experiments and full mini-apps, each with a write-up of how and why it was built.
- **Writing**: a blog.
- **Now**: a live page of what Nadav is working on, built from short status updates plus public GitHub activity.
- **Sandbox**: private and admin-only, for trying things on the real site.

Success is a mix with no single winner. Visitors see how Nadav thinks (reasoning, taste, craft). The right people reach out (work, hiring, collaboration). Visitors use or learn something they take away. And the site keeps being something Nadav enjoys building and publishing on.

## Positioning

The work is the proof. Instead of listing skills, the site shows real, running things a full-stack engineer built end to end, from database to UI, together with the reasoning behind them. Each entry stands on its own, so the site never looks abandoned between posts. *(Derived from the confirmed purpose and audiences; refine in Nadav's own words.)*

## Operating Context

- Readers arrive from links shared on GitHub, social posts, job applications and client conversations, often landing deep on a single experiment or post rather than the home page.
- Nadav publishes by committing MDX (write-ups, posts) and by posting short status updates from a private admin screen, usually on a phone.
- Experiments can call paid APIs (e.g. AI models). Public use is rate-limited per visitor, and each experiment can be switched off from the sandbox.

## Capabilities and Constraints

- Sections: Home · Lab · Writing · Now, plus a private Sandbox (not in public navigation, `noindex`). No separate About page; Home covers it.
- Each experiment is self-contained (its own folder, and its own database schema if it needs data) so it can later move to its own deployment.
- English only for now. Layout must not assume left-to-right, so that Hebrew/RTL stays cheap to add later.
- Undecided: the visual world, the voice and tone guidelines, the Home page intro copy, and which experiments come first.

## Brand Commitments

- Name: **spitzweb**, at `spitzweb.dev` (`spitzweb.com` redirects there).
- Author identity: Nadav Spitzer; GitHub `SpitzN`.
- No inherited visual identity: the v1 aurora color system was deliberately dropped. The visual world will be established fresh.

## Evidence on Hand

None yet. The site starts empty: no experiments, posts, testimonials, client names, metrics or photos exist. Future work must not invent any of them; use clearly marked placeholders until Nadav supplies real content.

## Product Principles

1. **Show, don't list.** A working thing with honest reasoning beats any claim about skills.
2. **Every entry stands alone.** Each experiment or post is finished and self-contained, and no page depends on a publishing cadence.
3. **Speak to builders first, without shutting out deciders.** Write with the depth developers respect, and make the "who is this and how do I reach Nadav" path obvious for hiring managers and clients.
4. **Cheap to publish.** Adding an update, post or experiment should take minutes, so the site stays alive.
5. **Honest about state.** Work in progress, archived experiments and outages are labelled as such, never hidden or dressed up.

## Accessibility & Inclusion

WCAG 2.2 AA is the bar for every public page, checked automatically. Motion respects `prefers-reduced-motion`. The admin status form must be fully usable on a phone.
