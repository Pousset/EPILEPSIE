import type { Metadata } from "next";
import AssociationCard from "@/features/information/AssociationCard";
import { ASSOCIATIONS, COUNTRIES } from "@/features/information/associations";

export const metadata: Metadata = {
  title: "Associations",
  description:
    "Associations d'aide aux personnes épileptiques en France, en Belgique et en Suisse.",
};

export default function AssociationsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Associations</h1>
        <p className="max-w-prose text-zinc-700 dark:text-zinc-300">
          Des associations qui informent, accompagnent et soutiennent la recherche. Chaque fiche
          renvoie vers le site officiel, qui reste la référence.
        </p>
        <nav aria-label="Aller à un pays">
          <ul className="flex flex-wrap gap-3 text-sm font-medium">
            {COUNTRIES.map((country) => (
              <li key={country.id}>
                <a href={`#${country.id}`} className="underline">
                  {country.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {COUNTRIES.map((country) => {
        const list = ASSOCIATIONS.filter((a) => a.country === country.id);
        if (list.length === 0) return null;

        return (
          <section key={country.id} id={country.id} aria-labelledby={`titre-${country.id}`}>
            <h2 id={`titre-${country.id}`} className="mb-4 text-2xl font-semibold">
              {country.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((association) => (
                <AssociationCard key={association.id} association={association} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Ces liens sont donnés à titre d&apos;information. Ce site ne remplace pas un avis médical.
      </p>
    </div>
  );
}