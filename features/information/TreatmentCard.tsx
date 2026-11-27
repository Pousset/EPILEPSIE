import { formatDate } from "@/features/information/format";
import type { Treatment } from "@/features/information/types";

export default function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const { medicalReview } = treatment;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h2 className="text-xl font-semibold">{treatment.name}</h2>

      <p className="text-sm text-zinc-800 dark:text-zinc-200">{treatment.summary}</p>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">{treatment.context}</p>

      <div>
        <h3 className="text-sm font-semibold">Sources</h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {treatment.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline"
              >
                {source.label}
                <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Sources vérifiées le{" "}
        <time dateTime={treatment.verifiedAt}>{formatDate(treatment.verifiedAt)}</time>.{" "}
        {medicalReview ? (
          <>
            Relu par {medicalReview.reviewer} le{" "}
            <time dateTime={medicalReview.reviewedAt}>{formatDate(medicalReview.reviewedAt)}</time>.
          </>
        ) : (
          "Relecture médicale en attente."
        )}
      </p>
    </article>
  );
}