import * as Sentry from "@sentry/nextjs";
import { readPublicEnv } from "@/lib/env";
import { sentryDataCollection } from "@/lib/sentry-data-collection";

// With no DSN (local, CI) Sentry stays off and sends nothing.
export function register() {
  Sentry.init({
    dsn: readPublicEnv().NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    dataCollection: sentryDataCollection,
  });
}

export const onRequestError = Sentry.captureRequestError;
