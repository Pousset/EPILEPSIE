# Référence des fonctions du site

Ce document recense les fonctions nommées et les handlers principaux du dossier `SITE`. Les callbacks anonymes utilisés directement dans JSX, comme `onClick={() => ...}` et `onChange={(event) => ...}`, sont regroupés dans la description de leur composant plutôt que listés individuellement.

## Vue d'ensemble

| Domaine | Emplacement | Responsabilité |
| --- | --- | --- |
| Routes | [`app/`](../app/) | Rend les pages et compose les layouts Next.js. |
| Authentification | [`features/auth/`](../features/auth/) | Crée les clients Better Auth et gère les formulaires/session. |
| Calendrier | [`features/calendar/`](../features/calendar/) | Affiche, valide, ajoute, modifie, supprime et exporte les crises. |
| Articles | [`features/articles/`](../features/articles/) | Récupère, nettoie et affiche les articles des sites partenaires. |
| Interface partagée | [`components/layout/`](../components/layout/), [`components/ui/`](../components/ui/) | Navigation, pied de page et fenêtre modale réutilisable. |
| Infrastructure | [`lib/`](../lib/) | Connexion partagée à Prisma/Neon. |
| Proxy | [`proxy.ts`](../proxy.ts) | Protège la route `/calendrier` grâce au cookie de session. |

## Routes et pages

### `app/layout.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`RootLayout`](../app/layout.tsx:22) | 22 | Layout global de l'application : `<html>`, polices, `Navbar`, `<main>` et `Footer`. |

Les constantes `geistSans`, `geistMono` et `metadata` configurent respectivement les polices et les métadonnées globales.

### `app/page.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`HomePage`](../app/page.tsx:5) | 5 | Affiche l'accueil avec le calendrier en mode `demo` et le bouton de démarrage. |

### Pages statiques

| Fonction | Ligne | Fichier | Rôle |
| --- | ---: | --- | --- |
| [`AboutPage`](../app/about/page.tsx:2) | 2 | `app/about/page.tsx` | Page de présentation. |
| [`ContactPage`](../app/contact/page.tsx:2) | 2 | `app/contact/page.tsx` | Page de contact. |
| [`ConnexionPage`](../app/connexion/page.tsx:4) | 4 | `app/connexion/page.tsx` | Affiche `AuthForm` en mode connexion. |
| [`InscriptionPage`](../app/inscription/page.tsx:4) | 4 | `app/inscription/page.tsx` | Affiche `AuthForm` en mode inscription. |

### `app/calendrier/page.tsx`

| Fonction | Ligne | Exécution | Rôle |
| --- | ---: | --- | --- |
| [`PersonalCalendar`](../app/calendrier/page.tsx:9) | 9 | Serveur | Vérifie la session, charge les crises de l'utilisateur avec Prisma et prépare le calendrier personnel. |
| [`CalendrierPage`](../app/calendrier/page.tsx:32) | 32 | Serveur | Rend la page `/calendrier` et son état de chargement `Suspense`. |

`PersonalCalendar` doit toujours filtrer les requêtes Prisma avec `session.user.id`.

### `app/api/auth/[...all]/route.ts`

| Handler | Rôle |
| --- | --- |
| `GET` | Handler Better Auth généré pour les requêtes HTTP GET. |
| `POST` | Handler Better Auth généré pour les requêtes HTTP POST. |

Les deux handlers sont produits par `toNextJsHandler(auth)` et ne doivent pas être réimplémentés manuellement.

## Authentification

### `features/auth/auth.ts`

| Export | Rôle |
| --- | --- |
| `auth` | Instance serveur Better Auth configurée avec l'adaptateur Prisma PostgreSQL et l'authentification email/mot de passe. |

### `features/auth/auth-client.ts`

| Export | Rôle |
| --- | --- |
| `authClient` | Instance Better Auth utilisable dans les Client Components. |

### `features/auth/AuthForm.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`AuthForm`](../features/auth/AuthForm.tsx:8) | 8 | Composant client partagé pour l'inscription et la connexion. |
| `handleSubmit` | 17 | Soumet les identifiants à Better Auth, affiche les erreurs et redirige vers `/calendrier` après succès. |

Le prop `mode` vaut `"signin"` ou `"signup"`. Les callbacks `onChange` mettent à jour le nom, l'email et le mot de passe.

### `features/auth/StartCalendarButton.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`StartCalendarButton`](../features/auth/StartCalendarButton.tsx:8) | 8 | Affiche un accès direct au calendrier si l'utilisateur est connecté, sinon un choix entre connexion et inscription. |

