# Site de suivi des crises d'épilepsie

## Présentation
Site Next.js (App Router, TypeScript, Tailwind) pour les personnes épileptiques.
Fonction principale : un calendrier pour noter ses crises.

- Accueil : calendrier d'exemple avec de fausses données.
- Un visiteur non inscrit peut utiliser le calendrier, ses données restent dans son navigateur (localStorage).
- Plus tard : inscription/connexion pour enregistrer les données en base et les retrouver sur d'autres appareils.
- Idée à terme : export PDF/CSV pour le médecin.

## Commandes
- `npm run dev` : serveur de développement
- `npm run build` : build de production (à lancer avant un déploiement)
- `npm run lint` : vérification ESLint

## Structure
- `app/layout.tsx` : Navbar + `<main className="flex-1">` + Footer, body en `flex min-h-screen flex-col`
- `app/page.tsx` : accueil (hero + calendrier)
- `app/about/`, `app/contact/` : pages principales
- `components/Navbar.tsx`, `components/Footer.tsx`
- `components/SeizureCalendar.tsx` : calendrier (Client Component)
- `data/fakeSeizures.ts` : type `Seizure` et données d'exemple

## Modèle de données
```ts
type Seizure = {
  date: string;     // AAAA-MM-JJ
  time: string;     // HH:MM
  type: string;     // Absence, Crise focale, Myoclonie, Crise tonico-clonique, Autre
  duration: string; // texte libre (ex. "30 s", "2 min")
  trigger: string;  // Fatigue, Stress, Manque de sommeil, Oubli de traitement, etc.
};
```

## Conventions
- Langue : interface, commentaires et messages de commit en français.
- Commits : `feat:`, `fix:`, `style:`, `refactor:`, un commit par étape logique.
- Composants Server par défaut ; `"use client"` seulement si état, effets ou événements.
- Alias d'import : `@/` (ex. `@/components/Navbar`).
- Pas de balise `<form>` dans les composants React : utiliser `onClick`/`onChange`.
- Tailwind pour le style ; les `<option>` des `<select>` ont `text-black` pour rester lisibles en mode sombre.
- Windows / PowerShell : proposer des commandes PowerShell (`New-Item`, `mkdir`).

## Pièges connus
- Ne pas utiliser `new Date()` sans argument dans un composant rendu côté serveur ou prérendu : Next.js lève l'erreur "unstable value `new Date()` while prerendering". Pour l'année du footer, la valeur est calculée dans une fonction `"use cache"`. Dans le calendrier, le mois initial est fixe (novembre 2026).
- Ne jamais lire `localStorage` pendant le rendu : lire dans un `useEffect` au montage, avec un drapeau `loaded` pour ne pas écraser les données sauvegardées au premier rendu (clé : `calendrier-crises-v1`).

## Accessibilité et public concerné
- Public photosensible : aucune animation clignotante ou très flashy, transitions douces uniquement.
- Ne jamais transmettre une information par la couleur seule (ex. jour avec crise : fond rouge + symbole ●).
- Contrastes suffisants en mode clair et sombre ; `aria-label` sur les boutons sans texte.

## Données de santé
Ce sont des données sensibles (RGPD).
- Ne jamais commiter de `.env` ni d'identifiants.
- Mots de passe hashés, HTTPS, possibilité de supprimer son compte et ses données.
- HDS à étudier avant un service public avec de vraies données.
- Prévenir l'utilisateur que le localStorage est lisible par les autres utilisateurs d'un ordinateur partagé.

## Feuille de route
1. Suppression d'une crise (bouton "Supprimer" + `confirm()`), si pas encore fait.
2. Séparer la démo de l'accueil (fausses données, sans sauvegarde) d'une page `/calendrier` qui démarre vide et utilise le localStorage.
3. Base de données + ORM (idée : Prisma + PostgreSQL via Neon ou Supabase).
4. Authentification (Auth.js ou Better Auth, email + mot de passe), pages `/inscription` et `/connexion`.
5. Page `/calendrier` privée branchée sur la base, avec import des données du localStorage à l'inscription.
6. Export PDF/CSV pour le médecin.
7. Déploiement sur Vercel.

## Façon de travailler
- Avancer par petites étapes, donner le code complet des fichiers modifiés.
- Proposer un nom de commit à la fin de chaque étape.
- Expliquer brièvement le « pourquoi » des choix techniques.