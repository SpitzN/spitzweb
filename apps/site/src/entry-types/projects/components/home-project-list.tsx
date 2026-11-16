import { entryHref } from "@/domain/entry";
import { SelectableProjectList } from "@/entry-types/projects/components/selectable-project-list";
import { STATUS_LABELS, type Project } from "@/entry-types/projects/server/parse-projects";

/**
 * The Projects list on the home page, in the order given: rows whose selection the pointer, focus
 * and J and K move, and a line saying so where a keyboard is likely. With no Projects, the empty
 * state, as on the Projects list.
 */
export function HomeProjectList({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) {
    return <p className="border-bs border-rule pbs-6 text-ink-muted">No Projects yet.</p>;
  }

  // A Project carries its compiled write-up, which can't cross to the client, so the list gets
  // only what a row shows.
  const rows = projects.map((project) => ({
    href: entryHref(project),
    title: project.title,
    summary: project.summary,
    isFeatured: project.featured,
    date: project.date,
    statusLabel: STATUS_LABELS[project.status],
  }));

  return (
    <>
      <SelectableProjectList rows={rows} />
      {/* A touch screen has no J or K to press. */}
      <p className="hidden pbs-4 text-sm text-ink-muted pointer-fine:block">
        J and K move through the Projects, and Enter opens one.
      </p>
    </>
  );
}
