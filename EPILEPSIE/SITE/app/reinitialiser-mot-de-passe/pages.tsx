import Link from "next/link";
import ResetPasswordForm from "@/features/auth/ResetPasswordForm";

export default async function ReinitialiserMotDePassePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <div className="flex justify-center p-6">
      {token && !error ? (
        <ResetPasswordForm token={token} />
      ) : (
        <p role="alert">
          Lien invalide ou expiré.{" "}
          <Link href="/mot-de-passe-oublie" className="underline">Refaire une demande</Link>
        </p>
      )}
    </div>
  );
}