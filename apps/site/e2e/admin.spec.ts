import { expect, test } from "@playwright/test";
import { switchTheme, THEMES, wcagViolations } from "./accessibility";

// The suite has no GitHub and no real database, so it checks everything up to the sign-in itself;
// the sign-in flow is covered against PGlite in src/lib/auth.test.ts.

test("the Admin panel sends a visitor without a session to sign-in", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL("/admin/sign-in");
  await expect(page.getByRole("heading", { level: 1, name: "Admin panel" })).toBeVisible();
});

test("an Update's edit page sends a visitor without a session to sign-in", async ({ page }) => {
  await page.goto("/admin/updates/00000000-0000-4000-8000-000000000000");

  await expect(page).toHaveURL("/admin/sign-in");
});

test("sign-in is a 44 by 44 px target and kept out of search results", async ({ page }) => {
  await page.goto("/admin/sign-in");

  const box = await page.getByRole("button", { name: "Sign in with GitHub" }).boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("signing in says it is opening GitHub and can't be pressed twice", async ({ page }) => {
  // Hold the Server Action's request, so the button stays in its pending state.
  await page.route("/admin/sign-in", async (route) => {
    if (route.request().method() !== "POST") await route.continue();
  });
  await page.goto("/admin/sign-in");

  await page.getByRole("button", { name: "Sign in with GitHub" }).click();

  const pending = page.getByRole("button", { name: "Opening GitHub…" });
  await expect(pending).toBeVisible();
  await expect(pending).toHaveAttribute("aria-disabled", "true");
});

test("an account that isn't Nadav's is told it can't sign in", async ({ page }) => {
  await page.goto("/admin/sign-in?error=not_admin");

  // Next.js's route announcer is an alert too, so the message is found by its text.
  const message = page.getByText("This account can’t sign in.");
  await expect(page.getByRole("alert").and(message)).toBeVisible();
});

test("any other failed sign-in says to try again", async ({ page }) => {
  await page.goto("/admin/sign-in?error=state_mismatch");

  const message = page.getByText("Sign-in failed. Try again.");
  await expect(page.getByRole("alert").and(message)).toBeVisible();
});

for (const theme of THEMES) {
  test(`sign-in meets WCAG 2.2 AA in the ${theme} theme`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const response = await page.goto("/admin/sign-in?error=not_admin");
    expect(response?.status()).toBe(200);
    await switchTheme(page, theme);

    expect(await wcagViolations(page)).toEqual([]);
  });
}
