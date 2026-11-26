// components/AuthForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/features/auth/auth-client";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    const result = isSignup
      ? await authClient.signUp.email({ name, email, password, callbackURL: "/calendrier" })
      : await authClient.signIn.email({ email, password, callbackURL: "/calendrier" });

    setLoading(false);

    if (result.error) {
      if (result.error.status === 403) {
        setError("Ton adresse email n'est pas encore confirmée. Un nouveau lien vient de t'être envoyé.");
      } else {
        setError(result.error.message ?? "Une erreur est survenue.");
      }
      return;
    }

    if (isSignup) {
      setInfo("Compte créé. Vérifie ta boîte mail et clique sur le lien pour l'activer.");
      return;
    }

    // Navigation complète : vide le cache du navigateur et l'état de l'utilisateur précédent
    window.location.assign("/calendrier");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border p-6">
      <h1 className="text-2xl font-bold">
        {isSignup ? "Créer un compte" : "Se connecter"}
      </h1>

      {isSignup && (
        <label className="block text-sm">
          <span className="mb-1 block">Prénom</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border bg-transparent p-2"
          />
        </label>
      )}

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

      <label className="block text-sm">
        <span className="mb-1 block">Mot de passe (8 caractères minimum)</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border bg-transparent p-2"
        />
      </label>

      {!isSignup && (
        <p className="text-right text-sm">
          <Link href="/mot-de-passe-oublie" className="underline">
            Mot de passe oublié ?
          </Link>
        </p>
      )}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {info && (
        <p role="status" className="text-sm text-green-700 dark:text-green-400">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Patiente…" : isSignup ? "S'inscrire" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-gray-500">
        {isSignup ? (
          <>Déjà un compte ? <Link href="/connexion" className="underline">Se connecter</Link></>
        ) : (
          <>Pas encore de compte ? <Link href="/inscription" className="underline">inscription</Link></>
        )}
      </p>
    </form>
  );
}