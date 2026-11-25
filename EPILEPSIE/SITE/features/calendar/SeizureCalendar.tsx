// components/SeizureCalendar.tsx
"use client";

import { useState } from "react";
import { fakeSeizures } from "@/features/calendar/demo-data";
import type { Seizure } from "@/features/calendar/types";
import { SEIZURE_TYPES, SEIZURE_TRIGGERS } from "@/features/calendar/options";
import { addSeizure, deleteSeizure, updateSeizure } from "@/features/calendar/actions";
import { dateKey, exportSeizuresPdf, formatDate } from "@/features/calendar/export-pdf";
import { subtractMonths } from "@/features/calendar/period";
import Dialog from "@/components/ui/Dialog";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

type Period = "month" | "3m" | "6m" | "all";

type Props = {
  mode?: "demo" | "personal";
  initialSeizures?: Seizure[];
  initialYear?: number;
  initialMonth?: number;
  userName?: string;
};

export default function SeizureCalendar({
  mode = "demo",
  initialSeizures,
  initialYear = 2026,
  initialMonth = 10, // 10 = novembre (utilisé par la démo)
  userName,
}: Props) {
  const isPersonal = mode === "personal";

  const [seizures, setSeizures] = useState<Seizure[]>(
    isPersonal ? (initialSeizures ?? []) : fakeSeizures
  );
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Seizure | null>(null); // crise en cours de modification
  const [error, setError] = useState("");

  // Confirmation de suppression
  const [toDelete, setToDelete] = useState<Seizure | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Export PDF
  const [period, setPeriod] = useState<Period>("3m");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  // Champs du formulaire
  const [time, setTime] = useState("12:00");
  const [type, setType] = useState(SEIZURE_TYPES[0]);
  const [duration, setDuration] = useState("");
  const [trigger, setTrigger] = useState(SEIZURE_TRIGGERS[0]);

  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const seizuresOn = (key: string) =>
    seizures
      .filter((s) => s.date === key)
      .sort((a, b) => a.time.localeCompare(b.time));

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthCount = seizures.filter((s) => s.date.startsWith(monthPrefix)).length;

  function changeMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
    closeForm();
    setError("");
  }

  function selectDay(key: string) {
    setSelected(key);
    closeForm();
    setError("");
  }

  function openAddForm() {
    setEditing(null);
    setError("");
    setShowForm(true);
  }

  // Pré-remplit le formulaire avec la crise à modifier.
  function startEdit(target: Seizure) {
    setEditing(target);
    setTime(target.time);
    setType(target.type);
    setDuration(target.duration === "Non précisée" ? "" : target.duration);
    setTrigger(target.trigger);
    setError("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleSave() {
    if (!selected || saving) return;
    setSaving(true);
    setError("");

    const input = { date: selected, time, type, duration, trigger };
    const normalized = { ...input, duration: duration.trim() || "Non précisée" };

    try {
      if (editing) {
        const target = editing;
        const updated =
          isPersonal && target.id ? await updateSeizure(target.id, input) : normalized;
        setSeizures((prev) => prev.map((s) => (s === target ? updated : s)));
      } else if (isPersonal) {
        const created = await addSeizure(input);
        setSeizures((prev) => [...prev, created]);
      } else {
        setSeizures((prev) => [...prev, normalized]);
      }
      setDuration("");
      closeForm();
    } catch {
      setError("Impossible d'enregistrer la crise. Réessaie.");
    } finally {
      setSaving(false);
    }
  }

  // Ouvre la fenêtre de confirmation ; la suppression réelle se fait dans confirmDelete.
  function handleDelete(target: Seizure) {
    setError("");
    setToDelete(target);
  }

  async function confirmDelete() {
    if (!toDelete || deleting) return;
    const target = toDelete;
    setDeleting(true);

    try {
      if (isPersonal && target.id) {
        await deleteSeizure(target.id);
      }
      setSeizures((prev) => prev.filter((s) => s !== target));
    } catch {
      setError("Impossible de supprimer la crise. Réessaie.");
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  async function handleExport() {
    if (exporting) return;
    setExportError("");

    let list = seizures;
    let label = "Toutes les crises";

    if (period === "month") {
      list = seizures.filter((s) => s.date.startsWith(monthPrefix));
      label = `${MONTHS[month]} ${year}`;
    } else if (period === "3m" || period === "6m") {
      const months = period === "3m" ? 3 : 6;
      const now = new Date();
      const fromKey = dateKey(subtractMonths(now, months));
      const untilKey = dateKey(now);
      list = seizures.filter((s) => s.date >= fromKey && s.date <= untilKey);
      label = `${months} derniers mois (du ${formatDate(fromKey)} au ${formatDate(untilKey)})`;
    }

    if (list.length === 0) {
      setExportError("Aucune crise sur cette période.");
      return;
    }

    setExporting(true);
    try {
      await exportSeizuresPdf({ seizures: list, userName: userName ?? "", periodLabel: label });
    } catch {
      setExportError("Impossible de créer le PDF. Réessaie.");
    } finally {
      setExporting(false);
    }
  }

  const selectedSeizures = selected ? seizuresOn(selected) : [];

  return (
    <div className="w-full max-w-md rounded-xl border p-4 text-left">
      <div className="mb-1 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} aria-label="Mois précédent" className="px-3 py-1">
          ←
        </button>
        <h2 className="font-semibold">
          {MONTHS[month]} {year}
        </h2>
        <button onClick={() => changeMonth(1)} aria-label="Mois suivant" className="px-3 py-1">
          →
        </button>
      </div>
      <p className="mb-4 text-center text-sm text-gray-500">
        {monthCount} crise{monthCount > 1 ? "s" : ""} ce mois-ci
      </p>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {DAYS.map((d) => (
          <div key={d} className="font-medium text-gray-500">{d}</div>
        ))}

        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const key = toKey(day);
          const count = seizuresOn(key).length;
          return (
            <button
              key={key}
              onClick={() => selectDay(key)}
              className={`rounded py-2 ${
                count > 0
                  ? "bg-red-600 font-semibold text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
              } ${selected === key ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
            >
              {day}
              {count > 0 && <span aria-label={`${count} crise(s) notée(s)`}> ●</span>}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 space-y-2 text-sm">
          {selectedSeizures.length === 0 && <p>Aucune crise notée ce jour-là.</p>}

          {selectedSeizures.map((s, i) => (
            <div key={s.id ?? i} className="flex items-start justify-between rounded border p-2">
              <div>
                <p className="font-medium">{s.type} à {s.time}</p>
                <p className="text-gray-500">
                  Durée : {s.duration} · Déclencheur : {s.trigger}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => startEdit(s)}
                  aria-label="Modifier cette crise"
                  className="px-2 text-blue-700 hover:underline dark:text-blue-400"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(s)}
                  aria-label="Supprimer cette crise"
                  className="px-2 text-red-600 hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}

          {error && <p role="alert" className="text-red-600">{error}</p>}

          {!showForm ? (
            <button
              onClick={openAddForm}
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              + Noter une crise
            </button>
          ) : (
            <div className="space-y-3 rounded border p-3">
              <p className="font-medium">{editing ? "Modifier la crise" : "Nouvelle crise"}</p>

              <label className="block">
                <span className="mb-1 block">Heure</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded border bg-transparent p-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block">Type de crise</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded border bg-transparent p-2"
                >
                  {SEIZURE_TYPES.map((t) => (
                    <option key={t} value={t} className="text-black">{t}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block">Durée (ex. 30 s, 2 min)</span>
                <input
                  type="text"
                  maxLength={50}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded border bg-transparent p-2"
                />
              </label>

              <label className="block">
                <span className="mb-1 block">Déclencheur possible</span>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="w-full rounded border bg-transparent p-2"
                >
                  {SEIZURE_TRIGGERS.map((t) => (
                    <option key={t} value={t} className="text-black">{t}</option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>
                <button
                  onClick={closeForm}
                  className="flex-1 rounded border py-2"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isPersonal && (
        <div className="mt-4 space-y-2 border-t pt-4 text-sm">
          <p className="font-medium">Exporter pour mon médecin</p>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
              aria-label="Période à exporter"
              className="flex-1 rounded border bg-transparent p-2"
            >
              <option value="month" className="text-black">Mois affiché</option>
              <option value="3m" className="text-black">3 derniers mois</option>
              <option value="6m" className="text-black">6 derniers mois</option>
              <option value="all" className="text-black">Toutes les crises</option>
            </select>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="rounded border px-4 py-2 hover:bg-gray-200 disabled:opacity-50 dark:hover:bg-gray-800"
            >
              {exporting ? "Création…" : "Exporter en PDF"}
            </button>
          </div>
          {exportError && <p role="alert" className="text-red-600">{exportError}</p>}
        </div>
      )}

      <Dialog
        open={toDelete !== null}
        onClose={() => setToDelete(null)}
        title="Supprimer cette crise ?"
        size="sm"
        closeLabel="Annuler la suppression"
        footer={
          <>
            <button
              type="button"
              data-autofocus
              onClick={() => setToDelete(null)}
              className="rounded border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Suppression…" : "Supprimer"}
            </button>
          </>
        }
      >
        {toDelete && (
          <p className="text-sm">
            {toDelete.type} du {formatDate(toDelete.date)} à {toDelete.time}. Cette action est
            définitive.
          </p>
        )}
      </Dialog>

      <p className="mt-4 text-xs text-gray-500">
        {isPersonal
          ? "Tes crises sont enregistrées dans ton compte."
          : "Exemple : ces données sont fictives et ne sont pas enregistrées."}
      </p>
    </div>
  );
}
