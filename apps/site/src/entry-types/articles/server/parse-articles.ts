import type { MDXContent } from "mdx/types";
import { z } from "zod";
import { type Entry, entryFactsSchema, entrySlugSchema } from "@/domain/entry";
import type { MdxFile } from "@/lib/mdx-files";
import { mdxContentSchema, parseMdxFile } from "@/lib/parse-mdx-file";
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
  type: "article";
  readingMinutes: number;
  /** Every anchored heading in the body, in reading order. */
  headings: ArticleHeading[];
  Content: MDXContent;
};

const articleModuleSchema = z.object({
  /** The file name, which becomes the Article's URL. */
  slug: entrySlugSchema,
  default: mdxContentSchema,
  // Articles add nothing to the facts every Entry shares, yet.
  frontmatter: entryFactsSchema,
  tableOfContents: z.array(tocNodeSchema),
  wordCount: z.number().int().nonnegative(),
});

/** Turns compiled MDX files into Articles, each named by its file. Throws on bad frontmatter. */
export function parseArticles(files: readonly MdxFile[]): Article[] {
  return files.map((file) => {
    const {
      slug,
      default: Content,
      frontmatter,
      tableOfContents,
      wordCount,
    } = parseMdxFile(file, articleModuleSchema);
    return {
      type: "article",
      slug,
      ...frontmatter,
      readingMinutes: readingMinutes(wordCount),
      headings: headingsIn(tableOfContents),
      Content,
    };
  });
}
