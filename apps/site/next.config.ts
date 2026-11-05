import path from "node:path";
import createMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import { cspReportUriFromDsn } from "./src/lib/csp-report-uri";
import { readPublicEnv } from "./src/lib/env";

// The e2e suite builds the site against fixture content (e2e/content) into its own folder, so the
// production build only ever sees content/ and the two builds never overwrite each other.
const isE2eBuild = process.env.SPITZWEB_E2E === "1";
const isDev = process.env.NODE_ENV === "development";
// Parsed here as well as read in the browser, so a malformed DSN fails the build.
const sentryDsn = readPublicEnv().NEXT_PUBLIC_SENTRY_DSN;

// ADR 0007. The CSP allows inline scripts and styles: Next.js inlines both, and the only way to
// allow them without 'unsafe-inline' is a per-request nonce, which would make every page dynamic
// (ADR 0011). It runs report-only until the reports are clean, and reports go to Sentry when a
// DSN is set. React's dev build needs eval, and in dev Vercel Analytics and Speed Insights load
// debug scripts from Vercel's CDN; on Vercel both load from the site's own /_vercel path.
const reportOnlyCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  // Admin sign-in posts to the site, which redirects to GitHub; form-action covers that redirect.
  "form-action 'self' https://github.com",
  ...(sentryDsn ? [`report-uri ${cspReportUriFromDsn(sentryDsn)}`] : []),
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Browsers ignore frame-ancestors in a report-only policy, so it is enforced on its own.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Content-Security-Policy-Report-Only", value: reportOnlyCsp },
];

const nextConfig: NextConfig = {
  headers: () => Promise.resolve([{ source: "/:path*", headers: securityHeaders }]),
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

// Source maps upload only when SENTRY_AUTH_TOKEN is set (Vercel production and preview builds);
// elsewhere the build skips the upload. Browser events go through /monitoring, a rewrite to
// Sentry on our own origin, so ad blockers don't drop them and the CSP needs no Sentry origin.
export default withSentryConfig(withMDX(nextConfig), {
  org: "spitzweb-site",
  project: "site",
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  silent: !process.env.CI,
});
