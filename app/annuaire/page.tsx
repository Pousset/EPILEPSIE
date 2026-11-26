import type { Metadata } from "next";
import DirectoryCard from "@/features/information/DirectoryCard";
import { COUNTRIES } from "@/features/information/countries";
import { DIRECTORY } from "@/features/information/directory";

export const metadata: Metadata = {
  title: "Annuaire des centres spécialisés",
  description:
    "Annuaires officiels et centres spécialisés dans l'épilepsie en France, en Belgique et en Suisse.",
};

export default function AnnuairePage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Annuaire des centres spécialisés</h1>
        <p className="max-w-prose text-zinc-700 dark:text-zinc-300">
          Des annuaires officiels et des centres hospitaliers spécialisés dans l&apos;épilepsie.
          Nous ne listons pas de médecins : votre médecin ou votre neurologue reste le mieux placé
          pour vous orienter vers le bon centre.
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
        const list = DIRECTORY.filter((entry) => entry.country === country.id);
        if (list.length === 0) return null;

        return (
          <section key={country.id} id={country.id} aria-labelledby={`titre-${country.id}`}>
            <h2 id={`titre-${country.id}`} className="mb-4 text-2xl font-semibold">
              {country.label}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((entry) => (
                <DirectoryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Ces liens sont donnés à titre d&apos;information. En cas d&apos;urgence, appelez les
        secours. Ce site ne remplace pas un avis médical.
      </p>
    </div>
  );
}