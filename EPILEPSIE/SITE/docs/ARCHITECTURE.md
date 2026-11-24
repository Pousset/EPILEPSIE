# Architecture

## Vue d'ensemble

Le site est une application Next.js utilisant l'App Router. L'architecture sépare les routes, les fonctionnalités métier, les composants d'interface, l'infrastructure et la persistance des données.

```text
app/                         # Routes et composition des pages
├─ page.tsx                  # Accueil et calendrier de démonstration
├─ layout.tsx                # Layout global
├─ calendrier/               # Page personnelle protégée
├─ connexion/                # Connexion
├─ inscription/              # Inscription
└─ api/auth/[...all]/        # Handlers Better Auth

features/                    # Logique métier par domaine
├─ auth/                     # Authentification et session
└─ calendar/                 # Crises, calendrier et export PDF

components/                  # UI réutilisable
└─ layout/                   # Navbar et Footer

lib/                         # Infrastructure partagée
└─ prisma.ts                 # Client Prisma/Neon

prisma/                      # Schéma et migrations
docs/                        # Documentation du projet
```

## Responsabilités

| Couche | Responsabilité |
| --- | --- |
| `app/` | Déclarer les routes, charger les données initiales et composer les layouts. |
| `features/` | Porter la logique métier et les composants spécifiques à un domaine. |
| `components/` | Fournir des composants UI partagés, sans logique métier spécifique. |
| `lib/` | Centraliser les intégrations techniques et les utilitaires d'infrastructure. |
| `prisma/` | Décrire la base et versionner ses évolutions. |

## Flux principal

### Calendrier personnel

1. La route `app/calendrier/page.tsx` vérifie la session côté serveur.
2. Elle redirige vers `/connexion` si aucune session n'est trouvée.
3. Elle charge les crises avec Prisma en filtrant par `session.user.id`.
4. `features/calendar/SeizureCalendar.tsx` affiche les données côté client.
5. Les ajouts et suppressions utilisent les Server Actions de `features/calendar/actions.ts`.

### Authentification

1. `AuthForm` appelle `authClient` depuis le navigateur.
2. Better Auth reçoit les requêtes via `app/api/auth/[...all]/route.ts`.
3. L'adaptateur Prisma enregistre les utilisateurs, sessions et comptes dans PostgreSQL.
4. Les routes serveur utilisent `auth.api.getSession(...)` pour contrôler l'accès.

## Règles de dépendance

- Les routes peuvent utiliser les features, les composants partagés et l'infrastructure.
- Une feature peut utiliser `lib/` et ses propres modules, mais ne doit pas dépendre d'une autre feature sans raison claire.
- Un Client Component ne doit jamais importer Prisma, `auth` serveur ou une variable secrète.
- Les données privées sont chargées et filtrées côté serveur avant d'être transmises au client.
