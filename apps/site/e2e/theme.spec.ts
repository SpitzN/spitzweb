import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

/** The page's ground in each theme (DESIGN.md: Drenched Ultramarine, Paper Ground). */
const GROUND = { dark: "rgb(20, 26, 82)", light: "rgb(244, 241, 234)" };

function themeSwitch(page: Page) {
  return page.getByRole("group", { name: "Theme" });
}

async function groundOf(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
}

async function inkOf(option: Locator) {
  return option.evaluate((element) => getComputedStyle(element).color);
}

test("a first visit is dark, and the theme switch says so", async ({ page }) => {
  await page.goto("/");

  await expect(themeSwitch(page).getByRole("button", { name: "Dark" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(themeSwitch(page).getByRole("button", { name: "Light" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );
  expect(await groundOf(page)).toBe(GROUND.dark);
});

test("a chosen theme stays on every page and on the next visit", async ({ page }) => {
  await page.goto("/");

  await themeSwitch(page).getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.goto("/articles");
  await expect(themeSwitch(page).getByRole("button", { name: "Light" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(await groundOf(page)).toBe(GROUND.light);

  await themeSwitch(page).getByRole("button", { name: "Dark" }).click();
  await page.reload();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  expect(await groundOf(page)).toBe(GROUND.dark);
});

for (const theme of ["dark", "light"] as const) {
  test(`a returning visitor's ${theme} theme is on the page from its first frame`, async ({
    page,
  }) => {
    await page.addInitScript((stored) => {
      localStorage.setItem("theme", stored);
      // A frame callback runs before the browser paints that frame, so the first one sees what
      // the first paint shows.
      requestAnimationFrame(() => {
        document.documentElement.dataset.firstFrameGround = getComputedStyle(
          document.documentElement,
        ).backgroundColor;
      });
    }, theme);

    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("data-first-frame-ground", GROUND[theme]);
  });
}

test("with storage unavailable, a visit is dark, the switch still works, and nothing throws", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.addInitScript(() => {
    Object.defineProperty(globalThis, "localStorage", {
      get() {
        throw new DOMException("Storage is blocked", "SecurityError");
      },
    });
  });

  await page.goto("/");
  expect(await groundOf(page)).toBe(GROUND.dark);

  await themeSwitch(page).getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});

test("each option is a target of at least 24 px square", async ({ page }) => {
  await page.goto("/");

  const options = await themeSwitch(page).getByRole("button").all();
  for (const option of options) {
    const box = await option.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(24);
    expect(box?.height).toBeGreaterThanOrEqual(24);
  }
});

test.describe("with a pointer that hovers", () => {
  // Hover styles apply only where the device can hover; the mobile project emulates a touch phone.
  test.use({ isMobile: false, hasTouch: false });

  test("the other theme turns to full ink on hover", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const light = themeSwitch(page).getByRole("button", { name: "Light" });
    const inUse = await inkOf(themeSwitch(page).getByRole("button", { name: "Dark" }));

    expect(await inkOf(light)).not.toBe(inUse);
    await light.hover();
    expect(await inkOf(light)).toBe(inUse);
  });
});
