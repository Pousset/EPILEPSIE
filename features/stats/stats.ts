import type { Seizure } from "@/features/calendar/types";


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

function countBy(list: Seizure[], key: "type" | "trigger"): [string, number][] {
  const map = new Map<string, number>();
  for (const s of list) map.set(s[key], (map.get(s[key]) ?? 0) + 1);
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

// Date -> "AAAA-MM-JJ" (heure locale). Défini ici pour éviter un import circulaire
// avec export-pdf.ts, qui dépend de ce module.
function localKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

// Crises par mois, du premier au dernier mois concernés (mois sans crise inclus)
export function monthlyCounts(list: Seizure[]): [string, number][] {
  if (list.length === 0) return [];
  const counts = new Map<string, number>();
  for (const s of list) {
    const key = s.date.slice(0, 7);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const keys = [...counts.keys()].sort();
  const [firstYear, firstMonth] = keys[0].split("-").map(Number);
  const [lastYear, lastMonth] = keys[keys.length - 1].split("-").map(Number);

  const result: [string, number][] = [];
  let y = firstYear;
  let m = firstMonth;
  while (y < lastYear || (y === lastYear && m <= lastMonth)) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    result.push([key, counts.get(key) ?? 0]);
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }
  return result;
}

// Crises par mois sur les `months` derniers mois (mois courant inclus)
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

  // Les crises datées dans le futur sont ignorées pour la « dernière crise »
  const todayKey = localKey(today);
  const last = sorted.filter((s) => s.date <= todayKey).at(-1);

  return {
    total: sorted.length,
    byType: countBy(sorted, "type"),
    byTrigger: countBy(sorted, "trigger"),
    perMonth: perMonth(sorted, today, 6),
    averageDurationSeconds: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null,
    durationsUsed: durations.length,
    lastDate: last?.date ?? null,
    daysSinceLast: last ? daysBetween(last.date, today) : null,
  };
}