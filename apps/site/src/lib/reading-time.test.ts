import { expect, test } from "vitest";
import { readingMinutes } from "@/lib/reading-time";

test("rounds up to whole minutes at 230 words a minute", () => {
  expect(readingMinutes(230)).toBe(1);
  expect(readingMinutes(231)).toBe(2);
  expect(readingMinutes(1150)).toBe(5);
});

test("a very short text still takes a minute", () => {
  expect(readingMinutes(1)).toBe(1);
  expect(readingMinutes(0)).toBe(1);
});
