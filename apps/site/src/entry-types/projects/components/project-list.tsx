import Link from "next/link";
import { EntryYear } from "@/components/entry-date";
import { entryHref } from "@/domain/entry";
import { STATUS_LABELS, type Project } from "@/entry-types/projects/server/parse-projects";

/**
 * Projects in the order given, one row each (DESIGN.md, Project list row): hairline rows on the
 * 12-column grid, the title in Title type, the summary, year and Status in muted ink. A long
 * title wraps rather than truncates, so the whole of it stays in the row. A hovered or focused
 * row lifts its ground and its title turns heavy in the accent ink. With no Projects, the empty
 * state.
 */
export function ProjectList({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) {
    return <p className="border-bs border-rule pbs-6 text-ink-muted">No Projects yet.</p>;
  }

  return (
    // The list bleeds past the page column by the amount each row pads, so the hairlines span the
    // lifted ground while the text stays on the page column; on a narrow screen, to its edges.
    <ol className="-mx-4 border-bs border-rule sm:-mx-3">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="group relative grid grid-cols-1 gap-x-5 gap-y-1 border-be border-rule px-4 py-4 transition-all hover:bg-ground-raised has-focus-visible:bg-ground-raised sm:grid-cols-12 sm:items-baseline sm:px-3"
        >
          <h2 className="font-display text-title text-balance transition-all group-hover:font-extrabold group-hover:text-accent-ink group-has-focus-visible:font-extrabold group-has-focus-visible:text-accent-ink sm:col-span-4">
            {/* The link covers the whole row, and its name stays the title. */}
            <Link href={entryHref(project)} className="after:absolute after:inset-0">
              {project.title}
            </Link>
          </h2>
          <p className="text-ink-muted sm:col-span-5">{project.summary}</p>
          <p className="text-ink-muted sm:col-span-3 sm:text-end">
            {/* Featured Projects lead the list, so the mark explains why one sits above newer ones. */}
            {project.featured ? <span className="font-semibold text-ink">Featured · </span> : null}
            <EntryYear date={project.date} />
            <br />
            {STATUS_LABELS[project.status]}
          </p>
        </li>
      ))}
    </ol>
  );
}
