import type { Metadata } from "next";
import { listedEntries } from "@/domain/entry";
import { ProjectList } from "@/entry-types/projects/components/project-list";
import { loadProjects } from "@/entry-types/projects/server/projects";

export const ensureStatic = "navigation";

const DESCRIPTION = "What Nadav Spitzer builds, and the story of how and why.";

export const metadata: Metadata = { title: "Projects", description: DESCRIPTION };

export default function ProjectsPage() {
  return (
    <main className="pbs-16 pbe-24">
      <h1 className="font-display text-statement font-extrabold">Projects</h1>
      <p className="pbs-5 pbe-12 text-lg text-ink-muted max-inline-2xl">{DESCRIPTION}</p>
      <ProjectList projects={listedEntries(loadProjects())} />
    </main>
  );
}
