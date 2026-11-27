import { readFileSync } from "node:fs";
import { parse } from "dotenv";
import { defineConfig } from "vitest/config";

function readEnvFile(path: string) {
  try {
    return parse(readFileSync(path));
  } catch {
    return {};
  }
}

const testEnv = readEnvFile(".env.test");
const productionEnv = readEnvFile(".env");

// CI injects DATABASE_URL and DATABASE_URL_TEST with the same test database.
// Read the production URL only from .env to avoid comparing those CI values.
const testUrl = process.env.DATABASE_URL_TEST ?? testEnv.DATABASE_URL_TEST;
const prodUrl = productionEnv.DATABASE_URL;

if (!testUrl) throw new Error("DATABASE_URL_TEST manquante (.env.test)");
if (prodUrl && testUrl === prodUrl) {
  throw new Error("DATABASE_URL_TEST ne doit pas être la vraie base");
}

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["**/*.integration.test.ts"],
    env: { DATABASE_URL: testUrl },
    fileParallelism: false,
  },
});
