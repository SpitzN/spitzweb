import { z } from "zod";

/** Every Entry is in exactly one publication state (GLOSSARY.md, Publication). */
export const publicationStateSchema = z.enum(["draft", "unlisted", "published", "archived"]);

export type PublicationState = z.infer<typeof publicationStateSchema>;

/**
 * Whether a visitor may open the Entry at its URL. A Draft is for Nadav only, and visitors never
 * sign in, so no visitor reaches it.
 */
export function isReachable(state: PublicationState) {
  return state !== "draft";
}

/**
 * Whether search engines may index the Entry's page. An Unlisted Entry is shared by link only, so
 * it stays out of search as well as out of lists.
 */
export function isIndexable(state: PublicationState) {
  return state === "published" || state === "archived";
}

/**
 * Whether the Entry appears in lists, Activity, the sitemap and feeds. Unlisted Entries are
 * reachable only by link, and Archived Entries drop out of the main lists.
 */
export function isListed(state: PublicationState) {
  return state === "published";
}
