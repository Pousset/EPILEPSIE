import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/features/auth/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import { addSeizure, deleteSeizure, updateSeizure } from "@/features/calendar/actions";

const getSession = vi.mocked(auth.api.getSession);
const connectedAs = (id: string) =>
  getSession.mockResolvedValue({ user: { id } } as never);

const USERS = ["test-user-a", "test-user-b"];
const input = {
  date: "2026-11-25",
  time: "08:30",
  type: "Absence",
  duration: "20 s",
  trigger: "Fatigue",
};

// Crée une crise au nom de l'utilisateur et renvoie son id
async function createSeizureAs(userId: string, extra: object = {}): Promise<string> {
  connectedAs(userId);
  const seizure = await addSeizure({ ...input, ...extra } as never);
  if (!seizure.id) throw new Error("La crise créée n'a pas d'id");
  return seizure.id;
}

async function cleanUp() {
  // onDelete: Cascade supprime aussi leurs crises
  await prisma.user.deleteMany({ where: { id: { in: USERS } } });
}

beforeAll(async () => {
  await cleanUp();
  for (const id of USERS) {
    await prisma.user.create({
      data: { id, name: id, email: `${id}@test.local`, emailVerified: true },
    });
  }
});

afterAll(cleanUp);

beforeEach(() => vi.clearAllMocks());

describe("isolation des crises entre utilisateurs", () => {
  it("l'utilisateur B ne peut pas supprimer la crise de A", async () => {
    const id = await createSeizureAs("test-user-a");

    connectedAs("test-user-b");
    await deleteSeizure(id);

    const stillThere = await prisma.seizure.findUnique({ where: { id } });
    expect(stillThere).not.toBeNull();
  });

  it("l'utilisateur A peut supprimer sa propre crise", async () => {
    const id = await createSeizureAs("test-user-a");

    await deleteSeizure(id);

    const gone = await prisma.seizure.findUnique({ where: { id } });
    expect(gone).toBeNull();
  });

  it("une crise créée par A est enregistrée au nom de A, même avec un userId injecté", async () => {
    const id = await createSeizureAs("test-user-a", { userId: "test-user-b" });

    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.userId).toBe("test-user-a");
  });
});

describe("modification des crises", () => {
  it("l'utilisateur B ne peut pas modifier la crise de A", async () => {
    const id = await createSeizureAs("test-user-a");

    connectedAs("test-user-b");
    await expect(updateSeizure(id, { ...input, type: "Myoclonie" })).rejects.toThrow();

    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.type).toBe("Absence");
    expect(row?.userId).toBe("test-user-a");
  });

  it("l'utilisateur A peut modifier sa propre crise", async () => {
    const id = await createSeizureAs("test-user-a");

    const updated = await updateSeizure(id, { ...input, type: "Myoclonie", duration: "45 s" });

    expect(updated.type).toBe("Myoclonie");
    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.type).toBe("Myoclonie");
    expect(row?.duration).toBe("45 s");
    expect(row?.userId).toBe("test-user-a");
  });

  it("un userId injecté ne transfère pas la crise à un autre utilisateur", async () => {
    const id = await createSeizureAs("test-user-a");

    await updateSeizure(id, { ...input, userId: "test-user-b" } as never);

    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.userId).toBe("test-user-a");
  });

  it("une modification invalide laisse la crise intacte", async () => {
    const id = await createSeizureAs("test-user-a");

    await expect(updateSeizure(id, { ...input, time: "25:00" })).rejects.toThrow("Heure invalide");

    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.time).toBe("08:30");
  });

  it("normalise la durée vide en « Non précisée »", async () => {
    const id = await createSeizureAs("test-user-a");

    await updateSeizure(id, { ...input, duration: "   " });

    const row = await prisma.seizure.findUnique({ where: { id } });
    expect(row?.duration).toBe("Non précisée");
  });
});
