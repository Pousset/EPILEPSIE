// "2026-11-26" -> "26/11/2026" (sans passer par Date, donc sans décalage de fuseau)
export function formatDate(key: string): string {
  return key.split("-").reverse().join("/");
}