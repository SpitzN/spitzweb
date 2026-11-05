import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import {
  LatestUpdateLine,
  UnavailableLatestUpdate,
} from "@/entry-types/updates/components/latest-update";

const POSTED_AT = new Date("2026-11-05T09:30:00Z");

describe("the latest Update on the home page", () => {
  test("says what the latest Update says, and when it was posted", () => {
    const html = renderToStaticMarkup(
      <LatestUpdateLine
        update={{ text: "Rebuilding this site.", link: null, postedAt: POSTED_AT }}
      />,
    );

    expect(html).toContain("Now:");
    expect(html).toContain("Rebuilding this site.");
    expect(html).toContain('<time dateTime="2026-11-05">5 Nov 2026</time>');
    expect(html).not.toContain("<a");
  });

  test("renders an Update's text as text, never as HTML", () => {
    const html = renderToStaticMarkup(
      <LatestUpdateLine
        update={{
          text: '<script>alert(1)</script><a href="javascript:alert(1)">x</a>',
          link: null,
          postedAt: POSTED_AT,
        }}
      />,
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("<a ");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  test("links to the Update's link, named by its address without the protocol", () => {
    const html = renderToStaticMarkup(
      <LatestUpdateLine
        update={{
          text: "Rebuilding this site.",
          link: "https://github.com/SpitzN/spitzweb",
          postedAt: POSTED_AT,
        }}
      />,
    );

    expect(html).toContain('<a href="https://github.com/SpitzN/spitzweb"');
    expect(html).toContain(">github.com/SpitzN/spitzweb</a>");
  });

  test("says so when no Update has been posted yet", () => {
    const html = renderToStaticMarkup(<LatestUpdateLine update={undefined} />);

    expect(html).toContain("Now:");
    expect(html).toContain("No Updates yet.");
  });

  test("says so when Updates can't be loaded", () => {
    const html = renderToStaticMarkup(<UnavailableLatestUpdate />);

    expect(html).toContain("Updates are unavailable right now.");
  });
});
