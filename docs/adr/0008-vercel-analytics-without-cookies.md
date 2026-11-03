# Vercel Analytics, cookieless, with no consent banner

The site needs page views and referrers, and nothing about individual visitors. Vercel Analytics collects that without cookies, so there is no consent banner. It is the one Vercel-only API allowed in app code (ADR 0006).

## Considered Options

- **PostHog**: funnels, events and session replay are more than the site needs now, and they bring cookies and a banner. It can be revisited once a Hosted project needs product analytics.
- **Plausible, Umami or another self-hosted tool**: portable, but costs money or upkeep for the same numbers.

## Consequences

- Analytics is wrapped in a single component, so swapping providers touches one file.
