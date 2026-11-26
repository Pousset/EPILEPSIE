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