// Sans "use server" : simple utilitaire serveur, jamais exposé comme endpoint
export function isDevLoginEnabled() {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.ENABLE_DEV_LOGIN === "true"
  );
}