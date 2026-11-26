import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import EmergencyCardView from "@/features/emergency/EmergencyCardView";
import PrintButton from "@/features/emergency/PrintButton";

async function EmergencyContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");

  const card = await prisma.emergencyCard.findUnique({ where: { userId: session.user.id } });
  if (!card) redirect("/urgence/modifier");

  return (
    <>
      <div className="flex gap-3 print:hidden">
        <PrintButton />
        <Link href="/urgence/modifier" className="rounded border px-4 py-2">
          Modifier
        </Link>
      </div>
      <EmergencyCardView card={card} />
    </>
  );
}

export default function UrgencePage() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Suspense fallback={<p>Chargement…</p>}>
        <EmergencyContent />
      </Suspense>
    </div>
  );
}