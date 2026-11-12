import type { Entry } from "@/domain/entry";

/**
 * Splits listed Projects for the home page: the leading Featured Project goes in the Featured
 * panel, and every other Project in the list beneath it, so none is shown twice. With no Featured
 * Project there is no panel. Expects the order `listedEntries` gives (Featured first).
 */
export function featuredAndOthers<T extends Pick<Entry, "featured">>(listed: readonly T[]) {
  const [first, ...rest] = listed;
  return first?.featured
    ? { featured: first, others: rest }
    : { featured: undefined, others: [...listed] };
}
