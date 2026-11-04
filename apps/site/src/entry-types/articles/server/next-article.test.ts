import { expect, test } from "vitest";
import { nextArticle } from "@/entry-types/articles/server/next-article";

const listed = [{ slug: "newest" }, { slug: "middle" }, { slug: "oldest" }];

test("the next Article is the one after this in the Articles list", () => {
  expect(nextArticle(listed, "newest")?.slug).toBe("middle");
  expect(nextArticle(listed, "middle")?.slug).toBe("oldest");
});

test("the last Article in the list has none", () => {
  expect(nextArticle(listed, "oldest")).toBeUndefined();
});

test("an Article that is in no list, such as an Unlisted one, leads to the top of the list", () => {
  expect(nextArticle(listed, "unlisted")?.slug).toBe("newest");
});

test("with nothing listed there is no next Article", () => {
  expect(nextArticle<{ slug: string }>([], "unlisted")).toBeUndefined();
});
