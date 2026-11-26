import { DIRECTORY_KIND_LABELS } from "@/features/information/directory";
import { formatDate } from "@/features/information/format";
import type { DirectoryEntry } from "@/features/information/types";

export default function DirectoryCard({ entry }: { entry: DirectoryEntry }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="w-fit rounded-full border border-zinc-300 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">
        {DIRECTORY_KIND_LABELS[entry.kind]}
      </p>

      <h3 className="text-lg font-semibold">{entry.name}</h3>

      <p className="text-sm text-zinc-700 dark:text-zinc-300">{entry.description}</p>

      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit text-sm font-medium underline"
      >
        Ouvrir le site de {entry.name}
        <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
      </a>

      <p className="mt-auto text-xs text-zinc-600 dark:text-zinc-400">
        Informations vérifiées le{" "}
        <time dateTime={entry.verifiedAt}>{formatDate(entry.verifiedAt)}</time>
      </p>
    </article>
  );
}