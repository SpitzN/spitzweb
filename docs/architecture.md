# Architecture

How spitzweb is built: the stack, the workspace, the code layout and where state lives. The reasons for each choice are in the ADRs linked below. Exact versions are in each `package.json`.

> **Status:** skeleton from the scaffold (2026-11-03). Two parts are still to come. The code layout inside `apps/site` and the "where state lives" table will be designed with `codebase-design` once the visual direction is set and before the first slice lands. Until then, `src/app/` is the only known folder (`docs/tooling.md`, Import direction).

## Stack

| Concern           | Choice                                                                                   | ADR                                                            |
| ----------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Repo              | pnpm workspaces + Turborepo; `apps/*` deploy, `packages/*` only for shared code          | [0001](adr/0001-monorepo-with-pnpm-and-turborepo.md)           |
| Hosted projects   | A slice in `apps/site`, moved out to `<name>.spitzweb.dev` when a trigger hits           | [0002](adr/0002-hosted-projects-graduate-to-subdomain-apps.md) |
| Framework         | Next.js (App Router), React 19 with the React Compiler                                   | [0003](adr/0003-nextjs-over-astro.md)                          |
| Rendering         | Cache Components: a static shell with dynamic holes in `<Suspense>`                      | [0011](adr/0011-cache-components-for-rendering.md)             |
| Long-form content | MDX in the repo                                                                          | [0004](adr/0004-neon-postgres-with-drizzle.md)                 |
| Data              | Postgres on Neon via Drizzle; PGlite in tests                                            | [0004](adr/0004-neon-postgres-with-drizzle.md)                 |
| Migrations        | Applied in the Vercel build; expand/contract                                             | [0009](adr/0009-migrations-run-in-the-vercel-build.md)         |
| Auth              | Better Auth, GitHub, admin-only                                                          | [0005](adr/0005-admin-only-github-sign-in-with-better-auth.md) |
| Hosting           | Vercel Hobby, kept portable                                                              | [0006](adr/0006-vercel-hosting-kept-portable.md)               |
| Monitoring        | Sentry, security headers, report-only CSP, uptime monitor                                | [0007](adr/0007-production-monitoring-baseline.md)             |
| Analytics         | Vercel Analytics, cookieless                                                             | [0008](adr/0008-vercel-analytics-without-cookies.md)           |
| UI                | Two registers on one token system (`DESIGN.md`); shadcn/ui on Base UI in the Admin panel | [0010](adr/0010-two-ui-registers-one-token-system.md)          |
| Styling           | Tailwind v4, tokens in `apps/site/src/app/globals.css`                                   |                                                                |
| Validation        | zod at every boundary                                                                    |                                                                |
| Tests             | Vitest beside the code; Playwright + axe in `apps/site/e2e/`                             |                                                                |
| Tooling           | `docs/tooling.md`                                                                        |                                                                |

## Workspace

```
apps/
  site/            the site at spitzweb.dev (Next.js)
    src/app/       routes only: they compose slices
    e2e/           Playwright specs, one list of public routes
packages/          created when a second app needs shared code
docs/              ADRs, conventions, tooling, setup, this file
```

## Code layout

_To be designed with `codebase-design`._ Expected shape, per `.claude/rules/structure.md`:

- route segments in `src/app/`;
- one folder per slice (an Entry type, a Feature, the Admin panel, a Hosted project);
- a shared domain folder;
- shared components, hooks and lib folders.

Each folder gets a row in the import-direction table in `docs/tooling.md`.

## Where state lives

_To be filled with `codebase-design`._ Every piece of state gets a row: what it is, its home (MDX, Postgres, URL, cache, client), who owns it, and why.

## Boundaries where zod parses

_To be listed as they land._ So far: none.
