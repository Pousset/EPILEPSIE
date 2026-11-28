import { APIError, createAuthMiddleware } from "better-auth/api";
import { isDevAccountBlocked } from "@/features/auth/dev-login-config";

// Routes où un email est fourni : connexion, inscription, demande de réinitialisation.
const GUARDED_PATHS = new Set(["/sign-in/email", "/sign-up/email", "/request-password-reset"]);

export function assertNotDevAccount(path: string | undefined, body: unknown) {
  if (!path || !GUARDED_PATHS.has(path)) return;
  const email = (body as { email?: unknown } | null | undefined)?.email;
  if (isDevAccountBlocked(email)) {
    // 401 et non 403 : AuthForm interprète 403 comme « email non confirmé ».
    throw new APIError("UNAUTHORIZED", { message: "Identifiants invalides" });
  }
}

export const devAccountGuard = createAuthMiddleware(async (ctx) => {
  assertNotDevAccount(ctx.path, ctx.body);
});