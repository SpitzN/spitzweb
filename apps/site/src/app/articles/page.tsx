import type { Metadata } from "next";
import { listedEntries } from "@/domain/entry";
import { ArticleList } from "@/entry-types/articles/components/article-list";
import { loadArticles } from "@/entry-types/articles/server/articles";

export const ensureStatic = "navigation";

const DESCRIPTION = "What Nadav Spitzer writes: opinions, how-tos, lessons and reviews.";

export const metadata: Metadata = { title: "Articles", description: DESCRIPTION };

export default function ArticlesPage() {
  return (
    <main className="pbs-16 pbe-24">
      <h1 className="font-display text-statement font-extrabold">Articles</h1>
      <p className="pbs-5 pbe-12 text-lg text-ink-muted max-inline-2xl">{DESCRIPTION}</p>
      <ArticleList articles={listedEntries(loadArticles())} />
    </main>
  );
}
