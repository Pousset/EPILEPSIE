// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DevLoginButton from "@/features/auth/DevLoginButton";

const devLoginMock = vi.fn();
vi.mock("@/features/auth/dev-login", () => ({
  devLogin: () => devLoginMock(),
}));

const assignMock = vi.fn();

describe("DevLoginButton", () => {
  beforeEach(() => {
    devLoginMock.mockReset();
    assignMock.mockReset();
    // jsdom ne permet pas de spy sur location.assign : on remplace location
    vi.stubGlobal("location", { ...window.location, assign: assignMock });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("affiche le bouton de connexion de développement", () => {
    render(<DevLoginButton />);
    expect(
      (screen.getByRole("button", {
        name: /connexion de développement/i,
      }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it("appelle devLogin puis redirige vers /calendrier", async () => {
    devLoginMock.mockResolvedValue(undefined);
    render(<DevLoginButton />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(assignMock).toHaveBeenCalledWith("/calendrier"));
    expect(devLoginMock).toHaveBeenCalledTimes(1);
  });

  it("se désactive et affiche « Connexion… » pendant la connexion", async () => {
    let resolve!: () => void;
    devLoginMock.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    render(<DevLoginButton />);

    await userEvent.click(screen.getByRole("button"));

    const button = screen.getByRole("button", { name: /connexion…/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);

    resolve();
    await waitFor(() => expect(assignMock).toHaveBeenCalled());
  });

  it("ne redirige pas et se réactive si devLogin échoue", async () => {
    devLoginMock.mockRejectedValue(new Error("Connexion de développement désactivée"));
    render(<DevLoginButton />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() =>
      expect(
        (screen.getByRole("button", {
          name: /connexion de développement/i,
        }) as HTMLButtonElement).disabled,
      ).toBe(false),
    );
    expect(assignMock).not.toHaveBeenCalled();
  });
});
