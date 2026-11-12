import { featuredAndOthers, listedEntries } from "@/domain/entry";
import { FeaturedProjectPanel } from "@/entry-types/projects/components/featured-project-panel";
import { HomeProjectList } from "@/entry-types/projects/components/home-project-list";
import { loadProjects } from "@/entry-types/projects/server/projects";
import { LatestUpdate } from "@/entry-types/updates/components/latest-update";

// A stand-in until Nadav writes the statement, and labelled as one on the page (the home page's
// surface brief, Unresolved).
const STAND_IN_STATEMENT = "Nadav Spitzer builds software you can poke at.";

/**
 * The home page (apps/site/.impeccable/surfaces): the statement and the latest Update over the
 * start seven columns, the Featured panel over the end five, and the other Projects in a full-width
 * list beneath. Below `lg` they stack.
 */
export default function HomePage() {
  const { featured, others } = featuredAndOthers(listedEntries(loadProjects()));

  return (
    <main className="pbs-16 pbe-24">
      <div className="grid grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          <h1 className="font-display text-statement font-extrabold text-balance max-inline-4xl">
            {STAND_IN_STATEMENT}
          </h1>
          {/* The statement's tight leading lets descenders hang below its box, so the note keeps
              clear of them. */}
          <p className="pbs-6 text-sm text-ink-muted">
            A stand-in line until Nadav writes the real one.
          </p>
          <LatestUpdate />
        </div>
        {featured === undefined ? null : (
          <div className="lg:col-span-5">
            <FeaturedProjectPanel project={featured} />
          </div>
        )}
      </div>
      {/* With only the Featured Project there is nothing left to list; with none at all, the list
          says so. */}
      {featured !== undefined && others.length === 0 ? null : (
        <section aria-labelledby="home-projects" className="pbs-16">
          <h2 id="home-projects" className="sr-only">
            Projects
          </h2>
          <HomeProjectList projects={others} />
        </section>
      )}
    </main>
  );
}
