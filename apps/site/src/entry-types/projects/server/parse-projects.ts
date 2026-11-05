import type { MDXContent } from "mdx/types";
import { z } from "zod";
import { entryFactsSchema, entrySlugSchema } from "@/domain/entry";
import type { MdxFile } from "@/lib/mdx-files";
import { mdxContentSchema, parseMdxFile } from "@/lib/parse-mdx-file";
import { SITE_HOST } from "@/lib/site";

/** In progress or Complete, independent of the publication state (GLOSSARY.md, Status). */
const projectStatusSchema = z.enum(["in-progress", "complete"]);

export const STATUS_LABELS = {
  "in-progress": "In progress",
  complete: "Complete",
} satisfies Record<z.infer<typeof projectStatusSchema>, string>;

const httpsUrlSchema = z.url({ protocol: /^https$/ });

// The site's host or any subdomain of it.
const SITE_HOSTNAME_PATTERN = new RegExp(
  String.raw`^(?:[a-z0-9-]+\.)*${RegExp.escape(SITE_HOST)}$`,
);

/**
 * Where a Hosted project runs: a path on this site, or an https URL on spitzweb.dev or one of its
 * subdomains, where a Hosted project goes when it moves out (ADR 0002). Anything else is not run
 * by spitzweb, so it is an External project.
 */
const runsAtSchema = z.union(
  [
    z.string().regex(/^\/(?:[^/\\\s]\S*)?$/),
    z.url({
      protocol: /^https$/,
      hostname: SITE_HOSTNAME_PATTERN,
    }),
  ],
  { error: "must be a path on this site or an https URL on spitzweb.dev" },
);

const projectFactsSchema = entryFactsSchema.extend({
  status: projectStatusSchema,
  /** The languages, frameworks and services the Project is built with. */
  madeWith: z.array(z.string().trim().min(1)).min(1),
});

/** A place an External project lives: the product, its source, a write-up elsewhere. */
const externalLinkSchema = z.strictObject({
  label: z.string().trim().min(1),
  href: httpsUrlSchema,
});

const projectFrontmatterSchema = z.discriminatedUnion("kind", [
  projectFactsSchema.extend({ kind: z.literal("hosted"), runsAt: runsAtSchema }),
  projectFactsSchema.extend({
    kind: z.literal("external"),
    links: z.array(externalLinkSchema).min(1),
  }),
]);

export type Project = z.infer<typeof projectFrontmatterSchema> & {
  type: "project";
  slug: z.infer<typeof entrySlugSchema>;
  Content: MDXContent;
};

const projectModuleSchema = z.object({
  /** The file name, which becomes the Project's URL. */
  slug: entrySlugSchema,
  default: mdxContentSchema,
  frontmatter: projectFrontmatterSchema,
});

/** Turns compiled MDX files into Projects, each named by its file. Throws on bad frontmatter. */
export function parseProjects(files: readonly MdxFile[]): Project[] {
  return files.map((file) => {
    const { slug, default: Content, frontmatter } = parseMdxFile(file, projectModuleSchema);
    return { type: "project", slug, ...frontmatter, Content };
  });
}
