import {
  PARENT_RELATIVE_IMPORT,
  VERCEL_ONLY_IMPORT,
  formatting,
  strictLayers,
  uiLayers,
} from "@spitzweb/lint-config/eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import { DESIGN_SYSTEM_SETTINGS, RESTYLE_POLICY } from "./lint-policy.js";

// The design system lints with the repo's strict layers (@spitzweb/lint-config). Its own parts
// are below; the reason for each is in docs/tooling.md at the repo root.

// The design system holds no domain meaning, so it imports nothing from an app (ADR 0014). The
// app's `@/` alias doesn't exist here; this names the mistake instead of a resolver error.
const APP_IMPORT = {
  regex: "^(@/|site(/|$))|/apps/",
  message:
    "The design system holds no domain meaning: it imports nothing from apps/site. Pass values in through props.",
};

export default defineConfig(
  globalIgnores(["coverage"]),

  ...strictLayers({ tsconfigRootDir: import.meta.dirname }),
  ...uiLayers({
    tailwindStylesheet: "src/styles/tokens.css",
    designSystem: { restylePolicy: RESTYLE_POLICY, settings: DESIGN_SYSTEM_SETTINGS },
  }),

  {
    // The design system is where Base UI is wrapped, so the shared Base UI ban is lifted here.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [PARENT_RELATIVE_IMPORT, VERCEL_ONLY_IMPORT, APP_IMPORT] },
      ],
    },
  },

  // --- Exceptions. Each one is listed in docs/tooling.md with its reason.
  {
    // Next.js's rule looks for a pages/ folder to check links against; a package has none.
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  {
    // An atom styles itself through its own cva: it is where the look is defined, so neither
    // restyling nor its own variant calls are findings there. Molecules and organisms compose
    // atoms under the same rule as the app.
    files: ["src/atoms/**"],
    rules: { "shadcn/no-restyle": "off", "shadcn/require-static-classes": "off" },
  },

  // Prettier owns formatting: keep this last.
  formatting,
);
