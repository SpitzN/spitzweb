# Host on Vercel's free tier, keep the code portable

Every app in `apps/*` deploys as its own Vercel project on the Hobby plan. Pushes deploy automatically, and every branch gets a preview URL. Vercel is the least-effort home for Next.js. The lock-in cost is kept low by using no Vercel-only APIs in app code, with Vercel Analytics as the one deliberate exception (ADR 0008).

Domains are registered at Cloudflare. `spitzweb.dev` is primary; `spitzweb.com` and `www` hosts redirect to it. Cloudflare DNS records stay DNS-only so that Vercel terminates TLS.

## Considered Options

- **Cloudflare Workers via OpenNext**: cheaper at scale and Nadav already uses Cloudflare, but the Next.js adapter lags behind new Next.js releases.
- **Self-hosting (a VPS or Coolify)**: full control, but the patching, TLS and uptime work fall on Nadav.
- **Netlify**: no clear advantage over Vercel for Next.js.

## Consequences

- Hobby is for non-commercial use. A Hosted project that earns money, or growth past the free limits, means moving to Pro or to another host.
- With Neon's Vercel integration, each preview deploy gets its own database branch.
- Moving to another host means replacing Analytics and the deploy setup, not app code.
