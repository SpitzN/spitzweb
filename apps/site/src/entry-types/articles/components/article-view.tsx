import type { Entry } from "@/domain/entry";
import { TOPIC_LABELS } from "@/domain/topic";
import { ArticleBody } from "@/entry-types/articles/components/article-body";
import { EntryDate } from "@/entry-types/articles/components/entry-date";
import { Ledger, LedgerFact, LedgerLink } from "@/entry-types/articles/components/ledger";
import type { Article } from "@/entry-types/articles/server/parse-articles";

// Contents earn their rows only in a long piece: more than three headings.
const MIN_HEADINGS_FOR_CONTENTS = 4;

function NextArticle({ next }: { next: Entry }) {
  return (
    <nav aria-label="Next Article">
      <ul>
        <LedgerLink
          href={`/articles/${next.slug}`}
          label="Next"
          end={<EntryDate date={next.date} />}
        >
          {next.title}
        </LedgerLink>
      </ul>
    </nav>
  );
}

/**
 * One Article as a colophon ledger (the Article page's surface brief): the title, a ruled ledger
 * of its facts, contents and the way onward, then the body; the way onward again at the end.
 * `next` is the Article a reader goes to after this one, if any.
 */
export function ArticleView({ article, next }: { article: Article; next?: Entry | undefined }) {
  const { title, date, topics, state, readingMinutes, headings, Content } = article;

  return (
    <article>
      <h1 className="pbe-10 font-display text-statement font-extrabold text-balance max-inline-5xl">
        {title}
      </h1>

      <Ledger label="About this Article">
        <dl>
          {state === "archived" && <LedgerFact label="Archived">No longer maintained.</LedgerFact>}
          <LedgerFact label="Published" end={`${readingMinutes} min read`}>
            <EntryDate date={date} />
          </LedgerFact>
          <LedgerFact label="Topics">
            {topics.map((topic) => TOPIC_LABELS[topic]).join(", ")}
          </LedgerFact>
        </dl>
        {headings.length >= MIN_HEADINGS_FOR_CONTENTS && (
          <nav aria-label="Contents">
            <ol>
              {headings.map(({ text, id, level }, index) => (
                <LedgerLink key={id} href={`#${id}`} label={index === 0 ? "Contents" : undefined}>
                  <span className={level > 2 ? "ps-5" : undefined}>{text}</span>
                </LedgerLink>
              ))}
            </ol>
          </nav>
        )}
        {next !== undefined && <NextArticle next={next} />}
      </Ledger>

      <div className="grid grid-cols-1 gap-x-5 pbs-12 sm:grid-cols-12">
        <div className="sm:col-span-9 sm:col-start-3">
          <ArticleBody Content={Content} />
        </div>
      </div>

      <footer className="pbs-10">
        <Ledger label="Where to go next">
          {next !== undefined && <NextArticle next={next} />}
          <ul>
            <LedgerLink href="/articles" label="Articles">
              All Articles
            </LedgerLink>
          </ul>
        </Ledger>
      </footer>
    </article>
  );
}
