import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import { ProjectList } from "@/entry-types/projects/components/project-list";

test("the Projects list says so when there are no Projects", () => {
  const html = renderToStaticMarkup(<ProjectList projects={[]} />);

  expect(html).toContain("No Projects yet.");
  expect(html).not.toContain("<ol");
});
