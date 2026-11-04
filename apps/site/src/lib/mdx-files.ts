import "server-only";
import { CONTENT_FILES } from "@/lib/content-glob";

/** One compiled MDX file: its path from the app root, and the module @next/mdx built from it. */
export interface MdxFile {
  path: string;
  module: unknown;
}

/**
 * Every MDX file directly in `content/<collection>/` (subfolders are not part of a collection),
 * sorted by path. Modules are unparsed: the Entry type that owns the collection parses them
 * (docs/architecture.md, Boundaries where zod parses).
 */
export function mdxFilesIn(collection: string): MdxFile[] {
  const folder = `content/${collection}/`;
  return Object.entries(CONTENT_FILES)
    .filter(
      ([path]) =>
        path.includes(folder) && !path.slice(path.indexOf(folder) + folder.length).includes("/"),
    )
    .map(([path, module]) => ({ path: path.slice(1), module }));
}
