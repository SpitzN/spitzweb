import { describe, expect, test } from "vitest";
import {
  type Entry,
  entryHref,
  entryHrefSchema,
  entrySlugSchema,
  featuredAndOthers,
  listedEntries,
} from "@/domain/entry";

function entry(slug: string, overrides: Partial<Entry> = {}): Entry {
  return {
    type: "article",
    slug,
    title: slug,
    summary: `${slug} summary`,
    date: "2026-01-01",
    state: "published",
    topics: [],
    featured: false,
    related: [],
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

describe("featuredAndOthers", () => {
  // Listed Entries arrive Featured first, then newest first, as listedEntries gives them.
  const lead = entry("lead", { featured: true });
  const secondFeatured = entry("second-featured", { featured: true });
  const newer = entry("newer");
  const older = entry("older");

  test("the leading Featured Entry is shown apart and the rest are listed", () => {
    expect(featuredAndOthers([lead, secondFeatured, newer, older])).toStrictEqual({
      featured: lead,
      others: [secondFeatured, newer, older],
    });
  });

  test("with no Featured Entry none is shown apart, and every Entry is listed", () => {
    expect(featuredAndOthers([newer, older])).toStrictEqual({
      featured: undefined,
      others: [newer, older],
    });
  });

  test("with no Entries there is nothing to show", () => {
    expect(featuredAndOthers([])).toStrictEqual({ featured: undefined, others: [] });
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

describe("an Entry's URL", () => {
  test("is its Entry type's section followed by its slug", () => {
    expect(entryHref({ type: "article", slug: "test-at-seams" })).toBe("/articles/test-at-seams");
    expect(entryHref({ type: "project", slug: "spitzweb" })).toBe("/projects/spitzweb");
  });

  test.each(["/articles/test-at-seams", "/projects/spitzweb"])(
    "%s names an Entry in frontmatter",
    (href) => {
      expect(entryHrefSchema.safeParse(href).success).toBe(true);
    },
  );

  test.each([
    "articles/test-at-seams",
    "/updates/today",
    "/projects/Not-A-Slug",
    "/projects/spitzweb/",
    "/projects",
    "https://spitzweb.dev/projects/spitzweb",
  ])("%j does not name an Entry", (href) => {
    expect(entryHrefSchema.safeParse(href).success).toBe(false);
  });
});
