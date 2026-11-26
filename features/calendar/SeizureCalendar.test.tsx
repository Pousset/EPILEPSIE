// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/features/calendar/actions", () => ({
  addSeizure: vi.fn(),
  deleteSeizure: vi.fn(),
  updateSeizure: vi.fn(),
}));
vi.mock("@/features/calendar/export-pdf", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/calendar/export-pdf")>()),
  exportSeizuresPdf: vi.fn(),
}));

import SeizureCalendar from "@/features/calendar/SeizureCalendar";
import { addSeizure, deleteSeizure, updateSeizure } from "@/features/calendar/actions";
import { exportSeizuresPdf } from "@/features/calendar/export-pdf";
import type { Seizure } from "@/features/calendar/types";

const crise: Seizure = {
  id: "s1",
  date: "2026-11-10",
  time: "09:15",
  type: "Absence",
  duration: "20 s",
  trigger: "Stress",
};

// Bouton d'un jour du calendrier (le texte du bouton est le numéro du jour)
const day = (n: number) => screen.getByText(String(n), { selector: "button" });

// Cases vides avant le 1er du mois : seules <div> sans classe dans la grille
function emptyCells() {
  const grid = screen.getByText("Lun").parentElement!;
  return grid.querySelectorAll(":scope > div:not([class])").length;
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("navigation", () => {
  it("passe de décembre à janvier de l'année suivante", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="personal" initialYear={2026} initialMonth={11} />);
    expect(screen.getByRole("heading", { name: "Décembre 2026" })).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Mois suivant" }));
    expect(screen.getByRole("heading", { name: "Janvier 2027" })).toBeTruthy();
  });

  it("passe de janvier à décembre de l'année précédente", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="personal" initialYear={2026} initialMonth={0} />);

    await user.click(screen.getByRole("button", { name: "Mois précédent" }));
    expect(screen.getByRole("heading", { name: "Décembre 2025" })).toBeTruthy();
  });

  it("place le 1er du mois sur le bon jour de la semaine (lundi = 0)", async () => {
    const user = userEvent.setup();
    // Le 1er novembre 2026 est un dimanche, le 1er décembre un mardi
    render(<SeizureCalendar mode="personal" initialYear={2026} initialMonth={10} />);
    expect(emptyCells()).toBe(6);

    await user.click(screen.getByRole("button", { name: "Mois suivant" }));
    expect(emptyCells()).toBe(1);
  });
});

describe("compteur mensuel", () => {
  it("compte les crises de démonstration de novembre", () => {
    render(<SeizureCalendar mode="demo" />);
    expect(screen.getByText("10 crises ce mois-ci")).toBeTruthy();
  });

  it("met « crise » au singulier pour une seule crise", () => {
    render(
      <SeizureCalendar mode="personal" initialSeizures={[crise]} initialYear={2026} initialMonth={10} />,
    );
    expect(screen.getByText("1 crise ce mois-ci")).toBeTruthy();
  });

  it("met « crise » au singulier pour zéro crise", () => {
    render(<SeizureCalendar mode="personal" initialSeizures={[]} initialYear={2026} initialMonth={10} />);
    expect(screen.getByText("0 crise ce mois-ci")).toBeTruthy();
  });
});

describe("ajout d'une crise", () => {
  it("en mode démo : ajoute en mémoire sans appeler le serveur", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="demo" />);

    await user.click(day(1));
    await user.click(screen.getByRole("button", { name: "+ Noter une crise" }));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(screen.getByText("Absence à 12:00")).toBeTruthy();
    expect(screen.getByText(/Non précisée/)).toBeTruthy();
    expect(addSeizure).not.toHaveBeenCalled();
  });

  it("en mode personnel : appelle addSeizure puis affiche la crise créée", async () => {
    const user = userEvent.setup();
    vi.mocked(addSeizure).mockResolvedValue({
      id: "n1",
      date: "2026-11-01",
      time: "12:00",
      type: "Absence",
      duration: "Non précisée",
      trigger: "Aucun identifié",
    });
    render(<SeizureCalendar mode="personal" initialSeizures={[]} initialYear={2026} initialMonth={10} />);

    await user.click(day(1));
    await user.click(screen.getByRole("button", { name: "+ Noter une crise" }));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(addSeizure).toHaveBeenCalledWith({
      date: "2026-11-01",
      time: "12:00",
      type: "Absence",
      duration: "",
      trigger: "Aucun identifié",
    });
    expect(await screen.findByText("Absence à 12:00")).toBeTruthy();
  });

  it("affiche une erreur quand l'enregistrement échoue", async () => {
    const user = userEvent.setup();
    vi.mocked(addSeizure).mockRejectedValue(new Error("échec"));
    render(<SeizureCalendar mode="personal" initialSeizures={[]} initialYear={2026} initialMonth={10} />);

    await user.click(day(1));
    await user.click(screen.getByRole("button", { name: "+ Noter une crise" }));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toBe("Impossible d'enregistrer la crise. Réessaie.");
    expect(screen.queryByText("Absence à 12:00")).toBeNull();
  });
});

