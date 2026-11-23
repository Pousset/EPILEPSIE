// components/SeizureCalendar.tsx
"use client";

import { useState } from "react";
import { fakeSeizures } from "@/data/fakeSeizures";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function SeizureCalendar() {
  // Mois fixe au départ : évite new Date() sans argument (cf. l'erreur de prerender)
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // 10 = novembre
  const [selected, setSelected] = useState<string | null>(null);

  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const seizuresOn = (key: string) => fakeSeizures.filter((s) => s.date === key);

  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthCount = fakeSeizures.filter((s) => s.date.startsWith(monthPrefix)).length;

  function changeMonth(delta: number) {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
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
              onClick={() => setSelected(key)}
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
          {selectedSeizures.length === 0 ? (
            <p>Aucune crise notée ce jour-là.</p>
          ) : (
            selectedSeizures.map((s, i) => (
              <div key={i} className="rounded border p-2">
                <p className="font-medium">{s.type} à {s.time}</p>
                <p className="text-gray-500">
                  Durée : {s.duration} · Déclencheur : {s.trigger}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}