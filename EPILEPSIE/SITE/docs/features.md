# Dossier `features`

Le dossier `features` regroupe les fonctionnalités métier de l'application. Chaque feature rassemble ses composants, sa logique, ses types et sa documentation afin de rester autonome et facilement maintenable.

## Arborescence

```text
features/
├─ README.md
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

| Feature | Responsabilité | Documentation |
| --- | --- | --- |
| `auth` | Inscription, connexion, session utilisateur et accès au calendrier privé. | [`auth/README.md`](./auth/README.md) |
| `calendar` | Affichage du calendrier, ajout/suppression de crises, données de démonstration et export PDF. | [`calendar/README.md`](./calendar/README.md) |

## Organisation d'une feature

Une feature peut contenir :

- des composants React propres à la fonctionnalité ;
- des modules serveur et des Server Actions ;
- des types TypeScript partagés ;
- des constantes et options d'interface ;
- des données de démonstration ou des utilitaires métier ;
- un `README.md` expliquant son fonctionnement.

Les composants génériques utilisés par plusieurs fonctionnalités restent dans [`../components/`](../components/). Les routes Next.js restent dans [`../app/`](../app/).

## Règles d'import

Utiliser l'alias `@/features/...` pour importer un module depuis une autre partie de l'application :

```tsx
import AuthForm from "@/features/auth/AuthForm";
import SeizureCalendar from "@/features/calendar/SeizureCalendar";
```

À l'intérieur d'une feature, conserver également des imports explicites avec l'alias `@/features/...` lorsque cela améliore la lisibilité et évite les chemins relatifs fragiles.

## Server et Client Components

- Les composants sont des Server Components par défaut.
- Ajouter `"use client"` uniquement lorsqu'un composant utilise un hook, un état local, un effet ou une API du navigateur.
- Garder les accès à Prisma, les secrets et les vérifications de session côté serveur.
- Exposer au navigateur uniquement les données nécessaires au rendu et aux interactions.

## Ajouter une nouvelle feature

1. Créer un dossier sous `features/` avec un nom descriptif en anglais et en minuscules.
2. Regrouper les composants et la logique propres à cette fonctionnalité dans ce dossier.
3. Ajouter un `README.md` local.
4. Ajouter les routes correspondantes dans [`../app/`](../app/).
5. Mettre à jour ce README si la feature devient une partie importante de l'application.
6. Vérifier le projet avec `pnpm build`.

## Sécurité

Les fonctionnalités Auth et Calendar manipulent des données potentiellement sensibles. Toute nouvelle feature qui accède à des données personnelles doit vérifier la session côté serveur, valider les entrées et limiter les requêtes à l'utilisateur concerné.
