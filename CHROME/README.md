# Utiliser les fichiers Chrome

Ce dossier contient deux fichiers complémentaires :

| Fichier | Rôle |
|---|---|
| `BOOKMARKS.html` | Export de favoris au format HTML, à importer dans un navigateur. |
| `EXTENSIONS.txt` | Capture d'un export d'extensions affiché dans PowerShell ; c'est une liste de référence, pas un fichier d'installation. |

## Importer les favoris

1. Ouvrir Chrome.
2. Ouvrir le menu `⋮`, puis `Favoris et listes` → `Importer les favoris et les paramètres` (ou rechercher « Importer les favoris » dans les paramètres).
3. Choisir le fichier `BOOKMARKS.html` dans ce dossier, puis lancer l'import.
4. Ouvrir le gestionnaire de favoris avec `Ctrl+Maj+O` pour retrouver les favoris importés et les ranger si nécessaire.

L'import ajoute des favoris au profil Chrome courant ; il ne remplace pas automatiquement ceux qui s'y trouvent déjà. Si les mêmes favoris sont importés plusieurs fois, des doublons peuvent apparaître.

### Faire une sauvegarde ou modifier les favoris

- Avant un import, il est possible de sauvegarder les favoris actuels depuis le gestionnaire (`Ctrl+Maj+O` → `⋮` → `Exporter les favoris`).
- Pour modifier les liens ou les dossiers de ce fichier, utiliser de préférence le gestionnaire de favoris de Chrome, puis exporter à nouveau au format HTML.
- Pour partager `BOOKMARKS.html`, vérifier d'abord son contenu : les favoris peuvent révéler des comptes, des profils personnels ou des adresses locales.

## Utiliser la liste d'extensions

`EXTENSIONS.txt` est une transcription de console. Elle montre notamment des noms, versions et identifiants d'extensions, ainsi qu'un exemple de sortie d'un script PowerShell. Le fichier ne contient ni les extensions elles-mêmes, ni leurs paramètres, ni le script d'export mentionné dans la transcription.

Pour retrouver une extension après une réinstallation de Chrome :

1. Dans Chrome, ouvrir `⋮` → `Extensions` → `Gérer les extensions`, ou saisir `chrome://extensions`.
2. Rechercher le nom ou l'identifiant indiqué dans `EXTENSIONS.txt` sur le Chrome Web Store.
3. Vérifier que l'identifiant correspond avant d'installer l'extension.
4. Répéter pour chaque extension souhaitée.

La liste sert de pense-bête : elle ne permet pas de restaurer les extensions automatiquement. Elle ne sauvegarde pas non plus leurs données ou paramètres. Ceux-ci dépendent de chaque extension et peuvent parfois être synchronisés avec son compte ou avec Chrome.

### À propos de la transcription PowerShell

La sortie montre qu'un script nommé `export-extensions-chrome.ps1` a été exécuté, mais ce script n'est pas présent dans ce dossier. Le fichier TXT seul ne permet donc pas de relancer l'export.

Si vous récupérez ce script séparément, vérifiez sa provenance et son contenu avant de l'exécuter. Ne modifiez pas globalement la stratégie d'exécution de PowerShell pour contourner un avertissement. `Unblock-File` retire le blocage Windows d'un fichier téléchargé ; cela ne vérifie pas que le script est sûr.
