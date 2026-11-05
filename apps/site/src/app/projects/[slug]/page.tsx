import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { entrySlugSchema } from "@/domain/entry";
import { isIndexable } from "@/domain/publication";
import { relatedEntries } from "@/domain/related-entries";
import { loadArticles } from "@/entry-types/articles/server/articles";
import { ProjectView } from "@/entry-types/projects/components/project-view";
import {
  findReachableProject,
  loadProjects,
  reachableProjectSlugs,
} from "@/entry-types/projects/server/projects";

// Projects are static content (docs/conventions.md). This also makes the first request for a slug
// outside generateStaticParams wait for the full render, so a Draft or unknown slug gets a real 404
// instead of a 200 App Shell.
export const ensureStatic = "navigation";

// Cache Components needs at least one param to validate the route at build time. With no reachable
// Project yet, this slug stands in and renders the 404.
const NO_PROJECTS_YET = "__no-projects-yet__";

export function generateStaticParams() {
  const slugs = reachableProjectSlugs();
  return (slugs.length > 0 ? slugs : [NO_PROJECTS_YET]).map((slug) => ({ slug }));
}

/** The reachable Project a request names, or undefined for a malformed or unknown slug. */
async function requestedProject(params: PageProps<"/projects/[slug]">["params"]) {
  const { slug } = await params;
  const parsed = entrySlugSchema.safeParse(slug);
  return parsed.success ? findReachableProject(parsed.data) : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await requestedProject(params);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    ...(!isIndexable(project.state) && { robots: { index: false } }),
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  // An unknown slug renders on request, so the Draft rule is checked here, not only above.
  const project = await requestedProject(params);
  if (!project) notFound();
  // Related entries cross Entry types, so the route, where slices meet, gathers every Entry.
  const entries = [...loadProjects(), ...loadArticles()];
  return (
    <main className="pbs-16 pbe-24">
      <ProjectView project={project} related={relatedEntries(entries, project)} />
    </main>
  );
}
