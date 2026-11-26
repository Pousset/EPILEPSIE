# Dossier `features`

Le dossier `features` regroupe les fonctionnalités métier de l'application. Chaque feature rassemble ses composants, sa logique, ses types et sa documentation afin de rester autonome et maintenable.

## Arborescence

```text
features/
├─ README.md
├─ articles/
│  ├─ README.md
│  ├─ ArticleCard.tsx
│  ├─ ArticleReader.tsx
│  ├─ fetch-articles.ts
│  ├─ sources.ts
│  └─ types.ts
├─ auth/
│  ├─ README.md
│  ├─ AuthForm.tsx
│  ├─ StartCalendarButton.tsx
│  ├─ auth.ts
│  └─ auth-client.ts
└─ calendar/
   ├─ README.md
   ├─ SeizureCalendar.tsx
   ├─ actions.ts
   ├─ demo-data.ts
   ├─ export-pdf.ts
   ├─ options.ts
   └─ types.ts
```

## Features disponibles

| Feature | Responsabilité | Route principale | Documentation |
| --- | --- | --- | --- |
| `articles` | Agrégation d'articles publics sur l'épilepsie depuis des sources externes, nettoyage du contenu et lecture détaillée. | `/articles` | [`articles/README.md`](../features/articles/README.md) |
| `auth` | Inscription, connexion, session utilisateur et accès au calendrier privé. | `/connexion`, `/inscription` | [`auth/README.md`](../features/auth/README.md) |
| `calendar` | Affichage du calendrier, ajout/suppression de crises, données de démonstration et export PDF. | `/`, `/calendrier` | [`calendar/README.md`](../features/calendar/README.md) |

## Feature Articles

La feature `articles` alimente [`/articles`](../app/articles/page.tsx) avec les publications d'Épilepsie-France et de la Fondation Française pour la Recherche sur l'Épilepsie.

- Les sources sont déclarées dans `features/articles/sources.ts`.
- Les articles sont récupérés depuis les API REST WordPress côté serveur.
- Les résultats sont mis en cache pendant une heure.
- Une source indisponible ne bloque pas les autres grâce à `Promise.allSettled`.
- Le HTML externe est nettoyé avec `sanitize-html` avant affichage.
- Seules les images HTTPS sont conservées.
- La page est publique et ne manipule aucune donnée personnelle.

## Feature Auth

La feature `auth` regroupe Better Auth, son client navigateur, le formulaire partagé d'inscription/connexion et le bouton d'accès au calendrier. Les données d'authentification sont stockées avec Prisma dans PostgreSQL.

## Feature Calendar

La feature `calendar` gère le calendrier de démonstration et le calendrier personnel. Le mode personnel vérifie la session côté serveur et utilise des Server Actions pour ajouter ou supprimer les crises.

## Organisation d'une feature

Une feature peut contenir :

- des composants React propres à la fonctionnalité ;
- des modules serveur et des Server Actions ;
- des types TypeScript partagés ;
- des constantes et options d'interface ;
- des données de démonstration ou des utilitaires métier ;
- un `README.md` expliquant son fonctionnement.

Les composants génériques restent dans [`../components/`](../components/). Les routes Next.js restent dans [`../app/`](../app/).

## Règles d'import et d'exécution

Utiliser l'alias `@/features/...` pour les imports internes :

```tsx
import AuthForm from "@/features/auth/AuthForm";
import ArticleCard from "@/features/articles/ArticleCard";
import SeizureCalendar from "@/features/calendar/SeizureCalendar";
```

- Les composants sont des Server Components par défaut.
- Ajouter `"use client"` uniquement pour les hooks, l'état, les effets ou les API du navigateur.
- Garder Prisma, Better Auth serveur, les secrets et les vérifications de session côté serveur.
- Valider les données avant toute écriture.

## Ajouter une feature

1. Créer un dossier sous `features/` avec un nom descriptif en minuscules.
2. Regrouper les composants et la logique propres à cette fonctionnalité.
3. Ajouter un `README.md` local.
4. Ajouter ou modifier les routes correspondantes dans [`../app/`](../app/).
5. Mettre à jour ce document et sa copie dans `docs/`.
6. Ajouter les fonctions et handlers importants dans [`../docs/functions.md`](./functions.md).
7. Vérifier le projet avec `pnpm lint` et `pnpm build`.

## Sécurité

Les fonctionnalités Auth et Calendar manipulent des données potentiellement sensibles. Toute feature qui accède à des données personnelles doit vérifier la session côté serveur, valider les entrées et limiter les requêtes à l'utilisateur concerné. La feature Articles doit nettoyer tout HTML provenant d'une source externe avant affichage.
