import * as Sentry from "@sentry/nextjs";
import { sentryDataCollection } from "@/lib/sentry-data-collection";

Sentry.init({
  // Read raw rather than through lib/env.ts, which would put zod in every page's bundle.
  // next.config.ts parses the same value at build time, so a malformed DSN fails the build.
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  dataCollection: sentryDataCollection,
  // Events go through the /monitoring tunnel. Previews sit behind Vercel's login, and the tunnel
  // request needs its cookie to get through.
  transportOptions: { fetchOptions: { credentials: "same-origin" } },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
