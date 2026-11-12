# Migrations run in the Vercel build, with expand/contract for destructive changes

Each Vercel build applies pending Drizzle migrations to its own database before `next build` runs. A preview build migrates its Neon branch and a production build migrates production. Nobody migrates production by hand, and no agent holds the production database URL; it lives only in Vercel.

## Considered Options

- **A GitHub Actions job on merge**: production's URL would also have to be a GitHub secret, and nothing guarantees the migration runs before Vercel's deploy goes live.
- **Nadav runs it by hand**: easy to forget, and a deploy can go live against a schema it doesn't expect.

## Consequences

- A migration can succeed and the build after it still fail. The previous deploy then keeps serving against the new schema, so every migration has to work with the code that is already running. Destructive changes go expand/contract over two PRs (`.claude/rules/server.md`).
- CI never migrates. It builds with a fake `DATABASE_URL` and tests against PGlite.
- A preview's Neon branch has to exist before its build starts. GitHub Actions creates it and then deploys the preview (ADR 0017); the migration still runs in the Vercel build.
