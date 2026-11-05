// Stylelint checks the CSS that the Tailwind lint rules cannot see, in every workspace. The rules
// and the reason for each are listed in docs/tooling.md at the repo root.

// Tailwind v4's own at-rules.
const TAILWIND_AT_RULES = [
  "theme",
  "utility",
  "variant",
  "custom-variant",
  "apply",
  "source",
  "plugin",
  "config",
  "reference",
];

// A raw colour value: hex, a colour function, or a named colour.
const RAW_COLOUR = [
  String.raw`/#[\da-f]{3,8}\b/i`,
  String.raw`/\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i`,
];

const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-plugin-logical-css"],
  // Disable comments are inert, as in ESLint (docs/tooling.md, Decisions).
  ignoreDisables: true,
  rules: {
    "at-rule-no-unknown": [true, { ignoreAtRules: TAILWIND_AT_RULES }],
    "at-rule-no-deprecated": [true, { ignoreAtRules: TAILWIND_AT_RULES }],
    // `@apply` takes class names, which aren't a CSS prelude.
    "at-rule-prelude-no-invalid": [true, { ignoreAtRules: TAILWIND_AT_RULES }],
    // Tailwind's theme namespaces (`--color-*`, `--text-title--line-height`) aren't kebab-case.
    "custom-property-pattern": null,
    // Tailwind documents `@import "tailwindcss"`; a token's comment sits tight against it.
    "import-notation": "string",
    "comment-empty-line-before": null,
    // Theme tokens only (.claude/rules/ui.md, Tokens): a raw colour may only define a custom
    // property, which is what a token is.
    "declaration-property-value-disallowed-list": [
      { "/^(?!--)/": RAW_COLOUR },
      { message: "No raw colours: define a token and use var(--color-…)." },
    ],
    "color-named": "never",
    // Logical properties only, so RTL stays cheap (.claude/rules/ui.md, Tokens).
    "logical-css/require-logical-properties": true,
    "logical-css/require-logical-keywords": true,
  },
};

export default config;
