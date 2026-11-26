import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Seizure } from "@/features/calendar/types";

// Mock de jsPDF : on vérifie ce qui est écrit sans générer de vrai PDF
const mocks = vi.hoisted(() => ({
  text: vi.fn(),
  save: vi.fn(),
  autoTable: vi.fn(),
}));

vi.mock("jspdf", () => ({
  jsPDF: vi.fn().mockImplementation(function () {
    return {
      internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
      setFontSize: vi.fn(),
      setTextColor: vi.fn(),
      setPage: vi.fn(),
      getNumberOfPages: () => 1,
      splitTextToSize: (t: string) => [t],
      text: mocks.text,
      save: mocks.save,
    };
  }),
}));
vi.mock("jspdf-autotable", () => ({ default: mocks.autoTable }));

import { buildSummaryLines, exportSeizuresPdf } from "@/features/calendar/export-pdf";

const make = (over: Partial<Seizure> = {}): Seizure => ({
  date: "2026-11-10",
  time: "12:00",
  type: "Absence",
  duration: "30 s",
  trigger: "Fatigue",
  ...over,
});

const TODAY = new Date(2026, 10, 26);

describe("buildSummaryLines", () => {
  it("résume une période d'un seul mois sans détail mensuel", () => {
    const lines = buildSummaryLines(
      [make(), make({ type: "Myoclonie", duration: "10 s", trigger: "Stress" })],
      TODAY,
    );
    expect(lines).toEqual([
      "Nombre total de crises : 2",
      "Par type : Absence (1), Myoclonie (1)",
      "Durée moyenne : 20 s (calculée sur 2 crise(s) dont la durée est renseignée)",
      "Déclencheurs notés : Fatigue (1), Stress (1)",
      "Dernière crise : 10/11/2026",
    ]);
  });

  it("ajoute le détail par mois, mois vides compris", () => {
    const lines = buildSummaryLines(
      [make({ date: "2026-09-05" }), make({ date: "2026-11-02" })],
      TODAY,
    );
    expect(lines).toContain("Par mois : 09/2026 (1), 10/2026 (0), 11/2026 (1)");
  });

  it("indique quand la durée moyenne n'est pas calculable", () => {
    const lines = buildSummaryLines([make({ duration: "Non précisée" })], TODAY);
    expect(lines).toContain("Durée moyenne : non calculable (durées non renseignées)");
  });
});

describe("exportSeizuresPdf", () => {
  beforeEach(() => vi.clearAllMocks());

  it("écrit le résumé statistique et enregistre le PDF", async () => {
    await exportSeizuresPdf({
      seizures: [make(), make({ date: "2026-11-14" })],
      userName: "Mathis",
      periodLabel: "Novembre 2026",
    });

    expect(mocks.text).toHaveBeenCalledWith(
      ["Nombre total de crises : 2"],
      14,
      expect.any(Number),
    );
    expect(mocks.text).toHaveBeenCalledWith(
      [expect.stringContaining("Durée moyenne : 30 s")],
      14,
      expect.any(Number),
    );
    expect(mocks.autoTable).toHaveBeenCalledOnce();
    expect(mocks.save).toHaveBeenCalledWith(expect.stringMatching(/^journal-crises-.*\.pdf$/));
  });
});