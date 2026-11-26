import { defineConfig, devices } from "@playwright/test";
import { getTestDatabaseUrl } from "./e2e/env";

const testUrl = getTestDatabaseUrl();
const PORT = 3100;

export default defineConfig({
  timeout: 60_000,
  expect: { timeout: 10_000 },
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  globalTeardown: "./e2e/global-teardown.ts",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "fr-FR",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `pnpm exec next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: testUrl,
      BETTER_AUTH_URL: `http://localhost:${PORT}`,
    },
  },
});
