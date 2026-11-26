# Base de données

## Technologie

La base utilise PostgreSQL hébergé sur Neon. Prisma 7 fournit le schéma, les migrations et le client TypeScript.

Fichiers principaux :

- [`../prisma/schema.prisma`](../prisma/schema.prisma) : modèles et relations ;
- [`../prisma/migrations/`](../prisma/migrations/) : historique des changements ;
- [`../lib/prisma.ts`](../lib/prisma.ts) : instance Prisma partagée ;
- [`../prisma7.config.ts`](../prisma7.config.ts) : configuration CLI Prisma ;
- [`../app/generated/prisma/`](../app/generated/prisma/) : client généré, à ne pas modifier.

## Variables d'environnement

```env
DATABASE_URL="postgresql://...pooler..."
DATABASE_URL_UNPOOLED="postgresql://...direct..."
```

`DATABASE_URL` est utilisée par l'application. `DATABASE_URL_UNPOOLED` est utilisée par Prisma pour les migrations et Prisma Studio.

Ne jamais versionner les valeurs réelles de ces variables.

## Modèles

| Modèle | Rôle |
| --- | --- |
| `User` | Compte utilisateur Better Auth. |
| `Session` | Session de connexion et expiration. |
| `Account` | Identifiants et données de compte Better Auth. |
| `Verification` | Données de vérification Better Auth. |
| `Seizure` | Crise enregistrée par un utilisateur. |

`Seizure.userId` référence `User.id`. L'index `[userId, date]` accélère le chargement du calendrier personnel. Les relations utilisent `onDelete: Cascade` pour supprimer les données dépendantes avec leur propriétaire.

## Workflow de modification

```bash
pnpm exec prisma format
pnpm exec prisma validate
pnpm exec prisma migrate dev --name description_du_changement
pnpm exec prisma generate
```

Avant de déployer :

```bash
pnpm exec prisma migrate status
pnpm exec prisma migrate deploy
```

Les fichiers de migration doivent être relus, committés avec le schéma et appliqués dans l'ordre. Ne jamais modifier une migration déjà appliquée en production : créer une nouvelle migration.

## Sécurité des requêtes

- Toute requête de crise doit être filtrée par `userId` côté serveur.
- Ne jamais utiliser un `userId` fourni par le navigateur pour autoriser un accès.
- Valider les entrées avant `create`, `update` ou `delete`.
- Les commandes destructives comme `migrate reset` nécessitent une confirmation explicite.
- Les données médicales ne doivent pas être journalisées.
