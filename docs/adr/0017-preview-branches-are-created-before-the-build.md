# Preview branches are created before the build

A GitHub Actions workflow (`.github/workflows/preview.yml`) owns preview deployments. On every push to a PR it creates the Neon branch `preview/<git-branch>`, or reuses it, and only then deploys the preview with the Vercel CLI, passing that branch's URLs to the build and to the deployment. Closing the PR deletes the branch. Vercel's Git deployments stay on for `main` only (`git.deploymentEnabled` in `apps/site/vercel.json`), so production deploys exactly as before.

The reason is a race. With the Neon-Managed integration, a push starts the Vercel build first; the integration then gets a webhook, creates the Neon branch and injects its URLs. On a branch's first push the build was already running `pnpm db:migrate` with an empty `DATABASE_URL_UNPOOLED`, and failed (PRs #40 and #41). Neon documents this order, and nothing in it redeploys afterwards.

## Considered Options

- **Skip the migration when a preview has no URL**: a red check becomes a preview with no database, and a broken integration looks the same as a slow one.
- **Redeploy on failure from Actions**: it needs the same Vercel token, and every new branch still starts with a failed deploy.

## Consequences

- ADR 0009 stands. The migration still runs inside the Vercel build, against the preview's own branch, and nobody migrates production from Actions.
- GitHub now holds two secrets: a Neon API key limited to this project, and a Vercel token. Neither is production's database URL, but the Neon key can do anything inside the project, which includes reading production's connection string and deleting its branches. It is as sensitive as that URL. Only a workflow on one of this repo's own branches receives it; a fork's PR doesn't.
- A preview exists only for a PR, and only when the PR affects the site (Turborepo's `--affected`, the rule `turbo-ignore` applies to `main`). A branch pushed without a PR gets no preview, and neither does a PR from a fork or from Dependabot, because their runs get no secrets.
- The Neon integration's preview branching is off. Left on, it could create its own branch and inject its URLs over the workflow's (`docs/setup.md`).
- The Vercel CLI runs at a pinned version without being a dependency: as one, it added 226 packages to the lockfile and took `pnpm audit` from 3 advisories to 44. Renovate updates the pin.
- The branch is deleted through Neon's API, not `neondatabase/delete-branch-action`: that action fails when the branch doesn't exist, which is the normal case for a PR that never affected the site.
- A preview branch copies production's data, including Better Auth's users and sessions, as the integration's branches did. Branching without data is a separate decision.
