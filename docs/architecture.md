# Architecture

How spitzweb is built: the stack, the workspace, the code layout and where state lives. The reasons for each choice are in the ADRs linked below. Exact versions are in each `package.json`.

> **Status:** code layout, state and zod boundaries designed with `codebase-design` on 2026-11-04, before the first slice. Folders appear with their first file; lint already knows every layer below.

## Stack

| Concern            | Choice                                                                                   | ADR                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Repo               | pnpm workspaces + Turborepo; `apps/*` deploy, `packages/*` only for shared code          | [0001](adr/0001-monorepo-with-pnpm-and-turborepo.md)              |
| Design system      | `@spitzweb/design-system`: atoms, molecules, organisms and the tokens, as TSX source     | [0014](adr/0014-the-design-system-is-a-workspace-package.md)      |
| Hosted projects    | A slice in `apps/site`, moved out to `<name>.spitzweb.dev` when a trigger hits           | [0002](adr/0002-hosted-projects-graduate-to-subdomain-apps.md)    |
| Framework          | Next.js (App Router), React 19 with the React Compiler                                   | [0003](adr/0003-nextjs-over-astro.md)                             |
| Rendering          | Cache Components: a static shell with dynamic holes in `<Suspense>`                      | [0011](adr/0011-cache-components-for-rendering.md)                |
| Long-form content  | MDX in the repo                                                                          | [0004](adr/0004-neon-postgres-with-drizzle.md)                    |
| Drafts             | MDX Drafts stay in a git-ignored folder; the public repo holds none                      | [0013](adr/0013-the-public-repo-holds-no-drafts.md)               |
| Data               | Postgres on Neon via Drizzle; PGlite in tests                                            | [0004](adr/0004-neon-postgres-with-drizzle.md)                    |
| Migrations         | Applied in the Vercel build; expand/contract                                             | [0009](adr/0009-migrations-run-in-the-vercel-build.md)            |
| Preview databases  | A Neon branch per PR, made by GitHub Actions before the preview builds                   | [0017](adr/0017-preview-branches-are-created-before-the-build.md) |
| Auth               | Better Auth, GitHub, admin-only                                                          | [0005](adr/0005-admin-only-github-sign-in-with-better-auth.md)    |
| Hosting            | Vercel Hobby, kept portable                                                              | [0006](adr/0006-vercel-hosting-kept-portable.md)                  |
| Monitoring         | Sentry, security headers, report-only CSP, uptime monitor                                | [0007](adr/0007-production-monitoring-baseline.md)                |
| Analytics          | Vercel Analytics, cookieless                                                             | [0008](adr/0008-vercel-analytics-without-cookies.md)              |
| Field Web Vitals   | Vercel Speed Insights                                                                    | [0012](adr/0012-vercel-speed-insights-for-field-web-vitals.md)    |
| UI                 | Two registers on one token system (`DESIGN.md`); shadcn/ui on Base UI in the Admin panel | [0010](adr/0010-two-ui-registers-one-token-system.md)             |
| Forms              | Base UI `Form` and `Field`, posting to a Server Action through `useActionState`          | [0015](adr/0015-forms-on-base-ui-form-with-server-actions.md)     |
| Styling            | Tailwind v4, tokens in `packages/design-system/src/styles/tokens.css`                    |                                                                   |
| Design-system lint | `@shadcn/lint`: a caller sets a component's layout, never its look                       | [0016](adr/0016-shadcn-lint-enforces-the-design-system.md)        |
| Validation         | zod at every boundary                                                                    |                                                                   |
| Tests              | Vitest beside the code; Playwright + axe in `apps/site/e2e/`                             |                                                                   |
| Tooling            | `docs/tooling.md`                                                                        |                                                                   |

## Workspace

