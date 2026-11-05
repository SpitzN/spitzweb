import type { ReactNode } from "react";
import { EntryYear } from "@/components/entry-date";
import { TOPIC_LABELS } from "@/domain/topic";
import { STATUS_LABELS, type Project } from "@/entry-types/projects/server/parse-projects";
import { SITE_HOST } from "@/lib/site";

/** Where a Hosted project runs, written for reading: host and path, without the protocol. */
function runsAtForReading(runsAt: string) {
  const { host, pathname } = new URL(runsAt, `https://${SITE_HOST}`);
  return `${host}${pathname === "/" ? "" : pathname}`;
}

/** A fact row: a muted label and its value, on the block's own 12 columns. */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 border-be border-rule px-4 py-3 sm:grid-cols-12 sm:items-baseline sm:px-3">
      <dt className="text-ink-muted sm:col-span-4">{label}</dt>
      <dd className="sm:col-span-8">{children}</dd>
    </div>
  );
}

/**
 * The accent cell that opens the Project: the page's one accent fill, because it is the live
 * thing (DESIGN.md, The Live Thing Rule). Inside the fill, focus and selection switch to the
 * accent shadow ink, since the accent itself would vanish on it.
 */
function AccentCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group relative grid grid-cols-1 gap-x-5 border-be border-rule bg-accent px-4 py-5 text-on-accent selection:bg-on-accent selection:text-accent sm:grid-cols-12 sm:items-baseline sm:px-3">
      <p className="text-on-accent-muted sm:col-span-4">{label}</p>
      <div className="sm:col-span-8">{children}</div>
    </div>
  );
}

/** A Hosted project's cell: one target, "Open <title>", with where it runs beneath. */
function HostedCell({ title, runsAt }: { title: string; runsAt: string }) {
  return (
    <AccentCell label="Hosted">
      {/* The link covers the whole cell, and its name stays the action. Its focus ring is drawn on
          that cover, so it rings the whole target. */}
      <a
        href={runsAt}
        className="font-display text-title font-extrabold decoration-2 underline-offset-4 group-hover:underline group-has-focus-visible:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-xs focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-on-accent"
      >
        Open {title}
      </a>
      {/* A long path breaks anywhere rather than overflowing the cell. */}
      <p className="wrap-anywhere text-on-accent-muted">{runsAtForReading(runsAt)}</p>
    </AccentCell>
  );
}

/** An External project's cell: each place it lives, as its own link out. */
function ExternalCell({ links }: { links: readonly { label: string; href: string }[] }) {
  return (
    <AccentCell label="External">
      <ul className="flex flex-col gap-1">
        {links.map(({ label, href }) => (
          <li key={href}>
            <a
              href={href}
              className="font-display text-title font-extrabold underline decoration-on-accent-muted decoration-2 underline-offset-4 transition-colors hover:decoration-on-accent focus-visible:outline-on-accent"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </AccentCell>
  );
}

/**
 * A Project's title block (the Project page's surface brief): the accent cell that opens it, then
 * its facts on hairlines, Status first and in heavy type so it is never fine print. An Archived
 * Project says so before anything else. On a narrow screen the block runs to the screen's edges,
 * so the accent fill never stops just short of them.
 */
export function TitleBlock({ project }: { project: Project }) {
  return (
    <section aria-label="About this Project" className="-mx-4 border-bs border-rule sm:-mx-3">
      {project.state === "archived" && (
        <dl>
          <Fact label="Archived">No longer maintained.</Fact>
        </dl>
      )}
      {project.kind === "hosted" ? (
        <HostedCell title={project.title} runsAt={project.runsAt} />
      ) : (
        <ExternalCell links={project.links} />
      )}
      <dl>
        <Fact label="Status">
          <span className="font-display text-title font-extrabold">
            {STATUS_LABELS[project.status]}
          </span>
        </Fact>
        <Fact label="Year">
          <EntryYear date={project.date} />
        </Fact>
        <Fact label="Made with">{project.madeWith.join(", ")}</Fact>
        <Fact label="Topics">{project.topics.map((topic) => TOPIC_LABELS[topic]).join(", ")}</Fact>
      </dl>
    </section>
  );
}
