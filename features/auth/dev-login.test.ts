import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const update = vi.fn();
const signUpEmail = vi.fn();
const signInEmail = vi.fn();

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: (a: unknown) => findUnique(a), update: (a: unknown) => update(a) } },
}));
vi.mock("@/features/auth/auth", () => ({
  auth: {
    api: {
      signUpEmail: (a: unknown) => signUpEmail(a),
      signInEmail: (a: unknown) => signInEmail(a),
    },
  },
}));

import { devLogin } from "@/features/auth/dev-login";

describe("devLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("ENABLE_DEV_LOGIN", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("quand la connexion de développement est désactivée", () => {
    it.each([
      ["production", "true"],
      ["development", undefined],
      ["development", "false"],
    ])("refuse (NODE_ENV=%s, ENABLE_DEV_LOGIN=%s) sans toucher à la base ni à l'auth", async (env, flag) => {
      vi.stubEnv("NODE_ENV", env);
      vi.stubEnv("ENABLE_DEV_LOGIN", flag);

      await expect(devLogin()).rejects.toThrow("Connexion de développement désactivée");

      expect(findUnique).not.toHaveBeenCalled();
      expect(signUpEmail).not.toHaveBeenCalled();
      expect(update).not.toHaveBeenCalled();
      expect(signInEmail).not.toHaveBeenCalled();
    });
  });

  describe("quand elle est activée", () => {
    it("crée le compte de test s'il n'existe pas, le vérifie puis le connecte", async () => {
      findUnique.mockResolvedValue(null);

      await devLogin();

      expect(signUpEmail).toHaveBeenCalledWith({
        body: expect.objectContaining({ email: "dev@example.com" }),
      });
      expect(update).toHaveBeenCalledWith({
        where: { email: "dev@example.com" },
        data: { emailVerified: true },
      });
      expect(signInEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({ email: "dev@example.com" }),
        }),
      );
    });

    it("ne recrée pas le compte s'il existe déjà", async () => {
      findUnique.mockResolvedValue({ id: "user-1" });

      await devLogin();

      expect(signUpEmail).not.toHaveBeenCalled();
      expect(signInEmail).toHaveBeenCalledTimes(1);
    });

    it("ne modifie que le compte de développement", async () => {
      findUnique.mockResolvedValue({ id: "user-1" });

      await devLogin();

      expect(update).toHaveBeenCalledTimes(1);
      expect(update.mock.calls[0][0].where).toEqual({ email: "dev@example.com" });
    });
  });
});