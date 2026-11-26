// components/StartCalendarButton.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/features/auth/auth-client";

export default function StartCalendarButton() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  // Espace réservé pendant le chargement de la session : évite un clignotement
  if (isPending) return <div className="h-12" aria-hidden="true" />;

  // Connecté : accès direct au calendrier
  if (session) {
    return (
      <Link
        href="/calendrier"
        className="rounded-lg bg-black px-6 py-3 text-white hover:opacity-80 dark:bg-white dark:text-black"
      >
        Accéder à mon calendrier
      </Link>
    );
  }

  // Non connecté : le bouton déroule deux choix
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="rounded-lg bg-black px-6 py-3 text-white hover:opacity-80 dark:bg-white dark:text-black"
      >
        Commencer mon calendrier
      </button>

      {open && (
        <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
          <Link
            href="/connexion"
            className="rounded-xl border p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <p className="font-semibold">Connexion</p>
            <p className="mt-1 text-sm text-gray-500">j ai un compte</p>
          </Link>

          <Link
            href="/inscription"
            className="rounded-xl border p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <p className="font-semibold">S inscrire</p>
            <p className="mt-1 text-sm text-gray-500">Créer un compte</p>
          </Link>
        </div>
      )}
    </div>
  );
}
