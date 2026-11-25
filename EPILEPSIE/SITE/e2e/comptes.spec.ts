import { expect, test } from "@playwright/test";
import { markEmailVerified } from "./db";
import { signUp, submitSignIn, uniqueEmail } from "./helpers";

test("un compte dont l'email n'est pas vérifié ne peut pas se connecter", async ({ page }) => {
  const email = uniqueEmail("non-verifie");
  await signUp(page, "Alice", email);

  await submitSignIn(page, email);

  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/connexion$/);

  await page.goto("/calendrier");
  await expect(page).toHaveURL(/\/connexion$/);
});

test("connexion après vérification, puis déconnexion", async ({ page }) => {
  const email = uniqueEmail("alice");
  await signUp(page, "Alice", email);
  await markEmailVerified(email);

  await submitSignIn(page, email);

  await expect(page).toHaveURL(/\/calendrier$/);
  await expect(page.getByText("Bonjour Alice")).toBeVisible();

  await page.getByRole("button", { name: "Déconnexion" }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
  await expect(page.getByRole("link", { name: "Connexion" })).toBeVisible();

  // Le cookie de session a disparu : /calendrier est de nouveau protégé
  await page.goto("/calendrier");
  await expect(page).toHaveURL(/\/connexion$/);
});

test("un mauvais mot de passe est refusé", async ({ page }) => {
  const email = uniqueEmail("mauvais-mdp");
  await signUp(page, "Alice", email);
  await markEmailVerified(email);

  await page.goto("/connexion");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel(/Mot de passe/).fill("pas-le-bon-mot-de-passe");
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/connexion$/);
});