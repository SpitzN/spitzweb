import type { Locator, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { THEMES } from "./accessibility";

type Theme = (typeof THEMES)[number];

/** The page's ground in each theme (DESIGN.md: Drenched Ultramarine, Paper Ground). */
const GROUND = { dark: "rgb(20, 26, 82)", light: "rgb(244, 241, 234)" };
const OTHER = { dark: "light", light: "dark" } as const;

/** The header's theme switch: one button, named for what it does. */
function themeSwitch(page: Page) {
  return page.getByRole("button", { name: /^Switch to the (light|dark) theme$/ });
}

/** The switch's name as a sighted visitor sees it: the words beside the picture. */
function switchName(page: Page) {
  return page
    .getByRole("banner")
    .locator("[aria-hidden='true']")
    .filter({ hasText: "Switch to the" });
}

/** Opens a page as a returning visitor who chose a theme. */
async function visit(page: Page, theme: Theme, path = "/") {
  await page.addInitScript((stored) => {
    localStorage.setItem("theme", stored);
  }, theme);
  await page.goto(path);
}

async function groundOf(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
}

/**
 * Where the switch draws its lime disc: standing on the header's hairline (the sun), or up above
 * it (the moon). It asks the page what is painted at a point in each place.
 */
async function discPlace(page: Page) {
  return themeSwitch(page).evaluate((button) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    function isLimeAt(across: number, down: number) {
      const shape = document.elementFromPoint(left + width * across, top + height * down);
      return shape instanceof SVGElement && getComputedStyle(shape).fill === "rgb(200, 242, 90)";
    }
    return { isOnTheHairline: isLimeAt(0.5, 0.93), isAboveIt: isLimeAt(0.4, 0.52) };
  });
}

const PICTURE = {
  light: { isOnTheHairline: true, isAboveIt: false },
  dark: { isOnTheHairline: false, isAboveIt: true },
};

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

// --- The switch at rest.

test("a first visit is dark: the moon is up, and the switch offers the light theme", async ({
  page,
}) => {
  await page.goto("/");

  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the light theme");
  expect(await groundOf(page)).toBe(GROUND.dark);
  expect(await discPlace(page)).toEqual(PICTURE.dark);
});

test("the switch stands on the header's hairline", async ({ page }) => {
  await page.goto("/");

  // The hairline is the header's bottom border, so it starts where the header's padding ends.
  const header = await page.getByRole("banner").evaluate((element) => {
    const { top, bottom } = element.getBoundingClientRect();
    return { bottom, hairlineTop: top + element.clientTop + element.clientHeight };
  });
  const [button] = await boxesOf(themeSwitch(page));

  expect(header.bottom).toBeGreaterThan(header.hairlineTop);
  expect(button?.bottom).toBe(header.hairlineTop);
});

test("a chosen theme stays on every page and on the next visit", async ({ page }) => {
  await page.goto("/");

  await themeSwitch(page).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.goto("/articles");
  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the dark theme");
  expect(await groundOf(page)).toBe(GROUND.light);
  expect(await discPlace(page)).toEqual(PICTURE.light);

  await themeSwitch(page).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the light theme");
  expect(await groundOf(page)).toBe(GROUND.dark);
});

for (const theme of THEMES) {
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

// The page's own script (the one inline in <head>) puts the theme on <html>; the picture and the
// name must need nothing more, or they would show the other theme's until the site's script ran.
test("with none of the site's script loaded, a light theme still has its picture and its name", async ({
  page,
}) => {
  await page.route("**/*", async (route) => {
    await (route.request().resourceType() === "script" ? route.abort() : route.continue());
  });

  await visit(page, "light");

  expect(await groundOf(page)).toBe(GROUND.light);
  expect(await discPlace(page)).toEqual(PICTURE.light);
  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the dark theme");
});

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

  await themeSwitch(page).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});

