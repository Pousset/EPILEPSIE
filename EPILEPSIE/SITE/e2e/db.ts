import { neon } from "@neondatabase/serverless";
import { getTestDatabaseUrl } from "./env";

// Retrouve le nom réel de la table des utilisateurs (User ou user selon le schéma)
async function userTable(sql: ReturnType<typeof neon>): Promise<string | null> {
  const rows = await sql.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND lower(table_name) = 'user'`,
  );
  return rows.length === 1 ? (rows[0].table_name as string) : null;
}

// Simule le clic sur le lien de confirmation reçu par email
export async function markEmailVerified(email: string) {
  const sql = neon(getTestDatabaseUrl());
  const table = await userTable(sql);
  if (!table) throw new Error("Table des utilisateurs introuvable");

  const rows = await sql.query(
    `UPDATE "${table}" SET "emailVerified" = true WHERE email = $1 RETURNING id`,
    [email],
  );
  if (rows.length !== 1) throw new Error(`Compte de test introuvable : ${email}`);
}

// Supprime les comptes créés par les tests (leurs crises partent en cascade)
export async function deleteE2eUsers() {
  const sql = neon(getTestDatabaseUrl());
  const table = await userTable(sql);
  if (!table) {
    console.warn("Nettoyage E2E ignoré : table des utilisateurs introuvable.");
    return;
  }
  await sql.query(`DELETE FROM "${table}" WHERE email LIKE $1`, ["%@e2e.local"]);
}