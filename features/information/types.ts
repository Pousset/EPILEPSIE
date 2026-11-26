export type Country = "fr" | "be" | "ch";

export type Association = {
  id: string;
  name: string;
  country: Country;
  description: string;
  url: string; // site officiel (HTTPS)
  verifiedAt: string; // AAAA-MM-JJ : date de dernière vérification du lien et de la description
};