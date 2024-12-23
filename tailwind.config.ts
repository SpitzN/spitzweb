import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";
import { shadcnPlugin } from "./src/lib/plugins/shadcn-plugin";
import { auroraPlugin } from "./src/lib/plugins/aurora-plugin";
import { typographyPlugin } from "./src/lib/plugins/typography-plugin";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx, mdx}"],

  plugins: [shadcnPlugin, auroraPlugin, typographyPlugin, tailwindAnimate, tailwindTypography()],
} satisfies Config;
