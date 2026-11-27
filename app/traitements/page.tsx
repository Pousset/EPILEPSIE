import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreatmentCard from "@/features/information/TreatmentCard";
import { TREATMENTS } from "@/features/information/traitements";

export const metadata: Metadata = {
  title: "Traitements",
  description: "Présentation générale des grandes familles de traitements de l'épilepsie.",
};

export default function TraitementsPage() {
  const pendingReview = TREATMENTS.some((treatment) => treatment.medicalReview === null);

  // Garde-fou : tant qu'une fiche n'est pas relue par un professionnel de santé,
  // la page reste visible en développement mais n'existe pas en production.
  if (pendingReview && process.env.NODE_ENV === "production") notFound();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold">Traitements</h1>
        <p className="max-w-prose text-zinc-700 dark:text-zinc-300">
          Une présentation générale des grandes familles de traitements, à titre d&apos;information.
          Cette page ne donne ni dose ni conseil personnalisé : le choix d&apos;un traitement relève
          de l&apos;équipe médicale qui vous suit.
        </p>
      </header>

      {pendingReview && (
        <p className="rounded-lg border border-zinc-400 p-4 text-sm dark:border-zinc-500">
          Aperçu de développement : une partie du contenu attend encore une relecture médicale.
          Cette page n&apos;est pas publiée en production.
        </p>
      )}

      <div className="space-y-4">
        {TREATMENTS.map((treatment) => (
          <TreatmentCard key={treatment.id} treatment={treatment} />
        ))}
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        Ce site ne remplace pas un avis médical. En cas d&apos;urgence, appelez les secours.
      </p>
    </div>
  );
}