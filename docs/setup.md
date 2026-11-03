# Setup

Steps only Nadav can do: creating accounts, handling secrets, and touching production. Agents walk Nadav through them and wait for confirmation at each step. Variable names live in `.env.example`, while the values live in Vercel and in the local `.env.local`, never in chat or in git.

## Accounts and services

1. **Neon**: create the project `spitzweb` in the region closest to the Vercel region, then copy the pooled connection string.
2. **GitHub OAuth apps**: create one for production (callback `https://spitzweb.dev/api/auth/callback/github`) and one for local development (callback `http://localhost:3000/api/auth/callback/github`). The dev credentials go only in `.env.local`.
3. **Vercel**: import `SpitzN/spitzweb` on the Hobby plan, then:
   - Set the root directory to `apps/site`.
   - Install the Neon integration, so that every preview gets its own database branch.
   - Set the production environment variables.
   - Turn on Vercel Analytics.
4. **Sentry**: create a project for `apps/site` and add its DSN to the Vercel environment.
5. **Uptime monitor**: add a check on `https://spitzweb.dev` that alerts Nadav.
6. **Paid APIs**: set a spend cap in each provider's dashboard before its key reaches Vercel.

## Domains

Buy `spitzweb.dev` and `spitzweb.com` on Cloudflare Registrar, plus `nadavspitzer.com` if you want it.

In Vercel, add `spitzweb.dev` as the primary domain. Then add `www.spitzweb.dev`, `spitzweb.com` and `www.spitzweb.com`, setting each to 308-redirect to `spitzweb.dev`.

In Cloudflare DNS, add the records that Vercel shows and set them to **DNS only** (grey cloud).

## Production database

Nadav runs migrations against production from Nadav's own shell, with the production `DATABASE_URL` exported in that shell. Agents never run them (AGENTS.md).

## First-deploy check

- `https://spitzweb.dev` loads, and `http://spitzweb.com` 308-redirects to it.
- `robots.txt`, `sitemap.xml` and the feeds are correct, and contain no Draft or Unlisted Entries.
- Signing in to the Admin panel works on a phone. A different GitHub account is rejected.
- An Update posted from the Admin panel appears in Activity.
- Analytics shows the visit, Sentry receives a test error, and the uptime monitor reports the site as up.
- Required CI status checks are added to the `protect-main` ruleset.
