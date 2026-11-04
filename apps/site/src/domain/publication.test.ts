import { describe, expect, test } from "vitest";
import { isIndexable, isListed, isReachable } from "@/domain/publication";

describe("who can reach an Entry", () => {
  test("a Draft is reachable by no visitor", () => {
    expect(isReachable("draft")).toBe(false);
  });

  test.each(["unlisted", "published", "archived"] as const)(
    "%s is reachable at its URL",
    (state) => {
      expect(isReachable(state)).toBe(true);
    },
  );
});

describe("which Entries appear in lists", () => {
  test("only a Published Entry is listed", () => {
    expect(isListed("published")).toBe(true);
  });

  test.each(["draft", "unlisted", "archived"] as const)("%s is in no list", (state) => {
    expect(isListed(state)).toBe(false);
  });
});

describe("which Entries search engines may index", () => {
  test.each(["published", "archived"] as const)("%s is indexable", (state) => {
    expect(isIndexable(state)).toBe(true);
  });

  test.each(["draft", "unlisted"] as const)("%s is kept out of search", (state) => {
    expect(isIndexable(state)).toBe(false);
  });
});
