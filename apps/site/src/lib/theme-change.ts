import type { Theme } from "@/lib/theme";
import { appliedTheme, applyTheme, storeTheme } from "@/lib/theme";
import { spreadEdges } from "@/lib/theme-spread";

/**
 * Plays the theme change (DESIGN.md, Motion). What is up in the picture sets, the new theme
 * spreads over the page, and the other rises. The phase is marked on <html> as
 * `data-theme-change`: "setting", "turning" for the one step in which the page turns, then
 * "rising". app/theme-change.css gives each part of the picture its motion in a phase.
 */

/** Reads one of the change's motion tokens, which are plain numbers (app/theme-change.css). */
function motionToken(name: string) {
  return Number(getComputedStyle(document.documentElement).getPropertyValue(name));
}

function percent(share: number) {
  return `${(share * 100).toFixed(3)}%`;
}

/**
 * Spreads the page's new snapshot over its old one, from the scene's bottom edge. The old
 * snapshot gets the new one's band cut out of it, wider by the lime line (`--theme-spread-edge`),
 * so the line shows between them on both moving edges.
 */
function spreadFrom(scene: Element) {
  const { bottom: horizon } = scene.getBoundingClientRect();
  const edges = spreadEdges({
    horizon: Math.min(Math.max(horizon / innerHeight, 0), 1),
    climb: motionToken("--theme-spread-climb"),
    slowing: motionToken("--theme-spread-slowing"),
  });
  const incoming = edges.map(({ top, bottom }) => ({
    clipPath: `inset(${percent(top)} 0% ${percent(1 - bottom)} 0%)`,
  }));
  const outgoing = edges.map(({ top, bottom }) => {
    const lineTop = `calc(${percent(top)} - var(--theme-spread-edge))`;
    const lineBottom = `calc(${percent(bottom)} + var(--theme-spread-edge))`;
    return {
      clipPath: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 0% ${lineTop}, 100% ${lineTop}, 100% ${lineBottom}, 0% ${lineBottom}, 0% ${lineTop})`,
    };
  });
  const timing = { duration: motionToken("--theme-spread-ms"), fill: "both" } as const;
  const root = document.documentElement;
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
 * Shows a theme on the page in one step. For that step the phase is "turning", in which the
 * stylesheet lets nothing ease: a link easing to its new ink would otherwise show the old
 * theme's ink on the new ground for as long as it took.
 */
function showThemeAtOnce(theme: Theme) {
  const root = document.documentElement;
  const { themeChange: phase } = root.dataset;
  root.dataset.themeChange = "turning";
  applyTheme(theme);
  // Asking for a computed style makes the browser take in the new theme now, while nothing eases.
  getComputedStyle(root).getPropertyValue("color");
  if (phase === undefined) delete root.dataset.themeChange;
  else root.dataset.themeChange = phase;
}

/**
 * Turns the page to a theme inside a view transition, the new theme spreading from the scene's
 * bottom edge, and starts the rising phase as it turns. The new snapshot is live, so what rises
 * is seen rising.
 */
async function turnPage(theme: Theme, scene: Element) {
  const transition = document.startViewTransition(() => {
    showThemeAtOnce(theme);
    document.documentElement.dataset.themeChange = "rising";
  });
  let spread: Animation[] = [];
  try {
    await transition.ready;
    spread = spreadFrom(scene);
  } catch {
    // The browser skipped the transition (a hidden tab, a resize): the page turns with no spread.
  }
  // Skipped or not, the page has turned once this settles: a skipped one still runs its callback.
  await transition.finished;
  // Safari keeps a script-made animation alive after its transition, and it blocks the next one.
  for (const animation of spread) animation.cancel();
}

/**
 * Whether the change can be played. It needs view transitions, and a visitor who asked for
 * reduced motion gets none of it; the stylesheet's rule for that can't reach an animation made
 * by script.
 */
function canPlayChange() {
  return (
    "startViewTransition" in document && !matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Switches the page to the other theme and keeps the choice for the next visit. Where the change
 * can be played, it plays; otherwise the page changes at once. `scene` is the element the picture
 * is drawn in: its animations are the setting and the rising, and its bottom edge is where the
 * new theme spreads from. A call while a change is playing does nothing.
 */
export async function switchTheme(scene: Element) {
  const root = document.documentElement;
  if (root.dataset.themeChange) return;

  const theme = appliedTheme() === "dark" ? "light" : "dark";
  storeTheme(theme);
  if (!canPlayChange()) {
    showThemeAtOnce(theme);
    return;
  }

  root.dataset.themeChange = "setting";
  try {
    await animationsEnd(scene);
    await turnPage(theme, scene);
    await animationsEnd(scene);
  } finally {
    delete root.dataset.themeChange;
  }
}
