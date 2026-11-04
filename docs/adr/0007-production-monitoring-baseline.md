# Production baseline: Sentry, security headers with a report-only CSP, and an uptime monitor

spitzweb runs paid-API Hosted projects and an admin login, and Nadav is the only one watching it. Every app therefore ships from its first deploy with three things: Sentry for errors (free tier), a fixed set of security headers, and an external uptime monitor that alerts Nadav.

## Considered Options

- **Vercel's runtime logs only**: short retention and no alerting. Errors would be found by visitors first.
- **Enforcing CSP from day one**: the strictest option, but MDX embeds, analytics and Hosted projects would each break silently until the policy caught up.

## Consequences

- The Content Security Policy starts in `Report-Only` mode, with reports going to Sentry. It switches to enforcing once the reports are clean, and that switch gets its own PR.
- The CSP allows `'unsafe-inline'` scripts and styles, because Next.js inlines both. The alternative, a per-request nonce, would make every page dynamic (ADR 0011). Next.js's hash-based Subresource Integrity is the path to a stricter policy once it leaves experimental.
- Browsers ignore `frame-ancestors` in a report-only policy, so it is enforced in its own `Content-Security-Policy` header.
- The other security headers (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`) are enforced from the start.
- The Sentry DSN and the uptime monitor's alert target are set up by Nadav (`docs/setup.md`).
