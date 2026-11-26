import type { Seizure } from "@/features/calendar/types";
import { dateKey } from "@/features/calendar/export-pdf";

// "1 min 30 s" -> 90 ; "30 s" -> 30 ; "2 min" -> 120 ; "Non précisée" -> null
export function parseDurationSeconds(text: string): number | null {
  const t = text.toLowerCase().replace(",", ".");
  const min = t.match(/(\d+(?:\.\d+)?)\s*min/);
  const sec = t.match(/(\d+(?:\.\d+)?)\s*s(?:ec|econdes?)?\b/);
  if (!min && !sec) return null;
  return Math.round((min ? parseFloat(min[1]) * 60 : 0) + (sec ? parseFloat(sec[1]) : 0));
}

export function formatSeconds(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? (s > 0 ? `${m} min ${s} s` : `${m} min`) : `${s} s`;
}

function countBy(list: Seizure[], key: "type" | "trigger") {
  const map = new Map<string, number>();
  for (const s of list) map.set(s[key], (map.get(s[key]) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

// Nombre de crises par mois sur les `months` derniers mois (mois courant inclus)
function perMonth(list: Seizure[], today: Date, months: number) {
  const result: { key: string; count: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    result.push({ key, count: list.filter((s) => s.date.startsWith(key)).length });
  }
  return result;
}

// Écart en jours calendaires, calculé en UTC pour éviter les décalages d'heure d'été
function daysBetween(fromKey: string, today: Date): number {
  const [y, m, d] = fromKey.split("-").map(Number);
  const from = Date.UTC(y, m - 1, d);
  const to = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((to - from) / 86_400_000);
}

export function computeStats(seizures: Seizure[], today = new Date()) {
  const sorted = [...seizures].sort((a, b) =>
    (a.date + a.time).localeCompare(b.date + b.time),
  );
  const durations = sorted
    .map((s) => parseDurationSeconds(s.duration))
    .filter((n): n is number => n !== null);

  const last = sorted.filter((s) => s.date <= dateKey(today)).at(-1);

  return {
    total: sorted.length,
    byType: countBy(sorted, "type"),
    byTrigger: countBy(sorted, "trigger"),
    perMonth: perMonth(sorted, today, 6),
    averageDurationSeconds: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null,
    durationsUsed: durations.length, // à afficher : « moyenne sur N crises »
    daysSinceLast: last ? Math.max(0, daysBetween(last.date, today)) : null,
  };
}