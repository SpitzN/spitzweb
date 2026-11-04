import { expect, test } from "vitest";
import { cspReportUriFromDsn } from "@/lib/csp-report-uri";

test("CSP reports go to the Sentry project's security endpoint, keyed by the DSN's public key", () => {
  expect(cspReportUriFromDsn("https://publickey@o123.ingest.us.sentry.io/456")).toBe(
    "https://o123.ingest.us.sentry.io/api/456/security/?sentry_key=publickey",
  );
});
