"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/features/auth/auth-client";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await authClient.resetPassword({ newPassword: password, token });

    setLoading(false);
    if (error) {
      setError("Ce lien est invalide ou expiré. Refais une demande.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-xl border p-6">
        <p role="status">Mot de passe modifié.</p>
        <Link href="/connexion" className="underline">Se connecter</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border p-6">
      <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>

      <label className="block text-sm">
        <span className="mb-1 block">Mot de passe (8 caractères minimum)</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border bg-transparent p-2"
        />
      </label>

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Patiente…" : "Enregistrer"}
      </button>
    </form>
  );
}