Le composant utilise `authClient.useSession()` et son état local `open` pour afficher le menu d'accès.

## Calendrier et crises

### `features/calendar/actions.ts`

| Fonction | Ligne | Exécution | Rôle |
| --- | ---: | --- | --- |
| `requireUserId` | 28 | Serveur | Vérifie la session et renvoie l'identifiant de l'utilisateur connecté. Lève une erreur si aucune session n'existe. |
| `validateInput` | 35 | Serveur | Valide et normalise les champs d'une crise (date, heure, type, déclencheur, durée). Partagée par l'ajout et la modification. |
| [`addSeizure`](../features/calendar/actions.ts:50) | 50 | Serveur | Valide les champs, associe la crise à l'utilisateur courant et l'enregistre avec Prisma. |
| [`updateSeizure`](../features/calendar/actions.ts:60) | 60 | Serveur | Valide les champs puis modifie uniquement la crise correspondant à l'id fourni et à l'utilisateur connecté. |
| [`deleteSeizure`](../features/calendar/actions.ts:73) | 73 | Serveur | Supprime uniquement la crise correspondant à l'id fourni et à l'utilisateur connecté. |

`validateInput` vérifie le format de la date, l'heure, le type et le déclencheur. La durée est limitée à 50 caractères et reçoit une valeur par défaut si elle est vide.

### `features/calendar/SeizureCalendar.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`SeizureCalendar`](../features/calendar/SeizureCalendar.tsx:28) | 28 | Composant client principal du calendrier, utilisable en mode `demo` ou `personal`. |
| `toKey` | 66 | Transforme un numéro de jour en clé `AAAA-MM-JJ`. |
| `seizuresOn` | 69 | Filtre et trie les crises d'une journée par heure. |
| `changeMonth` | 77 | Change le mois affiché, réinitialise la sélection et ferme le formulaire. |
| `selectDay` | 86 | Sélectionne une journée et ferme le formulaire. |
| `openAddForm` | 92 | Ouvre le formulaire en mode ajout. |
| `startEdit` | 99 | Ouvre le formulaire pré-rempli avec la crise à modifier. |
| `closeForm` | 109 | Ferme le formulaire et abandonne une éventuelle modification. |
| `handleSave` | 114 | Ajoute ou modifie une crise : en base en mode personnel, en mémoire en mode démo. |
| `handleDelete` | 144 | Ouvre la fenêtre de confirmation de suppression. |
| `confirmDelete` | 149 | Supprime la crise confirmée (en base en mode personnel) puis la retire de l'état local. |
| `handleExport` | 167 | Sélectionne la période, prépare les données et lance l'export PDF. |

La confirmation de suppression utilise le composant partagé [`Dialog`](../components/ui/Dialog.tsx). Les callbacks `onClick`, `onChange` et les fonctions de rendu des tableaux sont des fonctions inline liées à l'interface du calendrier.

### `features/calendar/export-pdf.ts`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`formatDate`](../features/calendar/export-pdf.ts:4) | 4 | Convertit une clé `AAAA-MM-JJ` en date lisible `JJ/MM/AAAA` sans décalage de fuseau. |
| [`dateKey`](../features/calendar/export-pdf.ts:9) | 9 | Convertit une date JavaScript en clé locale `AAAA-MM-JJ`. |
| `countBy` | 15 | Compte les crises par type ou par déclencheur et trie les résultats. |
| [`exportSeizuresPdf`](../features/calendar/export-pdf.ts:27) | 27 | Construit le PDF, ajoute le résumé et le tableau détaillé, puis déclenche son téléchargement. |

`jspdf` et `jspdf-autotable` sont chargés dynamiquement uniquement au moment de l'export.

### Données et options

| Export | Fichier | Rôle |
| --- | --- | --- |
| `fakeSeizures` | [`demo-data.ts`](../features/calendar/demo-data.ts) | Données fictives du calendrier d'accueil. |
| `SEIZURE_TYPES` | [`options.ts`](../features/calendar/options.ts) | Types de crises disponibles dans le formulaire. |
| `SEIZURE_TRIGGERS` | [`options.ts`](../features/calendar/options.ts) | Déclencheurs disponibles dans le formulaire. |
| `Seizure` | [`types.ts`](../features/calendar/types.ts) | Type partagé d'une crise. |

## Articles

### `features/articles/fetch-articles.ts`

