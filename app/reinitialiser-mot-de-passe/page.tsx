import { Suspense } from "react";
import Link from "next/link";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm"; // ton composant existant

async function ResetPasswordContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-xl border p-6">
        <p role="alert">Lien invalide ou expiré</p>
        <Link href="/mot-de-passe-oublie" className="underline">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}

export default function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense fallback={<p aria-live="polite">Chargement…</p>}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}