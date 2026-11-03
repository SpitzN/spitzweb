import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every public route is listed here, so each one gets the smoke and accessibility checks.
const PUBLIC_ROUTES = ["/"];

for (const route of PUBLIC_ROUTES) {
  test(`${route} responds and meets WCAG 2.2 AA`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(violations).toEqual([]);
  });
}
