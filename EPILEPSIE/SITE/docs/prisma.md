# Dossier `prisma`

Le dossier `prisma` contient la définition de la base PostgreSQL, les migrations et les fichiers nécessaires à la génération du client Prisma.

## Arborescence

```text
prisma/
├─ README.md
├─ schema.prisma
└─ migrations/
   ├─ migration_lock.toml
   ├─ 20261123231953_init/
   │  └─ migration.sql
   └─ 20261123233924_add_auth/
      └─ migration.sql
```

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| [`schema.prisma`](./schema.prisma) | Décrit les modèles, relations, index et générateur Prisma. |
| [`migrations/`](./migrations/) | Contient l'historique versionné des changements de schéma. |
| [`migrations/migration_lock.toml`](./migrations/migration_lock.toml) | Verrouille le fournisseur PostgreSQL utilisé par les migrations. |

La configuration CLI complémentaire se trouve dans [`../prisma7.config.ts`](../prisma7.config.ts).

## Modèles actuels

### `Seizure`

Stocke une crise déclarée par un utilisateur :

- date et heure ;
- type de crise ;
- durée ;
- déclencheur ;
- utilisateur propriétaire ;
- date de création.

Un index est défini sur `userId` et `date` pour accélérer l'affichage du calendrier personnel.

### Modèles Better Auth

Les modèles `User`, `Session`, `Account` et `Verification` sont utilisés par Better Auth pour gérer les comptes, les sessions et l'authentification par email/mot de passe.

Les relations utilisent `onDelete: Cascade` : la suppression d'un utilisateur supprime également ses sessions, ses comptes associés et ses crises.

## Client généré

Le générateur Prisma produit le client dans [`../app/generated/prisma/`](../app/generated/prisma/) :

```prisma
generator client {
  provider = "prisma-client"
  output   = "../app/generated/prisma"
}
```

Ce dossier est généré automatiquement et ignoré par Git. Il ne doit pas être modifié manuellement. Le client est ensuite exposé à l'application par [`../lib/prisma.ts`](../lib/prisma.ts).

## Commandes principales

Après une modification de [`schema.prisma`](./schema.prisma) :

```bash
# Vérifier le schéma
pnpm exec prisma validate

# Formater le schéma
pnpm exec prisma format

# Créer et appliquer une migration en développement
pnpm exec prisma migrate dev --name description_du_changement

# Régénérer le client Prisma
pnpm exec prisma generate
```

Pour un déploiement :

```bash
pnpm exec prisma migrate deploy
```

Pour consulter l'état des migrations :

```bash
pnpm exec prisma migrate status
```

## Workflow recommandé

1. Modifier [`schema.prisma`](./schema.prisma).
2. Exécuter `prisma format` et `prisma validate`.
3. Créer une migration avec un nom explicite.
4. Vérifier la migration générée.
5. Régénérer le client Prisma.
6. Tester l'application avec `pnpm build`.
7. Déployer les migrations avec `prisma migrate deploy`.

Les migrations doivent être commitées avec le schéma. Elles constituent l'historique reproductible de la structure de la base.

## Données et sécurité

- La base utilise PostgreSQL via Neon.
- La connexion est fournie par `DATABASE_URL`.
- Ne jamais commiter une URL de connexion contenant un secret.
- Les requêtes de crises doivent toujours filtrer sur `userId` côté serveur.
- Toute migration destructive doit être vérifiée et validée avant exécution.
