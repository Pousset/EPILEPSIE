# Documentation du site

Ce dossier regroupe les copies centralisées de la documentation du projet Calendrier Épilepsie. Les README restent également dans leurs dossiers d'origine afin de conserver une documentation accessible directement depuis chaque module et de ne pas casser les liens existants.

## Documentation

| Document | Contenu |
| --- | --- |
| [`site.md`](./site.md) | Documentation globale du site : installation, architecture, sécurité, Docker et déploiement. |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Architecture technique, couches et flux. |
| [`DATABASE.md`](./DATABASE.md) | Base de données, modèles et migrations. |
| [`API.md`](./API.md) | Routes, Server Actions et échanges de données. |
| [`CONVENTIONS.md`](./CONVENTIONS.md) | Conventions de code, de sécurité et de contribution. |
| [`app.md`](./app.md) | Routes et organisation de l'App Router Next.js. |
| [`features.md`](./features.md) | Organisation des fonctionnalités métier. |
| [`auth.md`](./auth.md) | Authentification Better Auth et gestion des sessions. |
| [`calendar.md`](./calendar.md) | Calendrier, Server Actions (ajout, modification, suppression), données de crise et export PDF. |
| [`information.md`](./information.md) | Associations et annuaire des centres spécialisés. |
| [`articles.md`](./articles.md) | Page d'articles : sources WordPress, nettoyage du HTML et fenêtre de lecture. |
| [`components.md`](./components.md) | Composants d'interface réutilisables (layout et `Dialog`). |
| [`lib.md`](./lib.md) | Infrastructure partagée et client Prisma. |
| [`prisma.md`](./prisma.md) | Schéma PostgreSQL, migrations et génération Prisma. |
| [`agents.md`](./agents.md) | Skills et instructions destinés aux assistants IA. |
| [`next.md`](./next.md) | Dossier `.next` généré par Next.js. |
| [`functions.md`](./functions.md) | Référence des fonctions et handlers du site. |

## Tests

La documentation des tests unitaires, d'intÃ©gration et des parcours E2E est dÃ©taillÃ©e dans [`e2e.md`](./e2e.md).

## Documentation canonique

Les fichiers présents dans les dossiers du projet restent les références locales :

- [`../README.md`](../README.md)
- [`../app/README.md`](../app/README.md)
- [`../features/README.md`](../features/README.md)
- [`../features/auth/README.md`](../features/auth/README.md)
- [`../features/calendar/README.md`](../features/calendar/README.md)
- [`../features/information/README.md`](../features/information/README.md)
- [`../features/articles/README.md`](../features/articles/README.md)
- [`../components/README.md`](../components/README.md)
- [`../lib/README.md`](../lib/README.md)
- [`../prisma/README.md`](../prisma/README.md)
- [`../.agents/README.md`](../.agents/README.md)

Lorsqu'un README local est modifié, mettre à jour la copie correspondante dans `docs/` pour éviter les divergences.

Le fichier `next.md` est une copie documentaire du README de `.next`. Le dossier `.next` lui-même est généré, ignoré par Git et peut être supprimé à tout moment.
