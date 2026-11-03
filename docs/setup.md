# Setup

Steps only Nadav can do: creating accounts, handling secrets and choosing settings in third-party dashboards. Agents walk Nadav through each step and wait for confirmation before moving on. Variable names live in `.env.example`. Values live in Vercel, in GitHub secrets and in the local `.env.local`; they never go in chat or in git.

## Accounts and services

1. **Neon**: create the project `spitzweb` in the region closest to the Vercel region, and copy the pooled connection string.
2. **GitHub OAuth apps**: create two.
   - Production, with callback `https://spitzweb.dev/api/auth/callback/github`.
   - Local development, with callback `http://localhost:3000/api/auth/callback/github`. Its credentials go in `.env.local` only.
3. **Vercel**: import `SpitzN/spitzweb` on the Hobby plan, with root directory `apps/site`. Then:
   - install the Neon integration, so every preview build gets its own database branch;
   - set the production environment variables;
   - set the build command to migrate before building (ADR 0009) and the ignored build step to `turbo-ignore`;
   - turn on Vercel Analytics.
4. **Turborepo remote cache**: run `pnpm dlx turbo login` and `pnpm dlx turbo link`. Then add `TURBO_TOKEN` and `TURBO_TEAM` as GitHub Actions secrets.
5. **Sentry**: create a project for `apps/site` and add its DSN to the Vercel environment.
6. **Uptime monitor**: add a check on `https://spitzweb.dev` that alerts Nadav.
7. **Paid APIs**: set a spend cap in each provider's dashboard before its key goes into Vercel.

## Domains

1. Buy `spitzweb.dev` and `spitzweb.com` on Cloudflare Registrar, plus `nadavspitzer.com` if you want it.
2. In Vercel, add `spitzweb.dev` as the primary domain. Add `www.spitzweb.dev`, `spitzweb.com` and `www.spitzweb.com`, each 308-redirecting to `spitzweb.dev`.
3. In Cloudflare DNS, add the records Vercel shows, set to **DNS only** (grey cloud).

## First-deploy check

- `https://spitzweb.dev` loads, and `http://spitzweb.com` 308-redirects to it.
- `robots.txt`, `sitemap.xml` and the feeds are correct and leave out Draft and Unlisted Entries.
- Admin panel sign-in works on a phone, and a different GitHub account is rejected.
- An Update posted from the Admin panel appears in Activity.
- Analytics shows the visit, Sentry receives a test error, and the uptime monitor reports the site as up.
- The CI checks are required in the `protect-main` ruleset.
