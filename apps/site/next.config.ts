import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// The e2e suite builds the site against fixture content (e2e/content) into its own folder, so the
// production build only ever sees content/ and the two builds never overwrite each other.
const isE2eBuild = process.env.SPITZWEB_E2E === "1";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  ...(isE2eBuild && { distDir: ".next-e2e" }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
    ...(isE2eBuild && {
      resolveAlias: { "@/lib/content-glob": "./e2e/content-glob.ts" },
    }),
  },
};

// Turbopack takes remark plugins by name, because functions can't cross into Rust.
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      // Exports `wordCount`, for reading time. @next/mdx resolves names from the workspace root,
      // so a local plugin is passed by absolute path.
      path.join(import.meta.dirname, "src/lib/remark-word-count.ts"),
    ],
    // Headings get ids, and each module exports `tableOfContents` built from them.
    rehypePlugins: [
      "rehype-slug",
      "@stefanprobst/rehype-extract-toc",
      "@stefanprobst/rehype-extract-toc/mdx",
    ],
  },
});

export default withMDX(nextConfig);
