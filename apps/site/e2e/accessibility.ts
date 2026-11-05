import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";

/** Both themes; dark is the default and light is switched on <html> (DESIGN.md). */
export const THEMES = ["dark", "light"] as const;

/** Switches the page to a theme, as the theme setting does. */
export async function switchTheme(page: Page, theme: (typeof THEMES)[number]) {
  await page.evaluate((name) => {
    document.documentElement.dataset.theme = name;
  }, theme);
}

/** What axe finds on the page as it is now against WCAG 2.2 AA (docs/conventions.md). */
export async function wcagViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return violations;
}
