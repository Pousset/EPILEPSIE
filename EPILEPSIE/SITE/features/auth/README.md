# Feature Auth

Cette feature regroupe toute la logique d'inscription, de connexion et de gestion de session utilisateur.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| [`auth.ts`](./auth.ts) | Configure Better Auth avec l'adaptateur Prisma PostgreSQL. |
| [`auth-client.ts`](./auth-client.ts) | Expose le client Better Auth utilisé côté navigateur. |
| [`AuthForm.tsx`](./AuthForm.tsx) | Formulaire client partagé par `/connexion` et `/inscription`. |
| [`StartCalendarButton.tsx`](./StartCalendarButton.tsx) | Affiche l'accès au calendrier ou les choix de connexion/inscription. |

## Fonctionnement

- L'inscription utilise `authClient.signUp.email(...)`.
- La connexion utilise `authClient.signIn.email(...)`.
- Après une authentification réussie, l'utilisateur est redirigé vers `/calendrier`.
- La session est consultée avec `authClient.useSession()` côté client.
- Côté serveur, la session est vérifiée avec `auth.api.getSession(...)`.
- Les données d'authentification sont stockées via Prisma dans PostgreSQL.

## Routes associées

| Route | Utilisation |
| --- | --- |
| `/connexion` | Connexion avec email et mot de passe. |
| `/inscription` | Création d'un compte. |
| `/api/auth/[...all]` | Point d'entrée des requêtes Better Auth. |
| `/calendrier` | Page privée accessible après connexion. |

## Configuration requise

Les variables d'environnement utilisées par l'authentification doivent être définies dans `.env` :

```env
DATABASE_URL=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

Ne jamais commiter les valeurs réelles de `.env`.

## Bonnes pratiques

- Ne pas importer `authClient` dans un composant serveur.
- Ne pas faire confiance à l'identifiant utilisateur envoyé par le navigateur : récupérer la session côté serveur.
- Vérifier la session avant toute lecture ou modification de données personnelles.
- Ne jamais afficher ni journaliser les mots de passe ou les secrets d'authentification.
