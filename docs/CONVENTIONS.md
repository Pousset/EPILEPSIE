# Conventions du projet

## Langue et style

- Interface utilisateur, commentaires et messages d'erreur en français.
- Noms de fichiers, composants, fonctions et variables en anglais lorsque cela suit les conventions du framework ou du code existant.
- Éviter les abréviations ambiguës.
- Préférer des fonctions courtes avec une responsabilité claire.

## Organisation du code

- Routes et layouts dans [`../app/`](../app/).
- Logique métier dans [`../features/`](../features/).
- UI partagée dans [`../components/`](../components/).
- Infrastructure dans [`../lib/`](../lib/).
- Schéma et migrations dans [`../prisma/`](../prisma/).
- Documentation centralisée dans [`./`](./).

## Imports

Utiliser l'alias `@/` pour les imports internes :

```ts
import { prisma } from "@/lib/prisma";
import SeizureCalendar from "@/features/calendar/SeizureCalendar";
```

Éviter les chemins relatifs longs et ne pas importer une fonctionnalité entière lorsqu'un export ciblé suffit.

## Server et Client Components

- Server Component par défaut.
- Ajouter `"use client"` uniquement pour les hooks, l'état, les événements ou les API du navigateur.
- Prisma et Better Auth serveur restent côté serveur.
- Ne jamais exposer de secret au navigateur.
- Les Server Actions vérifient la session et valident leurs entrées.

## Accessibilité et santé

- Ajouter un label aux champs de formulaire.
- Ajouter `aria-label` aux boutons sans texte visible.
- Ne pas transmettre une information uniquement par la couleur.
- Éviter les animations clignotantes ou très contrastées pour le public photosensible.
- Afficher des contrastes suffisants en mode clair et sombre.
- Ne pas présenter le site comme un dispositif médical.

## Base de données

- Filtrer toute donnée personnelle par l'utilisateur connecté.
- Ne jamais modifier manuellement le client généré dans `app/generated/prisma/`.
- Créer une nouvelle migration pour chaque changement de schéma.
- Ne pas modifier une migration déjà appliquée en production.
- Demander une confirmation explicite avant toute commande Prisma destructive.

## Documentation obligatoire

Toute modification doit mettre à jour, dans le même changement :

1. le README local du dossier ou de la feature concernée ;
2. la copie correspondante dans [`../docs/`](../docs/) si nécessaire ;
3. [`functions.md`](./functions.md) si une fonction, un handler, un composant ou un export est ajouté, supprimé ou modifié ;
4. [`../README.md`](../README.md) si l'architecture, une commande ou un flux global change.

Les numéros de ligne et liens de [`functions.md`](./functions.md) doivent rester exacts.

## Validation

Avant de terminer une tâche :

```bash
pnpm lint
pnpm build
```

Pour une modification Prisma, ajouter `prisma format`, `prisma validate` et la vérification de migration nécessaires.

## Commits

Utiliser un préfixe explicite :

- `feat:` fonctionnalité ;
- `fix:` correction ;
- `refactor:` réorganisation ;
- `docs:` documentation ;
- `style:` styles ou formatage.

Toujours proposer un nom de commit précis, en français, décrivant le résultat :

```text
docs: ajouter la documentation architecture et API du site
```
