import { z } from "zod";
import { isListed, publicationStateSchema } from "@/domain/publication";
import { topicSchema } from "@/domain/topic";

/**
 * The facts every Entry type shares (GLOSSARY.md, Entry). An MDX Entry type extends this schema
 * for its frontmatter; an Entry type stored in Postgres maps its rows onto the same shape.
 */
/** An Entry's URL segment: lower-case words and digits joined by single hyphens. */
export const entrySlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const entryFactsSchema = z.strictObject({
  title: z.string().trim().min(1),
  /** One line saying what the Entry is, shown in lists and as the page description. */
  summary: z.string().trim().min(1),
  /** The day the Entry was first published, as YYYY-MM-DD. */
  date: z.iso.date(),
  state: publicationStateSchema,
  topics: z.array(topicSchema).min(1),
  featured: z.boolean().default(false),
});

export type Entry = z.infer<typeof entryFactsSchema> & {
  /** Unique within its Entry type. */
  slug: z.infer<typeof entrySlugSchema>;
};

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
