import { expect, test } from "vitest";
import { featuredAndOthers } from "@/entry-types/projects/featured-project";

// Listed Projects arrive Featured first, then newest first (listedEntries in domain/entry.ts).
const lead = { slug: "lead", featured: true };
const secondFeatured = { slug: "second-featured", featured: true };
const newer = { slug: "newer", featured: false };
const older = { slug: "older", featured: false };

test("the leading Featured Project goes to the panel and the rest to the list", () => {
  expect(featuredAndOthers([lead, secondFeatured, newer, older])).toStrictEqual({
    featured: lead,
    others: [secondFeatured, newer, older],
  });
});

test("with no Featured Project there is no panel, and every Project is in the list", () => {
  expect(featuredAndOthers([newer, older])).toStrictEqual({
    featured: undefined,
    others: [newer, older],
  });
});

test("with no Projects there is neither a panel nor a list", () => {
  expect(featuredAndOthers([])).toStrictEqual({ featured: undefined, others: [] });
});
