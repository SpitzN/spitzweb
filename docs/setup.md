# Setup

Steps only Nadav can do: creating accounts, handling secrets and choosing settings in third-party dashboards. Agents walk Nadav through each step and wait for confirmation before moving on. Variable names live in `.env.example`. Values live in Vercel, in GitHub secrets and in the local `.env.local`; they never go in chat or in git.

## Accounts and services

1. **Neon**: create the project `spitzweb` in the region closest to the Vercel function region (`iad1`, so AWS US East 1). Add a `development` branch and put its pooled and direct connection strings in `apps/site/.env.local`. The `production` branch's URL never leaves Vercel (ADR 0009).
2. **GitHub OAuth apps**: create two.
   - Production, with callback `https://spitzweb.dev/api/auth/callback/github`.
   - Local development, with callback `http://localhost:3000/api/auth/callback/github`. Its credentials go in `.env.local` only.
3. **Vercel**: import `SpitzN/spitzweb` on the Hobby plan, with root directory `apps/site`. Then:
   - install the Neon integration with **Link Existing Neon Account**, so every preview build gets its own database branch and production uses `production`. Leave **Create a branch for your development environment** off, and set Vercel's Development `DATABASE_URL` and `DATABASE_URL_UNPOOLED` from the `development` branch;
   - the integration saves Production's `DATABASE_URL` and `DATABASE_URL_UNPOOLED` as readable Config. Replace each with a Secret, which nobody can read back, so no agent can pull the production URL (ADR 0009). Copy the `production` branch's string from Neon, using the pooled one for `DATABASE_URL` and the direct one for `DATABASE_URL_UNPOOLED`, then run `vercel env rm <NAME> --environment production -y && pbpaste | vercel env add <NAME> --environment production --sensitive --yes` from `apps/site`. Piping from the clipboard keeps the value out of chat and shell history;
   - set the production environment variables. For Admin panel sign-in (ADR 0005), add as Secrets: `BETTER_AUTH_SECRET` (generate it with `openssl rand -base64 32`), `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from the production OAuth app; and as Config: `BETTER_AUTH_URL=https://spitzweb.dev`. Locally, `.env.local` holds the same four, with the local OAuth app's credentials and `BETTER_AUTH_URL=http://localhost:3000`. Preview deployments get none of them: the OAuth apps call back only to production and localhost, so a preview can't sign in. Add them before the deploy that first needs them: a deploy reads env when it builds, so a variable added afterwards needs a redeploy (a missing `BETTER_AUTH_SECRET` served a 500 until one);
   - the build command migrates before building (ADR 0009) and the ignored build step is `turbo-ignore`; both are set in `apps/site/vercel.json`, not in the dashboard;
   - turn on Vercel Analytics and Speed Insights.
4. **Turborepo remote cache**: run `pnpm exec turbo login` and `pnpm exec turbo link`. Then in GitHub, add `TURBO_TOKEN` as an Actions secret and `TURBO_TEAM` as an Actions variable.
5. **Renovate**: install the Renovate GitHub app on `SpitzN/spitzweb`. It reads `renovate.json`.
6. **Sentry**: create a Next.js project for `apps/site`. Add its DSN to Vercel as `NEXT_PUBLIC_SENTRY_DSN` (Config; it is public by design) and an organization auth token as `SENTRY_AUTH_TOKEN` (Secret), both for Production and Preview. In the organization's **Security & Privacy** settings, turn on **Prevent Storing of IP Addresses** (ADR 0007).
7. **Uptime monitor**: in Sentry, add an uptime monitor on `https://spitzweb.dev` and connect it to the high-priority issue alert, so an outage emails Nadav.
8. **Paid APIs**: set a spend cap in each provider's dashboard before its key goes into Vercel.

## Domains

1. Buy `spitzweb.dev` on Vercel (ADR 0006). Vercel serves its DNS, so there are no records to add.
2. In the Vercel project, add `spitzweb.dev` as the primary domain, and add `www.spitzweb.dev` 308-redirecting to it.

## First-deploy check

- `https://spitzweb.dev` loads, and `https://www.spitzweb.dev` 308-redirects to it.
- `robots.txt`, `sitemap.xml` and the feeds are correct and leave out Draft and Unlisted Entries.
- Admin panel sign-in works on a phone, and a different GitHub account is rejected.
- An Update posted from the Admin panel appears in Activity.
- Analytics shows the visit and sets no cookie, Speed Insights shows Core Web Vitals, Sentry receives a test error, and the uptime monitor reports the site as up.
- `vercel env ls --environment production` lists `DATABASE_URL` and `DATABASE_URL_UNPOOLED` as Secret.
- The `check` and `pr-title` CI checks are required in the `protect-main` ruleset.
