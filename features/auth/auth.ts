import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 h
    sendResetPassword: async ({ user, url }) => {
      // Pas de await : évite de révéler par le temps de réponse si l'email existe.
      void sendEmail({
        to: user.email,
        subject: "Réinitialisation de ton mot de passe",
        text: `Bonjour ${user.name},\n\nClique sur ce lien pour choisir un nouveau mot de passe (valable 1 heure) :\n${url}\n\nSi tu n'es pas à l'origine de cette demande, ignore cet email.`,
      }).catch(() => undefined);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true, // renvoie le lien si un compte non vérifié tente de se connecter
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Confirme ton adresse email",
        text: `Bonjour ${user.name},\n\nClique sur ce lien pour confirmer ton adresse email :\n${url}`,
      }).catch(() => undefined);
    },
  },
  plugins: [nextCookies()],
});
