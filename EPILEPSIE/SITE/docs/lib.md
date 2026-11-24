# Dossier `lib`

Le dossier `lib` contient les modules d'infrastructure partagés par plusieurs parties de l'application. Il ne contient pas les composants React ni la logique propre à une feature.

## Arborescence

```text
lib/
├─ README.md
└─ prisma.ts
```

## Client Prisma

Le fichier [`prisma.ts`](./prisma.ts) expose une instance partagée de `PrismaClient` configurée avec l'adaptateur Neon PostgreSQL.

```ts
import { prisma } from "@/lib/prisma";
```

La connexion utilise la variable d'environnement `DATABASE_URL`. Le client généré est importé depuis [`../app/generated/prisma/`](../app/generated/prisma/), un dossier produit automatiquement par Prisma.

## Singleton en développement

En développement, Next.js recharge régulièrement les modules pendant le hot reload. Le client est donc conservé sur `globalThis` afin d'éviter de créer trop de connexions à la base de données.

En production, une instance classique est utilisée.

## Utilisation côté serveur

Prisma doit être utilisé uniquement dans du code serveur : Server Components, Server Actions ou routes API.

```ts
import { prisma } from "@/lib/prisma";

const seizures = await prisma.seizure.findMany({
  where: { userId },
  orderBy: [{ date: "asc" }, { time: "asc" }],
});
```

Ne pas importer `prisma` dans un Client Component ou dans un module envoyé au navigateur.

## Variables d'environnement

Le fichier `.env` doit contenir une URL PostgreSQL valide :

```env
DATABASE_URL=postgresql://...
```

Les vraies valeurs de `.env` ne doivent jamais être commitées. Utiliser `.env.example` pour documenter les variables nécessaires sans exposer de secrets.

## Génération du client

Après une modification du schéma Prisma, régénérer le client avec :

```bash
pnpm exec prisma generate
```

Ne pas modifier manuellement le contenu de [`../app/generated/prisma/`](../app/generated/prisma/).

## Organisation du code

Ajouter un fichier dans `lib` lorsqu'il s'agit d'un utilitaire technique ou d'une intégration partagée, par exemple :

- un client de base de données ;
- un client d'API externe ;
- une configuration d'infrastructure ;
- un utilitaire sans interface utilisateur.

La logique métier spécifique à l'authentification ou au calendrier doit rester dans [`../features/`](../features/). Les composants d'interface partagés restent dans [`../components/`](../components/).
