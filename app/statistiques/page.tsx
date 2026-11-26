import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import StatsDashboard from "@/features/stats/StatsDashboard";

async function PersonalStats() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");

  const seizures = await prisma.seizure.findMany({
    where: { userId: session.user.id },
    select: { id: true, date: true, time: true, type: true, duration: true, trigger: true },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  return <StatsDashboard seizures={seizures} />;
}

export default function StatistiquesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10">
      <h1 className="text-3xl font-bold">Mes statistiques</h1>
      <Suspense fallback={<p>Chargement…</p>}>
        <PersonalStats />
      </Suspense>
    </div>
  );
}