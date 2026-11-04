import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import tailwind from "eslint-plugin-better-tailwindcss";
import boundaries from "eslint-plugin-boundaries";
import nextTypescript from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import jsxA11y from "eslint-plugin-jsx-a11y";
import vitest from "@vitest/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import reactHooks from "eslint-plugin-react-hooks";
import regexp from "eslint-plugin-regexp";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

// Next.js's own config is the base; the stricter layers below build on it. The rules and the
// reason for each are listed in docs/tooling.md at the repo root.

const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone|mauve|olive|mist|taupe";

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

const NO_REEXPORT = "No re-exports: import from the file that declares the symbol.";

// Files whose default export Next.js requires.
const NEXT_DEFAULT_EXPORTS = [
  "src/app/**/{page,layout,template,default,loading,error,global-error,not-found,forbidden,unauthorized}.tsx",
  "src/app/**/{opengraph-image,twitter-image,icon,apple-icon}.{ts,tsx}",
  "src/app/**/{sitemap,robots,manifest}.ts",
];

// Boolean names read as a question (docs/tooling.md, Naming).
const BOOLEAN_PREFIXES = ["is", "has", "should", "can", "did", "will"];
// Boolean props that mirror an HTML attribute keep the attribute's name.
const HTML_BOOLEAN_ATTRIBUTES =
  "^(disabled|hidden|open|required|checked|selected|multiple|readOnly|autoFocus|inert)$";

// Some presets report at "warn"; here every reported rule fails the run outright.
function asErrors(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([name, level]) => [name, level === "warn" ? "error" : level]),
  );
}

