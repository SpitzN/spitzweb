import { type Entry, entryHref } from "@/domain/entry";
import { isShownAsRelated } from "@/domain/publication";

// Checks every Entry's `related` paths, not only the one being shown, so a broken path anywhere
// fails the first page build that resolves Related entries.
function throwOnMissingRelatedEntry(entries: readonly Entry[]) {
  const hrefs = new Set(entries.map((candidate) => entryHref(candidate)));
  for (const candidate of entries) {
    const missing = candidate.related.find((href) => !hrefs.has(href));
    if (missing !== undefined) {
      throw new Error(
        `${entryHref(candidate)} names a Related entry that does not exist: ${missing}`,
      );
    }
  }
}

/**
 * The Related entries a visitor sees on `entry`'s page: every Entry it names and every Entry that
 * names it, once each, newest first, leaving out any that may not be linked from another page
 * (`isShownAsRelated`). `entries` is every Entry of every type, so links across Entry types
 * resolve.
 *
 * A path in any Entry's `related` that names no Entry is a content error, so this throws with the
 * naming Entry's path and the missing one, and the build that renders a page fails.
 */
export function relatedEntries(entries: readonly Entry[], entry: Entry) {
  throwOnMissingRelatedEntry(entries);

  const href = entryHref(entry);
  return entries
    .filter(
      (candidate) =>
        entryHref(candidate) !== href &&
        (entry.related.includes(entryHref(candidate)) || candidate.related.includes(href)) &&
        isShownAsRelated(candidate.state),
    )
    .toSorted((a, b) => b.date.localeCompare(a.date));
}
