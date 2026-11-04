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
- Every input is parsed with zod at the entry point, and an expected failure goes back to the caller as a result object.
- A module that must never reach the browser starts with `import "server-only"`.

## Env

Env is read through one zod-validated accessor, called where the value is used and never at module top level. Builds and CI run on fake values, with no real secrets.

## Rendering

- A content route (an Entry's page, an Entry list) exports `ensureStatic = "navigation"`. It stays static, and a slug outside `generateStaticParams` waits for the full render, so `notFound()` returns a real 404 instead of a 200 App Shell (ADR 0011; `docs/tooling.md`, Traps).

## Data

- A data-access function takes the database as its first parameter, so tests can pass PGlite.
- When the database or a third-party API fails, only the section that needs it degrades. That section shows an honest "unavailable" message, and the page still returns 200.
- A Hosted project's tables live in its own Postgres schema (ADR 0004).

## Migrations

- Every schema change ships as a new generated migration. A committed migration is never edited.
- Migrations run in the Vercel build, before the new code goes live (ADR 0009). Each migration must therefore work with the code that is already running.
- A destructive change goes expand/contract over two PRs. Destructive means dropping, renaming or retyping a column, or adding `NOT NULL` without a default.
  - The first PR adds the new shape, backfills it and switches the code over.
  - The second PR removes the old shape.
