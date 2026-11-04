import type { MDXContent } from "mdx/types";
import { z } from "zod";
import { type Entry, entryFactsSchema, entrySlugSchema } from "@/domain/entry";
import type { MdxFile } from "@/lib/mdx-files";
import { readingMinutes } from "@/lib/reading-time";

/** One node of the table of contents rehype-extract-toc exports (next.config.ts). */
interface TocNode {
  value: string;
  depth: number;
  id?: string | undefined;
  children?: TocNode[] | undefined;
}

const tocNodeSchema: z.ZodType<TocNode> = z.object({
  value: z.string(),
  depth: z.number(),
  id: z.string().optional(),
  get children() {
    return z.array(tocNodeSchema).optional();
  },
});

/** A heading in an Article's body that a contents link can point to. */
interface ArticleHeading {
  text: string;
  id: string;
  /** 2 for a section, 3 and deeper for the headings inside it. */
  level: number;
}

function headingsIn(nodes: readonly TocNode[]): ArticleHeading[] {
  return nodes.flatMap(({ value, depth, id, children = [] }) => [
    // A heading without an id has no anchor to link to.
    ...(id === undefined ? [] : [{ text: value, id, level: depth }]),
    ...headingsIn(children),
  ]);
}

export type Article = Entry & {
  readingMinutes: number;
  /** Every anchored heading in the body, in reading order. */
  headings: ArticleHeading[];
  Content: MDXContent;
};

const articleModuleSchema = z.object({
  /** The file name, which becomes the Article's URL. */
  slug: entrySlugSchema,
  default: z.custom<MDXContent>((value) => typeof value === "function"),
  // Articles add nothing to the facts every Entry shares, yet.
  frontmatter: entryFactsSchema,
  tableOfContents: z.array(tocNodeSchema),
  wordCount: z.number().int().nonnegative(),
});

function fileNameOf(path: string) {
  return path.slice(path.lastIndexOf("/") + 1, -".mdx".length);
}

// A module namespace is an object; anything else parses as having no exports.
function asObject(value: unknown) {
  return typeof value === "object" && value !== null ? { ...value } : {};
}

function describeIssues(path: string, error: z.ZodError) {
  const lines = error.issues.map(({ path: field, message }) => {
    // Issues under the module's other exports are build bugs, not content errors; show the full path.
    const name = field[0] === "frontmatter" ? field.slice(1).join(".") : field.join(".");
    return `  ${name === "" ? "frontmatter" : name}: ${message}`;
  });
  return `${path} has invalid frontmatter:\n${lines.join("\n")}`;
}

/**
 * Turns compiled MDX files into Articles, each named by its file. Content that breaks the schema
 * is a broken invariant, so this throws with the file and every failing field, and the build that
 * loads it fails.
 */
export function parseArticles(files: readonly MdxFile[]): Article[] {
  return files.map(({ path, module }) => {
    const parsed = articleModuleSchema.safeParse({ slug: fileNameOf(path), ...asObject(module) });
    if (!parsed.success) throw new Error(describeIssues(path, parsed.error));
    const { slug, default: Content, frontmatter, tableOfContents, wordCount } = parsed.data;
    return {
      slug,
      ...frontmatter,
      readingMinutes: readingMinutes(wordCount),
      headings: headingsIn(tableOfContents),
      Content,
    };
  });
}
