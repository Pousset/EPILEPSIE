import type { Association } from "@/features/information/types";

// Descriptions volontairement courtes et générales : le site officiel reste la référence.
// Mettre à jour `verifiedAt` à chaque revérification d'une fiche.
export const ASSOCIATIONS: Association[] = [
  {
    id: "epilepsie-france",
    name: "Épilepsie-France",
    country: "fr",
    description:
      "Association de patients et de proches : information, accompagnement et sensibilisation à l'épilepsie.",
    url: "https://www.epilepsie-france.com",
    verifiedAt: "2026-11-26",
  },
  {
    id: "fondation-epilepsie",
    name: "Fondation Française pour la Recherche sur l'Épilepsie",
    country: "fr",
    description: "Fondation dédiée au soutien de la recherche sur l'épilepsie.",
    url: "https://www.fondation-epilepsie.fr",
    verifiedAt: "2026-11-26",
  },
  {
    id: "ligue-francophone-belge",
    name: "Ligue Francophone Belge contre l'Épilepsie",
    country: "be",
    description:
      "Informe le grand public, sensibilise à la maladie et accompagne les personnes touchées en Belgique francophone.",
    url: "https://ligueepilepsie.be",
    verifiedAt: "2026-11-26",
  },
  {
    id: "ligue-suisse",
    name: "Ligue Suisse contre l'Épilepsie",
    country: "ch",
    description:
      "Mène des actions de recherche, d'aide et d'information pour améliorer le quotidien des personnes concernées.",
    url: "https://www.epi.ch",
    verifiedAt: "2026-11-26",
  },
  {
    id: "epi-suisse",
    name: "Epi-Suisse",
    country: "ch",
    description:
      "Association suisse de l'épilepsie : qualité de vie, aspects psychosociaux et publications pour les trois régions linguistiques.",
    url: "https://www.epi-suisse.ch",
    verifiedAt: "2026-11-26",
  },
];