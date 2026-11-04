import Link from "next/link";
import type { Entry } from "@/domain/entry";
import { TOPIC_LABELS } from "@/domain/topic";
import { EntryDate } from "@/entry-types/articles/components/entry-date";

/**
 * Articles in the order given, one row each, in the Projects list's grammar (DESIGN.md): hairline
 * rows on the 12-column grid, the title in Title type, the rest in muted ink. A hovered or focused
 * row lifts its ground and its title turns heavy in the accent ink. With no Articles, the empty
 * state.
 */
export function ArticleList({ articles }: { articles: readonly Entry[] }) {
  if (articles.length === 0) {
    return <p className="border-bs border-rule pbs-6 text-ink-muted">No Articles yet.</p>;
  }

  return (
    // The list bleeds past the page column by the amount each row pads, so the hairlines span the
    // lifted ground while the text stays on the page column.
    <ol className="-mx-3 border-bs border-rule">
      {articles.map(({ slug, title, summary, date, topics, featured }) => (
        <li
          key={slug}
          className="group relative grid grid-cols-1 gap-x-5 gap-y-1 border-be border-rule px-3 py-4 transition-all hover:bg-ground-raised has-focus-visible:bg-ground-raised sm:grid-cols-12 sm:items-baseline"
        >
          <h2 className="font-display text-title transition-all group-hover:font-extrabold group-hover:text-accent-ink group-has-focus-visible:font-extrabold group-has-focus-visible:text-accent-ink sm:col-span-4">
            {/* The link covers the whole row, and its name stays the title. */}
            <Link href={`/articles/${slug}`} className="after:absolute after:inset-0">
              {title}
            </Link>
          </h2>
          <p className="text-ink-muted sm:col-span-5">{summary}</p>
          <p className="text-ink-muted sm:col-span-3 sm:text-end">
            {/* Featured Articles lead the list, so the mark explains why one sits above newer ones. */}
            {featured ? <span className="font-semibold text-ink">Featured · </span> : null}
            <EntryDate date={date} />
            <br />
            {topics.map((topic) => TOPIC_LABELS[topic]).join(", ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
