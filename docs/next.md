# Dossier `.next`

Le dossier `.next` contient les fichiers générés par Next.js pendant le développement et le build de production.

## Contenu généré

On y trouve notamment :

- le cache de compilation ;
- les fichiers JavaScript optimisés ;
- les artefacts du serveur standalone ;
- les fichiers statiques ;
- les types générés par Next.js ;
- les manifests de routes et de build.

## Utilisation

Ce dossier est créé ou mis à jour automatiquement par :

```bash
pnpm dev
pnpm build
```

Il ne doit pas être importé ou modifié manuellement.

## Suppression

Le dossier peut être supprimé sans risque lorsque le serveur Next.js est arrêté. Il sera recréé au prochain lancement :

```powershell
Remove-Item -Recurse -Force .next
pnpm dev
```

Il est ignoré par Git via [`.gitignore`](../.gitignore), donc ce README ne sera pas versionné et peut être supprimé lors du nettoyage du dossier généré.
