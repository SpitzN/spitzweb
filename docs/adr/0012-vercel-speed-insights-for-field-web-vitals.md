# Vercel Speed Insights for real-user Core Web Vitals

Public pages must meet Core Web Vitals' "good" thresholds on mobile (`docs/conventions.md`), and only measurements from real visits show whether they do. Vercel Speed Insights reports LCP, INP and CLS from real visits, per route and device, against those thresholds, with nothing to build or run. It is the second Vercel-only API allowed in app code, next to Vercel Analytics (ADR 0006, ADR 0008).

## Considered Options

- **Sentry's Web Vitals**: already collected by the tracing set up in ADR 0007, but only for the 10% of visits that are sampled, and Sentry is for errors, not for watching thresholds.
- **The `web-vitals` library with our own endpoint**: portable, but the storage, aggregation and dashboard would all be ours to build and keep up.
- **Lab tests only (Lighthouse in CI)**: repeatable, but a lab run on a fast machine is not a visitor's phone, and it can't measure INP.

## Consequences

- Speed Insights sits in the same single component as Analytics (ADR 0008), so leaving Vercel still means replacing one file.
- Like Analytics, it must set no cookie and send nothing about individual visitors. The Analytics ticket checks this for both.
