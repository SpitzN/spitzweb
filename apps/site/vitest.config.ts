import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    // The gate runs before the first tested module lands.
    passWithNoTests: true,
  },
});
