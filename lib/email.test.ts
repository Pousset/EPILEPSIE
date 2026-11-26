import { afterEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendEmail } from "@/lib/email";

const mail = { to: "alice@exemple.fr", subject: "Sujet", text: "Texte" };

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("sendEmail", () => {
  it("n'envoie rien sans configuration (comme pendant les tests E2E)", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");

    await expect(sendEmail(mail)).rejects.toThrow("La configuration email est incomplète.");
    expect(send).not.toHaveBeenCalled();
  });

  it("envoie le message via Resend quand tout est configuré", async () => {
    vi.stubEnv("RESEND_API_KEY", "cle-de-test");
    vi.stubEnv("EMAIL_FROM", "Site <no-reply@exemple.fr>");
    send.mockResolvedValue({ error: null });

    await sendEmail(mail);

    expect(send).toHaveBeenCalledWith({
      from: "Site <no-reply@exemple.fr>",
      to: "alice@exemple.fr",
      subject: "Sujet",
      text: "Texte",
    });
  });

  it("lève une erreur si Resend refuse l'envoi", async () => {
    vi.stubEnv("RESEND_API_KEY", "cle-de-test");
    vi.stubEnv("EMAIL_FROM", "Site <no-reply@exemple.fr>");
    send.mockResolvedValue({ error: { message: "refusé" } });

    await expect(sendEmail(mail)).rejects.toThrow("Échec de l'envoi de l'email");
  });
});