test("the switch is a target of at least 24 px square", async ({ page }) => {
  await page.goto("/");

  const box = await themeSwitch(page).boundingBox();

  expect(box?.width).toBeGreaterThanOrEqual(24);
  expect(box?.height).toBeGreaterThanOrEqual(24);
});

// --- The switch's name, shown beside it (WCAG 2.2, 1.4.13).

for (const theme of THEMES) {
  test(`in the ${theme} theme the switch shows its name beside it on keyboard focus`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await visit(page, theme);
    // The words that are shown: the other theme's wording is in the page too, not displayed.
    await expect(switchName(page)).toHaveText(`Switch to the ${OTHER[theme]} theme`, {
      useInnerText: true,
    });
    await expect(switchName(page)).toHaveCSS("opacity", "0");

    await themeSwitch(page).focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");

    await expect(themeSwitch(page)).toBeFocused();
    await expect(switchName(page)).toHaveCSS("opacity", "1");
  });
}

test.describe("with a pointer that hovers", () => {
  // Hover styles apply only where the device can hover; the mobile project emulates a touch phone.
  test.use({ isMobile: false, hasTouch: false });

  for (const theme of THEMES) {
    test(`in the ${theme} theme the switch shows its name on hover, and the pointer can rest on the name`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await visit(page, theme);
      await expect(switchName(page)).toHaveCSS("opacity", "0");

      await themeSwitch(page).hover();
      await expect(switchName(page)).toHaveCSS("opacity", "1");

      // What hover reveals stays while the pointer is on it.
      await switchName(page).hover();
      await expect(switchName(page)).toHaveCSS("opacity", "1");
    });
  }
});

// The name takes room of its own in the header's row, shown or not, so it can't lie over a link.
for (const width of [320, 412, 540, 768, 1280]) {
  test(`at ${width} px the switch's name covers neither the wordmark nor a nav link`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");

    const [name] = await boxesOf(switchName(page));
    const links = await boxesOf(page.getByRole("banner").getByRole("link"));

    expect(name).toBeDefined();
    expect(links.filter((link) => name && overlaps(link, name))).toEqual([]);
  });
}

for (const width of [320, 390, 412, 540]) {
  test(`at ${width} px, a phone's width, the switch keeps a line of its own under the nav`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");

    const [button] = await boxesOf(themeSwitch(page));
    const links = await boxesOf(page.getByRole("banner").getByRole("link"));

    expect(button?.top).toBeGreaterThanOrEqual(Math.max(...links.map((link) => link.bottom)));
  });
}

// --- Other ways in than a pointer. Reduced motion lands each change at once, so the next can start.

test("Enter and Space on the focused switch change the theme", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await themeSwitch(page).focus();

  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.keyboard.press("Space");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
});

