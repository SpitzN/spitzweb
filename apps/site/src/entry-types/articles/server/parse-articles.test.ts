import { describe, expect, test } from "vitest";
import { parseArticles } from "@/entry-types/articles/server/parse-articles";

function Content() {
  return null;
}

const validFrontmatter = {
  title: "Why I test at seams",
  summary: "Tests that survive a refactor.",
  date: "2026-11-04",
  state: "published",
  topics: ["developer-tools"],
};

const tableOfContents = [
  {
    value: "Seams",
    depth: 2,
    id: "seams",
    children: [{ value: "Where they go", depth: 3, id: "where-they-go" }],
  },
];

function file(name: string, frontmatter: unknown) {
  return {
    path: `content/articles/${name}.mdx`,
    module: { default: Content, frontmatter, tableOfContents, wordCount: 460 },
  };
}

describe("parseArticles", () => {
  test("turns each MDX file into an Article named by its file", () => {
    const [article] = parseArticles([file("test-at-seams", validFrontmatter)]);

    expect(article).toStrictEqual({
      type: "article",
      slug: "test-at-seams",
      title: "Why I test at seams",
      summary: "Tests that survive a refactor.",
      date: "2026-11-04",
      state: "published",
      topics: ["developer-tools"],
      featured: false,
      related: [],
      readingMinutes: 2,
      headings: [
        { text: "Seams", id: "seams", level: 2 },
        { text: "Where they go", id: "where-they-go", level: 3 },
      ],
      Content,
    });
  });

  test("names the file and the field when frontmatter breaks its schema", () => {
    const broken = file("broken", { ...validFrontmatter, topics: ["cooking"] });

    expect(() => parseArticles([broken])).toThrow(/content\/articles\/broken\.mdx.*topics\.0/s);
  });

  test("names a missing field", () => {
    const withoutTitle: Record<string, unknown> = { ...validFrontmatter };
    delete withoutTitle.title;

    expect(() => parseArticles([file("untitled", withoutTitle)])).toThrow(
      /content\/articles\/untitled\.mdx.*title/s,
    );
  });

  test("reports a file that has no frontmatter at all", () => {
    expect(() => parseArticles([file("bare", undefined)])).toThrow(/content\/articles\/bare\.mdx/);
  });

  test("rejects a file whose name is not a valid slug", () => {
    expect(() => parseArticles([file("Not A Slug", validFrontmatter)])).toThrow(
      /content\/articles\/Not A Slug\.mdx.*slug/s,
    );
  });

  test("rejects a field the schema does not know, so a typo cannot pass silently", () => {
    const typo = file("typo", { ...validFrontmatter, feautred: true });

    expect(() => parseArticles([typo])).toThrow(/content\/articles\/typo\.mdx.*feautred/s);
  });
});
