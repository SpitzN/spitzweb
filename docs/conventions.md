# Conventions

How code in this repo is written. Every rule here applies to every app in `apps/*` and every package in `packages/*`. Tooling enforces most of them. The config files are the source of truth for exact settings, so this file only records the rules and the reasons behind them.

## TypeScript

- `strict` and `noUncheckedIndexedAccess` are on everywhere. An indexed read is `T | undefined` until you prove otherwise.
- Use named exports. Default exports appear only where Next.js or a tool requires them: `page`, `layout`, `loading`, `error`, `not-found`, `route`, `opengraph-image` and config files.
- File and folder names are kebab-case (`activity-list.tsx`), including components. Next.js's reserved file names are already kebab-case.

## Boundaries and failures

- **Parse at every boundary with zod.** That means form data, search params, route params, request bodies, environment variables, MDX frontmatter, third-party API responses and JSON columns. Code past the boundary trusts its types.
- **Expected failures are values.** A function that can fail for a known reason, such as invalid input, a missing Entry, a rate limit or an API being down, returns `{ ok: true, value } | { ok: false, error }`. Throw only for bugs and broken invariants.
- **Fail soft and say so.** When the database or a third-party API is down, only the section that needs it degrades, and it shows an honest "unavailable" message. The page still returns 200 (PRODUCT.md: Honest about state).
- **Env is read lazily.** Read env through one zod-validated accessor, called at use, never at module top level. Builds and CI run with fake values and no real secrets.
- **Inject the database.** Data-access functions take the database as their first parameter, so tests can pass an in-memory PGlite instance.

## Server code

- **Server Actions** handle mutations from the site's own UI.
- **Route Handlers** serve external callers: OAuth callbacks, webhooks, feeds and anything with a public URL contract.
- **Every privileged entry point checks the admin session itself.** That covers every Server Action, Route Handler and Admin panel layout. A proxy may redirect early, but it is never the only check (ADR 0005).

## Security invariants

Each of these is pinned by a test once the code it governs exists.

- **Draft** Entries are reachable only by Nadav. **Unlisted** Entries are reachable at their URL but appear in no list, Activity, search, sitemap or feed.
- Any GitHub account other than Nadav's is rejected before a user record is created.
- Text entered through the Admin panel or by visitors renders as text, never as HTML. A user-supplied link is accepted only with the `https:` protocol.
- A Hosted project that calls a paid API needs three things:
  - A per-visitor rate limit, incremented atomically in a single upsert statement so concurrent requests can't all slip under the limit.
  - A kill switch in the Admin panel.
  - A spend cap set in the provider's dashboard.

## Module boundaries

- Boundaries are enforced by workspace dependencies (ADR 0001) and by lint rules.
- The lint rules are written when the code they protect exists. Modules and folders get their names then, and not in advance.
- Hosted projects never import from each other, which keeps each one ready to move out (ADR 0002).

## Styling and accessibility

- Use Tailwind v4.
- Use logical CSS properties only (`ms-*`/`me-*`, `ps-*`/`pe-*`, `start`/`end`, `inline`/`block`), so RTL stays cheap to add.
- Every public page meets WCAG 2.2 AA. Playwright runs axe on each public route.
- Motion respects `prefers-reduced-motion`.
- The Admin panel is usable at phone width.
- Impeccable owns design decisions. `DESIGN.md`, once it exists, is the source of truth for tokens and components.

## Testing

- Use Vitest for unit and integration tests and Playwright for end-to-end and accessibility tests.
- Test behaviour through public interfaces, and write the test first (`tdd`).
- Database tests run against PGlite with the real migrations applied.

## Workflow

- **pnpm** only. Turborepo runs tasks across the workspace.
- **Trunk-based:** short-lived branches off `main`, merged by squash-merged PR. The PR title becomes the commit on `main`.
- **Conventional Commits** for commit messages and PR titles, enforced by commitlint.
- **lefthook** runs lint and format on staged files before each commit, and commitlint on the message.
- **Renovate** opens grouped dependency PRs once a week.
