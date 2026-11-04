"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

// The only file that imports Vercel Analytics (ADR 0008) and Speed Insights (ADR 0012), so leaving
// Vercel replaces this file. Neither sets a cookie. Events drop the query string and fragment
// before they are sent, as Sentry's do (ADR 0007), so nothing about a visitor leaves the page.
function withoutQuery<Event extends { url: string }>(event: Event) {
  const url = new URL(event.url);
  url.search = "";
  url.hash = "";
  return { ...event, url: url.href };
}

export function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={withoutQuery} />
      <SpeedInsights beforeSend={withoutQuery} />
    </>
  );
}
