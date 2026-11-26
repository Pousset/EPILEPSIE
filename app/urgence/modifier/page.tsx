import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import EmergencyCardForm from "@/features/emergency/EmergencyCardForm";
import { DEFAULT_DO_LIST, DEFAULT_DONT_LIST } from "@/features/emergency/types";

async function EditContent() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/connexion");

  const card = await prisma.emergencyCard.findUnique({
    where: { userId: session.user.id },
    select: {
      fullName: true, contactName: true, contactPhone: true, epilepsyType: true,
      usualDuration: true, doList: true, dontList: true, medications: true,
      allergies: true, neurologistName: true, neurologistPhone: true,
    },
  });

  return (
    <EmergencyCardForm
      initial={
        card ?? {
          fullName: session.user.name ?? "", contactName: "", contactPhone: "",
          epilepsyType: "", usualDuration: "", doList: DEFAULT_DO_LIST,
          dontList: DEFAULT_DONT_LIST, medications: "", allergies: "",
          neurologistName: "", neurologistPhone: "",
        }
      }
    />
  );
}

export default function EditEmergencyPage() {
  return (
    <div className="flex justify-center p-4">
      <Suspense fallback={<p>Chargement…</p>}>
        <EditContent />
      </Suspense>
    </div>
  );
}