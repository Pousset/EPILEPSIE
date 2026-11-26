import { describe, expect, it } from "vitest";
import type { Seizure } from "@/features/calendar/types";
import {
  computeStats,
  formatSeconds,
  monthlyCounts,
  parseDurationSeconds,
} from "@/features/stats/stats";

const make = (over: Partial<Seizure> = {}): Seizure => ({
  date: "2026-11-10",
  time: "12:00",
  type: "Absence",
  duration: "30 s",
  trigger: "Fatigue",
  ...over,
});

// 26 novembre 2026, heure locale
const TODAY = new Date(2026, 10, 26);

describe("parseDurationSeconds", () => {
  it.each([
    ["30 s", 30],
    ["30s", 30],
    ["2 min", 120],
    ["1 min 30 s", 90],
    ["1,5 min", 90],
    ["45 secondes", 45],
  ])("interprète %s", (text, expected) => {
    expect(parseDurationSeconds(text)).toBe(expected);
  });

  it.each(["Non précisée", "", "longue"])("renvoie null pour %j", (text) => {
    expect(parseDurationSeconds(text)).toBeNull();
  });
});

describe("formatSeconds", () => {
  it.each([
    [45, "45 s"],
    [120, "2 min"],
    [90, "1 min 30 s"],
  ])("formate %i s", (seconds, expected) => {
    expect(formatSeconds(seconds)).toBe(expected);
  });
});

describe("monthlyCounts", () => {
  it("renvoie un tableau vide sans crise", () => {
    expect(monthlyCounts([])).toEqual([]);
  });

  it("inclut les mois sans crise entre la première et la dernière", () => {
    const list = [
      make({ date: "2026-09-05" }),
      make({ date: "2026-09-20" }),
      make({ date: "2026-11-02" }),
    ];
    expect(monthlyCounts(list)).toEqual([
      ["2026-09", 2],
      ["2026-10", 0],
      ["2026-11", 1],
    ]);
  });

  it("gère le changement d'année", () => {
    const list = [make({ date: "2026-12-30" }), make({ date: "2027-01-02" })];
    expect(monthlyCounts(list)).toEqual([
      ["2026-12", 1],
      ["2027-01", 1],
    ]);
  });
});

describe("computeStats", () => {
  it("gère une liste vide", () => {
    const stats = computeStats([], TODAY);
    expect(stats.total).toBe(0);
    expect(stats.averageDurationSeconds).toBeNull();
    expect(stats.daysSinceLast).toBeNull();
    expect(stats.lastDate).toBeNull();
  });

  it("trie les types par fréquence décroissante", () => {
    const stats = computeStats(
      [make({ type: "Myoclonie" }), make({ type: "Absence" }), make({ type: "Absence" })],
      TODAY,
    );
    expect(stats.byType).toEqual([
      ["Absence", 2],
      ["Myoclonie", 1],
    ]);
  });

  it("calcule la durée moyenne en ignorant les durées illisibles", () => {
    const stats = computeStats(
      [
        make({ duration: "30 s" }),
        make({ duration: "1 min 30 s" }),
        make({ duration: "Non précisée" }),
      ],
      TODAY,
    );
    expect(stats.averageDurationSeconds).toBe(60);
    expect(stats.durationsUsed).toBe(2);
  });

  it("calcule les jours depuis la dernière crise", () => {
    const stats = computeStats(
      [make({ date: "2026-11-10" }), make({ date: "2026-11-22" })],
      TODAY,
    );
    expect(stats.lastDate).toBe("2026-11-22");
    expect(stats.daysSinceLast).toBe(4);
  });

  it("renvoie 0 jour pour une crise du jour", () => {
    expect(computeStats([make({ date: "2026-11-26" })], TODAY).daysSinceLast).toBe(0);
  });

  it("ignore les crises futures pour la dernière crise", () => {
    const stats = computeStats(
      [make({ date: "2026-11-20" }), make({ date: "2026-12-15" })],
      TODAY,
    );
    expect(stats.lastDate).toBe("2026-11-20");
    expect(stats.daysSinceLast).toBe(6);
  });

  it("compte les crises sur les 6 derniers mois", () => {
    const stats = computeStats(
      [make({ date: "2026-06-03" }), make({ date: "2026-11-01" }), make({ date: "2026-11-02" })],
      TODAY,
    );
    expect(stats.perMonth).toHaveLength(6);
    expect(stats.perMonth[0]).toEqual({ key: "2026-06", count: 1 });
    expect(stats.perMonth[5]).toEqual({ key: "2026-11", count: 2 });
  });
});