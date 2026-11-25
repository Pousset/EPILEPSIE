// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock("@/features/auth/auth-client", () => ({
  authClient: { signIn: { email: vi.fn() }, signUp: { email: vi.fn() } },
}));

import AuthForm from "@/features/auth/AuthForm";
import { authClient } from "@/features/auth/auth-client";

const signIn = vi.mocked(authClient.signIn.email);
const signUp = vi.mocked(authClient.signUp.email);

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), "camille@test.fr");
  await user.type(screen.getByLabelText(/Mot de passe/), "motdepasse123");
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("AuthForm", () => {
  it("en connexion : pas de champ prénom", () => {
    render(<AuthForm mode="signin" />);
    expect(screen.getByRole("heading", { name: "Se connecter" })).toBeTruthy();
    expect(screen.queryByLabelText("Prénom")).toBeNull();
  });

  it("en inscription : demande le prénom et appelle signUp", async () => {
    const user = userEvent.setup();
    signUp.mockResolvedValue({ error: null } as never);
    render(<AuthForm mode="signup" />);

    await user.type(screen.getByLabelText("Prénom"), "Camille");
    await fill(user);
    await user.click(screen.getByRole("button", { name: "S'inscrire" }));

    expect(signUp).toHaveBeenCalledWith({
      name: "Camille",
      email: "camille@test.fr",
      password: "motdepasse123",
      callbackURL: "/calendrier",
    });
    expect(signIn).not.toHaveBeenCalled();
  });

  it("en connexion : appelle signIn avec email et mot de passe", async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ error: null } as never);
    render(<AuthForm mode="signin" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect(signIn).toHaveBeenCalledWith({
      email: "camille@test.fr",
      password: "motdepasse123",
      callbackURL: "/calendrier",
    });
  });

  it("affiche le message d'erreur renvoyé par Better Auth", async () => {
    const user = userEvent.setup();
    signIn.mockResolvedValue({ error: { message: "Identifiants invalides" } } as never);
    render(<AuthForm mode="signin" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    expect((await screen.findByRole("alert")).textContent).toBe("Identifiants invalides");
  });

  it("désactive le bouton pendant la requête", async () => {
    const user = userEvent.setup();
    signIn.mockReturnValue(new Promise(() => {}) as never);
    render(<AuthForm mode="signin" />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Se connecter" }));

    const button = await screen.findByRole("button", { name: "Patiente…" });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });
});
