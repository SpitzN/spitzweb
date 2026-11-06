import { defineConfig } from "eslint/config";
import { formatting, strictLayers } from "./eslint.js";

// The shared config lints itself with the layers it hands out. It has no UI, so it takes the
// strict layers only.
export default defineConfig(
  ...strictLayers({ tsconfigRootDir: import.meta.dirname }),
  {
    // Next.js's rule looks for a pages/ folder to check links against; a package has none. Nor
    // does it install React, so eslint-plugin-react is told the version instead of detecting it.
    settings: { react: { version: "19.3" } },
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  formatting,
);
