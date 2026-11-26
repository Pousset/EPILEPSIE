import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import SeizureCalendar from "@/features/calendar/SeizureCalendar";

async function PersonalCalendar() {
  // Cette page dépend de la requête : on arrête le pré-rendu ici.
  await connection();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");

  const seizures = await prisma.seizure.findMany({
    where: { userId: session.user.id },
    select: { id: true, date: true, time: true, type: true, duration: true, trigger: true },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });

  const now = new Date();

  return (
  <SeizureCalendar
    key={session.user.id}
    mode="personal"
    initialSeizures={seizures}
    initialYear={now.getFullYear()}
    initialMonth={now.getMonth()}
  />
);
}

export default function CalendrierPage() {
  return (
    <section className="flex flex-col items-center gap-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Mon calendrier</h1>
      <Suspense fallback={<p className="text-gray-500">Chargement de ton calendrier…</p>}>
        <PersonalCalendar />
      </Suspense>
    </section>
  );
}
