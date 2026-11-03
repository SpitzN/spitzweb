# Hosted projects live in the site app until they need isolation, then move to a subdomain app

A Hosted project starts as a self-contained folder inside `apps/site`. It moves to its own app in `apps/<name>` only when it needs a different framework or runtime, brings heavy dependencies or its own release rhythm, needs data, auth or permissions beyond the shared ones (or handles risky input), or could take the site down if it failed. A moved-out app is served at `<name>.spitzweb.dev`, not under a path on the main domain; its Project page stays on the main site and links to it.

## Considered Options

- **Path under the main domain via Next.js multi-zones**: one origin is better for search and for sharing the admin login, but it assumes every app is Next.js, adds routing config to the site, and gives no browser isolation. The apps that move out are exactly the ones that most need isolation, so subdomains win.

## Consequences

- Sharing the admin login across subdomain apps is opt-in per app (a cookie scoped to `.spitzweb.dev`) and decided when the first app moves out.
