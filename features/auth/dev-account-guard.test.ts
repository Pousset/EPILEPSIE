import { afterEach, describe, expect, it, vi } from "vitest";
import { assertNotDevAccount } from "@/features/auth/dev-account-guard";

afterEach(() => vi.unstubAllEnvs());

describe("assertNotDevAccount", () => {
  it.each(["/sign-in/email", "/sign-up/email", "/request-password-reset"])(
    "en production : refuse l'email de dev sur %s",
    (path) => {
      vi.stubEnv("NODE_ENV", "production");
      expect(() => assertNotDevAccount(path, { email: "dev@example.com" })).toThrow(
        "Identifiants invalides",
      );
    },
  );

  it("refuse aussi avec une casse ou des espaces différents", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertNotDevAccount("/sign-in/email", { email: "  Dev@Example.com " })).toThrow();
  });

  it("en production : laisse passer un autre email", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertNotDevAccount("/sign-in/email", { email: "alice@exemple.fr" })).not.toThrow();
  });

  it("en production : ignore les routes non concernées", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertNotDevAccount("/get-session", { email: "dev@example.com" })).not.toThrow();
  });

  it.each(["development", "test"])("en %s : l'email de dev reste autorisé", (env) => {
    vi.stubEnv("NODE_ENV", env);
    expect(() => assertNotDevAccount("/sign-in/email", { email: "dev@example.com" })).not.toThrow();
  });

  it("ne plante pas si le corps est absent ou sans email", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertNotDevAccount("/sign-in/email", undefined)).not.toThrow();
    expect(() => assertNotDevAccount("/sign-in/email", {})).not.toThrow();
  });
});