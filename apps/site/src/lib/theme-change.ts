import type { Theme } from "@/lib/theme";
import { appliedTheme, applyTheme, storeTheme } from "@/lib/theme";

/**
 * Plays the theme change (DESIGN.md, Motion). What is up in the sky sets, the new theme spreads
 * over the page from the horizon, and the other rises. The phase is marked on <html> as
 * `data-theme-change`, "setting" then "rising", and app/theme-change.css gives each part of the
 * picture its motion in that phase.
 */

/** How many steps the spread's keyframes are drawn in: enough for a curve to look smooth. */
const SPREAD_STEPS = 48;

/** The share of the spread's time in which the new theme climbs the header, above the horizon. */
const CLIMB_SHARE = 0.3;

/** How far an edge has travelled, by the share of its time: fast off the horizon, slow to land. */
function travelled(time: number) {
  return 1 - (1 - time) ** 2.4;
}

/**
 * The keyframes of the spread, for a horizon at a share of the viewport's height (0 to 100). A
 * band of the new theme opens on the horizon: its top edge climbs to the viewport's top quickly,
 * and its bottom edge falls to the foot. The old theme gets the same band cut out of it, wider by
 * the lime line (`--theme-spread-edge`), so the line shows on both moving edges.
 */
function spreadKeyframes(horizon: number) {
  const incoming: Keyframe[] = [];
  const outgoing: Keyframe[] = [];
  for (let step = 0; step <= SPREAD_STEPS; step++) {
    const time = step / SPREAD_STEPS;
    const top = (horizon * (1 - travelled(Math.min(time / CLIMB_SHARE, 1)))).toFixed(3);
    const bottom = (horizon + (100 - horizon) * travelled(time)).toFixed(3);
    const lineTop = `calc(${top}% - var(--theme-spread-edge))`;
    const lineBottom = `calc(${bottom}% + var(--theme-spread-edge))`;
    incoming.push({ clipPath: `inset(${top}% 0% calc(100% - ${bottom}%) 0%)` });
    outgoing.push({
      clipPath: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 0% ${lineTop}, 100% ${lineTop}, 100% ${lineBottom}, 0% ${lineBottom}, 0% ${lineTop})`,
    });
  }
  return { incoming, outgoing };
}

/** Spreads the new snapshot of the page over the old one, from the sky's bottom edge. */
function spreadFromHorizon(sky: Element) {
  const root = document.documentElement;
  const horizon = (sky.getBoundingClientRect().bottom / innerHeight) * 100;
  const { incoming, outgoing } = spreadKeyframes(Math.min(Math.max(horizon, 0), 100));
  const timing = {
    // The token is a count of milliseconds (app/theme-change.css).
    duration: Number(getComputedStyle(root).getPropertyValue("--theme-spread-ms")),
    fill: "both",
  } as const;
  return [
    root.animate(incoming, { ...timing, pseudoElement: "::view-transition-new(root)" }),
    root.animate(outgoing, { ...timing, pseudoElement: "::view-transition-old(root)" }),
  ];
}

/**
 * Waits for the keyframe animations running under an element. Transitions are not waited for: a
 * hover that is still easing out must not hold the change back.
 */
async function animationsEnd(scope: Element) {
  const animations = scope
    .getAnimations({ subtree: true })
    .filter((animation) => animation instanceof CSSAnimation);
  await Promise.allSettled(animations.map(async (animation) => animation.finished));
}

/**
 * Turns the page to a theme and starts the rising phase. Where the browser has view transitions
 * and the visitor hasn't asked for reduced motion, the new theme spreads from the horizon; the
 * new snapshot is live, so what rises is seen rising. Otherwise the page turns at once.
 */
async function turnPage(theme: Theme, sky: Element) {
  function turn() {
    applyTheme(theme);
    document.documentElement.dataset.themeChange = "rising";
  }

  // The stylesheet's reduced-motion rule can't reach an animation made by script.
  const isStill = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isStill || !("startViewTransition" in document)) {
    turn();
    return;
  }

  const transition = document.startViewTransition(turn);
  let spread: Animation[] = [];
  try {
    await transition.ready;
    spread = spreadFromHorizon(sky);
    await transition.finished;
  } catch {
    // The browser skipped the transition (a hidden tab, a resize). The page has turned all the same.
  }
  // Safari keeps a script-made animation alive after its transition, and it blocks the next one.
  for (const animation of spread) animation.cancel();
}

/**
 * Switches the page to the other theme, keeps the choice for the next visit, and plays the
 * change. `sky` holds everything that sets and rises, and its bottom edge is the horizon. A call
 * while a change is playing does nothing.
 */
export async function switchTheme(sky: Element) {
  const root = document.documentElement;
  if (root.dataset.themeChange) return;

  const theme = appliedTheme() === "dark" ? "light" : "dark";
  storeTheme(theme);
  root.dataset.themeChange = "setting";
  try {
    await animationsEnd(sky);
    await turnPage(theme, sky);
    await animationsEnd(sky);
  } finally {
    delete root.dataset.themeChange;
  }
}
