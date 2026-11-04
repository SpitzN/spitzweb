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
    env: { SPITZWEB_E2E: "1" },
    url: "http://localhost:3100",
    reuseExistingServer: !isCi,
    timeout: 300_000,
  },
});
