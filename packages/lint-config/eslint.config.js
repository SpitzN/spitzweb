import { defineConfig } from "eslint/config";
import { formatting, strictLayers } from "./eslint.js";

// The shared config lints itself with the layers it hands out. It has no source folder, theme or
// design-system components, so only the JavaScript layers find files here.
export default defineConfig(
  ...strictLayers({
    tsconfigRootDir: import.meta.dirname,
    tailwindStylesheet: "",
    designSystem: { restylePolicy: {}, settings: {} },
  }),
  {
    // Next.js's rule looks for a pages/ folder to check links against; a package has none. Nor
    // does it install React, so eslint-plugin-react is told the version instead of detecting it.
    settings: { react: { version: "19.3" } },
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  formatting,
);
