"use client";

import { useState } from "react";
import { devLogin } from "@/features/auth/dev-login";

export default function DevLoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await devLogin();
      window.location.assign("/calendrier");
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full rounded border border-dashed border-amber-500 py-2 text-sm text-amber-600 hover:bg-amber-50 disabled:opacity-50 dark:hover:bg-amber-950"
    >
      {loading ? "Connexion…" : "🛠 Connexion de développement"}
    </button>
  );
}