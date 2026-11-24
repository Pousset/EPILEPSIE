# Instructions Claude — Calendrier Épilepsie

## Contexte du projet

Application Next.js de suivi des crises d'épilepsie. L'application propose un calendrier de démonstration public, une authentification par email et mot de passe, un calendrier personnel protégé, l'enregistrement des crises et un export PDF.

Les données peuvent être des données de santé sensibles. Toute modification doit privilégier la confidentialité, la séparation des utilisateurs et la validation côté serveur.

## Stack et commandes

- Next.js 16 avec App Router, React 19 et TypeScript.
- Tailwind CSS pour les styles.
- Better Auth pour l'authentification.
- Prisma 7 avec PostgreSQL Neon.
- pnpm est le gestionnaire de paquets de référence.

Commandes principales :

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm start
```

Commandes Prisma :

```bash
pnpm exec prisma generate
pnpm exec prisma validate
pnpm exec prisma format
pnpm exec prisma migrate dev --name description_du_changement
pnpm exec prisma migrate deploy
pnpm exec prisma migrate status
pnpm run prisma:studio
```

Avant de considérer une modification terminée, lancer au minimum `pnpm lint` et `pnpm build` lorsque l'environnement le permet.

## Structure du projet

```text
app/                         # Routes Next.js et App Router
├─ page.tsx                  # Accueil et calendrier de démonstration
├─ layout.tsx                # Layout global
├─ calendrier/page.tsx       # Calendrier personnel protégé
├─ connexion/page.tsx        # Connexion
├─ inscription/page.tsx      # Inscription
├─ about/page.tsx
├─ contact/page.tsx
└─ api/auth/[...all]/        # Route Better Auth

features/                    # Fonctionnalités métier autonomes
├─ auth/                     # Better Auth, formulaires et session
└─ calendar/                 # Calendrier, actions, types et export PDF

components/                  # Composants d'interface partagés
└─ layout/                   # Navbar et Footer

lib/                         # Infrastructure partagée
└─ prisma.ts                 # Client Prisma avec adaptateur Neon

prisma/                      # Schéma et migrations PostgreSQL
├─ schema.prisma
└─ migrations/

