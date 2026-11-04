import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Every public route is listed here, so each one gets the smoke and accessibility checks in both
// themes. Article routes point at fixtures in e2e/content.
const PUBLIC_ROUTES = ["/", "/articles", "/articles/published-featured", "/articles/archived"];
const THEMES = ["dark", "light"] as const;

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
