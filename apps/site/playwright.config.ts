import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? "github" : "list",
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Turborepo builds before e2e runs, so this only starts the production server.
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !isCi,
  },
});
