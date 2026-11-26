import { afterEach, describe, expect, it, vi } from "vitest";
import { isDevLoginEnabled } from "@/features/auth/dev-login-config";

describe("isDevLoginEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("est actif en développement avec ENABLE_DEV_LOGIN=true", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ENABLE_DEV_LOGIN", "true");
    expect(isDevLoginEnabled()).toBe(true);
  });

  it("est actif en test avec ENABLE_DEV_LOGIN=true", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("ENABLE_DEV_LOGIN", "true");
    expect(isDevLoginEnabled()).toBe(true);
  });

  it("est inactif en production, même avec ENABLE_DEV_LOGIN=true", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ENABLE_DEV_LOGIN", "true");
    expect(isDevLoginEnabled()).toBe(false);
  });

  it("est inactif si ENABLE_DEV_LOGIN n'est pas défini", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ENABLE_DEV_LOGIN", undefined);
    expect(isDevLoginEnabled()).toBe(false);
  });

  it.each(["false", "1", "TRUE", "yes", ""])(
    "est inactif si ENABLE_DEV_LOGIN vaut %j (seul \"true\" active)",
    (value) => {
      vi.stubEnv("NODE_ENV", "development");
      vi.stubEnv("ENABLE_DEV_LOGIN", value);
      expect(isDevLoginEnabled()).toBe(false);
    },
  );
});