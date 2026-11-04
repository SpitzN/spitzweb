import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entrySlugSchema, listedEntries } from "@/domain/entry";
import { isIndexable } from "@/domain/publication";
import { ArticleView } from "@/entry-types/articles/components/article-view";
import {
  findReachableArticle,
  loadArticles,
  reachableArticleSlugs,
} from "@/entry-types/articles/server/articles";
import { nextArticle } from "@/entry-types/articles/server/next-article";

// Articles are static content (docs/conventions.md). This also makes the first request for a slug
// outside generateStaticParams wait for the full render, so a Draft or unknown slug gets a real 404
// instead of a 200 App Shell.
export const ensureStatic = "navigation";

// Cache Components needs at least one param to validate the route at build time. With no reachable
// Article yet, this slug stands in and renders the 404.
const NO_ARTICLES_YET = "__no-articles-yet__";

export function generateStaticParams() {
  const slugs = reachableArticleSlugs();
  return (slugs.length > 0 ? slugs : [NO_ARTICLES_YET]).map((slug) => ({ slug }));
}

/** The reachable Article a request names, or undefined for a malformed or unknown slug. */
async function requestedArticle(params: PageProps<"/articles/[slug]">["params"]) {
  const slug = entrySlugSchema.safeParse((await params).slug);
  return slug.success ? findReachableArticle(slug.data) : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const article = await requestedArticle(params);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
    ...(!isIndexable(article.state) && { robots: { index: false } }),
  };
}

export default async function ArticlePage({ params }: PageProps<"/articles/[slug]">) {
  // An unknown slug renders on request, so the Draft rule is checked here, not only above.
  const article = await requestedArticle(params);
  if (!article) notFound();
  return (
    <main className="pbs-16 pbe-24">
      <ArticleView
        article={article}
        next={nextArticle(listedEntries(loadArticles()), article.slug)}
      />
    </main>
  );
}
