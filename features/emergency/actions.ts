"use server";

import { headers } from "next/headers";
import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import type { EmergencyCardData } from "@/features/emergency/types";

const LIMITS: Record<keyof EmergencyCardData, number> = {
  fullName: 100,
  contactName: 100,
  contactPhone: 30,
  epilepsyType: 100,
  usualDuration: 50,
  doList: 1000,
  dontList: 1000,
  medications: 1000,
  allergies: 500,
  neurologistName: 100,
  neurologistPhone: 30,
};

const PHONE_REGEX = /^[+\d][\d\s.()-]{5,29}$/;

export async function saveEmergencyCard(input: EmergencyCardData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non connecté");
  const userId = session.user.id;

  // Nettoyage et limites de longueur (jamais de userId venant du navigateur)
  const data = {} as EmergencyCardData;
  for (const key of Object.keys(LIMITS) as (keyof EmergencyCardData)[]) {
    const value = String(input[key] ?? "").trim();
    if (value.length > LIMITS[key]) throw new Error("Champ trop long");
    data[key] = value;
  }

  if (!data.fullName) throw new Error("Nom requis");
  if (data.contactPhone && !PHONE_REGEX.test(data.contactPhone)) throw new Error("Téléphone invalide");
  if (data.neurologistPhone && !PHONE_REGEX.test(data.neurologistPhone)) throw new Error("Téléphone invalide");

  await prisma.emergencyCard.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });
}