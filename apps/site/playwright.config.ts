import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? "github" : "list",
  use: { baseURL: "http://localhost:3100", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // The suite builds its own copy of the site against fixture content (e2e/content, swapped in by
  // next.config.ts) into .next-e2e, and serves it on its own port so a dev server can keep running.
  webServer: {
    command: "pnpm build && pnpm start --port 3100",
    // Fake server env, as in CI: the suite never reaches a real database or GitHub, and these
    // override any real values in .env.local (Next.js lets the process env win).
    env: {
      SPITZWEB_E2E: "1",
      DATABASE_URL: "postgresql://e2e:e2e@localhost:5432/e2e",
      BETTER_AUTH_SECRET: "an-e2e-secret-that-is-at-least-32-characters",
      BETTER_AUTH_URL: "http://localhost:3100",
      GITHUB_CLIENT_ID: "e2e-client-id",
      GITHUB_CLIENT_SECRET: "e2e-client-secret",
    },
    url: "http://localhost:3100",
    reuseExistingServer: !isCi,
    timeout: 300_000,
  },
});
