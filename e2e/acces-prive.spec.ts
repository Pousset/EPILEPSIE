import { expect, test } from "@playwright/test";

test("un visiteur non connecté est redirigé de /calendrier vers /connexion", async ({ page }) => {
  await page.goto("/calendrier");

  await expect(page).toHaveURL(/\/connexion$/);
  await expect(page.getByRole("heading", { name: "Se connecter" })).toBeVisible();
});

test("la page d'accueil affiche le calendrier de démonstration", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByText("Exemple : ces données sont fictives et ne sont pas enregistrées."),
  ).toBeVisible();
});