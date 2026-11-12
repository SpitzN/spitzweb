import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

// Runs against the Project fixtures in e2e/content/projects: the Featured one leads, then the
// External one (newer), then the older Hosted one. The suite runs without a database
// (playwright.config.ts), so the latest Update is in its unavailable state; posting and showing an
// Update is covered against PGlite in src/entry-types/updates.

const FEATURED = "Fixture — a Featured Hosted project with a title long enough to wrap in the list";
const EXTERNAL = "Fixture — the most recent External project";
const OLDER = "Fixture — an older Hosted project";

function projectsList(page: Page) {
  return page.getByRole("region", { name: "Projects" });
}

function rowTitle(page: Page, name: string) {
  return projectsList(page).getByRole("heading", { level: 3, name });
}

function rowLink(page: Page, name: string) {
  return projectsList(page).getByRole("link", { name });
}

// The selected row's title is heavy; every other title sits at 400 (DESIGN.md, Weight carries state).
async function expectSelected(page: Page, name: string) {
  await expect(rowTitle(page, name)).toHaveCSS("font-weight", "800");
}

// The keys work once the page has hydrated. J stops at the last row, so pressing it until focus
// lands there is safe to repeat.
async function moveToLastRow(page: Page) {
  await expect(async () => {
    await page.keyboard.press("j");
    await expect(rowLink(page, OLDER)).toBeFocused({ timeout: 500 });
  }).toPass();
}

test.beforeEach(async ({ page }) => {
  // Weight and colour change through a transition; with reduced motion they land at once, so a
  // reading never catches a title halfway between 400 and 800.
  await page.emulateMedia({ reducedMotion: "reduce" });
});

test("the home page stays up and says so when Updates are unavailable", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page.getByText("Now: Updates are unavailable right now.")).toBeVisible();
});

test("the statement is labelled as a stand-in", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("A stand-in line until Nadav writes the real one.")).toBeVisible();
});

test("the Featured panel holds the leading Featured Project and opens its page", async ({
  page,
}) => {
  await page.goto("/");
  const panel = page.getByRole("region", { name: "Featured Project" });

  await expect(panel.getByRole("heading", { level: 2 })).toHaveText(FEATURED);
  await expect(panel).toContainText("Featured · Hosted · In progress · 2026");
  await panel.getByRole("link", { name: FEATURED }).click();
  await expect(page).toHaveURL("/projects/published-featured");
});

test("the Projects list shows the other Published Projects, newest first, with the first selected", async ({
  page,
}) => {
  await page.goto("/");

  await expect(projectsList(page).getByRole("heading", { level: 3 })).toHaveText([EXTERNAL, OLDER]);
  await expectSelected(page, EXTERNAL);
  await expect(rowTitle(page, OLDER)).toHaveCSS("font-weight", "400");
});

test("J and K move the selection and focus, and Enter opens the selected Project", async ({
  page,
}) => {
  await page.goto("/");

  await moveToLastRow(page);
  await expectSelected(page, OLDER);
  await expect(rowTitle(page, EXTERNAL)).toHaveCSS("font-weight", "400");

  await page.keyboard.press("k");
  await expect(rowLink(page, EXTERNAL)).toBeFocused();
  await expectSelected(page, EXTERNAL);

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/projects/published-external");
});

test("keyboard focus selects the row it lands on", async ({ page }) => {
  await page.goto("/");

  await expect(async () => {
    await rowLink(page, OLDER).blur();
    await rowLink(page, OLDER).focus();
    await expectSelected(page, OLDER);
  }).toPass();
});

test("the pointer selects the row it moves over, and Enter then opens it", async ({ page }) => {
  await page.goto("/");

  await expect(async () => {
    await page.mouse.move(0, 0);
    await rowLink(page, OLDER).hover();
    await expect(rowTitle(page, OLDER)).toHaveCSS("font-weight", "800", { timeout: 500 });
  }).toPass();
  await expect(rowTitle(page, EXTERNAL)).toHaveCSS("font-weight", "400");

  // Nothing has focus, so Enter opens the selected row.
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/projects/published-older");
});

test("J, K and Enter do nothing while a text field has focus", async ({ page }) => {
  await page.goto("/");
  await moveToLastRow(page);

  // The home page has no text field of its own, so the test brings one.
  await page.evaluate(() => {
    const field = document.createElement("input");
    field.setAttribute("aria-label", "Test field");
    document.body.append(field);
  });
  const field = page.getByRole("textbox", { name: "Test field" });
  await field.focus();
  await page.keyboard.type("kj");
  await page.keyboard.press("Enter");

  await expect(field).toHaveValue("kj");
  await expect(field).toBeFocused();
  await expect(page).toHaveURL("/");
  await expectSelected(page, OLDER);
});

test("weight and colour change on the shared ease-out, and at once under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(rowTitle(page, EXTERNAL)).toHaveCSS("transition-duration", "0.45s");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(rowTitle(page, EXTERNAL)).toHaveCSS("transition-duration", "0s");
});
