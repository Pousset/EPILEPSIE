// e2e/dev-login.spec.ts
import { expect, test } from "@playwright/test";

const devLoginEnabled = process.env.ENABLE_DEV_LOGIN === "true";

test.describe("Connexion de développement", () => {
  test("le bouton n'est visible que si ENABLE_DEV_LOGIN=true", async ({ page }) => {
    await page.goto("/connexion");
    const button = page.getByRole("button", { name: /connexion de développement/i });

    if (devLoginEnabled) {
      await expect(button).toBeVisible();
    } else {
      await expect(button).toHaveCount(0);
    }
  });

  test("le bouton est absent de la page d'inscription", async ({ page }) => {
    await page.goto("/inscription");
    await expect(
      page.getByRole("button", { name: /connexion de développement/i }),
    ).toHaveCount(0);
  });

  test("le clic connecte et mène au calendrier", async ({ page }) => {
    test.skip(!devLoginEnabled, "ENABLE_DEV_LOGIN n'est pas activé");

    await page.goto("/connexion");
    await page.getByRole("button", { name: /connexion de développement/i }).click();

    await expect(page).toHaveURL(/\/calendrier$/);
  });
});