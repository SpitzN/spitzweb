import "server-only";
import { isReachable } from "@/domain/publication";
import { parseArticles } from "@/entry-types/articles/server/parse-articles";
import { mdxFilesIn } from "@/lib/mdx-files";

/** Every Article in `content/articles/`, in every publication state. Throws on bad frontmatter. */
export function loadArticles() {
  return parseArticles(mdxFilesIn("articles"));
}

/** The slugs of every Article a visitor may open, which the Article route prerenders. */
export function reachableArticleSlugs() {
  return loadArticles()
    .filter(({ state }) => isReachable(state))
    .map(({ slug }) => slug);
}

/** The Article at `slug` if a visitor may open it; a Draft or an unknown slug gives undefined. */
export function findReachableArticle(slug: string) {
  return loadArticles().find((article) => article.slug === slug && isReachable(article.state));
}