describe("suppression d'une crise", () => {
  const renderWithCrise = () =>
    render(
      <SeizureCalendar mode="personal" initialSeizures={[crise]} initialYear={2026} initialMonth={10} />,
    );

  // Ouvre la fenêtre de confirmation et renvoie des requêtes limitées à cette fenêtre
  async function openDeleteDialog(user: ReturnType<typeof userEvent.setup>) {
    await user.click(day(10));
    await user.click(screen.getByRole("button", { name: "Supprimer cette crise" }));
    return within(screen.getByRole("dialog"));
  }

  it("demande confirmation sans supprimer tant qu'on n'a pas validé", async () => {
    const user = userEvent.setup();
    renderWithCrise();

    const dialog = await openDeleteDialog(user);

    expect(dialog.getByText("Supprimer cette crise ?")).toBeTruthy();
    expect(dialog.getByText(/Absence du 10\/11\/2026 à 09:15/)).toBeTruthy();
    expect(deleteSeizure).not.toHaveBeenCalled();
  });

  it("ne supprime rien si on clique sur Annuler", async () => {
    const user = userEvent.setup();
    renderWithCrise();

    const dialog = await openDeleteDialog(user);
    await user.click(dialog.getByRole("button", { name: "Annuler" }));

    expect(deleteSeizure).not.toHaveBeenCalled();
    expect(screen.queryByText(/Cette action est définitive/)).toBeNull();
    expect(screen.getByText("Absence à 09:15")).toBeTruthy();
  });

  it("ne supprime rien si on ferme la fenêtre avec la croix", async () => {
    const user = userEvent.setup();
    renderWithCrise();

    const dialog = await openDeleteDialog(user);
    await user.click(dialog.getByRole("button", { name: "Annuler la suppression" }));

    expect(deleteSeizure).not.toHaveBeenCalled();
    expect(screen.queryByText(/Cette action est définitive/)).toBeNull();
    expect(screen.getByText("Absence à 09:15")).toBeTruthy();
  });

  it("supprime la crise une fois la suppression confirmée", async () => {
    const user = userEvent.setup();
    vi.mocked(deleteSeizure).mockResolvedValue(undefined);
    renderWithCrise();

    const dialog = await openDeleteDialog(user);
    await user.click(dialog.getByRole("button", { name: "Supprimer" }));

    expect(deleteSeizure).toHaveBeenCalledWith("s1");
    await waitFor(() => expect(screen.queryByText("Absence à 09:15")).toBeNull());
    expect(screen.getByText("Aucune crise notée ce jour-là.")).toBeTruthy();
    expect(screen.queryByText(/Cette action est définitive/)).toBeNull();
  });

  it("garde la crise, ferme la fenêtre et affiche une erreur si la suppression échoue", async () => {
    const user = userEvent.setup();
    vi.mocked(deleteSeizure).mockRejectedValue(new Error("échec"));
    renderWithCrise();

    const dialog = await openDeleteDialog(user);
    await user.click(dialog.getByRole("button", { name: "Supprimer" }));

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Impossible de supprimer la crise. Réessaie.",
    );
    expect(screen.getByText("Absence à 09:15")).toBeTruthy();
    expect(screen.queryByText(/Cette action est définitive/)).toBeNull();
  });

  it("en mode démo : supprime en mémoire sans appeler le serveur", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="demo" />);
    expect(screen.getByText("10 crises ce mois-ci")).toBeTruthy();

    // Le 3 novembre ne compte qu'une seule crise dans les données de démonstration
    await user.click(day(3));
    await user.click(screen.getByRole("button", { name: "Supprimer cette crise" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Supprimer" }));

    await waitFor(() => expect(screen.getByText("9 crises ce mois-ci")).toBeTruthy());
    expect(deleteSeizure).not.toHaveBeenCalled();
  });
});

