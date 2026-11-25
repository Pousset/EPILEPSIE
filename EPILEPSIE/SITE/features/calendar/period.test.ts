import { describe, expect, it } from "vitest";
import { subtractMonths } from "@/features/calendar/period";
import { dateKey } from "@/features/calendar/export-pdf";

const sub = (y: number, m: number, d: number, n: number) =>
  dateKey(subtractMonths(new Date(y, m - 1, d), n));

describe("subtractMonths", () => {
  it("retire des mois simples", () => {
    expect(sub(2026, 11, 25, 3)).toBe("2026-08-25");
  });

  it("passe sur l'année précédente", () => {
    expect(sub(2026, 1, 15, 3)).toBe("2025-10-15");
  });

  it("ne déborde pas : 31 août - 6 mois = 28 février", () => {
    expect(sub(2026, 8, 31, 6)).toBe("2026-02-28");
  });

  it("ne déborde pas : 31 mai - 3 mois = 28 février", () => {
    expect(sub(2026, 5, 31, 3)).toBe("2026-02-28");
  });

  it("gère l'année bissextile : 31 août 2028 - 6 mois = 29 février", () => {
    expect(sub(2028, 8, 31, 6)).toBe("2028-02-29");
  });
});