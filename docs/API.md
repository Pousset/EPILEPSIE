# API et échanges de données

## Route Better Auth

| Route | Méthodes | Rôle |
| --- | --- | --- |
| `/api/auth/[...all]` | `GET`, `POST` | Route catch-all gérée par Better Auth. |

Les handlers sont créés avec `toNextJsHandler(auth)` dans [`../app/api/auth/[...all]/route.ts`](../app/api/auth/[...all]/route.ts). Ils gèrent les opérations d'inscription, de connexion, de session et de déconnexion.

## Server Actions du calendrier

Les actions suivantes ne sont pas des endpoints REST publics. Elles sont appelées depuis le composant client via le mécanisme Server Actions de Next.js.

### `addSeizure`

Fichier : [`../features/calendar/actions.ts`](../features/calendar/actions.ts)

Entrée :

```ts
{
  date: string;
  time: string;
  type: string;
  duration: string;
  trigger: string;
}
```

Comportement :

1. vérifie la session ;
2. valide la date au format `AAAA-MM-JJ` ;
3. valide l'heure au format `HH:MM` ;
4. vérifie le type et le déclencheur dans les options autorisées ;
5. limite la durée à 50 caractères ;
6. associe la crise à l'utilisateur connecté ;
7. renvoie la crise créée.

### `deleteSeizure`

Entrée :

```ts
id: string
```

L'action vérifie la session puis supprime uniquement la crise dont l'`id` et le `userId` correspondent. Une requête provenant d'un autre utilisateur ne doit jamais pouvoir supprimer une crise.

## Données renvoyées au calendrier

Le calendrier reçoit uniquement les champs nécessaires à l'interface :

```ts
{
  id: string;
  date: string;
  time: string;
  type: string;
  duration: string;
  trigger: string;
}
```

Les secrets, mots de passe et données internes Better Auth ne sont jamais transmis au Client Component.

## Proxy de protection

Le fichier [`../proxy.ts`](../proxy.ts) contrôle la présence du cookie de session pour `/calendrier`. La vérification de sécurité complète reste faite côté serveur dans la page et les Server Actions : le proxy ne remplace pas le contrôle d'autorisation.

## Ajouter une nouvelle API

1. Déterminer si un Server Action suffit ou si une route HTTP est nécessaire.
2. Définir une entrée typée et la valider côté serveur.
3. Vérifier la session et le propriétaire des données.
4. Ne renvoyer que les champs nécessaires.
5. Ajouter la fonction dans [`functions.md`](./functions.md).
6. Mettre à jour le README de la feature concernée.
