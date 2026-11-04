import type { init } from "@sentry/nextjs";

/**
 * What Sentry may collect, shared by the server and the browser (ADR 0007). The SDK collects
 * every category by default; this keeps visitors' personal data out: no user fields (so no IP
 * address), cookies, bodies, query strings or local variables, and of the headers only the user
 * agent, which names the browser.
 */
export const sentryDataCollection = {
  userInfo: false,
  cookies: false,
  httpHeaders: { allow: ["user-agent"] },
  httpBodies: [],
  urlQueryParams: false,
  stackFrameVariables: false,
} satisfies NonNullable<NonNullable<Parameters<typeof init>[0]>["dataCollection"]>;
