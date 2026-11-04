import { expect, test } from "@playwright/test";

// Runs against the fixtures in e2e/content/articles, one per publication state.

test("the Articles list shows Published Articles, Featured first, then newest first", async ({
  page,
}) => {
  await page.goto("/articles");

  await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
    "Fixture — a Featured Article that tests every element of the Read register",
    "Fixture — the most recent Published Article",
    "Fixture — an older Published Article",
  ]);
});

test("each listed Article shows its date and Topics", async ({ page }) => {
  await page.goto("/articles");

  const recent = page.getByRole("listitem").filter({ hasText: "the most recent Published" });
  await expect(recent.locator("time")).toHaveAttribute("datetime", "2026-05-14");
  await expect(recent).toContainText("14 May 2026");
  await expect(recent).toContainText("AI agents");
});

test("an Article renders its MDX at its URL", async ({ page }) => {
  await page.goto("/articles");
  await page.getByRole("link", { name: /a Featured Article/ }).click();

  await expect(page).toHaveURL("/articles/published-featured");
  await expect(
    page.getByRole("heading", { level: 2, name: "A second-level heading" }),
  ).toBeVisible();
  await expect(page.locator("pre code")).toContainText("listedEntries");
});

test("an Article shows its reading time, counted from its words", async ({ page }) => {
  await page.goto("/articles/published-featured");
  await expect(page.getByText("2 min read")).toBeVisible();

  await page.goto("/articles/published-older");
  await expect(page.getByText("1 min read")).toBeVisible();
});

test("a long Article lists its contents and a short one does not", async ({ page }) => {
  await page.goto("/articles/published-featured");
  const contents = page.getByRole("navigation", { name: "Contents" });
  await expect(contents.getByRole("link")).toHaveText([
    "A second-level heading",
    "Lists",
    "A third-level heading",
    "Quotes and code",
  ]);

  await page.goto("/articles/published-recent");
  await expect(page.getByRole("navigation", { name: "Contents" })).toHaveCount(0);
});

test("the list says which Article is Featured", async ({ page }) => {
  await page.goto("/articles");

  const rows = page.getByRole("main").getByRole("listitem");
  await expect(rows.first()).toContainText("Featured");
  await expect(rows.filter({ hasText: "Featured ·" })).toHaveCount(1);
});

test("an Article ends with the way onward and how to reach Nadav", async ({ page }) => {
  await page.goto("/articles/published-featured");

  const onward = page.getByRole("region", { name: "Where to go next" });
  await expect(onward.getByRole("link", { name: "All Articles" })).toHaveAttribute(
    "href",
    "/articles",
  );
  await expect(onward.getByRole("link", { name: "Nadav Spitzer on LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/nspitzer1/",
  );
});

test("a Draft Article is not reachable", async ({ page }) => {
  const response = await page.goto("/articles/draft");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("If a visitor can read this")).toHaveCount(0);
});

test("an Unlisted Article is reachable at its URL, kept out of search, and in no list", async ({
  page,
}) => {
  const response = await page.goto("/articles/unlisted");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fixture — an Unlisted Article");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/articles");
  await expect(page.getByText("an Unlisted Article")).toHaveCount(0);
});

test("an Archived Article stays reachable, says it is no longer maintained, and is in no list", async ({
  page,
}) => {
  const response = await page.goto("/articles/archived");
  expect(response?.status()).toBe(200);
  await expect(page.getByText("No longer maintained.")).toBeVisible();

  await page.goto("/articles");
  await expect(page.getByText("an Archived Article")).toHaveCount(0);
});

test("an unknown Article is a 404", async ({ page }) => {
  const response = await page.goto("/articles/no-such-article");

  expect(response?.status()).toBe(404);
});
