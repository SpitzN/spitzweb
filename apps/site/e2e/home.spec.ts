import { expect, test } from "@playwright/test";

// The suite runs without a database (playwright.config.ts), so the latest Update is in its unavailable
// state; posting and showing an Update is covered against PGlite in src/entry-types/updates.

test("the home page stays up and says so when Updates are unavailable", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page.getByText("Now: Updates are unavailable right now.")).toBeVisible();
});
