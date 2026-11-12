import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { switchTheme, THEMES } from "./accessibility";

// Between them these routes hold every kind of thing that takes focus: nav and prose links, list
// rows on the lifted ground, a scrolling code block, both accent cells and the Admin panel's
// button.
const ROUTES = [
  "/",
  "/projects",
  "/projects/published-featured",
  "/projects/published-external",
  "/articles/published-featured",
  "/admin/sign-in",
];
const TAB_STOPS = "a[href], button, input, textarea, select, [tabindex='0']";
// WCAG 2.2, 1.4.11 Non-text Contrast: a focus indicator against the colours next to it.
const MINIMUM_CONTRAST = 3;

interface FocusStop {
  name: string;
  outlineStyle: string;
  ringColor: string;
  ringGround: string;
  hasOwnBox: boolean;
  cornersAtRest: string | undefined;
  cornersInFocus: string;
}

/** Runs in the page, before anything has focus: notes each tab stop's corners on the element. */
function noteCornersAtRest(tabStops: string) {
  for (const stop of document.querySelectorAll<HTMLElement>(tabStops)) {
    stop.dataset.cornersAtRest = getComputedStyle(stop).borderRadius;
  }
}

/**
 * Runs in the page: the focused element's ring, the colour the ring is drawn on, and its corners.
 * A ring sits outside its element, so that colour is the nearest painted ground behind the
 * element. An element has a box of its own when it paints a fill or a frame.
 */
function readFocusStop(): FocusStop | null {
  const { activeElement: element, body, documentElement } = document;
  if (element === body || !(element instanceof HTMLElement)) return null;

  const own = getComputedStyle(element);
  // A Hosted project's cell draws its ring on the cover that fills the cell (DESIGN.md, Title block).
  const ring = own.outlineStyle === "none" ? getComputedStyle(element, "::after") : own;

  let behind = element.parentElement ?? documentElement;
  while (
    behind !== documentElement &&
    getComputedStyle(behind).backgroundColor === "rgba(0, 0, 0, 0)"
  ) {
    behind = behind.parentElement ?? documentElement;
  }

  return {
    name: element.textContent.trim().slice(0, 40) || element.tagName,
    outlineStyle: ring.outlineStyle,
    ringColor: ring.outlineColor,
    ringGround: getComputedStyle(behind).backgroundColor,
    hasOwnBox: own.backgroundColor !== "rgba(0, 0, 0, 0)" || /[1-9]/.test(own.borderWidth),
    cornersAtRest: element.dataset.cornersAtRest,
    cornersInFocus: own.borderRadius,
  };
}

/** Tabs through the whole page, as a keyboard user does, and reads each element that takes focus. */
async function focusStops(page: Page) {
  await page.evaluate(noteCornersAtRest, TAB_STOPS);
  const focusStops: FocusStop[] = [];
  const stops = await page.locator(TAB_STOPS).count();
  for (let stop = 0; stop < stops; stop++) {
    await page.keyboard.press("Tab");
    const focusStop = await page.evaluate(readFocusStop);
    if (focusStop) focusStops.push(focusStop);
  }
  return focusStops;
}

/** The relative luminance of a computed `rgb()` colour (WCAG 2.2). */
function luminance(color: string) {
  const [red = 0, green = 0, blue = 0] = (color.match(/\d+/g) ?? []).map((channel) => {
    const value = Number(channel) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

/** The WCAG contrast ratio between two computed colours, from 1 to 21. */
function contrast(one: string, other: string) {
  const [darker = 0, lighter = 0] = [luminance(one), luminance(other)].toSorted((a, b) => a - b);
  return (lighter + 0.05) / (darker + 0.05);
}

/** The rings a keyboard user would struggle to see: missing, or too close to their ground. */
function faintRings(focusStops: FocusStop[]) {
  return focusStops
    .map(({ name, outlineStyle, ringColor, ringGround }) => ({
      name,
      outlineStyle,
      ringColor,
      ringGround,
      contrast: contrast(ringColor, ringGround),
    }))
    .filter((ring) => ring.outlineStyle === "none" || ring.contrast < MINIMUM_CONTRAST);
}

/** The elements with a box of their own whose corners change when they take focus. */
function reshapedBoxes(focusStops: FocusStop[]) {
  return focusStops
    .filter((stop) => stop.hasOwnBox && stop.cornersInFocus !== stop.cornersAtRest)
    .map(({ name, cornersAtRest, cornersInFocus }) => ({ name, cornersAtRest, cornersInFocus }));
}

for (const route of ROUTES) {
  for (const theme of THEMES) {
    test(`every focus ring on ${route} stands out from its ground in the ${theme} theme`, async ({
      page,
    }) => {
      // A focused row changes ground through a transition; with reduced motion it lands at once.
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(route);
      await switchTheme(page, theme);

      const stops = await focusStops(page);

      expect(stops.length).toBeGreaterThan(0);
      expect(faintRings(stops)).toEqual([]);
    });
  }

  test(`taking focus on ${route} leaves a fill or a frame in its own shape`, async ({ page }) => {
    await page.goto(route);

    const stops = await focusStops(page);

    expect(reshapedBoxes(stops)).toEqual([]);
  });
}
