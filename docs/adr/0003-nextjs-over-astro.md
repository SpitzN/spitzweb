# Next.js over Astro

Most of spitzweb is content, which favours Astro. But Hosted projects range from small demos to full apps with server code, data and the admin login, and the Admin panel itself is a small app. Next.js (App Router) covers both content and apps in one framework, and React is Nadav's daily stack, so every app in `apps/*` starts as Next.js unless it has a reason not to.

## Considered Options

- **Astro**: ships less JavaScript and is a better fit for pure content, but app-like Hosted projects would end up as islands or as separate apps much sooner.
- **Astro for the site, Next.js for apps**: the best tool for each, but it means two frameworks to maintain from day one for one person.

## Consequences

- Content pages have to be kept static on purpose (static rendering, no client components unless they're needed); Next.js won't do it by default the way Astro would.
- A Hosted project that moves out (ADR 0002) may pick a different framework.
