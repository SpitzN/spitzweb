import { expect, test } from "vitest";
import { spreadEdges } from "@/lib/theme-spread";

// A horizon a tenth of the way down the viewport, as under the site header.
const UNDER_THE_HEADER = { horizon: 0.1, climb: 0.3, slowing: 2.4 };

test("the band opens closed on the horizon", () => {
  const [opening] = spreadEdges(UNDER_THE_HEADER);

  expect(opening).toStrictEqual({ top: 0.1, bottom: 0.1 });
});

test("the band ends covering the viewport", () => {
  expect(spreadEdges(UNDER_THE_HEADER).at(-1)).toStrictEqual({ top: 0, bottom: 1 });
});

test("the top edge reaches the top of the viewport in the climb's share of the time", () => {
  const edges = spreadEdges(UNDER_THE_HEADER);
  const lastStep = edges.length - 1;

  const climbing = edges.filter((_, step) => step / lastStep < 0.3);
  const climbed = edges.filter((_, step) => step / lastStep >= 0.3);

  expect(climbing.every((edge) => edge.top > 0)).toBe(true);
  expect(climbed.every((edge) => edge.top === 0)).toBe(true);
});

test("each edge only ever moves away from the horizon", () => {
  const edges = spreadEdges(UNDER_THE_HEADER);

  const tops = edges.map((edge) => edge.top);
  const bottoms = edges.map((edge) => edge.bottom);

  expect(tops).toStrictEqual(tops.toSorted((one, other) => other - one));
  expect(bottoms).toStrictEqual(bottoms.toSorted((one, other) => one - other));
});

test("at a steady pace, each edge is halfway there at half time", () => {
  const edges = spreadEdges({ horizon: 0.1, climb: 1, slowing: 1 });
  const halfTime = edges[(edges.length - 1) / 2];

  expect(halfTime?.top).toBeCloseTo(0.05);
  expect(halfTime?.bottom).toBeCloseTo(0.55);
});

test("slowing puts an edge further along at half time than a steady pace would", () => {
  const edges = spreadEdges(UNDER_THE_HEADER);
  const halfTime = edges[(edges.length - 1) / 2];

  expect(halfTime?.bottom).toBeGreaterThan(0.55);
});

test("a horizon at the top of the viewport has no climb to make", () => {
  const edges = spreadEdges({ horizon: 0, climb: 0.3, slowing: 2.4 });

  expect(edges.every((edge) => edge.top === 0)).toBe(true);
});
