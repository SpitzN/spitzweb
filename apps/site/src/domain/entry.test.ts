import { describe, expect, test } from "vitest";
import { type Entry, entrySlugSchema, listedEntries } from "@/domain/entry";

function entry(slug: string, overrides: Partial<Entry> = {}): Entry {
  return {
    slug,
    title: slug,
    summary: `${slug} summary`,
    date: "2026-01-01",
    state: "published",
    topics: [],
    featured: false,
    ...overrides,
  };
}

function slugs(entries: readonly Entry[]) {
  return entries.map(({ slug }) => slug);
}

describe("listedEntries", () => {
  test("lists Published Entries newest first", () => {
    const entries = [
      entry("march", { date: "2026-03-01" }),
      entry("may", { date: "2026-05-20" }),
      entry("january", { date: "2026-01-15" }),
    ];

    expect(slugs(listedEntries(entries))).toStrictEqual(["may", "march", "january"]);
  });

  test("leaves out Draft, Unlisted and Archived Entries", () => {
    const entries = [
      entry("draft", { state: "draft" }),
      entry("unlisted", { state: "unlisted" }),
      entry("archived", { state: "archived" }),
      entry("published"),
    ];

    expect(slugs(listedEntries(entries))).toStrictEqual(["published"]);
  });

  test("shows Featured Entries first, each group newest first", () => {
    const entries = [
      entry("new", { date: "2026-06-01" }),
      entry("old-featured", { date: "2025-02-01", featured: true }),
      entry("older", { date: "2025-01-01" }),
      entry("new-featured", { date: "2026-04-01", featured: true }),
    ];

    expect(slugs(listedEntries(entries))).toStrictEqual([
      "new-featured",
      "old-featured",
      "new",
      "older",
    ]);
  });

  test("returns a new list and leaves the input order alone", () => {
    const entries = [entry("a", { date: "2026-01-01" }), entry("b", { date: "2026-02-01" })];

    listedEntries(entries);

    expect(slugs(entries)).toStrictEqual(["a", "b"]);
  });
});

describe("an Entry's slug", () => {
  test.each(["first-article", "agents-2026", "a"])("%s is a slug", (slug) => {
    expect(entrySlugSchema.safeParse(slug).success).toBe(true);
  });

  test.each(["", "Upper", "two words", "../etc", "trailing-", "-leading", "a--b"])(
    "%j is not a slug",
    (slug) => {
      expect(entrySlugSchema.safeParse(slug).success).toBe(false);
    },
  );
});