describe("export PDF", () => {
  it("affiche un message quand la période est vide, sans générer de PDF", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="personal" initialSeizures={[]} initialYear={2026} initialMonth={10} />);

    await user.click(screen.getByRole("button", { name: "Exporter en PDF" }));

    expect((await screen.findByRole("alert")).textContent).toBe("Aucune crise sur cette période.");
    expect(exportSeizuresPdf).not.toHaveBeenCalled();
  });

  it("exporte toutes les crises avec le nom du patient", async () => {
    const user = userEvent.setup();
    render(
      <SeizureCalendar
        mode="personal"
        initialSeizures={[crise]}
        initialYear={2026}
        initialMonth={10}
        userName="Camille"
      />,
    );

    await user.selectOptions(screen.getByLabelText("Période à exporter"), "all");
    await user.click(screen.getByRole("button", { name: "Exporter en PDF" }));

    await waitFor(() => expect(exportSeizuresPdf).toHaveBeenCalledTimes(1));
    expect(exportSeizuresPdf).toHaveBeenCalledWith({
      seizures: [crise],
      userName: "Camille",
      periodLabel: "Toutes les crises",
    });
  });

  it("exporte uniquement le mois affiché", async () => {
    const user = userEvent.setup();
    const octobre: Seizure = { ...crise, id: "s2", date: "2026-10-05" };
    render(
      <SeizureCalendar
        mode="personal"
        initialSeizures={[crise, octobre]}
        initialYear={2026}
        initialMonth={10}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Période à exporter"), "month");
    await user.click(screen.getByRole("button", { name: "Exporter en PDF" }));

    await waitFor(() => expect(exportSeizuresPdf).toHaveBeenCalledTimes(1));
    expect(exportSeizuresPdf).toHaveBeenCalledWith({
      seizures: [crise],
      userName: "",
      periodLabel: "Novembre 2026",
    });
  });
});

describe("modification d'une crise", () => {
  const renderWithCrise = () =>
    render(
      <SeizureCalendar mode="personal" initialSeizures={[crise]} initialYear={2026} initialMonth={10} />,
    );

  async function startEditing(user: ReturnType<typeof userEvent.setup>) {
    await user.click(day(10));
    await user.click(screen.getByRole("button", { name: "Modifier cette crise" }));
  }

  it("pré-remplit le formulaire avec les valeurs de la crise", async () => {
    const user = userEvent.setup();
    renderWithCrise();

    await startEditing(user);

    expect(screen.getByText("Modifier la crise")).toBeTruthy();
    expect((screen.getByLabelText("Heure") as HTMLInputElement).value).toBe("09:15");
    expect((screen.getByLabelText("Type de crise") as HTMLSelectElement).value).toBe("Absence");
    expect((screen.getByLabelText(/Durée/) as HTMLInputElement).value).toBe("20 s");
    expect((screen.getByLabelText("Déclencheur possible") as HTMLSelectElement).value).toBe("Stress");
  });

  it("en mode personnel : appelle updateSeizure et affiche les nouvelles valeurs", async () => {
    const user = userEvent.setup();
    vi.mocked(updateSeizure).mockResolvedValue({ ...crise, duration: "45 s" });
    renderWithCrise();

    await startEditing(user);
    const duration = screen.getByLabelText(/Durée/);
    await user.clear(duration);
    await user.type(duration, "45 s");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(updateSeizure).toHaveBeenCalledWith("s1", {
      date: "2026-11-10",
      time: "09:15",
      type: "Absence",
      duration: "45 s",
      trigger: "Stress",
    });
    expect(await screen.findByText(/Durée : 45 s/)).toBeTruthy();
    expect(addSeizure).not.toHaveBeenCalled();
    expect(screen.queryByText("Modifier la crise")).toBeNull();
  });

  it("en mode démo : modifie en mémoire sans appeler le serveur", async () => {
    const user = userEvent.setup();
    render(<SeizureCalendar mode="demo" />);

    // Le 3 novembre : une seule crise « Absence » à 08:20
    await user.click(day(3));
    await user.click(screen.getByRole("button", { name: "Modifier cette crise" }));
    await user.selectOptions(screen.getByLabelText("Type de crise"), "Myoclonie");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(await screen.findByText("Myoclonie à 08:20")).toBeTruthy();
    expect(updateSeizure).not.toHaveBeenCalled();
  });

  it("garde le formulaire ouvert et affiche une erreur si la modification échoue", async () => {
    const user = userEvent.setup();
    vi.mocked(updateSeizure).mockRejectedValue(new Error("échec"));
    renderWithCrise();

    await startEditing(user);
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Impossible d'enregistrer la crise. Réessaie.",
    );
    expect(screen.getByText("Modifier la crise")).toBeTruthy();
  });

  it("referme le formulaire sans rien enregistrer avec Annuler", async () => {
    const user = userEvent.setup();
    renderWithCrise();

    await startEditing(user);
    await user.click(screen.getByRole("button", { name: "Annuler" }));

    expect(updateSeizure).not.toHaveBeenCalled();
    expect(screen.queryByText("Modifier la crise")).toBeNull();
    expect(screen.getByRole("button", { name: "+ Noter une crise" })).toBeTruthy();
  });
});