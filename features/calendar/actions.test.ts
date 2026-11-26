import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/features/auth/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { seizure: { create: vi.fn(), update: vi.fn(), deleteMany: vi.fn() } },
}));

import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import { addSeizure, deleteSeizure, updateSeizure } from "@/features/calendar/actions";

const getSession = vi.mocked(auth.api.getSession);
const create = vi.mocked(prisma.seizure.create);
const update = vi.mocked(prisma.seizure.update);
const deleteMany = vi.mocked(prisma.seizure.deleteMany);

const valid = {
  date: "2026-11-25",
  time: "08:30",
  type: "Absence",
  duration: "20 s",
  trigger: "Fatigue",
};

beforeEach(() => {
  vi.clearAllMocks();
  getSession.mockResolvedValue({ user: { id: "user-a" } } as never);
  create.mockResolvedValue({} as never);
  update.mockResolvedValue({} as never);
});

describe("addSeizure", () => {
  it("refuse sans session", async () => {
    getSession.mockResolvedValue(null as never);
    await expect(addSeizure(valid)).rejects.toThrow("Non connecté");
    expect(create).not.toHaveBeenCalled();
  });

  it.each([
    ["date mal formée", { date: "25/11/2026" }, "Date invalide"],
    ["heure hors plage", { time: "25:00" }, "Heure invalide"],
    ["minutes hors plage", { time: "12:60" }, "Heure invalide"],
    ["type hors liste", { type: "Inconnu" }, "Type invalide"],
    ["déclencheur hors liste", { trigger: "Inconnu" }, "Déclencheur invalide"],
  ])("rejette : %s", async (_label, override, message) => {
    await expect(addSeizure({ ...valid, ...override })).rejects.toThrow(message);
    expect(create).not.toHaveBeenCalled();
  });

  it("utilise « Non précisée » quand la durée est vide", async () => {
    await addSeizure({ ...valid, duration: "   " });
    expect(create.mock.calls[0][0].data.duration).toBe("Non précisée");
  });

  it("tronque la durée à 50 caractères", async () => {
    await addSeizure({ ...valid, duration: "x".repeat(80) });
    expect(create.mock.calls[0][0].data.duration).toHaveLength(50);
  });

  it("associe la crise à l'utilisateur de la session, pas à un userId injecté", async () => {
    await addSeizure({ ...valid, userId: "pirate" } as never);
    expect(create.mock.calls[0][0].data.userId).toBe("user-a");
  });
});

describe("deleteSeizure", () => {
  it("refuse sans session", async () => {
    getSession.mockResolvedValue(null as never);
    await expect(deleteSeizure("abc")).rejects.toThrow("Non connecté");
    expect(deleteMany).not.toHaveBeenCalled();
  });

  it("filtre la suppression sur l'id ET l'utilisateur connecté", async () => {
    await deleteSeizure("abc");
    expect(deleteMany).toHaveBeenCalledWith({ where: { id: "abc", userId: "user-a" } });
  });
});

describe("updateSeizure", () => {
  it("refuse sans session", async () => {
    getSession.mockResolvedValue(null as never);
    await expect(updateSeizure("abc", valid)).rejects.toThrow("Non connecté");
    expect(update).not.toHaveBeenCalled();
  });

  it.each([
    ["date mal formée", { date: "25/11/2026" }, "Date invalide"],
    ["heure hors plage", { time: "25:00" }, "Heure invalide"],
    ["minutes hors plage", { time: "12:60" }, "Heure invalide"],
    ["type hors liste", { type: "Inconnu" }, "Type invalide"],
    ["déclencheur hors liste", { trigger: "Inconnu" }, "Déclencheur invalide"],
  ])("rejette : %s", async (_label, override, message) => {
    await expect(updateSeizure("abc", { ...valid, ...override })).rejects.toThrow(message);
    expect(update).not.toHaveBeenCalled();
  });

  it("utilise « Non précisée » quand la durée est vide", async () => {
    await updateSeizure("abc", { ...valid, duration: "   " });
    expect(update.mock.calls[0][0].data).toMatchObject({ duration: "Non précisée" });
  });

  it("tronque la durée à 50 caractères", async () => {
    await updateSeizure("abc", { ...valid, duration: "x".repeat(80) });
    expect(update.mock.calls[0][0].data).toMatchObject({ duration: "x".repeat(50) });
  });

  it("filtre la modification sur l'id ET l'utilisateur connecté", async () => {
    await updateSeizure("abc", valid);
    expect(update.mock.calls[0][0].where).toEqual({ id: "abc", userId: "user-a" });
  });

  it("ignore un userId injecté : il n'est jamais écrit dans les données", async () => {
    await updateSeizure("abc", { ...valid, userId: "pirate" } as never);
    expect(update.mock.calls[0][0].data).not.toHaveProperty("userId");
    expect(update.mock.calls[0][0].where).toEqual({ id: "abc", userId: "user-a" });
  });

  it("propage l'erreur quand aucune crise ne correspond", async () => {
    update.mockRejectedValue(new Error("No record was found for an update."));
    await expect(updateSeizure("abc", valid)).rejects.toThrow();
  });
});
