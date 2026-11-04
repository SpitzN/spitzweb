import type { Root } from "mdast";
import { expect, test } from "vitest";
import { countWords } from "@/lib/remark-word-count";

const tree: Root = {
  type: "root",
  children: [
    { type: "yaml", value: "title: five words in frontmatter" },
    { type: "heading", depth: 2, children: [{ type: "text", value: "Two words" }] },
    {
      type: "paragraph",
      children: [
        { type: "text", value: "Read this " },
        { type: "inlineCode", value: "listedEntries()" },
        { type: "text", value: " sentence,  please." },
      ],
    },
    { type: "code", lang: "ts", value: "const ignored = 'every word in a code block';" },
  ],
};

test("counts the words a reader reads: prose, headings and inline code", () => {
  expect(countWords(tree)).toBe(7);
});

test("an empty document has no words", () => {
  expect(countWords({ type: "root", children: [] })).toBe(0);
});
