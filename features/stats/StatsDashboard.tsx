import type { Seizure } from "@/features/calendar/types";
import { computeStats, formatSeconds } from "@/features/stats/stats";

const MONTHS_SHORT = [
  "janv.", "févr.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return `${MONTHS_SHORT[month - 1]} ${year}`;
}

// Barres horizontales : la valeur est toujours écrite en texte (pas de couleur seule)
function BarList({ items, total }: { items: [string, number][]; total: number }) {
  if (items.length === 0) return <p className="text-sm text-zinc-600 dark:text-zinc-400">Aucune donnée.</p>;
  return (
    <ul className="space-y-3">
      {items.map(([label, count]) => (
        <li key={label} className="text-sm">
          <div className="mb-1 flex justify-between gap-2">
            <span>{label}</span>
            <span className="font-medium">
              {count} ({Math.round((count / total) * 100)} %)
            </span>
          </div>
          <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-700" aria-hidden="true">
            <div
              className="h-2 rounded bg-blue-600"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Figure({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{hint}</p>}
    </div>
  );
}

export default function StatsDashboard({ seizures }: { seizures: Seizure[] }) {
  if (seizures.length === 0) {
    return (
      <p className="text-center">
        Aucune crise enregistrée pour l&apos;instant. Les statistiques apparaîtront
        dès que vous aurez noté des crises dans votre calendrier.
      </p>
    );
  }

  const stats = computeStats(seizures);
  const maxMonth = Math.max(1, ...stats.perMonth.map((m) => m.count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Figure label="Crises enregistrées" value={String(stats.total)} />
        <Figure
          label="Durée moyenne"
          value={
            stats.averageDurationSeconds !== null
              ? formatSeconds(stats.averageDurationSeconds)
              : "Non disponible"
          }
          hint={
            stats.durationsUsed > 0
              ? `Calculée sur ${stats.durationsUsed} crise(s) dont la durée est renseignée`
              : "Aucune durée exploitable"
          }
        />
        <Figure
          label="Depuis la dernière crise"
          value={
            stats.daysSinceLast === null
              ? "—"
              : `${stats.daysSinceLast} jour${stats.daysSinceLast > 1 ? "s" : ""}`
          }
        />
      </div>

      <Card title="Crises par mois (6 derniers mois)">
        <ul className="flex items-end gap-2" style={{ height: "10rem" }}>
          {stats.perMonth.map(({ key, count }) => (
            <li key={key} className="flex h-full flex-1 flex-col justify-end text-center text-xs">
              <span className="mb-1 font-medium">{count}</span>
              <div
                className="rounded-t bg-blue-600"
                style={{ height: `${(count / maxMonth) * 100}%`, minHeight: count ? "4px" : "0" }}
                aria-hidden="true"
              />
              <span className="mt-1 text-zinc-600 dark:text-zinc-400">{monthLabel(key)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Types de crises">
          <BarList items={stats.byType} total={stats.total} />
        </Card>
        <Card title="Déclencheurs notés">
          <BarList items={stats.byTrigger} total={stats.total} />
        </Card>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Ces statistiques sont calculées à partir de vos notes. Elles sont descriptives
        et ne constituent pas un avis médical : parlez-en à votre médecin.
      </p>
    </div>
  );
}