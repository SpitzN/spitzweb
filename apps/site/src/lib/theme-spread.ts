/**
 * The shape of the page's change when the theme changes (DESIGN.md, Motion). A band of the new
 * theme opens on a horizon: its top edge climbs to the top of the viewport, and its bottom edge
 * falls to the foot. lib/theme-change.ts draws the page's snapshots to these edges.
 */

/** How many steps the spread is drawn in: enough for its curve to look smooth. */
const STEPS = 48;

interface Spread {
  /** Where the horizon is: a share of the viewport's height, from 0 at the top to 1 at the foot. */
  horizon: number;
  /** The share of the spread's time the top edge takes to reach the top of the viewport. */
  climb: number;
  /** How hard an edge slows as it lands: 1 is a steady pace, and more slows it sooner. */
  slowing: number;
}

/**
 * The band's two edges at each step of the spread, in order, as shares of the viewport's height
 * from its top. The first step is the band closed on the horizon; the last covers the viewport.
 */
export function spreadEdges({ horizon, climb, slowing }: Spread) {
  /** How far an edge has gone by a share of its time: quick off the horizon, slow to land. */
  function travelled(time: number) {
    return 1 - (1 - time) ** slowing;
  }

  return Array.from({ length: STEPS + 1 }, (_, step) => {
    const time = step / STEPS;
    return {
      top: horizon * (1 - travelled(Math.min(time / climb, 1))),
      bottom: horizon + (1 - horizon) * travelled(time),
    };
  });
}
