import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";

function readEnvFile(path: string): Record<string, string | undefined> {
  try {
    return parseEnv(readFileSync(path, "utf8"));
  } catch {
    return {};
  }
}

// Lit les fichiers .env sans modifier process.env, et refuse de continuer
// si l'URL de test est celle de la vraie base.
export function getTestDatabaseUrl(): string {
  const testUrl = readEnvFile(".env.test").DATABASE_URL_TEST;
  const prodUrl = readEnvFile(".env").DATABASE_URL;

  if (!testUrl) throw new Error("DATABASE_URL_TEST manquante (.env.test)");
  if (testUrl === prodUrl) throw new Error("DATABASE_URL_TEST ne doit pas être la vraie base");

  return testUrl;
}