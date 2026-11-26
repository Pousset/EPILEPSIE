export type EmergencyCardData = {
  fullName: string;
  contactName: string;
  contactPhone: string;
  epilepsyType: string;
  usualDuration: string;
  doList: string;
  dontList: string;
  medications: string;
  allergies: string;
  neurologistName: string;
  neurologistPhone: string;
};

export const DEFAULT_DO_LIST = `Noter l'heure de début de la crise
Éloigner les objets dangereux et protéger la tête
Desserrer les vêtements autour du cou
Rester près de moi jusqu'à mon réveil complet
Après les secousses, me mettre sur le côté (position latérale de sécurité)`;

export const DEFAULT_DONT_LIST = `Ne pas me retenir ni m'empêcher de bouger
Ne rien mettre dans ma bouche
Ne pas me donner à boire ou à manger avant mon réveil complet
Ne pas me laisser seul(e) après la crise`;