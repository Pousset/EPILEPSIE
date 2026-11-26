import { formatDate } from "@/features/information/format";
import type { Association } from "@/features/information/types";

export default function AssociationCard({ association }: { association: Association }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold">{association.name}</h3>

      <p className="text-sm text-zinc-700 dark:text-zinc-300">{association.description}</p>

      <a
        href={association.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-fit text-sm font-medium underline"
      >
        Visiter le site de {association.name}
        <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
      </a>

      <p className="mt-auto text-xs text-zinc-600 dark:text-zinc-400">
        Informations vérifiées le{" "}
        <time dateTime={association.verifiedAt}>{formatDate(association.verifiedAt)}</time>
      </p>
    </article>
  );
}