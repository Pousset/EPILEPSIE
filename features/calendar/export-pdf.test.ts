import { describe, expect, it } from "vitest";
import { dateKey, formatDate } from "@/features/calendar/export-pdf";

describe("formatDate", () => {
  it("convertit AAAA-MM-JJ en JJ/MM/AAAA", () => {
    expect(formatDate("2026-11-24")).toBe("24/11/2026");
  });

  it("garde les zéros du début", () => {
    expect(formatDate("2026-01-05")).toBe("05/01/2026");
  });
});

describe("dateKey", () => {
  it("formate une date locale avec mois et jour sur deux chiffres", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("gère le 31 décembre", () => {
    expect(dateKey(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("ne décale pas le jour à minuit", () => {
    expect(dateKey(new Date(2026, 5, 15, 0, 0, 0))).toBe("2026-06-15");
  });
});