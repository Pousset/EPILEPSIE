"use client";

import { useState } from "react";
import { authClient } from "@/features/auth/auth-client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await authClient.requestPasswordReset({
      email,
      redirectTo: "/reinitialiser-mot-de-passe",
    });
    setLoading(false);
    // Message identique que le compte existe ou non (pas d'énumération de comptes).
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border p-6">
      <h1 className="text-2xl font-bold">Mot de passe oublié</h1>

      <label className="block text-sm">
        <span className="mb-1 block">Email</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border bg-transparent p-2"
        />
      </label>

      {sent && (
        <p role="status" className="text-sm">
          Si un compte existe avec cette adresse, un lien de réinitialisation vient d&apos;être envoyé.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}