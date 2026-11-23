// components/SeizureCalendar.tsx
"use client";

import { useState } from "react";
import { fakeSeizures, type Seizure } from "@/data/fakeSeizures";

const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const TYPES = ["Absence", "Crise focale", "Myoclonie", "Crise tonico-clonique", "Autre"];
const TRIGGERS = [
  "Aucun identifié", "Fatigue", "Manque de sommeil", "Stress", "Oubli de traitement", "Autre",
];

export default function SeizureCalendar() {
  const [seizures, setSeizures] = useState<Seizure[]>(fakeSeizures);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // 10 = novembre
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Champs du formulaire
  const [time, setTime] = useState("12:00");
  const [type, setType] = useState(TYPES[0]);
  const [duration, setDuration] = useState("");
  const [trigger, setTrigger] = useState(TRIGGERS[0]);

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
    setShowForm(false);
  }

  function selectDay(key: string) {
    setSelected(key);
    setShowForm(false);
  }

  function handleAdd() {
    if (!selected) return;
    const newSeizure: Seizure = {
      date: selected,
      time,
      type,
      duration: duration.trim() || "Non précisée",
      trigger,
    };
    setSeizures((prev) => [...prev, newSeizure]);
    setDuration("");
    setShowForm(false);
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
            <div key={i} className="rounded border p-2">
              <p className="font-medium">{s.type} à {s.time}</p>
              <p className="text-gray-500">
                Durée : {s.duration} · Déclencheur : {s.trigger}
              </p>
            </div>
          ))}

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
            >
              + Noter une crise
            </button>
          ) : (
            <div className="space-y-3 rounded border p-3">
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
                  {TYPES.map((t) => (
                    <option key={t} value={t} className="text-black">{t}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block">Durée (ex. 30 s, 2 min)</span>
                <input
                  type="text"
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
                  {TRIGGERS.map((t) => (
                    <option key={t} value={t} className="text-black">{t}</option>
                  ))}
                </select>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded border py-2"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}