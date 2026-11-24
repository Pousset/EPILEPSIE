# Calendrier Épilepsie

Application web de suivi des crises d'épilepsie. Elle permet de consulter un calendrier de démonstration, de créer un compte, puis d'enregistrer ses crises dans un calendrier personnel et d'exporter un journal PDF pour son médecin.

> Les données manipulées peuvent être des données de santé sensibles. Cette application est un projet en développement et ne remplace pas un dispositif médical ni un avis médical.

## Fonctionnalités

- Page d'accueil avec un calendrier de démonstration et des données fictives.
- Inscription et connexion par email et mot de passe.
- Calendrier personnel protégé par authentification.
- Ajout d'une crise avec date, heure, type, durée et déclencheur.
- Suppression d'une crise appartenant à l'utilisateur connecté.
- Export PDF selon plusieurs périodes : mois affiché, trois mois, six mois ou toutes les crises.
- Interface en français et responsive.
- Navigation adaptée à l'état de la session.
- Base PostgreSQL hébergée sur Neon avec Prisma.
- Déploiement Docker possible grâce à une image Next.js standalone.

## Stack technique

| Technologie | Utilisation |
| --- | --- |
| [Next.js](https://nextjs.org/) 16 | Framework React et App Router. |
| [React](https://react.dev/) 19 | Interface utilisateur. |
| [TypeScript](https://www.typescriptlang.org/) | Typage du code. |
| [Tailwind CSS](https://tailwindcss.com/) | Styles et mise en page. |
| [Better Auth](https://www.better-auth.com/) | Inscription, connexion et sessions. |
| [Prisma](https://www.prisma.io/) 7 | ORM et migrations PostgreSQL. |
| [Neon](https://neon.tech/) | PostgreSQL serverless. |
| [jsPDF](https://github.com/parallax/jsPDF) | Génération des exports PDF. |
| Docker | Construction et exécution en production. |

## Prérequis

- Node.js 22 ou version compatible avec Next.js 16.
- pnpm 11 recommandé, car le projet utilise `pnpm-lock.yaml`.
- Un projet PostgreSQL, recommandé avec [Neon](https://neon.tech/).
- Git pour récupérer le projet et versionner les migrations.

Vérifier les versions installées :

```bash
node --version
pnpm --version
```

## Installation locale

Depuis la racine du projet :

```bash
pnpm install
pnpm exec prisma generate
pnpm dev
```

L'application est ensuite disponible à l'adresse [http://localhost:3000](http://localhost:3000).

Le script `postinstall` lance automatiquement `prisma generate` après l'installation des dépendances.

## Variables d'environnement

Créer un fichier `.env` à partir de [`.env.example`](./.env.example) :

```env
# URL avec pooler, utilisée par l'application
DATABASE_URL="postgresql://utilisateur:motdepasse@hote-pooler.neon.tech/neondb?sslmode=require"

# URL directe, utilisée par Prisma pour les migrations et Prisma Studio
DATABASE_URL_UNPOOLED="postgresql://utilisateur:motdepasse@hote.neon.tech/neondb?sslmode=require"

# Secret aléatoire pour Better Auth
BETTER_AUTH_SECRET=""

# URL complète de l'application
BETTER_AUTH_URL="http://localhost:3000"
```

Générer un secret Better Auth avec Node.js :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Ne jamais commiter `.env`, une URL PostgreSQL réelle ou un secret d'authentification.

## Commandes disponibles

| Commande | Description |
| --- | --- |
| `pnpm dev` | Lance le serveur de développement. |
| `pnpm build` | Compile et génère le build de production. |
| `pnpm start` | Lance le build de production. |
| `pnpm lint` | Lance ESLint. |
| `pnpm install` | Installe les dépendances et génère le client Prisma. |
| `pnpm exec prisma generate` | Régénère le client Prisma. |
| `pnpm exec prisma validate` | Vérifie le schéma Prisma. |
| `pnpm exec prisma format` | Formate le schéma Prisma. |
| `pnpm exec prisma migrate dev --name nom` | Crée et applique une migration en développement. |
| `pnpm exec prisma migrate deploy` | Applique les migrations en production. |
| `pnpm exec prisma migrate status` | Affiche l'état des migrations. |
| `pnpm run prisma:studio` | Ouvre Prisma Studio. |

Avant une livraison, exécuter au minimum :

```bash
pnpm lint
pnpm build
```

## Architecture

```text
SITE/
├─ app/                         # Routes Next.js App Router
│  ├─ about/
│  ├─ api/auth/[...all]/        # Route Better Auth
│  ├─ calendrier/               # Calendrier personnel
│  ├─ connexion/
│  ├─ inscription/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ features/                    # Fonctionnalités métier
│  ├─ auth/
│  └─ calendar/
├─ components/                  # Composants d'interface partagés
│  └─ layout/
├─ lib/                         # Infrastructure partagée
│  └─ prisma.ts
├─ prisma/                      # Schéma et migrations
│  ├─ schema.prisma
│  └─ migrations/
├─ app/generated/prisma/        # Client généré, ignoré par Git
├─ Dockerfile
├─ compose.yaml
├─ next.config.ts
├─ prisma7.config.ts
└─ proxy.ts
```

## Rôle des dossiers

| Dossier | Utilité | Ce qu'on y place |
| --- | --- | --- |
| [`app/`](./app/) | Routes Next.js et structure de l'application. | `page.tsx`, `layout.tsx`, routes API, styles globaux et fichiers propres à l'App Router. |
| [`features/`](./features/) | Fonctionnalités métier autonomes. | Authentification, calendrier, composants métier, Server Actions, types et utilitaires propres à une feature. |
| [`components/`](./components/) | Composants d'interface réutilisables. | Navigation, footer et composants partagés par plusieurs routes ou features. |
| [`lib/`](./lib/) | Infrastructure technique partagée. | Client Prisma, clients externes, configurations et utilitaires techniques sans interface utilisateur. |
| [`prisma/`](./prisma/) | Modèle et évolution de la base de données. | `schema.prisma`, migrations et configuration du fournisseur PostgreSQL. |

### Frontières entre les dossiers

- Une route et son chargement initial vont dans [`app/`](./app/).
- Une logique métier liée à une fonctionnalité va dans [`features/`](./features/).
- Un composant utilisé dans plusieurs contextes et sans logique métier spécifique va dans [`components/`](./components/).
- Un accès technique partagé, comme la connexion à la base, va dans [`lib/`](./lib/).
- La structure de la base et son historique vont dans [`prisma/`](./prisma/).

Par exemple, la page [`app/calendrier/page.tsx`](./app/calendrier/page.tsx) vérifie la session et charge les données. Le composant [`features/calendar/SeizureCalendar.tsx`](./features/calendar/SeizureCalendar.tsx) gère l'affichage et les interactions. Les Server Actions sont dans [`features/calendar/actions.ts`](./features/calendar/actions.ts), l'accès à la base est fourni par [`lib/prisma.ts`](./lib/prisma.ts), et les modèles sont définis dans [`prisma/schema.prisma`](./prisma/schema.prisma).

Documentation détaillée :

- [`app/README.md`](./app/README.md) — routes et App Router ;
- [`features/README.md`](./features/README.md) — organisation métier ;
- [`features/auth/README.md`](./features/auth/README.md) — authentification ;
- [`features/calendar/README.md`](./features/calendar/README.md) — calendrier et export ;
- [`components/README.md`](./components/README.md) — composants partagés ;
- [`lib/README.md`](./lib/README.md) — infrastructure et client Prisma ;
- [`prisma/README.md`](./prisma/README.md) — schéma et migrations ;
- [`.agents/README.md`](./.agents/README.md) — documentation destinée aux assistants IA.

## Feature articles

La feature [`features/articles/`](../features/articles/) expose la page [`app/articles/page.tsx`](../app/articles/page.tsx). Elle récupère des articles depuis les API WordPress configurées, nettoie leur contenu distant avec `sanitize-html`, applique un cache d'une heure et tolère les indisponibilités partielles des sources.

## Flux applicatifs

### Visiteur

1. L'utilisateur arrive sur `/`.
2. Le calendrier affiche des données fictives provenant de `features/calendar/demo-data.ts`.
3. Les modifications du calendrier de démonstration restent en mémoire.
4. Le bouton de démarrage propose la connexion ou l'inscription.

### Inscription et connexion

1. L'utilisateur ouvre `/inscription` ou `/connexion`.
2. `AuthForm` appelle le client Better Auth.
3. Better Auth utilise Prisma et PostgreSQL pour créer ou vérifier le compte.
4. Après une authentification réussie, l'utilisateur est envoyé vers `/calendrier`.

### Calendrier personnel

1. `/calendrier` vérifie la session côté serveur.
2. Un visiteur non connecté est redirigé vers `/connexion`.
3. Les crises sont chargées avec un filtre `userId`.
4. `SeizureCalendar` affiche les données et déclenche les actions d'ajout/suppression.
5. Les Server Actions revérifient la session avant toute écriture.

## Prisma et base de données

Le schéma se trouve dans [`prisma/schema.prisma`](./prisma/schema.prisma). Les modèles principaux sont :

- `Seizure` : crise enregistrée par un utilisateur ;
- `User` : compte utilisateur ;
- `Session` : session Better Auth ;
- `Account` : informations de compte d'authentification ;
- `Verification` : données de vérification Better Auth.

Le client est généré dans [`app/generated/prisma/`](./app/generated/prisma/) et utilisé via [`lib/prisma.ts`](./lib/prisma.ts). Ce dossier généré ne doit pas être modifié manuellement.

Après une modification du schéma :

```bash
pnpm exec prisma format
pnpm exec prisma validate
pnpm exec prisma migrate dev --name description_du_changement
pnpm exec prisma generate
```

Les migrations doivent être contrôlées avant d'être appliquées en production. Une commande destructive comme `prisma migrate reset` efface les données locales et nécessite une validation explicite.

## Authentification et sécurité

- Les secrets restent dans `.env` et ne sont jamais exposés au navigateur.
- Les sessions sont vérifiées côté serveur avant l'accès aux données personnelles.
- Les requêtes de crises filtrent par `userId`.
- Les suppressions utilisent l'identifiant de la crise et l'utilisateur connecté.
- Les mots de passe sont gérés par Better Auth et ne doivent jamais être journalisés.
- Les données de santé doivent être protégées conformément aux exigences applicables, notamment le RGPD.
- Avant un usage public avec de vraies données, étudier les exigences HDS et la sécurité de l'hébergement.
- Sur un ordinateur partagé, prévenir l'utilisateur que les données présentes dans le stockage local ou le navigateur peuvent être accessibles à d'autres utilisateurs.

## Docker

Le [Dockerfile](./Dockerfile) utilise un build multi-stage :

1. installation des dépendances ;
2. génération du client Prisma et compilation Next.js ;
3. exécution de l'image standalone avec un utilisateur non administrateur.

Lancer l'application avec Docker Compose :

```bash
docker compose up --build
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000). Les variables de production sont chargées par [compose.yaml](./compose.yaml) depuis `.env`.

Le fichier [`.dockerignore`](./.dockerignore) exclut notamment `node_modules`, `.next`, `.git`, `.env` et le client Prisma généré du contexte Docker.

## Déploiement

### Déploiement Node.js / Vercel

1. Configurer les variables d'environnement de production.
2. Installer les dépendances avec `pnpm install --frozen-lockfile`.
3. Appliquer les migrations avec `pnpm exec prisma migrate deploy`.
4. Construire avec `pnpm build`.
5. Démarrer avec `pnpm start` ou utiliser la plateforme de déploiement.

### Déploiement Docker

```bash
docker compose up -d --build
```

La configuration Next.js utilise `output: "standalone"`, ce qui permet de produire une image finale plus légère contenant uniquement les fichiers nécessaires à l'exécution.

## Règles de contribution

- Écrire l'interface, les commentaires et les messages de commit en français.
- Utiliser des noms de fichiers et de dossiers descriptifs.
- Placer la logique métier dans la feature concernée.
- Placer les composants réellement partagés dans `components/`.
- Utiliser l'alias `@/` pour les imports internes.
- Ne pas modifier les fichiers générés manuellement.
- Ajouter ou mettre à jour la documentation lorsqu'une architecture ou une commande change.
- Tester avec `pnpm lint` et `pnpm build` avant de considérer une étape terminée.

## Limites et prochaines étapes

- Ajouter une gestion plus complète de la suppression et de la récupération de compte.
- Prévoir l'import des données locales lors de l'inscription.
- Ajouter éventuellement un export CSV.
- Renforcer la validation des entrées et la gestion des erreurs.
- Étudier la conformité HDS avant l'utilisation de données médicales réelles.
- Préparer la supervision, les sauvegardes et la stratégie de suppression des données utilisateur.
