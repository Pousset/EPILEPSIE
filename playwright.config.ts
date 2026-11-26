import { defineConfig, devices } from "@playwright/test";
import { getTestDatabaseUrl } from "./e2e/env";

// Le test et le serveur lisent la même valeur : elle est fixée ici, pas dans .env
process.env.ENABLE_DEV_LOGIN = "true";

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
      ENABLE_DEV_LOGIN: "true",
      DATABASE_URL: testUrl,
      BETTER_AUTH_URL: `http://localhost:${PORT}`,
      // Aucun vrai email pendant les tests : les valeurs vides l'emportent sur celles du .env
      RESEND_API_KEY: "",
      EMAIL_FROM: "",
    },
  },
});
