import { describe, expect, test } from "vitest";
import type { Entry } from "@/domain/entry";
import { relatedEntries } from "@/domain/related-entries";

function entry(type: Entry["type"], slug: string, overrides: Partial<Entry> = {}): Entry {
  return {
    type,
    slug,
    title: slug,
    summary: `${slug} summary`,
    date: "2026-01-01",
    state: "published",
    topics: ["frontend"],
    featured: false,
    related: [],
    ...overrides,
  };
}

function slugs(entries: readonly Entry[]) {
  return entries.map(({ slug }) => slug);
}

describe("relatedEntries", () => {
  test("shows the Entries an Entry names", () => {
    const project = entry("project", "spitzweb", { related: ["/articles/test-at-seams"] });
    const article = entry("article", "test-at-seams");

    expect(slugs(relatedEntries([project, article], project))).toStrictEqual(["test-at-seams"]);
  });

  test("shows the link on both Entries, though only one names the other", () => {
    const project = entry("project", "spitzweb", { related: ["/articles/test-at-seams"] });
    const article = entry("article", "test-at-seams");

    expect(slugs(relatedEntries([project, article], article))).toStrictEqual(["spitzweb"]);
  });

  test("tells Entry types apart when two Entries share a slug", () => {
    const project = entry("project", "spitzweb", { related: ["/articles/spitzweb"] });
    const article = entry("article", "spitzweb");
    const other = entry("project", "other");

    expect(relatedEntries([project, article, other], project)).toStrictEqual([article]);
  });

  test("shows an Entry once when both name each other", () => {
    const project = entry("project", "spitzweb", { related: ["/articles/test-at-seams"] });
    const article = entry("article", "test-at-seams", { related: ["/projects/spitzweb"] });

    expect(slugs(relatedEntries([project, article], project))).toStrictEqual(["test-at-seams"]);
  });

  test("shows Published and Archived Entries, never Drafts or Unlisted ones", () => {
    const project = entry("project", "spitzweb", {
      related: [
        "/articles/draft",
        "/articles/unlisted",
        "/articles/archived",
        "/articles/published",
      ],
    });
    const entries = [
      project,
      entry("article", "draft", { state: "draft" }),
      entry("article", "unlisted", { state: "unlisted" }),
      entry("article", "archived", { state: "archived", date: "2025-01-01" }),
      entry("article", "published"),
    ];

    expect(slugs(relatedEntries(entries, project))).toStrictEqual(["published", "archived"]);
  });

  test("lists them newest first", () => {
    const project = entry("project", "spitzweb", {
      related: ["/articles/march", "/articles/may", "/articles/january"],
    });
    const entries = [
      project,
      entry("article", "march", { date: "2026-03-01" }),
      entry("article", "may", { date: "2026-05-20" }),
      entry("article", "january", { date: "2026-01-15" }),
    ];

    expect(slugs(relatedEntries(entries, project))).toStrictEqual(["may", "march", "january"]);
  });

  test("an Entry with no Related entries has none", () => {
    const project = entry("project", "spitzweb");

    expect(relatedEntries([project, entry("article", "unrelated")], project)).toStrictEqual([]);
  });

  test("fails, naming both paths, when any Entry names one that does not exist", () => {
    const project = entry("project", "spitzweb");
    const article = entry("article", "test-at-seams", { related: ["/projects/no-such-project"] });

    expect(() => relatedEntries([project, article], project)).toThrow(
      /\/articles\/test-at-seams.*\/projects\/no-such-project/,
    );
  });
});
