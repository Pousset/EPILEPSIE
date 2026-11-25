import { expect, type Page } from "@playwright/test";
import { markEmailVerified } from "./db";

export const PASSWORD = "motdepasse-e2e-123";

export function uniqueEmail(label: string) {
  return `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@e2e.local`;
}

// Inscription par le formulaire. On attend la réponse de l'API plutôt qu'un affichage précis.
export async function signUp(page: Page, name: string, email: string) {
  await page.goto("/inscription");
  await page.getByLabel("Prénom").fill(name);
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel(/Mot de passe/).fill(PASSWORD);

  const response = page.waitForResponse(
    (r) => r.url().includes("/api/auth/sign-up/email") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "S'inscrire" }).click();
  expect((await response).ok()).toBe(true);
}

export async function submitSignIn(page: Page, email: string) {
  await page.goto("/connexion");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel(/Mot de passe/).fill(PASSWORD);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

// Crée un compte vérifié et ouvre sa session : on arrive sur /calendrier
export async function createAccountAndSignIn(page: Page, name: string, email: string) {
  await signUp(page, name, email);
  await markEmailVerified(email);
  await submitSignIn(page, email);
  await expect(page).toHaveURL(/\/calendrier$/);
}

// Premier jour du mois affiché. On filtre sur le texte visible du bouton ("1" ou "1 ●"),
// pas sur son nom accessible, qui change quand le jour contient une crise.
// (?!\d) exclut "10", "11", etc.
export const firstDay = (page: Page) =>
  page.locator("button").filter({ hasText: /^\s*1(?!\d)/ });
