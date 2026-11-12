import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { THEMES } from "./accessibility";

/** The page's ground in each theme (DESIGN.md: Drenched Ultramarine, Paper Ground). */
const GROUND = { dark: "rgb(20, 26, 82)", light: "rgb(244, 241, 234)" };

/** The header's theme switch: one button, named for what it does. */
function themeSwitch(page: Page) {
  return page.getByRole("button", { name: /^Switch to the (light|dark) theme$/ });
}

async function groundOf(page: Page) {
  return page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
}

/**
 * Where the switch draws its lime disc: standing on the header's hairline (the sun), or up in the
 * header's sky (the moon). It asks the page what is painted at a point in each place.
 */
async function discPlace(page: Page) {
  return themeSwitch(page).evaluate((button) => {
    const { left, top, width, height } = button.getBoundingClientRect();
    function isLimeAt(across: number, down: number) {
      const shape = document.elementFromPoint(left + width * across, top + height * down);
      return shape instanceof SVGElement && getComputedStyle(shape).fill === "rgb(200, 242, 90)";
    }
    return { isOnTheHairline: isLimeAt(0.5, 0.93), isInTheSky: isLimeAt(0.4, 0.52) };
  });
}

/**
 * How opaque the switch's name is drawn, from 0 (hidden) to 1: the product of every opacity from
 * its text up to the switch.
 */
async function nameOpacity(page: Page) {
  return themeSwitch(page).evaluate((button) => {
    let opacity = 1;
    let box = [...button.querySelectorAll("span")].find(
      (span) => span.children.length === 0 && span.getClientRects().length > 0,
    );
    while (box && box !== button) {
      opacity *= Number(getComputedStyle(box).opacity);
      box = box.parentElement ?? undefined;
    }
    return opacity;
  });
}

const THE_SUN = { isOnTheHairline: true, isInTheSky: false };
const THE_MOON = { isOnTheHairline: false, isInTheSky: true };

test("a first visit is dark: the moon is up, and the switch offers the light theme", async ({
  page,
}) => {
  await page.goto("/");

  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the light theme");
  expect(await groundOf(page)).toBe(GROUND.dark);
  expect(await discPlace(page)).toEqual(THE_MOON);
});

test("a chosen theme stays on every page and on the next visit", async ({ page }) => {
  await page.goto("/");

  await themeSwitch(page).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.goto("/articles");
  await expect(themeSwitch(page)).toHaveAccessibleName("Switch to the dark theme");
  expect(await groundOf(page)).toBe(GROUND.light);
  expect(await discPlace(page)).toEqual(THE_SUN);

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

// The first frame has the theme on <html> (above), so a picture and a name that follow <html>
// alone are right in that frame too, before any of the switch's own script runs.
test("the switch's picture and name follow the theme on <html>, with no script of its own", async ({
  page,
}) => {
  await page.goto("/");

  await page.evaluate(() => {
    document.documentElement.dataset.theme = "light";
  });

  expect(await discPlace(page)).toEqual(THE_SUN);
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

test("the switch shows its name beside it when it takes keyboard focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await nameOpacity(page)).toBe(0);

  await themeSwitch(page).focus();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");

  await expect(themeSwitch(page)).toBeFocused();
  await expect.poll(() => nameOpacity(page)).toBe(1);
});

test.describe("with a pointer that hovers", () => {
  // Hover styles apply only where the device can hover; the mobile project emulates a touch phone.
  test.use({ isMobile: false, hasTouch: false });

  test("the switch shows its name beside it on hover, and the pointer can rest on the name", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await nameOpacity(page)).toBe(0);

    await themeSwitch(page).hover();
    await expect.poll(() => nameOpacity(page)).toBe(1);

    // WCAG 2.2, 1.4.13: what hover reveals stays while the pointer is on it.
    await themeSwitch(page).getByText("Switch to the light theme").hover();
    await expect.poll(() => nameOpacity(page)).toBe(1);
  });
});

// --- The change itself (DESIGN.md, Motion): what is up sets, the page turns, the other rises.

/**
 * Before the page loads: notes each step of a theme change on <html>, as `data-theme-steps`, and
 * the longest animation the header runs during one, as `data-longest-animation` (in ms). A step
 * reads "<phase>:<theme>", and "idle" is no change playing.
 */
async function noteThemeChanges(page: Page) {
  await page.addInitScript(() => {
    const steps: string[] = [];
    let longest = 0;
    // This runs before <html> exists, so it watches the document for the attributes instead.
    new MutationObserver(() => {
      const { dataset } = document.documentElement;
      steps.push(`${dataset.themeChange ?? "idle"}:${dataset.theme ?? "dark"}`);
      dataset.themeSteps = steps.join(" ");
      const animations = document.querySelector("header")?.getAnimations({ subtree: true }) ?? [];
      for (const animation of animations) {
        longest = Math.max(longest, Number(animation.effect?.getComputedTiming().endTime));
      }
      dataset.longestAnimation = String(longest);
    }).observe(document, {
      subtree: true,
      attributeFilter: ["data-theme-change", "data-theme"],
    });
  });
}

/** Passes once no theme change is playing. */
async function changeIsOver(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-theme-steps", /idle:\w+$/);
}

test("choosing a theme plays the change: what is up sets, the page turns, and the other rises", async ({
  page,
}) => {
  await noteThemeChanges(page);
  await page.goto("/");

  await themeSwitch(page).click();
  await changeIsOver(page);

  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-steps",
    "setting:dark rising:light idle:light",
  );
  expect(await discPlace(page)).toEqual(THE_SUN);
  expect(Number(await page.locator("html").getAttribute("data-longest-animation"))).toBeGreaterThan(
    0,
  );
});

