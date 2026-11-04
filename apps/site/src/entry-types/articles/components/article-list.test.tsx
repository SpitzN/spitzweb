import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { ArticleList } from "@/entry-types/articles/components/article-list";

test("the Articles list says so when there are no Articles", () => {
  const html = renderToStaticMarkup(<ArticleList articles={[]} />);

  expect(html).toContain("No Articles yet.");
  expect(html).not.toContain("<ol");
});
