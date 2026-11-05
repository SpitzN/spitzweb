import "server-only";
import { isReachable } from "@/domain/publication";
import { parseProjects } from "@/entry-types/projects/server/parse-projects";
import { mdxFilesIn } from "@/lib/mdx-files";

/** Every Project in `content/projects/`, in every publication state. Throws on bad frontmatter. */
export function loadProjects() {
  return parseProjects(mdxFilesIn("projects"));
}

/** The slugs of every Project a visitor may open, which the Project route prerenders. */
export function reachableProjectSlugs() {
  return loadProjects()
    .filter(({ state }) => isReachable(state))
    .map(({ slug }) => slug);
}

/** The Project at `slug` if a visitor may open it; a Draft or an unknown slug gives undefined. */
export function findReachableProject(slug: string) {
  return loadProjects().find((project) => project.slug === slug && isReachable(project.state));
}
