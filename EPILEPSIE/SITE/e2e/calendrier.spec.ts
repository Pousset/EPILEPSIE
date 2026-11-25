import { expect, test } from "@playwright/test";
import { createAccountAndSignIn, firstDay, uniqueEmail } from "./helpers";

test("une crise ajoutée est toujours là après rechargement", async ({ page }) => {
  await createAccountAndSignIn(page, "Alice", uniqueEmail("alice"));

  await firstDay(page).click();
  await page.getByRole("button", { name: "+ Noter une crise" }).click();
  await page.getByLabel("Type de crise").selectOption("Crise focale");
  await page.getByLabel(/Durée/).fill("1 min");
  await page.getByRole("button", { name: "Enregistrer" }).click();

  await expect(page.getByText("Crise focale à 12:00")).toBeVisible();

  await page.reload();
  await firstDay(page).click();
  await expect(page.getByText("Crise focale à 12:00")).toBeVisible();
  await expect(page.getByText("1 crise ce mois-ci")).toBeVisible();
});

test("une crise modifiée puis supprimée disparaît bien de la base", async ({ page }) => {
  await createAccountAndSignIn(page, "Alice", uniqueEmail("alice"));

  await firstDay(page).click();
  await page.getByRole("button", { name: "+ Noter une crise" }).click();
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Absence à 12:00")).toBeVisible();

  await page.getByRole("button", { name: "Modifier cette crise" }).click();
  await page.getByLabel("Type de crise").selectOption("Myoclonie");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Myoclonie à 12:00")).toBeVisible();

  await page.getByRole("button", { name: "Supprimer cette crise" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Supprimer" }).click();
  await expect(page.getByText("Aucune crise notée ce jour-là.")).toBeVisible();

  await page.reload();
  await expect(page.getByText("0 crise ce mois-ci")).toBeVisible();
});

test("le compte B ne voit jamais les crises du compte A", async ({ browser }) => {
  // Deux inscriptions complètes dans deux navigateurs : plus long qu'un test à un seul compte
  test.setTimeout(120_000);

  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  try {
    // A enregistre une crise
    await createAccountAndSignIn(pageA, "Alice", uniqueEmail("alice"));
    await firstDay(pageA).click();
    await pageA.getByRole("button", { name: "+ Noter une crise" }).click();
    await pageA.getByLabel("Type de crise").selectOption("Myoclonie");
    await pageA.getByRole("button", { name: "Enregistrer" }).click();
    await expect(pageA.getByText("Myoclonie à 12:00")).toBeVisible();
    await expect(pageA.getByText("1 crise ce mois-ci")).toBeVisible();

    // B se connecte dans un autre navigateur et ne voit rien
    await createAccountAndSignIn(pageB, "Bob", uniqueEmail("bob"));
    await expect(pageB.getByText("0 crise ce mois-ci")).toBeVisible();
    await firstDay(pageB).click();
    await expect(pageB.getByText("Aucune crise notée ce jour-là.")).toBeVisible();
    await expect(pageB.getByText("Myoclonie")).toHaveCount(0);

    // Et A voit toujours la sienne après le passage de B
    await pageA.reload();
    await expect(pageA.getByText("1 crise ce mois-ci")).toBeVisible();
  } finally {
    // Si le test a expiré, Playwright a déjà fermé les contextes : on ignore cette erreur
    await contextA.close().catch(() => undefined);
    await contextB.close().catch(() => undefined);
  }
});