import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every public route is listed here, so each one gets the smoke and accessibility checks in both
// themes. Entry routes point at fixtures in e2e/content.
const PUBLIC_ROUTES = [
  "/",
  "/projects",
  "/projects/published-featured",
  "/projects/published-external",
  "/projects/archived",
  "/articles",
  "/articles/published-featured",
  "/articles/published-recent",
  "/articles/archived",
];
const THEMES = ["dark", "light"] as const;

// ADR 0007: these are enforced on every response. The full CSP is report-only and is checked by
// its console reports below; only frame-ancestors is enforced, because browsers ignore it in a
// report-only policy.
const ENFORCED_HEADERS = {
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  "content-security-policy": "frame-ancestors 'none'",
};

for (const route of PUBLIC_ROUTES) {
  test(`${route} sends the security headers and breaks no CSP rule`, async ({ page }) => {
    const cspReports: string[] = [];
    page.on("console", (message) => {
      if (message.text().includes("Content Security Policy")) cspReports.push(message.text());
    });

    const response = await page.goto(route);
    await page.waitForLoadState("load");
    const headers = response?.headers() ?? {};

    for (const [name, value] of Object.entries(ENFORCED_HEADERS)) {
      expect(headers[name], name).toBe(value);
    }
    expect(headers["content-security-policy-report-only"]).toContain("default-src 'self'");
    expect(cspReports).toEqual([]);
  });
}

// Every same-origin link on a public route leads somewhere: a link to a section that isn't built
// yet fails here (.claude/rules/server.md, Status codes).
for (const route of PUBLIC_ROUTES) {
  test(`${route} links only to pages that exist`, async ({ page }) => {
    await page.goto(route);
    const hrefs = await page
      .locator("a[href^='/']")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));

    const uniqueHrefs = new Set(hrefs);

    for (const href of uniqueHrefs) {
      const response = await page.request.get(href);
      expect(response.status(), href).toBe(200);
    }
  });
}

// ADR 0008 and ADR 0012: the root layout loads Analytics and Speed Insights on every page, and
// neither sets a cookie. Off Vercel their scripts 404, so this checks they are requested, not
// what they send; the deployed site is checked by hand (docs/setup.md, First-deploy check).
test("the analytics scripts load and the site sets no cookie", async ({ page }) => {
  const analyticsScript = page.waitForRequest("**/_vercel/insights/script.js");
  const speedInsightsScript = page.waitForRequest("**/_vercel/speed-insights/script.js");

  await page.goto("/");
  await Promise.all([analyticsScript, speedInsightsScript]);

  expect(await page.context().cookies()).toEqual([]);
});

for (const route of PUBLIC_ROUTES) {
  for (const theme of THEMES) {
    test(`${route} responds and meets WCAG 2.2 AA in the ${theme} theme`, async ({ page }) => {
      // Colours change through a transition; with reduced motion the theme switch lands at once,
      // so axe never measures a colour halfway between the two themes.
      await page.emulateMedia({ reducedMotion: "reduce" });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");

      // Dark is the default; light is switched on <html> (DESIGN.md).
      await page.evaluate((name) => {
        document.documentElement.dataset.theme = name;
      }, theme);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(violations).toEqual([]);
    });
  }
}
