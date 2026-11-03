# Admin-only GitHub sign-in with Better Auth

Visitors never sign in, and Nadav is the only account. Sign-in is GitHub OAuth through Better Auth, stored in our own Postgres. One allowlisted GitHub account may sign in; any other account is rejected before a user record is created.

## Considered Options

- **Auth.js**: works, but development has slowed, and its maintainers now point new projects at Better Auth.
- **Clerk or another hosted auth service**: a vendor and a hosted UI, for a single user.
- **HTTP basic auth or a shared secret**: the simplest option, but it doesn't work well on a phone and can't grow into per-app login later.

## Consequences

- The allowlist matches the GitHub account's numeric id, not its email, because an email can be private or changed.
- Every Server Action, Route Handler and Admin panel layout checks the admin session itself. `proxy.ts` (Next.js 16's middleware) may redirect early, but it never stands in for that check.
- Email/password sign-in is disabled.
- Sharing the login with subdomain apps is decided per app (ADR 0002).