test("a second click while the change plays does nothing", async ({ page }) => {
  await noteThemeChanges(page);
  await page.goto("/");

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

/** The colour of a screenshot's pixels down one column, as runs: "light", "dark" or "lime". */
async function columnOf(page: Page, across: number) {
  const screenshot = await page.screenshot();
  return page.evaluate(
    async ({ png, x }) => {
      const picture = await fetch(`data:image/png;base64,${png}`);
      const bitmap = await createImageBitmap(await picture.blob());
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext("2d");
      if (!context) return [];
      context.drawImage(bitmap, 0, 0);
      const column = Math.round((x * bitmap.width) / innerWidth);
      const { data } = context.getImageData(column, 0, 1, bitmap.height);
      const runs: string[] = [];
      for (let row = 0; row < bitmap.height; row++) {
        const [red = 0, green = 0, blue = 0] = data.slice(row * 4, row * 4 + 3);
        // Lime is the only colour here with far more green than blue; a ground is light or dark.
        const ground = red > 128 ? "light" : "dark";
        const colour = green - blue > 60 ? "lime" : ground;
        if (runs.at(-1) !== colour) runs.push(colour);
      }
      return runs;
    },
    { png: screenshot.toString("base64"), x: across },
  );
}

test("the new theme spreads down the page from the header's hairline, behind a lime line", async ({
  page,
}) => {
  await page.goto("/");
  await themeSwitch(page).click();

  // Hold the page's change halfway. A transition stays open while its animations are paused.
  await page.waitForFunction(() => {
    const spreading = document
      .getAnimations()
      .filter(
        ({ effect }) =>
          effect instanceof KeyframeEffect && effect.pseudoElement?.startsWith("::view-transition"),
      );
    for (const animation of spreading) {
      animation.pause();
      animation.currentTime = Number(animation.effect?.getComputedTiming().duration) / 2;
    }
    return spreading.length >= 2;
  });

  // The page's edge, clear of the header and of every word: only the grounds and the line.
  expect(await columnOf(page, 4)).toEqual(["light", "lime", "dark"]);

  await page.evaluate(() => {
    for (const animation of document.getAnimations()) animation.finish();
  });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("with reduced motion, the theme and the picture change at once", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await noteThemeChanges(page);
  await page.goto("/");

  await themeSwitch(page).click();
  await changeIsOver(page);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveAttribute("data-longest-animation", "0");
  expect(await discPlace(page)).toEqual(THE_SUN);
});

test("in a browser without view transitions, the theme still changes and nothing throws", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  await page.addInitScript(() => {
    Reflect.deleteProperty(Document.prototype, "startViewTransition");
  });
  await noteThemeChanges(page);
  await page.goto("/");

  await themeSwitch(page).click();
  await changeIsOver(page);

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await discPlace(page)).toEqual(THE_SUN);
  expect(errors).toEqual([]);
});
