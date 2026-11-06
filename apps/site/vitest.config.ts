import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // server-only throws outside a React Server Components bundle, and tests import server
    // modules. Its package doesn't export the empty file, so the alias points at it by path.
    alias: {
      "server-only": fileURLToPath(new URL("node_modules/server-only/empty.js", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    // A database test starts PGlite (Postgres in WASM) and applies every migration, which takes
    // under a second alone but past Vitest's 5 s default while `pnpm check` runs every
    // workspace's lint, typecheck and tests at once (docs/tooling.md, Decisions).
    testTimeout: 20_000,
  },
});
