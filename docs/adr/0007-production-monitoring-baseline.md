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
- Sentry receives nothing about the visitor who hit an error: no IP address, location, cookies, bodies or query strings (ADR 0008). The SDK collects all of these by default, so the policy is written out in `src/lib/sentry-data-collection.ts`; browser events go through a tunnel Route Handler that forwards the event without the visitor's headers; and the Sentry organization refuses to store IP addresses. Where visitors come from is Analytics' job, not Sentry's.
- The uptime monitor is Sentry's own, so its alerts arrive by the same email as error alerts.
- The Sentry project, its DSN, the IP setting and the uptime monitor are set up by Nadav (`docs/setup.md`).