app/generated/prisma/        # Client Prisma généré, ignoré par Git
```

## Où placer le code

- Une route, un layout ou un fichier propre à l'App Router va dans `app/`.
- Une logique métier liée à l'authentification ou au calendrier va dans la feature correspondante sous `features/`.
- Un composant visuel réellement partagé va dans `components/`.
- Un client technique ou un utilitaire d'infrastructure partagé va dans `lib/`.
- Un modèle de données ou une évolution de base va dans `prisma/`.

Ne pas déplacer la logique métier vers `lib/` simplement parce qu'elle est réutilisée par deux fichiers. Elle doit rester dans sa feature tant qu'elle concerne le domaine Auth ou Calendar.

Documentation à consulter avant une modification importante :

- `README.md` à la racine pour la vue d'ensemble ;
- `docs/` pour la copie centralisée de la documentation du projet ;
- `docs/ARCHITECTURE.md` pour les couches et les flux ;
- `docs/DATABASE.md` pour la base, Prisma et les migrations ;
- `docs/API.md` pour les routes, actions serveur et échanges de données ;
- `docs/CONVENTIONS.md` pour les règles de code, sécurité et contribution ;
- `docs/functions.md` pour le catalogue des fonctions et handlers ;
- `app/README.md` pour les routes ;
- `features/README.md` pour l'organisation métier ;
- `features/auth/README.md` pour l'authentification ;
- `features/calendar/README.md` pour le calendrier ;
- `components/README.md` pour les composants partagés ;
- `lib/README.md` pour Prisma ;
- `prisma/README.md` pour le schéma et les migrations.

## Conventions TypeScript et Next.js

- Utiliser l'alias `@/` pour les imports internes.
- Les composants sont des Server Components par défaut.
- Ajouter `"use client"` uniquement pour les hooks, l'état, les événements navigateur ou les API navigateur.
- Ne jamais importer Prisma, `auth` serveur ou des secrets dans un Client Component.
- Garder les accès aux données personnelles côté serveur.
- Utiliser des types explicites pour les données échangées entre serveur et client.
- Préserver l'accessibilité : labels associés aux champs, `aria-label` pour les boutons sans texte et informations non transmises par la couleur seule.
- Interface, commentaires et messages utilisateur en français.

## Authentification

- La configuration serveur Better Auth est dans `features/auth/auth.ts`.
- Le client navigateur est dans `features/auth/auth-client.ts`.
- Le point d'entrée HTTP est `app/api/auth/[...all]/route.ts`.
- Les pages publiques sont `/connexion` et `/inscription`.
- `/calendrier` doit toujours vérifier la session côté serveur avant de lire la base.
- Ne jamais accepter un `userId` fourni par le navigateur pour autoriser une lecture ou une écriture.
- Après une modification d'authentification, tester la connexion, la déconnexion, la redirection et l'accès à `/calendrier`.

## Base de données et Prisma

- Le schéma est dans `prisma/schema.prisma`.
- Les migrations sont versionnées dans `prisma/migrations/`.
- Le client est généré dans `app/generated/prisma/`.
- L'instance partagée est exposée par `lib/prisma.ts`.
- `DATABASE_URL` est utilisée par l'application avec l'adaptateur Neon.
- `DATABASE_URL_UNPOOLED` est utilisée par la configuration Prisma pour les migrations et Prisma Studio.
- Ne jamais modifier manuellement `app/generated/prisma/`.
- Après une modification du schéma, exécuter `prisma format`, `prisma validate`, créer une migration et régénérer le client.
- Vérifier les migrations générées avant de les commiter.

Les commandes destructives comme `prisma migrate reset`, `prisma db push --force-reset` ou `prisma db push --accept-data-loss` nécessitent une confirmation explicite immédiate de l'utilisateur. Ne jamais les lancer par défaut.

## Données de santé et sécurité

- Ne jamais commiter `.env`, des mots de passe, des tokens ou des URLs de base contenant des secrets.
- Ne pas journaliser les mots de passe, secrets ou données médicales détaillées.
- Toute requête de crise doit être filtrée par l'utilisateur connecté.
- Vérifier et limiter les entrées reçues par les Server Actions.
- Conserver les relations et les suppressions en cascade cohérentes avec Better Auth.
- Ne pas présenter l'application comme un dispositif médical.
- Avant un usage public avec de vraies données, étudier le RGPD, l'hébergement HDS, les sauvegardes, la suppression de compte et la rétention des données.

## Calendrier

- Le mode `demo` utilise les données de `features/calendar/demo-data.ts` et ne persiste pas les modifications.
- Le mode `personal` reçoit les crises depuis le serveur et utilise les Server Actions de `features/calendar/actions.ts`.
- Le type partagé `Seizure` est dans `features/calendar/types.ts`.
- Les options de formulaire sont dans `features/calendar/options.ts`.
- L'export PDF est dans `features/calendar/export-pdf.ts`.
- Ne pas réintroduire de dépendance entre le type `Seizure` et les données de démonstration.
- Éviter les valeurs temporelles instables dans du contenu pré-rendu ; définir explicitement les valeurs initiales lorsque le rendu doit être déterministe.

## Docker et déploiement

- `Dockerfile` et `compose.yaml` restent à la racine.
- Le Dockerfile utilise un build multi-stage et `output: "standalone"`.
- Le contexte Docker doit inclure `package.json`, le lockfile, `prisma/` et la configuration Prisma.
- Ne jamais inclure `.env` dans l'image ou le contexte Docker.
- Tester avec `docker compose up --build` si la modification concerne le build ou le déploiement.

## Fichiers générés et configuration locale

- `.next/` est généré par Next.js et ignoré par Git. Ne pas le modifier manuellement.
- `app/generated/prisma/` est généré par Prisma et ignoré par Git.
- `.agents/` contient la documentation destinée aux assistants IA et est versionné.
- `hello.ts` et `neon.ts` sont des fichiers de configuration/exemple Neon, indépendants du rendu Next.js principal.
- Préserver les changements existants non liés à la tâche.

## Workflow de modification

1. Lire le README concerné et les fichiers appelants.
2. Vérifier l'état Git avant de modifier des fichiers.
3. Faire la modification la plus ciblée possible.
4. Mettre à jour le README correspondant au dossier ou à la feature modifiée.
5. Mettre à jour la copie correspondante dans `docs/` lorsque la documentation locale change.
6. Documenter en parallèle `docs/functions.md` dès qu'une fonction, un handler, un composant ou un export documenté est ajouté, supprimé ou modifié.
7. Vérifier les diagnostics TypeScript/éditeur lorsque disponibles.
8. Lancer les validations adaptées : `pnpm lint`, `pnpm build` et les commandes Prisma nécessaires.
9. Résumer les fichiers modifiés, les vérifications exécutées et les éventuels points restant à traiter.
10. Donner systématiquement un nom de commit bien décrit, en français, qui résume précisément l'objectif de la modification.

La documentation doit évoluer dans le même changement que le code : ne pas repousser la mise à jour des README ou de `docs/functions.md` à une étape ultérieure. Si une fonction change de comportement, modifier sa description et, si nécessaire, son lien ou son numéro de ligne dans `docs/functions.md`.

## Règles pour les assistants IA

- Consulter le README de la feature concernée avant toute modification.
- Vérifier le code source concerné avant toute modification.
- Respecter la séparation entre logique serveur et logique client.
- Ne jamais exposer de secrets, d'accès à la base de données ou de logique sensible côté client.
- Mettre à jour le README de la feature lorsque son architecture, ses responsabilités ou ses conventions évoluent.
- Ne pas modifier les autres features sans nécessité technique.

## Commits

Utiliser les préfixes suivants :

- `feat:` pour une fonctionnalité ;
- `fix:` pour une correction ;
- `refactor:` pour une réorganisation sans changement fonctionnel ;
- `docs:` pour la documentation ;
- `style:` pour le formatage ou les styles.

Chaque réponse qui termine une étape de travail doit proposer un nom de commit. Le message doit être spécifique, compréhensible sans relire la conversation et décrire le résultat principal, pas seulement le type de fichier modifié.

Éviter les messages vagues comme `docs: mise à jour` ou `fix: changements`. Préférer un message qui précise le périmètre et l'intention.

Exemples :

```text
docs: centraliser la documentation de l'architecture du site
feat: protéger le calendrier personnel par la session utilisateur
fix: filtrer les suppressions de crises par utilisateur connecté
refactor: déplacer la logique du calendrier dans sa feature dédiée
```

Pour les ajouts de documentation et la réorganisation documentaire réalisées dans ce projet, le commit recommandé est :

```text
docs: centraliser et documenter l'architecture du site
```
