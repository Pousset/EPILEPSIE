export type Country = "fr" | "be" | "ch";

export type Association = {
  id: string;
  name: string;
  country: Country;
  description: string;
  url: string; // site officiel (HTTPS)
  verifiedAt: string; // AAAA-MM-JJ : date de dernière vérification du lien et de la description
};

export type DirectoryKind = "annuaire" | "centre";

// Annuaire officiel ou centre hospitalier spécialisé. Jamais de nom de praticien.
export type DirectoryEntry = {
  id: string;
  name: string;
  country: Country;
  kind: DirectoryKind;
  description: string;
  url: string; // site officiel (HTTPS)
  verifiedAt: string; // AAAA-MM-JJ
};

export type TreatmentSource = {
  label: string;
  url: string; // source officielle ou associative (HTTPS)
};

// null = contenu pas encore relu par un professionnel de santé
export type MedicalReview = {
  reviewer: string; // nom et fonction du relecteur
  reviewedAt: string; // AAAA-MM-JJ
};

export type Treatment = {
  id: string;
  name: string;
  summary: string; // en quoi consiste le traitement, sans dose ni conseil personnalisé
  context: string; // dans quel cadre il est envisagé
  sources: TreatmentSource[];
  verifiedAt: string; // AAAA-MM-JJ : date de dernière vérification des sources
  medicalReview: MedicalReview | null;
};