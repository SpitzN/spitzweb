import Link from "next/link";
import { EntryYear } from "@/components/entry-date";
import { entryHref } from "@/domain/entry";
import { STATUS_LABELS, type Project } from "@/entry-types/projects/server/parse-projects";

const KIND_LABELS = { hosted: "Hosted", external: "External" } satisfies Record<
  Project["kind"],
  string
>;

/**
 * The home page's Featured panel (DESIGN.md, Featured panel): the page's one accent fill, because
 * the Featured Project is the live thing. It holds the Project's title, its summary and its facts,
 * and the whole panel opens the Project's page. It has no live readout yet: a Hosted project
 * supplies one when it exists, and until then nothing in it moves on its own. Below `sm` the fill
 * runs to the screen's edges, as the Title block's does.
 */
export function FeaturedProjectPanel({ project }: { project: Project }) {
  return (
    <section
      aria-label="Featured Project"
      className="group relative -mx-4 flex flex-col gap-4 bg-accent px-4 py-6 text-on-accent selection:bg-on-accent selection:text-accent sm:mx-0 sm:p-6"
    >
      <h2 className="font-display text-3xl/none font-extrabold tracking-tight text-balance lg:text-4xl/none">
        {/* The link covers the whole panel, and its name stays the title. Its focus ring is drawn
            on that cover in the accent shadow ink, so it rings the whole target. */}
        <Link
          href={entryHref(project)}
          className="decoration-2 underline-offset-4 group-hover:underline group-has-focus-visible:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-xs focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-on-accent"
        >
          {project.title}
        </Link>
      </h2>
      <p className="text-lg">{project.summary}</p>
      {/* The facts follow the title rather than sit above it: a label over a heading is a kicker. */}
      <p className="text-on-accent-muted">
        Featured · {KIND_LABELS[project.kind]} · {STATUS_LABELS[project.status]} ·{" "}
        <EntryYear date={project.date} />
      </p>
    </section>
  );
}
