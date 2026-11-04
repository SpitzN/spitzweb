import type { Nodes, Root } from "mdast";
import { define } from "unist-util-mdx-define";
import type { VFile } from "vfile";

// Node types whose words a reader reads. Code blocks, frontmatter and MDX expressions are left out.
const READ_TYPES = new Set(["text", "inlineCode"]);

/** The words a reader reads in a Markdown tree: prose, headings and inline code. */
export function countWords(node: Nodes): number {
  if (READ_TYPES.has(node.type) && "value" in node) {
    return node.value.match(/\S+/g)?.length ?? 0;
  }
  if (!("children" in node)) return 0;
  return node.children.reduce((total, child) => total + countWords(child), 0);
}

function defineWordCount(tree: Root, file: VFile) {
  define(tree, file, { wordCount: { type: "Literal", value: countWords(tree) } });
}

/**
 * A remark plugin that exports `wordCount` from every MDX module (next.config.ts). @next/mdx loads
 * plugins by path and calls their default export, so this file keeps one.
 */
export default function remarkWordCount() {
  return defineWordCount;
}
