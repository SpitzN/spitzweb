# Host on Vercel's free tier, keep the code portable

Every app in `apps/*` deploys as its own Vercel project on the Hobby plan. Pushes deploy automatically, and every branch gets a preview URL. Vercel is the least-effort home for Next.js. The lock-in cost is kept low by using no Vercel-only APIs in app code, with two deliberate exceptions behind one component: Vercel Analytics (ADR 0008) and Speed Insights (ADR 0012).

Domains are registered at Vercel, which also serves their DNS, so there are no records to copy or keep in sync. `spitzweb.dev` is the only domain: `www.spitzweb.dev` redirects to it, and moved-out apps live on its subdomains (ADR 0002).

## Considered Options

- **Cloudflare Workers via OpenNext**: cheaper at scale and Nadav already uses Cloudflare, but the Next.js adapter lags behind new Next.js releases.
- **Self-hosting (a VPS or Coolify)**: full control, but the patching, TLS and uptime work fall on Nadav.
- **Netlify**: no clear advantage over Vercel for Next.js.
- **Registering the domains at Cloudflare**: at-cost pricing and a registrar separate from the host, but every Vercel domain needs its DNS records copied by hand. A domain moves to another registrar in days, so keeping it at Vercel costs little portability.

## Consequences

- Hobby is for non-commercial use. A Hosted project that earns money, or growth past the free limits, means moving to Pro or to another host.
- With Neon's Vercel integration, each preview deploy gets its own database branch.
- Moving to another host means replacing Analytics, Speed Insights and the deploy setup, not app code, and transferring the domains out of Vercel.
