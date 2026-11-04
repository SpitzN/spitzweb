/**
 * Where a reader goes after finishing the Article at `slug`: the one after it in `listed` (the
 * Articles list, in its order), or the top of the list when this Article is not in it. The last
 * listed Article has none.
 */
export function nextArticle<T extends { slug: string }>(listed: readonly T[], slug: string) {
  // An Article in no list gives -1, so index + 1 lands on the top of the list.
  const index = listed.findIndex((article) => article.slug === slug);
  return listed[index + 1];
}
