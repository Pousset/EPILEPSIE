# Dossier `components`

Le dossier `components` contient les composants d'interface réutilisables à l'échelle de l'application. Les composants liés à une fonctionnalité métier restent dans le dossier [`../features/`](../features/), afin de garder chaque feature autonome.

## Arborescence

```text
components/
├─ README.md
└─ layout/
   ├─ Navbar.tsx
   ├─ Footer.tsx
   └─ EmergencyButton.tsx
```

## Composants disponibles

| Composant | Rôle | Type |
| --- | --- | --- |
| [`layout/Navbar.tsx`](./layout/Navbar.tsx) | Navigation principale, liens publics et état de connexion. | Client Component |
| [`layout/Footer.tsx`](./layout/Footer.tsx) | Pied de page partagé par toutes les pages. | Server Component |
| [`layout/EmergencyButton.tsx`](./layout/EmergencyButton.tsx) | Lien vers la page d'urgence, affiché au centre du footer. | Server Component |

## Utilisation

Les composants de layout sont utilisés dans [`../app/layout.tsx`](../app/layout.tsx), ce qui les rend disponibles sur toutes les routes :

```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

## Navigation

[`Navbar.tsx`](./layout/Navbar.tsx) utilise le client Better Auth pour adapter son affichage à la session courante. Il peut notamment proposer :

- les liens vers l'accueil, la présentation et le contact ;
- l'accès au calendrier personnel ;
- la connexion ou l'inscription ;
- la déconnexion lorsque l'utilisateur est connecté.

Comme il utilise `authClient.useSession()`, il doit rester un Client Component.

## Footer

[`Footer.tsx`](./layout/Footer.tsx) affiche le pied de page commun et les informations générales du site. Il intègre aussi [`EmergencyButton.tsx`](./layout/EmergencyButton.tsx), centré dans le footer pour accéder à la page d'urgence. Il reste donc un Server Component.

## Organisation des composants

Ajouter un composant dans `components` lorsqu'il est partagé par plusieurs pages ou features et qu'il ne porte pas une logique métier spécifique.

Pour les composants propres à une fonctionnalité, utiliser plutôt :

- [`../features/auth/`](../features/auth/) pour l'authentification ;
- [`../features/calendar/`](../features/calendar/) pour le calendrier et le suivi des crises.

Exemples : `AuthForm` et `StartCalendarButton` appartiennent à la feature Auth, tandis que `SeizureCalendar` appartient à la feature Calendar.

## Conventions

- Utiliser l'alias `@/` pour les imports internes.
- Les composants sont des Server Components par défaut.
- Ajouter `"use client"` uniquement pour l'état, les effets, les événements navigateur ou les hooks client.
- Garder les composants génériques et réutilisables dans ce dossier.
- Garder les accès à Prisma et les données privées côté serveur.
- Ajouter une `aria-label` aux boutons qui n'ont pas de texte visible.
