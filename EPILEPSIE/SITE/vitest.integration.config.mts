import { defineConfig } from "vitest/config";

function loadEnvFile(path: string) {
  try {
    process.loadEnvFile(path);
  } catch {
    // fichier absent : la vérification ci-dessous le signalera
  }
}

loadEnvFile(".env.test");
const testUrl = process.env.DATABASE_URL_TEST;

loadEnvFile(".env");
const prodUrl = process.env.DATABASE_URL;

if (!testUrl) throw new Error("DATABASE_URL_TEST manquante (.env.test)");
if (testUrl === prodUrl) throw new Error("DATABASE_URL_TEST ne doit pas être la vraie base");

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["**/*.integration.test.ts"],
    env: { DATABASE_URL: testUrl },
    fileParallelism: false,
  },
});