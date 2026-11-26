# Feature Calendar

Cette feature regroupe le calendrier de suivi des crises d'épilepsie, la persistance des données personnelles (ajout, modification, suppression) et l'export PDF.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| [`SeizureCalendar.tsx`](./SeizureCalendar.tsx) | Composant client d'affichage et d'interaction avec le calendrier. |
| [`actions.ts`](./actions.ts) | Server Actions pour ajouter, modifier et supprimer une crise. |
| [`types.ts`](./types.ts) | Type partagé `Seizure`. |
| [`options.ts`](./options.ts) | Types de crises et déclencheurs proposés dans les formulaires. |
| [`demo-data.ts`](./demo-data.ts) | Données fictives utilisées sur la page d'accueil. |
| [`export-pdf.ts`](./export-pdf.ts) | Génération du journal PDF pour le médecin. |

## Modes d'utilisation

### Mode démo

La page d'accueil utilise le calendrier avec `mode="demo"` :

- les données initiales viennent de [`demo-data.ts`](./demo-data.ts) ;
- les ajouts, modifications et suppressions restent uniquement en mémoire ;
- aucune donnée n'est enregistrée dans la base.

### Mode personnel

La page `/calendrier` utilise `mode="personal"` :

- l'utilisateur doit être connecté ;
- les crises sont chargées depuis PostgreSQL avec Prisma ;
- les ajouts, modifications et suppressions passent par les Server Actions ;
- l'utilisateur peut exporter les crises en PDF.

## Modèle `Seizure`

```ts
type Seizure = {
  id?: string;
  date: string;     // AAAA-MM-JJ
  time: string;     // HH:MM
  type: string;
  duration: string;
  trigger: string;
};
```

## Ajout, modification et suppression

- **Ajout** : le bouton « Noter une crise » ouvre le formulaire pour le jour sélectionné.
- **Modification** : le bouton « Modifier » d'une crise ouvre le même formulaire, pré-rempli. L'heure, le type, la durée et le déclencheur sont modifiables ; la date ne l'est pas. Changer de jour ou de mois, ou cliquer sur « Annuler », abandonne la modification.
- **Suppression** : le bouton « Supprimer » ouvre une fenêtre de confirmation basée sur le composant partagé [`Dialog`](../../components/ui/Dialog.tsx), avec « Annuler » focalisé par défaut.

La validation des champs est centralisée dans `validateInput` (`actions.ts`) et partagée par l'ajout et la modification.

## Sécurité des données

Les données de santé sont sensibles. Les Server Actions doivent toujours :

1. vérifier la session utilisateur côté serveur ;
2. valider les valeurs reçues ;
3. filtrer les requêtes par `userId` ;
4. ne jamais accepter un `userId` fourni par le navigateur.

La modification et la suppression utilisent le couple `id` + `userId` afin d'empêcher d'agir sur une crise appartenant à un autre compte.

## Export PDF

L'export est chargé dynamiquement uniquement lorsque l'utilisateur clique sur le bouton. Les périodes disponibles sont :

- le mois affiché ;
- les trois derniers mois ;
- les six derniers mois ;
- toutes les crises.

Le document contient un résumé par type et déclencheur, ainsi que le détail des crises.

## Tests

La feature est couverte par des tests Vitest pour les Server Actions, la validation, les pÃ©riodes d'export, le comptage et le composant calendrier. Des tests d'intÃ©gration vÃ©rifient l'isolation des crises entre utilisateurs, et les parcours Playwright couvrent l'utilisation dans le navigateur.

## Exemple d'utilisation

```tsx
<SeizureCalendar mode="demo" />

<SeizureCalendar
  mode="personal"
  initialSeizures={seizures}
  initialYear={2026}
  initialMonth={10}
/>
```