```
apps/
  site/            the site at spitzweb.dev (Next.js)
    content/       MDX: Articles and Project write-ups, public once committed
    drafts/        git-ignored: MDX Drafts, which the public repo never holds (ADR 0013)
    drizzle/       generated migrations, applied by the Vercel build (ADR 0009)
    src/           code, laid out below
    e2e/           Playwright specs, one list of public routes, and fixture content/ in every publication state
packages/
  design-system/   @spitzweb/design-system: the UI primitives and the tokens, compiled by the app (ADR 0014)
    components.json  shadcn CLI config; aliases.ui → src/atoms
    lint-policy.js   how a caller may style a component, read by every ESLint config (ADR 0016)
    src/atoms/       every primitive: shadcn-derived, or a direct Base UI wrapper
    src/molecules/   compositions of atoms (organisms/ arrives with its first file)
    src/lib/cn.ts    shadcn's cn: clsx + tailwind-merge, taught the theme's type sizes
    src/styles/      tokens.css: the theme, which imports Tailwind
  lint-config/     @spitzweb/lint-config: the shared ESLint layers and Stylelint config
docs/              ADRs, conventions, tooling, setup, this file
```

## Code layout

```
apps/site/src/
├── app/                   routes only: they read params and compose slices
├── entry-types/<name>/    one slice per Entry type: projects, articles, updates
├── features/<name>/       one slice per Feature: activity
├── admin/                 the Admin panel slice: shell, settings
├── hosted-projects/<name>/ one slice per Hosted project
├── domain/                facts several slices read: Entry, Topic, publication rules
├── components/            shared Read and creative UI with no domain meaning
├── hooks/                 shared hooks with no domain meaning
└── lib/                   shared plumbing: db client, env, auth, MDX loading
```

MDX reaches the code in one place: `lib/content-glob.ts` lets the bundler find every file in `content/` at build time, and `lib/mdx-files.ts` hands an Entry type its collection unparsed. The Entry type parses each file with its own schema through `lib/parse-mdx-file.ts`, which names the file and every bad field when the build fails. No page reads the filesystem at request time. `src/mdx-components.tsx` sits outside the layers because `@next/mdx` requires it there; it stays empty, and each Entry type styles its own MDX.

The database reaches the code in one place too. `lib/db.ts` builds the Drizzle client on Neon's HTTP driver: each query is one request, so there is no pool to keep alive between serverless invocations. `lib/auth.ts` builds Better Auth on that client, and its tables live in `lib/auth-schema.ts`. Both are built per call from the env accessor, never at module top level, so the build needs no database. drizzle-kit finds every slice's `schema.ts` and generates migrations into `drizzle/`; tests apply the same migrations to PGlite (`lib/test-auth.ts`).

The Admin panel builds from `@spitzweb/design-system` and never imports Base UI. A slice imports each design-system file by its path (`@spitzweb/design-system/atoms/field`) and passes it plain values; the package holds no domain meaning and imports nothing from the app.

Inside a slice, files sit in folders named for what they are (`components/`, `server/`), and the slice's tables are in its own `schema.ts`. Lint enforces who may import whom ([`docs/tooling.md`](tooling.md), Import direction):

- **Routes** may import every layer. They are where slices meet.
- **A slice** imports its own files, the domain and shared code. It never imports another slice, not even a type.
- **A Hosted project** imports shared code only, never the domain. It knows nothing about Entries, so moving it out (ADR 0002) is a copy, not a rewrite.
- **The domain** imports only itself and `lib`. **Shared code** never imports the domain.

### How the slices meet

