import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

/** Both themes; dark is the default and light is switched on <html> (DESIGN.md). */
export const THEMES = ["dark", "light"] as const;

/**
 * Reloads the page in a theme, as a returning visitor sees it: the choice is stored as the theme
 * switch stores it, and the page's inline script applies it (lib/theme.ts).
 */
export async function switchTheme(page: Page, theme: (typeof THEMES)[number]) {
  await page.evaluate((name) => {
    localStorage.setItem("theme", name);
  }, theme);
  await page.reload();
  await expect(
    page.getByRole("button", { name: theme, exact: false, pressed: true }),
  ).toBeVisible();
}

/** What axe finds on the page as it is now against WCAG 2.2 AA (docs/conventions.md). */
export async function wcagViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return violations;
}