| Fonction | Ligne | Exécution | Rôle |
| --- | ---: | --- | --- |
| `toPlainText` | 39 | Serveur | Convertit du HTML en texte brut lisible (extraits et titres). |
| `cleanContent` | 53 | Serveur | Nettoie le HTML tiers avec `sanitize-html` avant affichage. |
| `toArticle` | 87 | Serveur | Convertit un article de l'API REST WordPress en `Article`. |
| `fetchFromSource` | 107 | Serveur | Récupère les articles d'une source, avec cache d'une heure. Lève une erreur si la requête échoue. |
| [`fetchArticles`](../features/articles/fetch-articles.ts:131) | 131 | Serveur | Interroge toutes les sources, ignore celles en échec, fusionne et trie les articles par date. |

### `features/articles/ArticleCard.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| `formatDate` | 4 | Formate une date ISO en date lisible en français. |
| [`ArticleCard`](../features/articles/ArticleCard.tsx:12) | 12 | Carte d'un article : image, extrait, bouton de lecture et lien vers l'original. |

### `features/articles/ArticleReader.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`ArticleReader`](../features/articles/ArticleReader.tsx:33) | 33 | Client Component : bouton « Lire l'article » et affichage du contenu complet dans un `Dialog`. |

La constante `CONTENT_CLASSES` stylise le HTML nettoyé. `ArticleReader` ne gère que l'état `open` : la fenêtre est fournie par [`Dialog`](../components/ui/Dialog.tsx).

### Données

| Export | Fichier | Rôle |
| --- | --- | --- |
| `ARTICLE_SOURCES` | [`sources.ts`](../features/articles/sources.ts) | Liste des sites sources (nom et URL de base). |
| `Article`, `ArticleSource`, `ArticlesResult` | [`types.ts`](../features/articles/types.ts) | Types partagés de la feature. |

## Composants partagés

### `components/layout/Navbar.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`Navbar`](../components/layout/Navbar.tsx:7) | 7 | Affiche la navigation et adapte les liens selon la session courante. |
| `handleSignOut` | 10 | Déconnecte l'utilisateur puis actualise la page. |

`Navbar` est un Client Component car il utilise `authClient.useSession()` et des événements navigateur.

### `components/layout/Footer.tsx`

| Fonction | Ligne | Exécution | Rôle |
| --- | ---: | --- | --- |
| `getYear` | 4 | Serveur | Fournit l'année affichée dans le footer. |
| [`Footer`](../components/layout/Footer.tsx:9) | 9 | Serveur | Affiche le pied de page commun. |

### `components/ui/Dialog.tsx`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`Dialog`](../components/ui/Dialog.tsx:26) | 26 | Fenêtre modale réutilisable basée sur le `<dialog>` natif, pilotée par les props `open` et `onClose`. |

Props : `title` (obligatoire), `eyebrow`, `footer`, `size` (`"sm"` ou `"md"`) et `closeLabel`. Le composant bloque le défilement de la page pendant l'ouverture et se ferme avec Échap, la croix ou un clic sur le fond. Un élément portant `data-autofocus` reçoit le focus à l'ouverture. C'est un Client Component. Utilisé par `ArticleReader` et par la confirmation de suppression de `SeizureCalendar`.

### `lib/prisma.ts`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| `createClient` | 7 | Crée un `PrismaClient` avec l'adaptateur Neon et `DATABASE_URL`. |

| Export | Rôle |
| --- | --- |
| `prisma` | Instance Prisma partagée, conservée sur `globalThis` en développement pour éviter les connexions multiples pendant le hot reload. |

## Proxy

### `proxy.ts`

| Fonction | Ligne | Rôle |
| --- | ---: | --- |
| [`proxy`](../proxy.ts:5) | 5 | Vérifie le cookie de session et redirige vers `/connexion` si `/calendrier` est demandé sans session. |

La configuration `config.matcher` limite actuellement le proxy à `/calendrier`.

## Règles pour ajouter une fonction

- Déterminer d'abord si la fonction relève d'une route, d'une feature, d'un composant partagé ou de l'infrastructure.
- Garder les fonctions qui accèdent à Prisma, Better Auth serveur ou aux secrets côté serveur.
- Valider les entrées dans les Server Actions avant toute écriture.
- Filtrer les données personnelles par l'utilisateur connecté.
- Ajouter la fonction dans cette documentation si elle est exportée ou structurante.
- Mettre à jour le nom et le rôle dans le commit proposé.