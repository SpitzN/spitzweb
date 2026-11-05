import {
  PARENT_RELATIVE_IMPORT,
  VERCEL_ONLY_IMPORT,
  asErrors,
  formatting,
  strictLayers,
} from "@spitzweb/lint-config/eslint";
import { DESIGN_SYSTEM_SETTINGS, RESTYLE_POLICY } from "@spitzweb/design-system/lint-policy";
import boundaries from "eslint-plugin-boundaries";
import playwright from "eslint-plugin-playwright";
import { defineConfig, globalIgnores } from "eslint/config";

// The site lints with the repo's strict layers (@spitzweb/lint-config). Its own parts are below:
// import direction, the design-system boundary, end-to-end tests and its folder exceptions. The
// rules and the reason for each are listed in docs/tooling.md at the repo root.

// The layers of src/ (docs/architecture.md, Code layout). Shared code has no domain meaning.
const SHARED_CODE = ["components", "hooks", "lib"];
const ALL_LAYERS = [
  "app",
  "entry-type",
  "feature",
  "admin",
  "hosted-project",
  "domain",
  ...SHARED_CODE,
];

// Base UI is wrapped by the design system, so a slice composes only from its atoms (ADR 0014).
const BASE_UI_IMPORT = {
  regex: "^@base-ui/",
  message:
    "Base UI is wrapped by @spitzweb/design-system: import its atoms (e.g. @spitzweb/design-system/atoms/field), not Base UI.",
};

// Files whose default export Next.js requires.
const NEXT_DEFAULT_EXPORTS = [
  "src/app/**/{page,layout,template,default,loading,error,global-error,not-found,forbidden,unauthorized}.tsx",
  "src/app/**/{opengraph-image,twitter-image,icon,apple-icon}.{ts,tsx}",
  "src/app/**/{sitemap,robots,manifest}.ts",
];

export default defineConfig(
  globalIgnores([
    ".next",
    ".next-e2e",
    "coverage",
    "playwright-report",
    "test-results",
    "next-env.d.ts",
  ]),

  ...strictLayers({
    tsconfigRootDir: import.meta.dirname,
    tailwindStylesheet: "src/app/globals.css",
    designSystem: { restylePolicy: RESTYLE_POLICY, settings: DESIGN_SYSTEM_SETTINGS },
  }),

  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [PARENT_RELATIVE_IMPORT, VERCEL_ONLY_IMPORT, BASE_UI_IMPORT] },
      ],
    },
  },

  // --- Architecture (docs/architecture.md). An import between project files is an error unless
  // a policy allows it, and a file outside every known folder is an error. The layers grow with
  // the code; docs/tooling.md has the current table.
  {
    files: ["src/**/*.{ts,tsx}"],
    // Next.js requires these files at the top of src/, outside every layer. mdx-components.tsx
    // imports types only; the instrumentation files import Sentry and lib/env.ts.
    ignores: ["src/mdx-components.tsx", "src/instrumentation.ts", "src/instrumentation-client.ts"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/root-path": import.meta.dirname,
      "boundaries/legacy-templates": false,
      // An @/ import the resolver cannot follow counts as an unknown local file, which fails lint.
      // The default would treat it as an external package and skip every boundary check.
      // A workspace package (@spitzweb/design-system) resolves to its source outside apps/site;
      // it is a dependency like any package, not an unknown local file.
      "boundaries/flag-as-external": { unresolvableAlias: false, outsideRootPath: true },
      "boundaries/elements": [
        { type: "app", pattern: "src/app", partialMatch: false },
        { type: "entry-type", pattern: "src/entry-types/*", capture: ["name"] },
        { type: "feature", pattern: "src/features/*", capture: ["name"] },
        { type: "admin", pattern: "src/admin" },
        { type: "hosted-project", pattern: "src/hosted-projects/*", capture: ["name"] },
        { type: "domain", pattern: "src/domain" },
        { type: "components", pattern: "src/components" },
        { type: "hooks", pattern: "src/hooks" },
        { type: "lib", pattern: "src/lib" },
      ],
      "boundaries/files": [
        { category: "test", pattern: ["src/**/*.test.{ts,tsx}"] },
        { category: "style", pattern: "src/**/*.css" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkInternals: true,
          checkUnknownLocals: true,
          message:
            "This import crosses a layer boundary ({{#if from.element.types}}{{from.element.types}}{{else}}{{from.file.path}}{{/if}} → {{#if to.element.types}}{{to.element.types}}{{else}}{{to.file.path}}{{/if}}): see Import direction in docs/tooling.md.",
          policies: [
            // Routes compose: they may import every layer.
            {
              from: { element: { type: "app" } },
              allow: { to: [{ element: { type: ALL_LAYERS } }, { file: { categories: "style" } }] },
            },
            // A slice imports its own files, never another slice's (.claude/rules/structure.md).
            ...["entry-type", "feature", "hosted-project"].map((type) => ({
              from: { element: { type } },
              allow: {
                to: { element: { type, captured: { name: "{{ from.element.captured.name }}" } } },
              },
            })),
            {
              from: { element: { type: "admin" } },
              allow: { to: { element: { type: "admin" } } },
            },
            // Entry types, Features and the Admin panel read the shared domain and shared code.
            {
              from: { element: { type: ["entry-type", "feature", "admin"] } },
              allow: { to: { element: { type: ["domain", ...SHARED_CODE] } } },
            },
            // A Hosted project knows nothing about Entries, so it can move out (ADR 0002).
            {
              from: { element: { type: "hosted-project" } },
              allow: { to: { element: { type: SHARED_CODE } } },
            },
            {
              from: { element: { type: "domain" } },
              allow: { to: { element: { type: ["domain", "lib"] } } },
            },
            {
              from: { element: { type: "components" } },
              allow: {
                to: [{ element: { type: SHARED_CODE } }, { file: { categories: "style" } }],
              },
            },
            {
              from: { element: { type: "hooks" } },
              allow: { to: { element: { type: ["hooks", "lib"] } } },
            },
            {
              from: { element: { type: "lib" } },
              allow: { to: { element: { type: "lib" } } },
            },
            // Last, so it overrides every allow above: the last matching policy wins.
            {
              disallow: { to: { file: { categories: "test" } } },
              message: "No file imports a test file.",
            },
          ],
        },
      ],
      "boundaries/no-unknown-files": "error",
      "boundaries/no-unknown-dependencies": "error",
    },
  },

  // --- End-to-end tests run on Playwright.
  {
    files: ["e2e/**/*.ts"],
    extends: [playwright.configs["flat/recommended"]],
    rules: asErrors(playwright.configs["flat/recommended"].rules),
  },

  // --- Exceptions. Each one is listed in docs/tooling.md with its reason.
  {
    files: NEXT_DEFAULT_EXPORTS,
    rules: { "no-restricted-exports": "off" },
  },
  {
    // @next/mdx loads remark plugins by path and calls their default export.
    files: ["src/lib/remark-word-count.ts"],
    rules: { "no-restricted-exports": "off" },
  },
  {
    // The env accessor itself, and the browser's Sentry setup, which reads the DSN raw so zod stays
    // out of the client bundle (next.config.ts parses the same value at build time).
    files: ["src/lib/env.ts", "src/instrumentation-client.ts"],
    rules: { "no-restricted-properties": "off" },
  },
  {
    files: ["src/components/site-analytics.tsx"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [PARENT_RELATIVE_IMPORT, BASE_UI_IMPORT] }],
    },
  },

  // Prettier owns formatting: keep this last.
  formatting,
);
