import { describe, expect, it } from "vitest";
import { countBy } from "@/features/calendar/export-pdf";
import type { Seizure } from "@/features/calendar/types";

const seizure = (type: string, trigger: string): Seizure => ({
  date: "2026-11-01",
  time: "08:00",
  type,
  duration: "10 s",
  trigger,
});

describe("countBy", () => {
  it("compte par type et trie du plus fréquent au moins fréquent", () => {
    const list = [
      seizure("Absence", "Stress"),
      seizure("Crise focale", "Stress"),
      seizure("Absence", "Fatigue"),
      seizure("Absence", "Fatigue"),
    ];
    expect(countBy(list, "type")).toEqual([
      ["Absence", 3],
      ["Crise focale", 1],
    ]);
  });

  it("compte par déclencheur", () => {
    const list = [seizure("Absence", "Stress"), seizure("Myoclonie", "Stress")];
    expect(countBy(list, "trigger")).toEqual([["Stress", 2]]);
  });

  it("renvoie une liste vide pour aucune crise", () => {
    expect(countBy([], "type")).toEqual([]);
  });
});