# Postgres on Neon with Drizzle; long-form content stays in MDX

Articles and Project write-ups are MDX files in the repo, so they are versioned, reviewable and need no CMS. Everything posted or changed at runtime lives in Postgres: Updates, Events, the admin session, Hosted-project switches and rate limits. Postgres runs on Neon's free tier, and code reaches it through Drizzle. v1's MongoDB and Prisma are gone.

## Considered Options

- **MongoDB (v1)**: dropped. The data is relational, and the Hosted projects that need data are better served by SQL schemas.
- **Prisma**: a heavier client and a generate step. Drizzle stays close to SQL, is light on serverless, and also runs against PGlite.
- **Supabase**: bundles auth and storage this site doesn't need. Neon's database branching gives every preview deploy its own database.
- **SQLite / Turso**: cheap and fast, but it leaves Postgres features and per-project schemas behind.

## Consequences

- Each Hosted project that needs data owns its own Postgres schema, so it can move out with its data (ADR 0002).
- Tests run against in-memory PGlite with the real migrations applied, without needing a network or a Neon account.
- Neon's free tier suspends the database when idle, so the first query after a pause is slow. Pages that read data have to survive a slow or failing database (`docs/conventions.md`, Fail soft).
