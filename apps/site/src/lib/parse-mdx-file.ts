import type { MDXContent } from "mdx/types";
import { z } from "zod";
import type { MdxFile } from "@/lib/mdx-files";

/** The component an MDX module exports by default: its body. */
export const mdxContentSchema = z.custom<MDXContent>((value) => typeof value === "function");

function fileNameOf(path: string) {
  return path.slice(path.lastIndexOf("/") + 1, -".mdx".length);
}

// A module namespace is an object; anything else parses as having no exports.
function asObject(value: unknown) {
  return typeof value === "object" && value !== null ? { ...value } : {};
}

function describeIssues(path: string, error: z.ZodError) {
  const lines = error.issues.map(({ path: field, message }) => {
    // Issues under the module's other exports are build bugs, not content errors; show the full path.
    const name = field[0] === "frontmatter" ? field.slice(1).join(".") : field.join(".");
    return `  ${name === "" ? "frontmatter" : name}: ${message}`;
  });
  return `${path} has invalid frontmatter:\n${lines.join("\n")}`;
}

/**
 * Parses one compiled MDX file with `schema`, which receives the module's exports plus `slug`,
 * the file's name without `.mdx`. Content that breaks the schema is a broken invariant, so this
 * throws with the file and every failing field, and the build that loads it fails.
 */
export function parseMdxFile<S extends z.ZodType>({ path, module }: MdxFile, schema: S) {
  const parsed = schema.safeParse({ slug: fileNameOf(path), ...asObject(module) });
  if (!parsed.success) throw new Error(describeIssues(path, parsed.error));
  return parsed.data;
}
