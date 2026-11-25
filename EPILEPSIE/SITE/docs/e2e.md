# Tests du projet

Le projet utilise trois niveaux de tests complementaires :

| Type | Outil | Emplacement | Objectif |
| --- | --- | --- | --- |
| Unitaires | Vitest | `features/**/*.test.*` | Verifier une fonction, un composant ou une regle metier isolee. |
| Integration | Vitest | `features/calendar/*.integration.test.ts` | Verifier les Server Actions avec Prisma et Neon. |
| E2E | Playwright | `e2e/*.spec.ts` | Verifier un parcours reel dans le navigateur, de l'interface a la base. |

## Commandes

```bash
pnpm test
pnpm run test:integration
pnpm run test:e2e
```

Les tests E2E demarrent automatiquement Next.js sur le port `3100`, avec un seul worker pour eviter les conflits entre comptes et donnees.

## Base de donnees E2E

Les tests E2E utilisent `DATABASE_URL_TEST` dans `.env.test`. Cette URL doit pointer vers une base ou une branche Neon dediee aux tests et ne doit jamais etre identique a `DATABASE_URL`.

Le fichier [`e2e/env.ts`](../e2e/env.ts) verifie cette separation. Le fichier [`e2e/db.ts`](../e2e/db.ts) trouve la table utilisateur, valide les emails necessaires et supprime les comptes dont l'adresse finit par `@e2e.local` a la fin de la suite. Chaque operation ferme ensuite son pool PostgreSQL.

## Parcours couverts

- protection de `/calendrier` pour un visiteur non connecte ;
- inscription, email non verifie, connexion et deconnexion ;
- isolation des crises entre deux comptes ;
- ajout, modification et suppression d'une crise ;
- export PDF et periode sans donnee.

Les resultats temporaires sont places dans `test-results/` et ne doivent pas etre commites.
