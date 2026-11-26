import type { DirectoryEntry, DirectoryKind } from "@/features/information/types";

export const DIRECTORY_KIND_LABELS: Record<DirectoryKind, string> = {
  annuaire: "Annuaire officiel",
  centre: "Centre hospitalier",
};

// Uniquement des annuaires officiels et des centres : pas de noms de praticiens.
// Mettre à jour `verifiedAt` à chaque revérification d'une fiche.
export const DIRECTORY: DirectoryEntry[] = [
  {
    id: "defiscience",
    name: "Filière DéfiScience",
    country: "fr",
    kind: "annuaire",
    description:
      "Filière nationale de santé des maladies rares du développement cérébral : on y trouve les centres de référence et de compétence des épilepsies rares.",
    url: "https://www.defiscience.fr",
    verifiedAt: "2026-11-26",
  },
  {
    id: "orphanet",
    name: "Orphanet",
    country: "fr",
    kind: "annuaire",
    description:
      "Portail des maladies rares avec une cartographie des centres de référence et de compétence.",
    url: "https://www.orpha.net",
    verifiedAt: "2026-11-26",
  },
  {
    id: "inami-centres",
    name: "INAMI : centres spécialisés pour l'épilepsie",
    country: "be",
    kind: "annuaire",
    description:
      "Page officielle de l'assurance maladie belge : liste des centres spécialisés pour l'épilepsie réfractaire et conditions d'accès. L'orientation se fait par votre médecin spécialiste.",
    url: "https://www.inami.fgov.be/fr/themes/soins-de-sante-cout-et-remboursement/maladies/troubles-mentaux-et-neurologiques/epilepsie",
    verifiedAt: "2026-11-26",
  },
  {
    id: "erasme",
    name: "Centre multidisciplinaire d'épilepsie, hôpital Erasme",
    country: "be",
    kind: "centre",
    description:
      "Centre d'épilepsie de l'hôpital Erasme (Bruxelles), centre de référence pour l'épilepsie réfractaire.",
    url: "https://www.erasme.be/en/health-problems/multidisciplinary-epilepsy-centre",
    verifiedAt: "2026-11-26",
  },
  {
    id: "saint-luc",
    name: "Centre de référence pour l'épilepsie réfractaire, Cliniques universitaires Saint-Luc",
    country: "be",
    kind: "centre",
    description:
      "Centre de référence pour l'épilepsie réfractaire des Cliniques universitaires Saint-Luc (Bruxelles).",
    url: "https://saintluc.be/en/node/2266",
    verifiedAt: "2026-11-26",
  },
  {
    id: "epi-ch-specialiste",
    name: "Trouver un spécialiste en Suisse (Ligue Suisse contre l'Épilepsie)",
    country: "ch",
    kind: "annuaire",
    description:
      "Page de la Ligue Suisse contre l'Épilepsie qui renvoie vers un annuaire médical en ligne pour trouver un spécialiste.",
    url: "https://www.epi.ch/en/about-epilepsy/in-depth-information/find-a-specialist/",
    verifiedAt: "2026-11-26",
  },
  {
    id: "hug-epileptologie",
    name: "Unité d'épileptologie, Hôpitaux universitaires de Genève",
    country: "ch",
    kind: "centre",
    description:
      "Diagnostic et traitement de l'épilepsie, dont la chirurgie. Centre de référence pour les enfants en Suisse.",
    url: "https://www.hug.ch/neurologie/unite-deeg-epileptologie",
    verifiedAt: "2026-11-26",
  },
];