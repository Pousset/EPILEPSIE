# Dossier `features`

Le dossier `features` regroupe les fonctionnalités métier de l'application. Chaque feature rassemble ses composants, sa logique, ses types et sa documentation afin de rester autonome et maintenable.

## Features disponibles

| Feature | Responsabilité | Route principale | Documentation |
| --- | --- | --- | --- |
| `articles` | Agrégation d'articles publics sur l'épilepsie depuis des sources externes, nettoyage du contenu et lecture détaillée. | `/articles` | [`articles/README.md`](./articles/README.md) |
| `auth` | Inscription, connexion, session utilisateur et accès au calendrier privé. | `/connexion`, `/inscription` | [`auth/README.md`](./auth/README.md) |
| `calendar` | Affichage du calendrier, ajout/suppression de crises, données de démonstration et export PDF. | `/`, `/calendrier` | [`calendar/README.md`](./calendar/README.md) |

## Articles

La feature `articles` récupère des publications d'Épilepsie-France et de la Fondation Française pour la Recherche sur l'Épilepsie depuis leurs API REST WordPress. Les résultats sont mis en cache pendant une heure, les sources sont tolérantes aux erreurs et le HTML externe est nettoyé avec `sanitize-html`.

## Auth

La feature `auth` regroupe Better Auth, le client navigateur, les formulaires d'inscription/connexion et le bouton d'accès au calendrier personnel.

## Calendar

La feature `calendar` gère le calendrier de démonstration, le calendrier personnel protégé, l'ajout/suppression de crises et l'export PDF.

## Organisation

Une feature peut contenir des composants React, des Server Actions, des types, des constantes, des données de démonstration, des utilitaires métier et un README local. Les composants génériques restent dans [`../components/`](../components/) et les routes dans [`../app/`](../app/).

Utiliser l'alias `@/features/...` pour les imports. Les composants sont des Server Components par défaut ; ajouter `"use client"` uniquement lorsque l'état, les hooks ou les API navigateur sont nécessaires.

Toute feature qui accède à des données personnelles doit vérifier la session côté serveur, valider les entrées et filtrer les requêtes par utilisateur.