export default defineConfig(
  globalIgnores([
    ".next",
    ".next-e2e",
    "coverage",
    "playwright-report",
    "test-results",
    "next-env.d.ts",
  ]),

  ...nextVitals,
  ...nextTypescript,

  // Disable comments are inert and reported; with --max-warnings 0 they fail the run.
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: "error",
    },
  },

  { files: ["**/*.js"], extends: [js.configs.recommended] },

  // --- Modern, unsurprising JavaScript: unicorn's recommended set, minus the rules that clash
  // with a decision recorded in docs/tooling.md. regexp catches broken and slow patterns.
  {
    files: ["**/*.{js,ts,tsx}"],
    extends: [unicorn.configs.recommended, regexp.configs["flat/recommended"]],
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-export-from": "off",
      "unicorn/name-replacements": "off",
      "unicorn/consistent-boolean-name": "off",
      // Interface comments are TSDoc (.claude/rules/code-design.md, Comments).
      "unicorn/single-line-block-comment-style": "off",
      "unicorn/no-asterisk-prefix-in-documentation-comments": "off",
      "unicorn/consistent-destructuring": "error",
    },
  },

  // --- Core style that holds for every file.
  {
    files: ["**/*.{js,ts,tsx}"],
    rules: {
      eqeqeq: ["error", "always"],
      "no-console": "error",
      "object-shorthand": ["error", "always"],
      "prefer-template": "error",
      "no-param-reassign": ["error", { props: true }],
      "func-style": ["error", "declaration"],
    },
  },

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
      // `type` and `interface` are both fine (docs/tooling.md, Decisions).
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/switch-exhaustiveness-check": [
        "error",
        { considerDefaultExhaustiveForUnions: true },
      ],
      "@typescript-eslint/prefer-readonly": "error",

      // --- Naming (docs/tooling.md, Naming)
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["camelCase"] },
        { selector: "import", format: ["camelCase", "PascalCase"] },
        // Module-level constants may be UPPER_CASE; components assigned to a const are PascalCase.
        {
          selector: "variable",
          modifiers: ["const", "global"],
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
        },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "parameter", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        // A destructured name is chosen by the source object, not by this file.
        { selector: ["variable", "parameter"], modifiers: ["destructured"], format: null },
        // A component held in a variable or property is PascalCase, so it renders as <Content />.
        // The rule can't tell a component by type (ComponentType includes classes), so PascalCase
        // is allowed on these names whatever they hold.
        { selector: ["variable", "typeProperty"], format: ["camelCase", "PascalCase"] },
        // Env names such as SPITZWEB_E2E are UPPER_CASE wherever they appear as keys.
        { selector: "objectLiteralProperty", format: ["camelCase", "PascalCase", "UPPER_CASE"] },
        { selector: "typeLike", format: ["PascalCase"] },
        {
          selector: ["interface", "typeAlias", "class"],
          format: ["PascalCase"],
          custom: { regex: "^[IT][A-Z]", match: false },
        },
        // Keys such as "Desktop Chrome", "*.css" or "aria-label" belong to someone else's API.
        {
          selector: ["objectLiteralProperty", "typeProperty"],
          modifiers: ["requiresQuotes"],
          format: null,
        },
        {
          selector: ["variable", "parameter"],
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: BOOLEAN_PREFIXES,
        },
        {
          selector: "typeProperty",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: BOOLEAN_PREFIXES,
          filter: { regex: HTML_BOOLEAN_ATTRIBUTES, match: false },
        },
        {
          selector: ["variable", "parameter"],
          modifiers: ["destructured"],
          types: ["boolean"],
          format: null,
        },
      ],

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
          AssignmentExpression: { array: true, object: true },
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
            {
              regex: String.raw`^\.\./`,
              message: "Use the @/ alias instead of parent-relative imports.",
            },
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
    // Next.js requires mdx-components.tsx at the top of src/, outside every layer; it imports types only.
    ignores: ["src/mdx-components.tsx"],
    plugins: { boundaries },
    settings: {
      "import/resolver": { typescript: { project: "./tsconfig.json" } },
      "boundaries/root-path": import.meta.dirname,
      "boundaries/legacy-templates": false,
      // An @/ import the resolver cannot follow counts as an unknown local file, which fails lint.
      // The default would treat it as an external package and skip every boundary check.
      "boundaries/flag-as-external": { unresolvableAlias: false },
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

  // --- React, React Compiler, accessibility, on top of Next.js's React rules.
  {
    files: ["src/**/*.{ts,tsx}"],
    // Rules only: Next.js's config already registers these plugins, and ESLint refuses a second copy.
    rules: {
      ...reactHooks.configs.flat["recommended-latest"].rules,
      ...jsxA11y.flatConfigs.strict.rules,
      // eslint-plugin-react rules Next.js leaves off.
      "react/no-danger": "error",
      "react/jsx-no-leaked-render": "error",
      "react/no-unstable-nested-components": "error",
      "react/no-array-index-key": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-no-constructed-context-values": "error",
      "react/destructuring-assignment": ["error", "always", { destructureInSignature: "always" }],
      "react-hooks/no-deriving-state-in-effects": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/incompatible-library": "error",
      "react-hooks/unsupported-syntax": "error",
      // A scrollable region (a code block) must take keyboard focus (axe: scrollable-region-focusable),
      // so a labelled region may carry tabIndex as well as a tab panel.
      "jsx-a11y/no-noninteractive-tabindex": ["error", { tags: [], roles: ["tabpanel", "region"] }],
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
              pattern: String.raw`\[([^\[\]]*?)\](?!:)`,
              message: "No arbitrary values: add a theme token.",
            },
            {
              pattern: String.raw`^(.*[:-])?(${PALETTE})-(50|[1-9]00|950)(\/.+)?$`,
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

  // --- No index barrels (.claude/rules/structure.md): a file is named for what it holds.
  {
    files: ["src/**/index.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "Program", message: "No index files: name the file for what it holds." },
      ],
    },
  },

  // --- Tests. Unit tests run on Vitest, end-to-end tests on Playwright.
  {
    files: ["src/**/*.test.{ts,tsx}"],
    extends: [vitest.configs.recommended],
    rules: {
      ...asErrors(vitest.configs.recommended.rules),
      "vitest/consistent-test-it": ["error", { fn: "test", withinDescribe: "test" }],
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/no-standalone-expect": "error",
      "vitest/prefer-hooks-on-top": "error",
      "vitest/prefer-hooks-in-order": "error",
      "vitest/prefer-to-be": "error",
      "vitest/prefer-strict-equal": "error",
    },
  },
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
