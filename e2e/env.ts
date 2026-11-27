import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

function readEnvFile(path: string): Record<string, string | undefined> {
  try {
    return parseEnv(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

// En local, la valeur vient de .env.test. GitHub Actions ne checkout pas les
// fichiers .env ignorés : dans ce cas, la valeur vient du secret injecté.
export function getTestDatabaseUrl(): string {
  const rawTestUrl =
    process.env.DATABASE_URL_TEST ?? readEnvFile(".env.test").DATABASE_URL_TEST;
  const testUrl = rawTestUrl?.trim().replace(/^(['"])(.*)\1$/, "$2");
  const prodUrl = readEnvFile(".env").DATABASE_URL;

  if (!testUrl) {
    throw new Error("DATABASE_URL_TEST manquante (définir le secret GitHub Actions ou .env.test)");
  }
  if (prodUrl && testUrl === prodUrl) {
    throw new Error("DATABASE_URL_TEST ne doit pas être la vraie base");
  }

  return testUrl;
}
