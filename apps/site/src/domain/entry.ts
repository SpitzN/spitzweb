import { z } from "zod";
import { isListed, publicationStateSchema } from "@/domain/publication";
import { topicSchema } from "@/domain/topic";

/**
 * What every Entry type shares the rules for, in one place:
 * - `pathSegment`: the first segment of its Entries' URLs, followed by the slug;
 * - `label`: what visitors call it, in the singular (GLOSSARY.md, Entry types);
 * - `isDatedByYear`: whether its Entries are shown by their year rather than their day, wherever
 *   they appear (a Project is; an Article is not).
 */
export const ENTRY_TYPES = {
  article: { pathSegment: "articles", label: "Article", isDatedByYear: false },
  project: { pathSegment: "projects", label: "Project", isDatedByYear: true },
} as const;

type EntryType = keyof typeof ENTRY_TYPES;

// Lower-case words and digits joined by single hyphens.
const SLUG_PATTERN = "[a-z0-9]+(?:-[a-z0-9]+)*";

/** An Entry's URL segment. */
export const entrySlugSchema = z.string().regex(new RegExp(`^${SLUG_PATTERN}$`));

const PATH_SEGMENT_PATTERN = Object.values(ENTRY_TYPES)
  .map(({ pathSegment }) => pathSegment)
  .join("|");

/** An Entry named by its path, such as `/projects/spitzweb`, as frontmatter refers to one. */
export const entryHrefSchema = z
  .string()
  .regex(new RegExp(`^/(?:${PATH_SEGMENT_PATTERN})/${SLUG_PATTERN}$`), {
    error: "must be an Entry's path, such as /projects/spitzweb",
  });

/**
 * The facts every Entry type shares (GLOSSARY.md, Entry). An MDX Entry type extends this schema
 * for its frontmatter; an Entry type stored in Postgres maps its rows onto the same shape.
 */
export const entryFactsSchema = z.strictObject({
  title: z.string().trim().min(1),
  /** One line saying what the Entry is, shown in lists and as the page description. */
  summary: z.string().trim().min(1),
  /** The day the Entry was first published, as YYYY-MM-DD. */
  date: z.iso.date(),
  state: publicationStateSchema,
  topics: z.array(topicSchema).min(1),
  featured: z.boolean().default(false),
  /**
   * Related entries this Entry names by path. Naming one is enough: the link shows on both
   * Entries (GLOSSARY.md, Related entries).
   */
  related: z.array(entryHrefSchema).default([]),
});

export type Entry = z.infer<typeof entryFactsSchema> & {
  type: EntryType;
  /** Unique within its Entry type. */
  slug: z.infer<typeof entrySlugSchema>;
};

/** The path a visitor opens the Entry at. */
export function entryHref({ type, slug }: Pick<Entry, "type" | "slug">) {
  return `/${ENTRY_TYPES[type].pathSegment}/${slug}`;
}

/**
 * The Entries a list shows, in the order it shows them: Published only, Featured first, each
 * group newest first. Every list on the site goes through this, so they agree. Returns a new
 * array.
 */
export function listedEntries<T extends Entry>(entries: readonly T[]) {
  return entries
    .filter(({ state }) => isListed(state))
    .toSorted((a, b) => Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date));
}
