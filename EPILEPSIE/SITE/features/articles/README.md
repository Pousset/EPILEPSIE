# Feature Articles

Affiche sur `/articles` les derniers articles d'Épilepsie-France et de la Fondation
Française pour la Recherche sur l'Épilepsie, avec leur contenu, leur image à la une et
un lien vers l'URL d'origine.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| [`sources.ts`](./sources.ts) | Liste des sites sources (nom et URL de base). |
| [`types.ts`](./types.ts) | Types `Article`, `ArticleSource` et `ArticlesResult`. |
| [`fetch-articles.ts`](./fetch-articles.ts) | Appelle l'API REST WordPress de chaque source, nettoie le HTML et fusionne les résultats. |
| [`ArticleCard.tsx`](./ArticleCard.tsx) | Carte d'un article : image, extrait, bouton de lecture, lien vers l'original. |
| [`ArticleReader.tsx`](./ArticleReader.tsx) | Client Component : fenêtre modale (`<dialog>`) affichant l'article complet, fermée par la croix, Échap ou un clic en dehors. |

## Fonctionnement

- Appel serveur de `/wp-json/wp/v2/posts?_embed` sur chaque source, avec cache d'une heure (`"use cache"` + `cacheLife("hours")`, compatible `cacheComponents`).
- Une source indisponible n'empêche pas l'affichage des autres (`Promise.allSettled`).
- Le HTML tiers est nettoyé avec `sanitize-html` avant `dangerouslySetInnerHTML`.
- Seules les images en HTTPS sont conservées.
- Aucune donnée personnelle n'est utilisée : la page est publique.

## Ajouter une source

Ajouter une entrée dans `sources.ts`. Le site doit exposer l'API REST WordPress.