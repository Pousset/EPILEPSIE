import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/features/auth/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));

import { auth } from "@/features/auth/auth";
import { prisma } from "@/lib/prisma";
import { addSeizure, deleteSeizure } from "@/features/calendar/actions";

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