- **Related entries.** An Entry names others by path in its frontmatter (`related: [/articles/<slug>]`), and the link shows on both. An Entry's route loads every Entry type and passes them to `relatedEntries` in `domain/`, which resolves both directions, fails the build on a path that names nothing, and leaves out Drafts and Unlisted Entries.
- **Lists that span Entry types** (the home page, Activity, the sitemap, feeds). Each Entry type slice exposes a loader that returns domain Entries from its own source. The route calls the loaders it needs and passes the merged, plain values to the slice that renders them. Ordering, Featured and visibility rules live in `domain/`, so every list applies them the same way.
- **The Admin panel** owns its shell and the Hosted project switches. The admin-session check, `requireAdminSession`, is shared plumbing in `lib/admin-session.ts`, because every slice with admin parts calls it in its own Server Actions and reads. A slice that Nadav edits from the Admin panel ships its own admin parts: the Updates slice owns the form, the list, the edit page's body and the Server Actions that post, edit and delete an Update. The admin routes compose the shell with those parts.
- **Activity** owns Events. Updates already are Entries, so Activity lists them through the Updates loader. An Event comes from GitHub or from a publish (an Entry published, a Project's Status changing) and is recorded by the Activity slice itself.

## Where state lives

| State                                                                                           | Home                                                           | Owner                | Why                                                                            |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| Article and Project write-up text                                                               | MDX in `apps/site/content/`                                    | Nadav, by commit     | Long-form writing belongs in version control (ADR 0004)                        |
| An MDX Entry's facts: title, date, Topics, Featured, publication state, Status, Related entries | MDX frontmatter                                                | Nadav, by commit     | One file per Entry; zod parses it at load                                      |
| Updates                                                                                         | Postgres, the Updates slice's table                            | Admin panel          | Posted from a phone in minutes (PRODUCT.md, Cheap to publish)                  |
| Events                                                                                          | Postgres, the Activity slice's table                           | Activity             | Recorded once, listed many times                                               |
| The Topic set                                                                                   | `domain/`, in code                                             | Nadav, by commit     | Small and curated; changing it is a deliberate deploy                          |
| Admin session                                                                                   | Better Auth tables in Postgres, plus its cookie                | `lib/` auth          | ADR 0005                                                                       |
| Whether a Hosted project is switched on                                                         | Postgres, the Admin panel's table                              | Admin panel          | Switched off without a deploy (PRODUCT.md, Operating context)                  |
| A Hosted project's own data                                                                     | Postgres, in that project's own schema                         | That Hosted project  | Moves out with it (ADR 0002, 0004)                                             |
| Rendered pages and loader results                                                               | Next.js cache, tagged per slice; a mutation calls `updateTag`  | The slice that loads | A static shell with dynamic holes (ADR 0011)                                   |
| List filters (Topic, Entry type)                                                                | URL search params                                              | The route            | Shareable and linkable                                                         |
| The light or dark theme                                                                         | `localStorage`, applied by an inline script before first paint | `components/`        | Reading a cookie would make every page dynamic (ADR 0011); dark is the default |
| Selection in a list (J/K)                                                                       | Client component state                                         | The component        | Ephemeral; nothing to share                                                    |

Data that lives in Postgres reaches a public page at request time, because the build has no database. The home page's latest Update is a dynamic hole that reads a `"use cache: remote"` loader tagged `updates`: the remote cache is shared by every serverless instance (the default in-memory one isn't), so Neon is queried once after each change rather than on every visit, and posting, editing or deleting an Update calls `updateTag("updates")`. A failed read throws inside the cache and is caught outside it, so a failure is never cached.

Undecided until their tickets: where a Hosted project's per-visitor rate limits are counted, and how GitHub activity becomes Events (webhook or polling).

## Boundaries where zod parses

Data from outside the type system is parsed where it enters. Inside, types are trusted.

| Boundary                                      | Where it is parsed                      |
| --------------------------------------------- | --------------------------------------- |
| Environment variables                         | One accessor in `lib/`, read where used |
| MDX frontmatter                               | The Entry type's loader, at load        |
| Route params and search params                | The route, before it calls a slice      |
| Server Action input (`FormData`)              | The Server Action, first thing          |
| Route Handler input (webhooks, OAuth, feeds)  | The Route Handler, first thing          |
| Third-party API responses (GitHub, paid APIs) | The adapter that calls the API          |
| Input to a Hosted project                     | The Hosted project's own entry points   |

Database rows are not on this list: Drizzle types them from the slice's `schema.ts`.
