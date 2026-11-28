"use server";

import { headers } from "next/headers";
import { auth } from "@/features/auth/auth";
import { isDevLoginEnabled } from "@/features/auth/dev-login-config";
import { prisma } from "@/lib/prisma";
import { DEV_USER_EMAIL } from "@/features/auth/dev-login-config";

const DEV_USER = {
  name: "Dev",
  email: DEV_USER_EMAIL,
  password: "dev-password-local-only",
};

export async function devLogin() {
  // Garde-fou côté serveur : la vérification ne dépend jamais du client
  if (!isDevLoginEnabled()) throw new Error("Connexion de développement désactivée");

  const existing = await prisma.user.findUnique({ where: { email: DEV_USER.email } });

  if (!existing) {
    await auth.api.signUpEmail({ body: DEV_USER });
  }

  // Court-circuite la vérification d'email pour ce compte uniquement
  await prisma.user.update({
    where: { email: DEV_USER.email },
    data: { emailVerified: true },
  });

  await auth.api.signInEmail({
    body: { email: DEV_USER.email, password: DEV_USER.password },
    headers: await headers(),
  });
}