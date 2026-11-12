import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { reloadInTheme } from "./accessibility";
import { PUBLIC_ROUTES } from "./routes";

/** The header's stars: the drawings in its layer that assistive technology skips (DESIGN.md, Navigation). */
function headerStars(page: Page) {
  return page.getByRole("banner").locator(":scope > [aria-hidden='true'] > svg");
}

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

async function boxesOf(locator: Locator) {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const { left, right, top, bottom } = element.getBoundingClientRect();
      return { left, right, top, bottom };
    }),
  );
}

function overlaps(one: Box, other: Box) {
  return (
    one.left < other.right &&
    other.left < one.right &&
    one.top < other.bottom &&
    other.top < one.bottom
  );
}

for (const route of PUBLIC_ROUTES) {
  test(`${route} has stars along its header in the dark theme, and none in the light`, async ({
    page,
  }) => {
    await page.goto(route);

    const stars = await headerStars(page).all();
    expect(stars.length).toBeGreaterThan(0);
    for (const star of stars) await expect(star).toBeVisible();

    await reloadInTheme(page, "light");
    const starsByDay = await headerStars(page).all();
    for (const star of starsByDay) await expect(star).toBeHidden();
  });
}

// From the narrowest phone to a desktop: the header wraps below about 400 px.
for (const width of [320, 390, 768, 1280]) {
  test(`at ${width} px no star touches the wordmark, a nav link or the theme switch`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");

    const stars = await boxesOf(headerStars(page));
    const obstacles = await boxesOf(page.getByRole("banner").locator("a, button"));

    expect(stars.length).toBeGreaterThan(0);
    expect(obstacles.length).toBeGreaterThan(0);
    expect(stars.filter((star) => obstacles.some((obstacle) => overlaps(star, obstacle)))).toEqual(
      [],
    );
  });
}
