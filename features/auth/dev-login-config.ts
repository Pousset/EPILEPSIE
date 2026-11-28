// Sans "use server" : simple utilitaire serveur, jamais exposé comme endpoint
export const DEV_USER_EMAIL = "dev@example.com";

export function isDevLoginEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_DEV_LOGIN === "true"
  );
}

// Vrai si l'email est celui du compte de développement ET qu'on est en production.
// Ce compte a un mot de passe public : il ne doit jamais servir hors développement.
export function isDevAccountBlocked(email: unknown) {
  return (
    process.env.NODE_ENV === "production" &&
    typeof email === "string" &&
    email.trim().toLowerCase() === DEV_USER_EMAIL
  );
}