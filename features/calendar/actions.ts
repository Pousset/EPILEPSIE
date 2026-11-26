// app/calendrier/actions.ts
"use server";

import { headers } from "next/headers";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import { SEIZURE_TYPES, SEIZURE_TRIGGERS } from "@/features/calendar/options";
import type { Seizure } from "@/features/calendar/types";

type SeizureInput = {
  date: string;
  time: string;
  type: string;
  duration: string;
  trigger: string;
};

const SEIZURE_SELECT = {
  id: true,
  date: true,
  time: true,
  type: true,
  duration: true,
  trigger: true,
} as const;

// Vérifie la session côté serveur et renvoie l'id de l'utilisateur
async function requireUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non connecté");
  return session.user.id;
}

// Valide et normalise les champs reçus du navigateur (ajout et modification)
function validateInput(input: SeizureInput): SeizureInput {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) throw new Error("Date invalide");
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) throw new Error("Heure invalide");
  if (!SEIZURE_TYPES.includes(input.type)) throw new Error("Type invalide");
  if (!SEIZURE_TRIGGERS.includes(input.trigger)) throw new Error("Déclencheur invalide");

  return {
    date: input.date,
    time: input.time,
    type: input.type,
    trigger: input.trigger,
    duration: input.duration.trim().slice(0, 50) || "Non précisée",
  };
}

export async function addSeizure(input: SeizureInput): Promise<Seizure> {
  const userId = await requireUserId();
  const data = validateInput(input);

  return prisma.seizure.create({
    data: { userId, ...data },
    select: SEIZURE_SELECT,
  });
}

export async function updateSeizure(id: string, input: SeizureInput): Promise<Seizure> {
  const userId = await requireUserId();
  const data = validateInput(input);

  // Le filtre sur userId garantit qu'on ne peut modifier que ses propres crises.
  // Prisma lève une erreur si aucune crise ne correspond à ce couple id + userId.
  return prisma.seizure.update({
    where: { id, userId },
    data,
    select: SEIZURE_SELECT,
  });
}

export async function deleteSeizure(id: string) {
  const userId = await requireUserId();

  // Le filtre sur userId garantit qu'on ne peut supprimer que ses propres crises
  await prisma.seizure.deleteMany({ where: { id, userId } });
}