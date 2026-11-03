import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier/flat";
import tailwind from "eslint-plugin-better-tailwindcss";
import boundaries from "eslint-plugin-boundaries";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// The rules and the reason for each are listed in docs/tooling.md at the repo root.

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe";

const NO_REEXPORT = "No re-exports: import from the file that declares the symbol.";

// Files whose default export Next.js requires.
const NEXT_DEFAULT_EXPORTS = [
  "src/app/**/{page,layout,template,default,loading,error,global-error,not-found,forbidden,unauthorized}.tsx",
  "src/app/**/{opengraph-image,twitter-image,icon,apple-icon}.{ts,tsx}",
  "src/app/**/{sitemap,robots,manifest}.ts",
];

export default defineConfig(
  globalIgnores([".next", "coverage", "playwright-report", "test-results", "next-env.d.ts"]),

  // Disable comments are inert and reported; with --max-warnings 0 they fail the run.
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: "error",
    },
  },

  { files: ["**/*.js"], extends: [js.configs.recommended] },

  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // --- TypeScript strictness
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": true, "ts-ignore": true, "ts-nocheck": true, "ts-check": false },
      ],
      // Preset options that reject idiomatic React code; relaxed deliberately.
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
      "@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],

      // --- Shape of code
      complexity: ["error", 10],
      "max-depth": ["error", 2],
      "max-params": ["error", 3],
      "max-nested-callbacks": ["error", 2],
      "no-nested-ternary": "error",
      "no-else-return": ["error", { allowElseIf: false }],
      "no-useless-return": "error",
      "no-unneeded-ternary": "error",
      "no-lonely-if": "error",
      "prefer-destructuring": "off",
      "@typescript-eslint/prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { array: true, object: true },
          AssignmentExpression: { array: false, object: false },
        },
      ],

      // --- Modules
      "no-restricted-syntax": [
        "error",
        { selector: "ExportAllDeclaration", message: NO_REEXPORT },
        { selector: "ExportNamedDeclaration[source]", message: NO_REEXPORT },
        {
          selector: "ExportNamedDeclaration[declaration=null][source=null]",
          message:
            "No export lists: export at the declaration (export const / function / type / interface).",
        },
      ],
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { regex: "^\\.\\./", message: "Use the @/ alias instead of parent-relative imports." },
          ],
        },
      ],

      // --- Env is read through one validated accessor (.claude/rules/server.md, Env).
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message: "Read env through the validated env accessor, not process.env.",
        },
      ],
    },
  },

  // --- Architecture (docs/architecture.md). An import between project files is an error unless
  // a policy allows it, and a file outside every known folder is an error. The layers grow with
  // the code; docs/tooling.md has the current table.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/root-path": import.meta.dirname,
      "boundaries/legacy-templates": false,
      // An @/ import the resolver cannot follow counts as an unknown local file, which fails lint.
      // The default would treat it as an external package and skip every boundary check.
      "boundaries/flag-as-external": { unresolvableAlias: false },
      "boundaries/elements": [{ type: "app", pattern: "src/app", partialMatch: false }],
      "boundaries/files": [
        { category: "test", pattern: ["src/app/**/*.test.{ts,tsx}"] },
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
            {
              from: { element: { type: "app" } },
              allow: { to: [{ element: { type: "app" } }, { file: { categories: "style" } }] },
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

  // --- React, React Compiler, Next.js, accessibility
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      reactHooks.configs.flat["recommended-latest"],
      nextPlugin.configs["core-web-vitals"],
      jsxA11y.flatConfigs.strict,
    ],
    rules: {
      "react-hooks/no-deriving-state-in-effects": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/incompatible-library": "error",
      "react-hooks/unsupported-syntax": "error",
    },
  },

  // --- Tailwind v4: theme tokens only, logical properties only (docs/conventions.md,
  // "Strict by default, loosened by folder"). Per-folder exceptions go at the end of this file.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "better-tailwindcss": tailwind },
    settings: { "better-tailwindcss": { entryPoint: "src/app/globals.css" } },
    rules: {
      "better-tailwindcss/no-restricted-classes": [
        "error",
        {
          restrict: [
            {
              pattern: "\\[([^\\[\\]]*?)\\](?!:)",
              message: "No arbitrary values: add a theme token.",
            },
            {
              pattern: `^(.*[:-])?(${PALETTE})-(50|[1-9]00|950)(\\/.+)?$`,
              message: "No raw palette colours: use a theme token.",
            },
          ],
        },
      ],
      "better-tailwindcss/no-unknown-classes": "error",
      "better-tailwindcss/enforce-logical-properties": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
    },
  },

  // --- Exceptions. Each one is listed in docs/tooling.md with its reason.
  {
    files: NEXT_DEFAULT_EXPORTS,
    rules: { "no-restricted-exports": "off" },
  },
  {
    files: ["*.config.{js,ts}"],
    languageOptions: { globals: globals.node },
    rules: { "no-restricted-exports": "off", "no-restricted-properties": "off" },
  },
  {
    files: ["e2e/**/*.ts", "**/*.test.{ts,tsx}"],
    rules: { "max-nested-callbacks": "off" },
  },

  // Prettier owns formatting: keep this last.
  prettier,
);
