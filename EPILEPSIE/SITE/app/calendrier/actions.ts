// app/calendrier/actions.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SEIZURE_TYPES, SEIZURE_TRIGGERS } from "@/lib/seizure-options";
import type { Seizure } from "@/data/fakeSeizures";

type SeizureInput = {
  date: string;
  time: string;
  type: string;
  duration: string;
  trigger: string;
};

// Vérifie la session côté serveur et renvoie l'id de l'utilisateur
async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non connecté");
  return session.user.id;
}

export async function addSeizure(input: SeizureInput): Promise<Seizure> {
  const userId = await requireUserId();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error("Date invalide");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) throw new Error("Heure invalide");
  if (!SEIZURE_TYPES.includes(input.type)) throw new Error("Type invalide");
  if (!SEIZURE_TRIGGERS.includes(input.trigger)) throw new Error("Déclencheur invalide");

  const duration = input.duration.trim().slice(0, 50) || "Non précisée";

  return prisma.seizure.create({
    data: {
      userId,
      date: input.date,
      time: input.time,
      type: input.type,
      duration,
      trigger: input.trigger,
    },
    select: { id: true, date: true, time: true, type: true, duration: true, trigger: true },
  });
}

export async function deleteSeizure(id: string) {
  const userId = await requireUserId();

  // Le filtre sur userId garantit qu'on ne peut supprimer que ses propres crises
  await prisma.seizure.deleteMany({ where: { id, userId } });
}