import { describe, expect, test } from "vitest";
import { parseProjects } from "@/entry-types/projects/server/parse-projects";

function Content() {
  return null;
}

const sharedFrontmatter = {
  title: "spitzweb",
  summary: "This site, built in the open.",
  date: "2026-11-05",
  state: "published",
  topics: ["frontend"],
  status: "in-progress",
  madeWith: ["Next.js", "Postgres"],
};

const hostedFrontmatter = { ...sharedFrontmatter, kind: "hosted", runsAt: "/" };

const externalFrontmatter = {
  ...sharedFrontmatter,
  kind: "external",
  status: "complete",
  links: [{ label: "Source on GitHub", href: "https://github.com/SpitzN/example" }],
};

// Lint rejects http:// literals, and these tests need insecure URLs to prove they are refused.
function insecure(httpsUrl: string) {
  return httpsUrl.replace(/^https:/, "http:");
}

function file(name: string, frontmatter: unknown) {
  return {
    path: `content/projects/${name}.mdx`,
    module: { default: Content, frontmatter },
  };
}

function parseOne(frontmatter: unknown) {
  return parseProjects([file("example", frontmatter)]);
}

describe("parseProjects", () => {
  test("turns each MDX file into a Project named by its file", () => {
    const [project] = parseProjects([file("spitzweb", hostedFrontmatter)]);

    expect(project).toStrictEqual({
      type: "project",
      slug: "spitzweb",
      title: "spitzweb",
      summary: "This site, built in the open.",
      date: "2026-11-05",
      state: "published",
      topics: ["frontend"],
      featured: false,
      related: [],
      status: "in-progress",
      madeWith: ["Next.js", "Postgres"],
      kind: "hosted",
      runsAt: "/",
      Content,
    });
  });

  test("an External project carries its links out", () => {
    const [project] = parseOne(externalFrontmatter);

    expect(project).toMatchObject({
      kind: "external",
      status: "complete",
      links: [{ label: "Source on GitHub", href: "https://github.com/SpitzN/example" }],
    });
  });

  test.each([
    "/",
    "/projects/spitzweb/demo",
    "https://chat.spitzweb.dev",
    "https://spitzweb.dev/x",
  ])("a Hosted project may run at %s, on spitzweb", (runsAt) => {
    expect(parseOne({ ...hostedFrontmatter, runsAt })[0]).toMatchObject({ runsAt });
  });

  test.each([
    "https://example.com",
    "https://spitzweb.dev.example.com",
    insecure("https://chat.spitzweb.dev"),
    "//example.com",
    "javascript:alert(1)",
  ])("a Hosted project may not run at %s, off spitzweb", (runsAt) => {
    expect(() => parseOne({ ...hostedFrontmatter, runsAt })).toThrow(
      /content\/projects\/example\.mdx.*runsAt/s,
    );
  });

  test.each([
    insecure("https://github.com/SpitzN/example"),
    "javascript:alert(1)",
    "/projects/spitzweb",
  ])("an External project's link must be https, not %s", (href) => {
    const links = [{ label: "Source", href }];

    expect(() => parseOne({ ...externalFrontmatter, links })).toThrow(
      /content\/projects\/example\.mdx.*links\.0\.href/s,
    );
  });

  test("an External project has at least one link", () => {
    expect(() => parseOne({ ...externalFrontmatter, links: [] })).toThrow(/links/);
  });

  test("a Project says whether it is Hosted or External", () => {
    const withoutKind: Record<string, unknown> = { ...hostedFrontmatter };
    delete withoutKind.kind;

    expect(() => parseOne(withoutKind)).toThrow(/content\/projects\/example\.mdx.*kind/s);
  });

  test("a Project's Status is In progress or Complete", () => {
    expect(() => parseOne({ ...hostedFrontmatter, status: "paused" })).toThrow(
      /content\/projects\/example\.mdx.*status/s,
    );
  });

  test("a Project says what it is made with", () => {
    expect(() => parseOne({ ...hostedFrontmatter, madeWith: [] })).toThrow(/madeWith/);
  });

  test("names a Related entry by its path", () => {
    const related = ["/articles/test-at-seams"];

    expect(parseOne({ ...hostedFrontmatter, related })[0]).toMatchObject({ related });
    expect(() => parseOne({ ...hostedFrontmatter, related: ["test-at-seams"] })).toThrow(
      /related\.0/,
    );
  });
});
