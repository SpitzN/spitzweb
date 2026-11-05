import js from "@eslint/js";
import { plugin as shadcn } from "@shadcn/lint";
import vitest from "@vitest/eslint-plugin";
import nextTypescript from "eslint-config-next/typescript";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import tailwind from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import regexp from "eslint-plugin-regexp";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

// The strict layers every workspace lints with. Next.js's own config is the base; the stricter
// layers build on it. Each workspace's eslint.config.js adds only its own parts (import direction,
// folder exceptions). The rules and the reason for each are listed in docs/tooling.md.

/** Imports that climb out of the folder; `@/` (or the package's own name) reads better. */
export const PARENT_RELATIVE_IMPORT = {
  regex: String.raw`^\.\./`,
  message: "Use the @/ alias, or the package's own name, instead of parent-relative imports.",
};

/** Vercel-only APIs stay in one component, so leaving Vercel replaces one file (ADR 0006). */
export const VERCEL_ONLY_IMPORT = {
  regex: "^@vercel/(analytics|speed-insights)(/|$)",
  message:
    "Vercel Analytics and Speed Insights are imported only by components/site-analytics.tsx.",
};

const NO_CLASS_CONSTANTS =
  "No class strings in variables: write the classes inline, or add an @utility to the stylesheet.";

const NO_REEXPORT = "No re-exports: import from the file that declares the symbol.";

// Boolean names read as a question (docs/tooling.md, Naming).
const BOOLEAN_PREFIXES = ["is", "has", "should", "can", "did", "will"];
// Boolean props that mirror an HTML attribute keep the attribute's name.
const HTML_BOOLEAN_ATTRIBUTES =
  "^(disabled|hidden|open|required|checked|selected|multiple|readOnly|autoFocus|inert)$";

const SOURCE = "src/**/*.{ts,tsx}";

/** Some presets report at "warn"; here every reported rule fails the run outright. */
export function asErrors(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([name, level]) => [name, level === "warn" ? "error" : level]),
  );
}

function typescriptLayer(tsconfigRootDir) {
  return {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir },
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
        // Classes are written inline, or a repeated set becomes an @utility in the stylesheet.
        // A className prop passed through by name is still allowed.
        {
          selector:
            "JSXAttribute[name.name='className'] > JSXExpressionContainer > Identifier[name!='className']",
          message: NO_CLASS_CONSTANTS,
        },
        {
          selector:
            "JSXAttribute[name.name='className'] > JSXExpressionContainer > TemplateLiteral > Identifier",
          message: NO_CLASS_CONSTANTS,
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
        { patterns: [PARENT_RELATIVE_IMPORT, VERCEL_ONLY_IMPORT] },
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
  };
}

/**
 * The design system's lint (ADR 0016): every class handed to a design-system component, and every
 * class anywhere, is checked against the design system and its theme. `restylePolicy` is the
 * `no-restyle` options and `settings` is `settings.shadcn`, both from `@spitzweb/design-system`.
 *
 * @returns {import("eslint").Linter.Config}
 */
export function designSystemLayer({ restylePolicy, settings }) {
  return {
    files: [SOURCE],
    plugins: { shadcn },
    settings: { shadcn: settings },
    rules: {
      "shadcn/no-restyle": ["error", restylePolicy],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-inline-styles": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
    },
  };
}

/**
 * The strict layers for one workspace, in order, ending with the exceptions every workspace
 * shares. The caller adds its own layers after these and `formatting` last.
 *
 * - `tsconfigRootDir`: the workspace folder, for type-aware rules.
 * - `tailwindStylesheet`: the stylesheet that defines the theme, relative to the workspace.
 * - `designSystem`: `restylePolicy` (the `no-restyle` options, from `@spitzweb/design-system`)
 *   and `settings` (`settings.shadcn`: which imports are design-system components).
 */
export function strictLayers({ tsconfigRootDir, tailwindStylesheet, designSystem }) {
  return [
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

    typescriptLayer(tsconfigRootDir),

    // --- React, React Compiler, accessibility, on top of Next.js's React rules.
    {
      files: [SOURCE],
      // Rules only: Next.js's config already registers these plugins, and ESLint refuses a second
      // copy.
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
        // A scrollable region (a code block) must take keyboard focus (axe:
        // scrollable-region-focusable), so a labelled region may carry tabIndex as well as a tab
        // panel.
        "jsx-a11y/no-noninteractive-tabindex": [
          "error",
          { tags: [], roles: ["tabpanel", "region"] },
        ],
      },
    },

    // --- Tailwind v4: logical properties only, and classes that are valid, unique and current.
    // Tokens only, no arbitrary values and no unknown classes are the design system's lint below
    // (docs/conventions.md, "Strict by default, loosened by folder"). Per-folder exceptions go at
    // the end of each workspace's config.
    {
      files: [SOURCE],
      plugins: { "better-tailwindcss": tailwind },
      settings: { "better-tailwindcss": { entryPoint: tailwindStylesheet } },
      rules: {
        "better-tailwindcss/enforce-logical-properties": "error",
        "better-tailwindcss/no-conflicting-classes": "error",
        "better-tailwindcss/no-duplicate-classes": "error",
        "better-tailwindcss/no-deprecated-classes": "error",
      },
    },
    designSystemLayer(designSystem),

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

    // --- Unit tests run on Vitest.
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

    // --- Exceptions every workspace shares. Each one is listed in docs/tooling.md with its reason.
    {
      files: ["*.config.{js,ts}"],
      languageOptions: { globals: globals.node },
      rules: { "no-restricted-exports": "off", "no-restricted-properties": "off" },
    },
    {
      files: ["e2e/**/*.ts", "**/*.test.{ts,tsx}"],
      rules: { "max-nested-callbacks": "off" },
    },
  ];
}

/** Prettier owns formatting: every workspace puts this last. */
export const formatting = prettier;
