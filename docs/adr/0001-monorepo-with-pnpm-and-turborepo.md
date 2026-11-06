# Monorepo with pnpm workspaces and Turborepo, starting with one app

spitzweb will grow many Hosted projects, some of them full mini-apps that may need their own runtime, dependencies or deploy cadence. We first planned a single Next.js app with self-contained folders, but converting a grown single app into a monorepo later is costly, while a monorepo holding one app costs little. So the repo is a pnpm-workspaces monorepo orchestrated by Turborepo from day one: `apps/*` are deployable apps (starting with only `apps/site`), `packages/*` hold shared code and are created only when a second consumer needs them. ADR 0014 supersedes that last clause for the design system and the shared lint config.

## Considered Options

- **Single Next.js app**: simplest today, but every Hosted project shares one dependency tree and one framework, and extraction later means re-laying out the repo.
- **Nx**: strongest governance (generators, built-in module-boundary rules, affected builds), but heavier and more opinionated than a one-person site needs. Revisit if the repo grows to many apps that need generators and strict governance.
- **pnpm workspaces alone**: no task caching or orchestration; Turborepo would be added soon anyway.

## Consequences

- Each app in `apps/*` deploys as its own Vercel project.
- Workspace dependency declarations enforce most module boundaries; lint rules cover the rest.
