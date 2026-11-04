import { POST as forwardEventToSentry } from "@sentry/nextjs/tunnel";

// Browser events reach this handler through the /monitoring tunnel (withSentryConfig rewrites it
// here when this file exists). It forwards the event alone, without the visitor's request headers,
// so Sentry never sees the visitor's IP address and can't derive a location from it (ADR 0007).
// It is public on purpose, so there is no admin session check, and it accepts envelopes only for
// the server SDK's own DSN.
export const POST = forwardEventToSentry;
