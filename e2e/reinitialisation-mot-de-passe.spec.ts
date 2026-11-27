import { test, expect } from "@playwright/test";

test.describe("/reinitialiser-mot-de-passe", () => {
  test("avec un token, la route existe et affiche le formulaire", async ({ page }) => {
    const response = await page.goto("/reinitialiser-mot-de-passe?token=abc");

    expect(response?.status()).not.toBe(404);
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("sans token, affiche le message d'erreur et le lien de relance", async ({ page }) => {
    const response = await page.goto("/reinitialiser-mot-de-passe");

    expect(response?.status()).not.toBe(404);
    await expect(page.getByText("Lien invalide ou expiré")).toBeVisible();
    await expect(page.locator('a[href="/mot-de-passe-oublie"]')).toBeVisible();
  });
});