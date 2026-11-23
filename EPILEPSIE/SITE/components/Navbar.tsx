// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  }

  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="text-lg font-bold">
        MonSite
      </Link>

      <ul className="flex items-center gap-6">
        <li><Link href="/">Accueil</Link></li>
        {session && <li><Link href="/calendrier">Mon calendrier</Link></li>}
        <li><Link href="/about">À propos</Link></li>
        <li><Link href="/contact">Contact</Link></li>

        {isPending ? (
          // Espace réservé pendant le chargement de la session : évite que la navbar "saute"
          <li className="h-6 w-36" aria-hidden="true" />
        ) : session ? (
          <>
            <li className="text-sm text-gray-500">Bonjour {session.user.name}</li>
            <li>
              <button
                onClick={handleSignOut}
                className="rounded border px-3 py-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/connexion">Connexion</Link></li>
            <li>
              <Link
                href="/inscription"
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}