import type { Treatment } from "@/features/information/types";

// Présentation générale des grandes familles de traitements.
// Règles : aucune dose, aucun conseil personnalisé, au moins une source par fiche.
// Tant qu'une fiche a `medicalReview: null`, la page /traitements n'est pas publiée
// en production (voir app/traitements/page.tsx).
export const TREATMENTS: Treatment[] = [
  {
    id: "medicaments",
    name: "Médicaments antiépileptiques",
    summary:
      "Ils visent à prévenir les crises et constituent le traitement de base de l'épilepsie. Il en existe plusieurs familles, et le choix dépend notamment du type d'épilepsie.",
    context:
      "La décision de commencer un traitement se prend après une consultation avec un spécialiste. Le choix, l'ajustement et l'arrêt d'un traitement sont décidés avec le médecin. Chez les filles et les femmes en âge d'avoir des enfants, certains médicaments exposent l'enfant à naître à des risques : une information dédiée est recommandée dès la mise en place du traitement.",
    sources: [
      {
        label: "HAS : parcours de santé de la personne avec une épilepsie",
        url: "https://www.has-sante.fr/jcms/p_3444925/",
      },
      {
        label: "HAS : Épilepsies, prise en charge des enfants et des adultes (2020)",
        url: "https://has-sante.fr/upload/docs/application/pdf/2020-10/reco308_recommandations_epilepsies_preparation_mel.pdf",
      },
    ],
    verifiedAt: "2026-11-26",
    medicalReview: null,
  },
  {
    id: "chirurgie",
    name: "Chirurgie de l'épilepsie",
    summary:
      "Elle consiste à retirer ou à déconnecter la zone du cerveau à l'origine des crises. Dans certains cas, elle peut supprimer les crises.",
    context:
      "Elle est envisagée pour certaines épilepsies pharmacorésistantes, c'est-à-dire lorsque des crises persistent malgré des médicaments correctement prescrits. Elle suppose un bilan préalable (IRM, vidéo-EEG, évaluation neuropsychologique) réalisé dans un centre spécialisé.",
    sources: [
      {
        label: "HAS : prise en charge des épilepsies partielles pharmaco-résistantes",
        url: "https://www.has-sante.fr/jcms/c_272300/",
      },
      {
        label: "INAMI : épilepsie et centres spécialisés (Belgique)",
        url: "https://www.inami.fgov.be/fr/themes/soins-de-sante-cout-et-remboursement/maladies/troubles-mentaux-et-neurologiques/epilepsie",
      },
    ],
    verifiedAt: "2026-11-26",
    medicalReview: null,
  },
  {
    id: "nerf-vague",
    name: "Stimulation du nerf vague",
    summary:
      "Un petit appareil implanté stimule le nerf vague. Dans certains cas, il peut aider à réduire les crises.",
    context:
      "C'est une option étudiée dans un centre spécialisé pour une épilepsie qui ne répond pas aux médicaments. D'autres interventions, dites palliatives, existent lorsqu'une chirurgie à visée curative n'est pas possible.",
    sources: [
      {
        label: "INAMI : épilepsie et centres spécialisés (Belgique)",
        url: "https://www.inami.fgov.be/fr/themes/soins-de-sante-cout-et-remboursement/maladies/troubles-mentaux-et-neurologiques/epilepsie",
      },
      {
        label: "HAS : prise en charge des épilepsies partielles pharmaco-résistantes",
        url: "https://www.has-sante.fr/jcms/c_272300/",
      },
    ],
    verifiedAt: "2026-11-26",
    medicalReview: null,
  },
  {
    id: "regime-cetogene",
    name: "Régimes cétogènes",
    summary:
      "Régime très riche en graisses et très pauvre en glucides, utilisé dans certaines formes d'épilepsie, notamment des troubles du métabolisme comme le déficit en transporteur du glucose de type 1 (GLUT1).",
    context:
      "Il est mis en place et suivi par une équipe médicale. Il peut provoquer des effets indésirables, la constipation étant l'un des plus fréquents.",
    sources: [
      {
        label: "Ligue Suisse contre l'Épilepsie : e-book d'information (2023)",
        url: "https://www.epi.ch/wp-content/uploads/2023/01/Epilepsie-E-Book-F-apr-2023.pdf",
      },
    ],
    verifiedAt: "2026-11-26",
    medicalReview: null,
  },
  {
    id: "accompagnement",
    name: "Éducation thérapeutique et accompagnement",
    summary:
      "Le traitement de l'épilepsie ne se limite pas aux médicaments : il comprend de l'information, de l'éducation thérapeutique et, selon les besoins, un accompagnement psychologique, scolaire ou professionnel.",
    context:
      "Les associations de patients participent à cet accompagnement tout au long du parcours. Le suivi médical comprend au moins une visite par an auprès d'un médecin.",
    sources: [
      {
        label: "HAS : parcours de santé de la personne avec une épilepsie",
        url: "https://www.has-sante.fr/jcms/p_3444925/",
      },
    ],
    verifiedAt: "2026-11-26",
    medicalReview: null,
  },
];