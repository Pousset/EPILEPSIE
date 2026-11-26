import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { createAccountAndSignIn, firstDay, uniqueEmail, appAlert } from "./helpers";

test("l'export PDF télécharge un vrai fichier PDF", async ({ page }) => {
  await createAccountAndSignIn(page, "Alice", uniqueEmail("alice"));

  await firstDay(page).click();
  await page.getByRole("button", { name: "+ Noter une crise" }).click();
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Absence à 12:00")).toBeVisible();

  // « Toutes les crises » : le test ne dépend pas de la date du jour
  await page.getByLabel("Période à exporter").selectOption("all");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter en PDF" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/^journal-crises-\d{4}-\d{2}-\d{2}\.pdf$/);

  const content = readFileSync(await download.path());
  expect(content.subarray(0, 5).toString()).toBe("%PDF-");
  expect(content.length).toBeGreaterThan(1000);
});

test("l'export affiche un message quand il n'y a aucune crise", async ({ page }) => {
  await createAccountAndSignIn(page, "Alice", uniqueEmail("alice"));

  await page.getByRole("button", { name: "Exporter en PDF" }).click();

  await expect(appAlert(page)).toHaveText("Aucune crise sur cette période.");
});

