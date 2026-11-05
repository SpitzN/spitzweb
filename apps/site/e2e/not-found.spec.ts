import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const UNKNOWN_URL = "/no-such-page";

/** The body's own colours, next to the theme's colours on <html>. */
async function bodyColours(page: Page) {
  return page.evaluate(() => {
    const html = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    return {
      bodyBackground: body.backgroundColor,
      bodyText: body.color,
      themeText: html.color,
    };
  });
}

test("an unknown URL returns 404 with the site's not-found page, meeting WCAG 2.2 AA", async ({
  page,
}) => {
  const response = await page.goto(UNKNOWN_URL);

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found." })).toBeVisible();
  await expect(page).toHaveTitle("Page not found · spitzweb");

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(violations).toEqual([]);
});

// Next.js's built-in 404 brought its own <style> that painted the body over the theme, and it
// stayed in the document after navigating away (docs/tooling.md, Traps). The body must stay
// transparent, so the theme on <html> shows through.
test("the theme survives a 404 and the navigation home", async ({ page }) => {
  await page.goto(UNKNOWN_URL);
  const onNotFound = await bodyColours(page);
  expect(onNotFound.bodyBackground).toBe("rgba(0, 0, 0, 0)");
  expect(onNotFound.bodyText).toBe(onNotFound.themeText);

  await page.getByRole("link", { name: "Go to the home page" }).click();
  await expect(page).toHaveURL("/");
  const onHome = await bodyColours(page);
  expect(onHome.bodyBackground).toBe("rgba(0, 0, 0, 0)");
  expect(onHome.bodyText).toBe(onHome.themeText);
});
