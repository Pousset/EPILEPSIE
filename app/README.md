# Dossier `app`

Le dossier `app` contient les routes et les fichiers spécifiques à l'App Router de Next.js. Chaque dossier qui contient un `page.tsx` devient une route accessible depuis le navigateur.

## Arborescence

```text
app/
├─ layout.tsx
├─ page.tsx
├─ globals.css
├─ about/page.tsx
├─ contact/page.tsx
├─ associations/page.tsx
├─ annuaire/page.tsx
├─ connexion/page.tsx
├─ inscription/page.tsx
├─ calendrier/page.tsx
├─ api/auth/[...all]/route.ts
└─ generated/prisma/       # client Prisma généré, ignoré par Git
```

## Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| [`layout.tsx`](./layout.tsx) | Layout global : police, navigation, contenu principal et footer. |
| [`page.tsx`](./page.tsx) | Page d'accueil avec le calendrier de démonstration. |
| [`globals.css`](./globals.css) | Styles CSS globaux et styles Tailwind. |
| [`calendrier/page.tsx`](./calendrier/page.tsx) | Page privée du calendrier personnel. |
| [`api/auth/[...all]/route.ts`](./api/auth/[...all]/route.ts) | Route catch-all utilisée par Better Auth. |
| [`generated/prisma/`](./generated/prisma/) | Client Prisma généré automatiquement. Ne pas modifier manuellement. |

## Routes disponibles

| URL | Fichier | Accès |
| --- | --- | --- |
| `/` | [`page.tsx`](./page.tsx) | Public, calendrier de démonstration. |
| `/about` | [`about/page.tsx`](./about/page.tsx) | Public. |
| `/contact` | [`contact/page.tsx`](./contact/page.tsx) | Public. |
| `/associations` | [`associations/page.tsx`](./associations/page.tsx) | Public. Associations par pays. |
| `/annuaire` | [`annuaire/page.tsx`](./annuaire/page.tsx) | Public. Annuaires officiels et centres spécialisés. |
| `/connexion` | [`connexion/page.tsx`](./connexion/page.tsx) | Public. |
| `/inscription` | [`inscription/page.tsx`](./inscription/page.tsx) | Public. |
| `/calendrier` | [`calendrier/page.tsx`](./calendrier/page.tsx) | Privé, réservé aux utilisateurs connectés. |
| `/api/auth/*` | [`api/auth/[...all]/route.ts`](./api/auth/[...all]/route.ts) | API Better Auth. |

## Calendrier personnel

La page [`calendrier/page.tsx`](./calendrier/page.tsx) est un Server Component. Elle :

1. récupère la session avec Better Auth ;
2. redirige vers `/connexion` si l'utilisateur n'est pas connecté ;
3. récupère uniquement les crises appartenant à l'utilisateur connecté ;
4. transmet les données initiales au composant client `SeizureCalendar`.

La connexion à Prisma est centralisée dans [`../lib/prisma.ts`](../lib/prisma.ts). Ce fichier utilise l'adaptateur Neon et `DATABASE_URL` pour créer le client Prisma.

```ts
const session = await auth.api.getSession({ headers: await headers() });
if (!session) redirect("/connexion");

const seizures = await prisma.seizure.findMany({
  where: { userId: session.user.id },
});
```

## Conventions

- Les composants sont des Server Components par défaut.
- Ajouter `"use client"` uniquement lorsqu'un composant utilise un état, un effet ou des événements navigateur.
- Les composants fonctionnels sont regroupés dans [`../features/`](../features/).
- Les composants de structure partagée sont dans [`../components/layout/`](../components/layout/).
- Les accès à Prisma et aux données privées restent côté serveur.
- Utiliser l'alias `@/` pour les imports internes.
- Ne jamais exposer `DATABASE_URL`, `BETTER_AUTH_SECRET` ou une autre variable secrète au navigateur.

## Génération Prisma

Le dossier [`generated/prisma/`](./generated/prisma/) est produit par `prisma generate` et ignoré par Git. Après une modification du schéma Prisma, régénérer le client avec :

```bash
pnpm exec prisma generate
```

Le dossier généré ne doit pas être édité à la main.