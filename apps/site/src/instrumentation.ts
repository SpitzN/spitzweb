import * as Sentry from "@sentry/nextjs";
import { readPublicEnv } from "@/lib/env";

// With no DSN (local, CI) Sentry stays off and sends nothing. sendDefaultPii stays at its default,
// false, so no visitor IP addresses, cookies or request bodies are sent (ADR 0007).
export function register() {
  Sentry.init({ dsn: readPublicEnv().NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 });
}

export const onRequestError = Sentry.captureRequestError;