test.describe("on a touch screen", () => {
  test.use({ hasTouch: true });

  test("a tap on the switch changes the theme", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await themeSwitch(page).tap();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

// --- The change itself (DESIGN.md, Motion): what is up sets, the page turns, the other rises.

/**
 * Starts noting what a theme change does, on <html>: each of its steps as `data-theme-steps`
 * ("<phase>:<theme>", where "idle" is no change playing), the longest animation the header ran
 * as `data-longest-animation` (ms), and the wait before each star and each of the sun's rays
 * comes out as `data-star-waits` and `data-ray-waits` (ms, in the order they are drawn).
 */
async function noteThemeChanges(page: Page) {
  await page.evaluate(() => {
    const { dataset } = document.documentElement;
    const steps: string[] = [];
    let longest = 0;

    // Notes the wait before each of some parts comes out, the first time all of them are moving.
    function noteWaits(name: "starWaits" | "rayWaits", parts: string) {
      const waits = [...document.querySelectorAll(parts)].map(
        (part) => part.getAnimations()[0]?.effect?.getComputedTiming().delay,
      );
      if (!waits.includes(undefined)) dataset[name] ??= waits.join(" ");
    }

    new MutationObserver(() => {
      steps.push(`${dataset.themeChange ?? "idle"}:${dataset.theme ?? "dark"}`);
      dataset.themeSteps = steps.join(" ");
      const animations = document.querySelector("header")?.getAnimations({ subtree: true }) ?? [];
      for (const animation of animations) {
        longest = Math.max(longest, Number(animation.effect?.getComputedTiming().endTime));
      }
      dataset.longestAnimation = String(longest);
      noteWaits("starWaits", "header > [aria-hidden='true'] > svg > *");
      noteWaits("rayWaits", "header button svg line");
    }).observe(document.documentElement, {
      attributeFilter: ["data-theme-change", "data-theme"],
    });
  });
}

/** Passes once no theme change is playing. */
async function changeIsOver(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-theme-steps", /idle:\w+$/);
}

async function waitsNoted(page: Page, name: "data-star-waits" | "data-ray-waits") {
  const noted = await page.locator("html").getAttribute(name);
  return (noted ?? "").split(" ").map(Number);
}

for (const theme of THEMES) {
  test(`from the ${theme} theme, choosing the other plays the change: what is up sets, the page turns, and the other rises`, async ({
    page,
  }) => {
    await visit(page, theme);
    await noteThemeChanges(page);

    await themeSwitch(page).click();
    await changeIsOver(page);

    await expect(page.locator("html")).toHaveAttribute(
      "data-theme-steps",
      `setting:${theme} rising:${OTHER[theme]} idle:${OTHER[theme]}`,
    );
    expect(await discPlace(page)).toEqual(PICTURE[OTHER[theme]]);
    expect(
      Number(await page.locator("html").getAttribute("data-longest-animation")),
    ).toBeGreaterThan(0);
  });
}

test("when night falls the stars come out one by one, from the moon outward", async ({ page }) => {
  await visit(page, "light");
  await noteThemeChanges(page);

  await themeSwitch(page).click();
  await changeIsOver(page);

  const waits = await waitsNoted(page, "data-star-waits");
  expect(waits.length).toBeGreaterThan(1);
  expect(waits).toEqual([...new Set(waits)].toSorted((one, other) => one - other));
});

test("when day breaks the sun's rays come out from the middle one", async ({ page }) => {
  await page.goto("/");
  await noteThemeChanges(page);

  await themeSwitch(page).click();
  await changeIsOver(page);

  const [middle = 0, innerStart = 0, innerEnd = 0, outerStart = 0, outerEnd = 0] = await waitsNoted(
    page,
    "data-ray-waits",
  );
  expect(middle).toBeLessThan(innerStart);
  expect(innerStart).toBe(innerEnd);
  expect(innerStart).toBeLessThan(outerStart);
  expect(outerStart).toBe(outerEnd);
});

test("a second click while the change plays does nothing", async ({ page }) => {
  await page.goto("/");
  await noteThemeChanges(page);

  await themeSwitch(page).evaluate((button) => {
    if (!(button instanceof HTMLElement)) return;
    button.click();
    button.click();
  });
  await changeIsOver(page);

  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-steps",
    "setting:dark rising:light idle:light",
  );
});

/** Holds the page's change at a share of its time. A transition stays open while paused. */
async function holdTheSpreadAt(page: Page, share: number) {
  await page.waitForFunction((heldAt) => {
    const spreading = document
      .getAnimations()
      .filter(
        ({ effect }) =>
          effect instanceof KeyframeEffect && effect.pseudoElement?.startsWith("::view-transition"),
      );
    for (const animation of spreading) {
      animation.pause();
      animation.currentTime = Number(animation.effect?.getComputedTiming().duration) * heldAt;
    }
    return spreading.length >= 2;
  }, share);
}

/** A column of the page clear of the header and of every word: inside the page's own padding. */
const PAGE_EDGE = 4;

/**
 * The colours down the page's edge in a screenshot, as runs from the top: each is "light", "dark"
 * or "lime", with the row it starts at in CSS pixels.
 */
async function pageEdgeColours(page: Page) {
  const screenshot = await page.screenshot();
  return page.evaluate(
    async ({ png, x }) => {
      const picture = await fetch(`data:image/png;base64,${png}`);
      const bitmap = await createImageBitmap(await picture.blob());
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d");
      if (!context) return [];
      context.drawImage(bitmap, 0, 0);
      const scale = bitmap.width / innerWidth;
      const { data } = context.getImageData(Math.round(x * scale), 0, 1, bitmap.height);
      const runs: { colour: string; from: number }[] = [];
      for (let row = 0; row < bitmap.height; row++) {
        const [red = 0, green = 0, blue = 0] = data.slice(row * 4, row * 4 + 3);
        // Lime is the only colour here with far more green than blue; a ground is light or dark.
        const ground = red > 128 ? "light" : "dark";
        const colour = green - blue > 60 ? "lime" : ground;
        if (runs.at(-1)?.colour !== colour) runs.push({ colour, from: row / scale });
      }
      return runs;
    },
    { png: screenshot.toString("base64"), x: PAGE_EDGE },
  );
}

for (const theme of THEMES) {
  test(`from the ${theme} theme, the other spreads from the header's hairline behind a lime line`, async ({
    page,
  }) => {
    // The page's edge is read for the change's colours, so the page has no accent fill there: on a
    // phone the home page's Featured panel runs to the screen's edge.
    await visit(page, theme, "/articles");
    const [header] = await boxesOf(page.getByRole("banner"));
    const hairline = header?.bottom ?? 0;
    await themeSwitch(page).click();

    // Early on, a band of the new theme has opened around the hairline, a lime line on each edge.
    await holdTheSpreadAt(page, 0.1);
    const opening = await pageEdgeColours(page);
    expect(opening.map((run) => run.colour)).toEqual([theme, "lime", OTHER[theme], "lime", theme]);
    expect(opening[2]?.from).toBeLessThan(hairline);
    expect(opening[3]?.from).toBeGreaterThan(hairline);

    // Halfway, it has climbed past the top and is falling down the page.
    await holdTheSpreadAt(page, 0.5);
    const falling = await pageEdgeColours(page);
    expect(falling.map((run) => run.colour)).toEqual([OTHER[theme], "lime", theme]);

    await page.evaluate(() => {
      for (const animation of document.getAnimations()) animation.finish();
    });
    await expect(themeSwitch(page)).toHaveAccessibleName(`Switch to the ${theme} theme`);
  });
}

test("a change the browser skips still ends, and the switch goes on working", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const start = document.startViewTransition.bind(document);
    Object.defineProperty(document, "startViewTransition", {
      value(update: () => void) {
        const transition = start(update);
        transition.skipTransition();
        return transition;
      },
    });
  });
  await noteThemeChanges(page);

  await themeSwitch(page).click();
  await changeIsOver(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await themeSwitch(page).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", "light");
});

/**
 * Clicks the switch without moving a pointer onto it. A pointer's hover eases the switch's name
 * in, and that easing isn't part of the change these tests time.
 */
async function clickWithNoPointer(page: Page) {
  await themeSwitch(page).dispatchEvent("click");
}

test("with reduced motion, the theme and the picture change at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await noteThemeChanges(page);

  await clickWithNoPointer(page);

  await expect(page.locator("html")).toHaveAttribute("data-theme-steps", "idle:light");
  await expect(page.locator("html")).toHaveAttribute("data-longest-animation", "0");
  expect(await discPlace(page)).toEqual(PICTURE.light);
});

test("in a browser without view transitions, the theme and the picture change at once, and nothing throws", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.addInitScript(() => {
    Reflect.deleteProperty(Document.prototype, "startViewTransition");
  });
  await page.goto("/");
  await noteThemeChanges(page);

  await clickWithNoPointer(page);

  await expect(page.locator("html")).toHaveAttribute("data-theme-steps", "idle:light");
  await expect(page.locator("html")).toHaveAttribute("data-longest-animation", "0");
  expect(await discPlace(page)).toEqual(PICTURE.light);
  expect(errors).toEqual([]);
});
