# Configs CS2

Ensemble de fichiers de configuration pour **Counter-Strike 2** : réglages personnels, mode 1v1 et entraînement.

| Fichier | Rôle | Chargement |
|---|---|---|
| `autoexec.cfg` | Réglages personnels (viseur, sons, binds, réseau...) | Automatique au lancement du jeu |
| `1v1.cfg` | Règles d'un duel 1v1 sur serveur local | Manuel : `exec 1v1` |
| `train.cfg` | Mode entraînement (grenades, trajectoires, bots...) | Manuel : `exec train` |
| `cs2_video.txt` | Paramètres vidéo du jeu (résolution, qualité...) | Automatique (géré par le jeu) |

---

## 1. Installation

### Où placer les fichiers

`autoexec.cfg`, `1v1.cfg` et `train.cfg` vont dans le dossier `cfg` de CS2 :

```
<Steam>\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\
```

Chemin par défaut sous Windows :

```
C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg\
```

`cs2_video.txt` va dans le dossier utilisateur Steam :

```
<Steam>\userdata\<TON_ID_STEAM>\730\local\cfg\cs2_video.txt
```

> `730` est l'identifiant de CS2 sur Steam. Ton ID Steam est le dossier numérique dans `userdata`.

### Activer la console

1. `Paramètres` → `Jeu` → `Activer la console du développeur` → **Oui**
2. Ouvrir la console en jeu avec la touche `²` (AZERTY) ou `~` (QWERTY). Elle est modifiable dans `Paramètres` → `Clavier / Souris`.

### Option de lancement (facultatif)

Dans Steam → clic droit sur CS2 → `Propriétés` → `Options de lancement` :

```
-console -novid
```

`-console` ouvre la console dès le démarrage et `-novid` saute l'intro.

---

## 2. Détail de chaque fichier

### `autoexec.cfg` : config personnelle

Exécuté **automatiquement** à chaque lancement de CS2. On y met ce qui doit toujours s'appliquer :

- viseur (`cl_crosshair*`)
- sensibilité et paramètres souris (`sensitivity`, `zoom_sensitivity_ratio`)
- volume et options audio
- affichage du radar (`cl_radar_*`)
- binds (touches personnalisées)
- réglages réseau (`rate`, `cl_interp*`...)

Pour le recharger sans relancer le jeu :

```
exec autoexec
```

Conseil : termine le fichier par `host_writeconfig` pour forcer la sauvegarde, et ajoute `echo "autoexec charge"` pour vérifier dans la console qu'il a bien été lu.

### `1v1.cfg` : duel 1v1

À charger **en local** (serveur privé, map workshop 1v1 ou serveur de test) :

```
exec 1v1
```

Ce fichier configure les règles d'un duel, par exemple :

- durée du round et temps de gel (`mp_roundtime`, `mp_freezetime`)
- argent et équipement de départ (`mp_startmoney`, `mp_buytime`)
- redémarrage de la partie (`mp_restartgame 1`)
- gestion du warmup (`mp_warmup_end`)

Il ne doit **pas** être utilisé en matchmaking : ces commandes serveur ne fonctionnent que si tu es hôte de la partie.

### `train.cfg` : entraînement

À charger **sur une map locale** (mode `Compétitif` hors ligne ou map d'entraînement) :

```
exec train
```

Il active typiquement des outils d'entraînement :

- `sv_cheats 1` (requis pour la plupart des commandes de practice)
- munitions et grenades infinies (`sv_infinite_ammo 1`)
- trajectoire des grenades (`sv_grenade_trajectory_prac_pipreview 1`)
- impacts de balles visibles (`sv_showimpacts 1`)
- gestion des bots (`bot_kick`, `bot_stop`...)
- remise à zéro rapide (`mp_restartgame 1`)

> `sv_cheats 1` désactive les succès et ne fonctionne qu'en local. Pour revenir à la normale : `sv_cheats 0` puis `exec autoexec`.

### `cs2_video.txt` : paramètres vidéo

Fichier généré et lu par le jeu. Il stocke : résolution, mode d'affichage (plein écran / fenêtré), qualité des ombres, des textures, anti-aliasing, limite de FPS, etc.

- Il se modifie normalement via `Paramètres` → `Vidéo`.
- On le copie surtout pour **transférer ses réglages** d'un PC à un autre ou pour les sauvegarder.
- Fermer CS2 avant de le remplacer, sinon le jeu l'écrase à la fermeture.
- Si les réglages sont réinitialisés à chaque lancement, passe le fichier en **lecture seule** : clic droit → `Propriétés` → `Lecture seule`.

---

## 3. Utilisation pas à pas

### Au quotidien

1. Lancer CS2 : `autoexec.cfg` se charge tout seul.
2. Ouvrir la console et vérifier qu'il n'y a pas d'erreur rouge.

### Pour un duel 1v1

1. Lancer une map locale (workshop 1v1 ou serveur privé).
2. Ouvrir la console :
   ```
   exec 1v1
   ```
3. Vérifier que la partie redémarre avec les bons réglages.

### Pour s'entraîner

1. Lancer une map en local (par exemple via `map de_mirage` dans la console, ou le mode hors ligne).
2. Dans la console :
   ```
   exec train
   ```
3. S'entraîner, puis quitter ou taper :
   ```
   sv_cheats 0
   exec autoexec
   ```

---

## 4. Commandes console utiles

| Commande | Effet |
|---|---|
| `exec <nom>` | Exécute un fichier cfg (sans l'extension) |
| `host_writeconfig` | Force la sauvegarde de la config actuelle |
| `cl_showfps 1` | Affiche les FPS |
| `net_graph 1` | Affiche ping, perte de paquets, FPS |
| `bind <touche> "<commande>"` | Associe une commande à une touche |
| `unbindall` | Supprime tous les binds (à utiliser avec précaution) |
| `echo "texte"` | Affiche un message dans la console |
| `find <mot>` | Cherche une commande contenant ce mot |
| `help <commande>` | Décrit une commande |

---

## 5. Dépannage

- **Le cfg ne se charge pas** : vérifier le chemin du dossier et que l'extension est bien `.cfg` (et pas `.cfg.txt`, ce qui arrive avec le Bloc-notes).
- **Une commande est ignorée** : certaines commandes serveur exigent `sv_cheats 1` ou d'être hôte.
- **`Unknown command`** : la commande n'existe plus dans CS2 (beaucoup de commandes CS:GO ont été supprimées ou renommées). Utiliser `find` pour retrouver l'équivalent.
- **Les réglages vidéo reviennent à zéro** : mettre `cs2_video.txt` en lecture seule.
- **Un autre cfg écrase mes réglages** : placer `exec autoexec` en fin de `1v1.cfg` et `train.cfg` pour restaurer ses réglages perso.

---

## 6. Sauvegarde

Copier régulièrement les 4 fichiers dans un dépôt Git ou un dossier cloud pour retrouver sa config après une réinstallation.
