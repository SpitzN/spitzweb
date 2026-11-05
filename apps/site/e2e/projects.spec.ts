import { expect, test } from "@playwright/test";

// Runs against the fixtures in e2e/content/projects, one per publication state, and the Article
// fixtures some of them name as Related entries.

test("the Projects list shows Published Projects, Featured first, then newest first", async ({
  page,
}) => {
  await page.goto("/projects");

  await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveText([
    "Fixture — a Featured Hosted project with a title long enough to wrap in the list",
    "Fixture — the most recent External project",
    "Fixture — an older Hosted project",
  ]);
});

test("each listed Project shows its year and Status, In progress included", async ({ page }) => {
  await page.goto("/projects");
  const rows = page.getByRole("main").getByRole("listitem");

  const featured = rows.filter({ hasText: "a Featured Hosted project" });
  await expect(featured).toContainText("Featured · 2026");
  await expect(featured).toContainText("In progress");

  const older = rows.filter({ hasText: "an older Hosted project" });
  await expect(older.locator("time")).toHaveAttribute("datetime", "2025");
  await expect(older).toContainText("Complete");
});

test("a Hosted project's page opens it and shows its facts and write-up", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: /a Featured Hosted project/ }).click();
  await expect(page).toHaveURL("/projects/published-featured");

  const about = page.getByRole("region", { name: "About this Project" });
  await expect(
    about.getByRole("link", { name: /^Open Fixture — a Featured Hosted project/ }),
  ).toHaveAttribute("href", "https://fixture.spitzweb.dev");
  await expect(about).toContainText("fixture.spitzweb.dev");
  await expect(about).toContainText("In progress");
  await expect(about).toContainText("2026");
  await expect(about).toContainText("Next.js, Postgres, Tailwind CSS");
  await expect(about).toContainText("AI agents, Frontend");
  await expect(page.getByRole("heading", { level: 2, name: "How it was built" })).toBeVisible();
});

test("an External project's page links out to where it lives", async ({ page }) => {
  await page.goto("/projects/published-external");

  const about = page.getByRole("region", { name: "About this Project" });
  await expect(about.getByRole("link")).toHaveText(["Source on GitHub", "The product"]);
  await expect(about.getByRole("link", { name: "Source on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/SpitzN/spitzweb",
  );
  await expect(about).toContainText("Complete");
});

test("Related entries link both ways between a Project and an Article", async ({ page }) => {
  await page.goto("/projects/published-featured");
  const onProject = page
    .getByRole("navigation", { name: "Related entries" })
    .getByRole("link", { name: "Fixture — the most recent Published Article" });
  await expect(onProject).toHaveAttribute("href", "/articles/published-recent");

  // The Article names neither Project; the Featured and the Archived Projects name it.
  await page.goto("/articles/published-recent");
  const onArticle = page.getByRole("navigation", { name: "Related entries" }).first();
  await expect(onArticle.getByRole("link")).toHaveText([
    "Fixture — a Featured Hosted project with a title long enough to wrap in the list",
    "Fixture — an Archived Project",
  ]);
});

test("a Project's Related entries leave out Drafts and Unlisted Entries", async ({ page }) => {
  // The Draft and the Unlisted fixtures both name this Project.
  await page.goto("/projects/published-external");

  await expect(page.getByRole("navigation", { name: "Related entries" })).toHaveCount(0);
  await expect(page.getByText("an Unlisted Project")).toHaveCount(0);
});

test("a Project ends with the way onward and how to reach Nadav", async ({ page }) => {
  await page.goto("/projects/published-older");

  const onward = page.getByRole("region", { name: "Where to go next" });
  await expect(onward.getByRole("link", { name: "All Projects" })).toHaveAttribute(
    "href",
    "/projects",
  );
  await expect(onward.getByRole("link", { name: "Nadav Spitzer on LinkedIn" })).toBeVisible();
});

test("a Draft Project is not reachable", async ({ page }) => {
  const response = await page.goto("/projects/draft");

  expect(response?.status()).toBe(404);
  await expect(page.getByText("If a visitor can read this")).toHaveCount(0);
});

test("an Unlisted Project is reachable at its URL, kept out of search, and in no list", async ({
  page,
}) => {
  const response = await page.goto("/projects/unlisted");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fixture — an Unlisted Project");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await page.goto("/projects");
  await expect(page.getByText("an Unlisted Project")).toHaveCount(0);
});

test("an Archived Project stays reachable, says it is no longer maintained, and is in no list", async ({
  page,
}) => {
  const response = await page.goto("/projects/archived");
  expect(response?.status()).toBe(200);
  await expect(page.getByText("No longer maintained.")).toBeVisible();

  await page.goto("/projects");
  await expect(page.getByText("an Archived Project")).toHaveCount(0);
});

test("an unknown Project is a 404", async ({ page }) => {
  const response = await page.goto("/projects/no-such-project");

  expect(response?.status()).toBe(404);
});
