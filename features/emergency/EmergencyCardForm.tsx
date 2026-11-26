"use client";

import { useState } from "react";
import { saveEmergencyCard } from "@/features/emergency/actions";
import type { EmergencyCardData } from "@/features/emergency/types";

const FIELDS: { key: keyof EmergencyCardData; label: string; multiline?: boolean; type?: string }[] = [
  { key: "fullName", label: "Mon nom complet" },
  { key: "contactName", label: "Personne à contacter" },
  { key: "contactPhone", label: "Téléphone de cette personne", type: "tel" },
  { key: "epilepsyType", label: "Type d'épilepsie" },
  { key: "usualDuration", label: "Durée habituelle de mes crises" },
  { key: "doList", label: "Gestes à faire (une ligne par geste)", multiline: true },
  { key: "dontList", label: "Gestes à éviter (une ligne par geste)", multiline: true },
  { key: "medications", label: "Médicaments importants", multiline: true },
  { key: "allergies", label: "Allergies", multiline: true },
  { key: "neurologistName", label: "Nom du neurologue" },
  { key: "neurologistPhone", label: "Téléphone du neurologue", type: "tel" },
];

export default function EmergencyCardForm({ initial }: { initial: EmergencyCardData }) {
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await saveEmergencyCard(data);
      window.location.assign("/urgence");
    } catch {
      setError("Impossible d'enregistrer la fiche. Vérifie les champs et réessaie.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-xl border p-6">
      <h1 className="text-2xl font-bold">Ma fiche d&apos;urgence</h1>

      {FIELDS.map(({ key, label, multiline, type }) => (
        <label key={key} className="block text-sm">
          <span className="mb-1 block">{label}</span>
          {multiline ? (
            <textarea
              rows={4}
              value={data[key]}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              className="w-full rounded border bg-transparent p-2"
            />
          ) : (
            <input
              type={type ?? "text"}
              required={key === "fullName"}
              value={data[key]}
              onChange={(e) => setData({ ...data, [key]: e.target.value })}
              className="w-full rounded border bg-transparent p-2"
            />
          )}
        </label>
      ))}

      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}