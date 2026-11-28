import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { sendEmail, sendEmailInBackground } from "@/lib/email";

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

describe("sendEmailInBackground", () => {
  let consoleError: MockInstance<typeof console.error>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  const loggedText = () => consoleError.mock.calls.flat().join(" ");

  it("journalise l'échec avec console.error sans rien remonter", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");

    // Aucune exception, et retour immédiat (undefined) : on n'attend pas l'envoi
    expect(sendEmailInBackground(mail, "test")).toBeUndefined();

    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledTimes(1));
    expect(loggedText()).toContain("[email] Échec de l'envoi (test)");
    expect(loggedText()).toContain("La configuration email est incomplète.");
  });

  it("ne journalise rien quand l'envoi réussit", async () => {
    vi.stubEnv("RESEND_API_KEY", "cle-de-test");
    vi.stubEnv("EMAIL_FROM", "Site <no-reply@exemple.fr>");
    send.mockResolvedValue({ error: null });

    sendEmailInBackground(mail, "test");

    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1));
    expect(consoleError).not.toHaveBeenCalled();
  });

  it("n'écrit ni l'adresse du destinataire ni le lien dans le log", async () => {
    vi.stubEnv("RESEND_API_KEY", "cle-de-test");
    vi.stubEnv("EMAIL_FROM", "Site <no-reply@exemple.fr>");
    // Pire cas : l'erreur tierce embarque l'adresse et le lien de vérification
    send.mockRejectedValue(
      new Error("Échec pour alice@exemple.fr via https://exemple.fr/verify?token=abc123"),
    );

    sendEmailInBackground(
      { ...mail, text: "Lien : https://exemple.fr/verify?token=abc123" },
      "test",
    );

    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledTimes(1));
    const log = loggedText();
    expect(log).not.toContain("alice@exemple.fr");
    expect(log).not.toContain("exemple.fr/verify");
    expect(log).not.toContain("token=abc123");
    expect(log).not.toContain("https://");
    expect(log).toContain("[adresse masquée]");
    expect(log).toContain("[lien masqué]");
  });

  it("n'expose pas l'objet erreur (stack) dans le log", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("EMAIL_FROM", "");

    sendEmailInBackground(mail, "test");

    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledTimes(1));
    expect(
      consoleError.mock.calls.every((call) => call.every((arg) => typeof arg === "string")),
    ).toBe(true);
  });
});
