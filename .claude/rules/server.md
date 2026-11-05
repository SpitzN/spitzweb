---
paths:
  - "apps/**/*.{ts,tsx}"
  - "apps/**/drizzle/**"
  - "packages/**/*.{ts,tsx}"
---

# Server

The security invariants these rules serve are listed in `docs/conventions.md`.

## Entry points

- **Server Actions** handle mutations that come from the site's own UI. **Route Handlers** serve external callers: OAuth callbacks, webhooks, feeds and anything with a public URL contract.
- Every Server Action, Route Handler and Admin panel layout checks the admin session itself. A proxy may redirect early, but it is never the only check (ADR 0005).
  - A layout's check doesn't run again when the browser moves between its pages, so an Admin panel page that reads data checks the session too.
  - Two entry points are exempt, because they run before a session exists: Better Auth's Route Handler (`app/api/auth/[...all]`), which makes the session and turns away every other account, and the Server Action that starts GitHub sign-in.
- Every input is parsed with zod at the entry point, and an expected failure goes back to the caller as a result object.
- A module that must never reach the browser starts with `import "server-only"`.

## Env

Env is read through one zod-validated accessor, called where the value is used and never at module top level. Builds and CI run on fake values, with no real secrets.

## Rendering

- A content route (an Entry's page, an Entry list) exports `ensureStatic = "navigation"`. It stays static, and a slug outside `generateStaticParams` waits for the full render, so `notFound()` returns a real 404 instead of a 200 App Shell (ADR 0011; `docs/tooling.md`, Traps).

## Status codes

- A URL that names nothing returns 404 from `app/not-found.tsx`, inside the root layout. That covers an unknown route, a Draft, and a deleted Entry. There is no 410 and no list of deleted slugs.
- An Archived or Unlisted Entry returns 200.
- A renamed slug 308-redirects to the new one through an `aliases` field in the Entry's frontmatter, built with the first rename.
- Our code never sends a 503. A failing dependency degrades its section (Data, below); when Vercel itself is down, Vercel serves its own page.
- A 404 is not reported to Sentry: bots and typos make it noise. A link to a page that doesn't exist fails the e2e link check instead, so a section's header link lands with its route.

## Data

- A data-access function takes the database as its first parameter, so tests can pass PGlite.
- When the database or a third-party API fails, only the section that needs it degrades. That section shows an honest "unavailable" message, reports the error to Sentry, and the page still returns 200.
- A Hosted project's tables live in its own Postgres schema (ADR 0004).

## Migrations

- Every schema change ships as a new generated migration. A committed migration is never edited.
- Migrations run in the Vercel build, before the new code goes live (ADR 0009). Each migration must therefore work with the code that is already running.
- A destructive change goes expand/contract over two PRs. Destructive means dropping, renaming or retyping a column, or adding `NOT NULL` without a default.
  - The first PR adds the new shape, backfills it and switches the code over.
  - The second PR removes the old shape.
