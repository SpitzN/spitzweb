import { EntryDate, EntryYear } from "@/components/entry-date";
import { Ledger, LedgerLink } from "@/components/ledger";
import { Prose } from "@/components/prose";
import { ENTRY_TYPE_LABELS, type Entry, entryHref } from "@/domain/entry";
import { TitleBlock } from "@/entry-types/projects/components/title-block";
import type { Project } from "@/entry-types/projects/server/parse-projects";
import { CONTACT } from "@/lib/contact";

/**
 * One Project as a drawing sheet (the Project page's surface brief): the title and summary at the
 * start, the title block that opens it and holds its facts at the end, then the write-up. It ends
 * with the way onward: its Related entries, all Projects, and how to reach Nadav.
 */
export function ProjectView({
  project,
  related,
}: {
  project: Project;
  /** The Related entries to show, in order. */
  related: readonly Entry[];
}) {
  return (
    <article>
      <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-12">
        <header className="sm:col-span-7">
          <h1 className="font-display text-statement font-extrabold text-balance">
            {project.title}
          </h1>
          <p className="pbs-5 text-lg text-ink-muted max-inline-2xl">{project.summary}</p>
        </header>
        <div className="sm:col-span-5 sm:col-start-8">
          <TitleBlock project={project} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-5 pbs-16 sm:grid-cols-12">
        <div className="sm:col-span-9 sm:col-start-3">
          <Prose Content={project.Content} />
        </div>
      </div>

      <footer className="pbs-10">
        <Ledger label="Where to go next">
          {related.length > 0 && (
            <nav aria-label="Related entries">
              <ul>
                {related.map((entry, index) => (
                  <LedgerLink
                    key={entryHref(entry)}
                    href={entryHref(entry)}
                    label={index === 0 ? "Related" : undefined}
                    end={
                      <>
                        {ENTRY_TYPE_LABELS[entry.type]} ·{" "}
                        {/* A Project is dated by its year everywhere it appears. */}
                        {entry.type === "project" ? (
                          <EntryYear date={entry.date} />
                        ) : (
                          <EntryDate date={entry.date} />
                        )}
                      </>
                    }
                  >
                    {entry.title}
                  </LedgerLink>
                ))}
              </ul>
            </nav>
          )}
          <ul>
            <LedgerLink href="/projects" label="Projects">
              All Projects
            </LedgerLink>
            <LedgerLink href={CONTACT.href} label="Contact">
              {CONTACT.label}
            </LedgerLink>
          </ul>
        </Ledger>
      </footer>
    </article>
  );
}
