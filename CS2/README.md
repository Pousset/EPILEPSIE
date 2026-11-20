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
2. Ouvrir la console en jeu avec la touche `` ` `` (bindée dans ton `autoexec.cfg`). Sans autoexec, la touche se règle dans `Paramètres` → `Clavier / Souris`.

### Option de lancement (facultatif)

Dans Steam → clic droit sur CS2 → `Propriétés` → `Options de lancement` :

```
-console -novid
```

`-console` ouvre la console dès le démarrage et `-novid` saute l'intro.

---

## 2. Détail de chaque fichier

### `autoexec.cfg` : config personnelle

Exécuté **automatiquement** à chaque lancement de CS2. Il contient toute la configuration personnelle, rangée en sections : binds, audio, radar, viewmodel, gameplay et viseur.

Pour le recharger sans relancer le jeu :

```
exec autoexec
```

#### Binds (touches)

| Touche | Commande | Effet |
|---|---|---|
| `W` `A` `S` `D` | `+forward` `+left` `+back` `+right` | Déplacements |
| `ESPACE`, molette haut, molette bas | `+jump` | Saut (la molette permet d'enchaîner les sauts) |
| `SHIFT` | `+sprint` | Marche silencieuse |
| `CTRL` | `+duck` | S'accroupir |
| `R` / `E` | `+reload` / `+use` | Recharger / utiliser |
| `MOUSE1` / `MOUSE2` | `+attack` / `+attack2` | Tirer / tir secondaire |
| `G` / `H` / `Q` / `F` | `drop` / `switchhands` / `lastinv` / `+lookatweapon` | Jeter l'arme / changer de main / dernière arme / inspecter l'arme |
| `X` | `+voicerecord` | Parler (push-to-talk) |
| `` ` `` | `toggleconsole` | Ouvrir la console |
| `B` | `buymenu` | Menu d'achat |
| `T` / `Y` | `messagemode` / `messagemode2` | Chat général / chat d'équipe |
| `TAB` | `+showscores` | Tableau des scores |
| `;` | `teammenu` | Menu d'équipe |
| `MOUSE4` | `player_ping` | Ping |
| `<` (touche ISO à gauche de `W`) | `+spray_menu` | Menu des sprays |
| `1` à `9`, `0` | `slot1` à `slot9`, `slot10` | Sélection des armes |
| `ESC` / `DEL` / `PAUSE` | `cancelselect` / `mute` / `pause` | Annuler / couper le son / pause |
| `F5` / `F6` / `F7` | `jpeg` / `save quick` / `load quick` | Capture d'écran / sauvegarde rapide / chargement rapide |
| `F10` | `quit prompt` | Quitter avec confirmation |
| `ALT` | `sv_cheats 1; noclip` | Active le noclip (voir **Points d'attention**) |

#### Achats rapides

Les flèches achètent tout un équipement en un appui. L'ordre compte : si l'argent manque, les achats s'arrêtent dans l'ordre de la ligne (armure, arme, puis utilitaires).

| Touche | Achat |
|---|---|
| `↑` | Armure + casque, AK-47 / M4A1-S, fumigène, flash, incendiaire / molotov, kit de désamorçage |
| `→` | Armure + casque, FAMAS / Galil AR, fumigène, flash, incendiaire / molotov, kit |
| `←` | Armure + casque, MP9 / MAC-10, fumigène, flash, incendiaire / molotov, kit |
| `↓` | `sellbackall` : revendre l'équipement |
| `F3` / `F4` | `autobuy` / `rebuy` |

Chaque ligne liste les armes des deux camps (`ak47; m4a1_silencer`) : le jeu n'achète que celle qui correspond à ton équipe, donc un seul bind sert aux T et aux CT.

#### Réglages principaux

| Domaine | Valeurs |
|---|---|
| Audio | `volume 0.4`, son coupé quand la fenêtre perd le focus, musiques (menu, MVP, objectifs, début et fin de round) à 0, avertissement des 10 secondes quasi muet |
| Radar | centré sur le joueur (`cl_radar_always_centered 1`), rotation active, échelle `0.4`, carré quand le tableau des scores est ouvert |
| Viewmodel | `viewmodel_fov 68`, décalage `x 2.5 / y 0 / z -1.5`, preset `1` |
| Souris | `sensitivity 1.0`, `zoom_sensitivity_ratio 0.9`, `m_pitch` et `m_yaw` à `0.022` |
| Viseur | style `4` (statique), sans point, forme en croix, `gap 2`, longueur `2`, épaisseur `2`, couleur cyan (`0 / 255 / 255`), sans contour, sans recul |
| Profil | pseudo `BlopBlop`, `rate 196608` |

Le reste du fichier regroupe des sections héritées : manette (`joy_*`), caméra et troisième personne (`c_*`, `cam_*`), spectateur et démos, logs serveur (`sv_*`), matchmaking et menus (`mm_*`, `ui_*`, `player_*`).

#### Points d'attention

1. **Bind `ALT` = `sv_cheats 1; noclip`.** En local, il fait voler et traverser les murs (vitesse réglée par `sv_noclipspeed 1200`). Mais `ALT` sert aussi à `ALT+TAB` : tu risques d'activer le noclip par accident. Mieux vaut déplacer ce bind dans `train.cfg`.
2. **Le fichier ressemble à un export complet d'une ancienne config CS:GO** (certaines valeurs datent de 2021). Les lignes `mm_*`, `ui_*`, `cachedvalue_*`, `joy_*`, `cam_*`, etc. servent peu ou plus du tout dans CS2, et celles qui n'existent plus affichent `Unknown command` dans la console au lancement. Je ne peux pas te dire ligne par ligne lesquelles sont obsolètes : ouvre la console après le démarrage et note les erreurs. Un autoexec allégé (binds, audio, radar, viewmodel, souris, viseur) est plus simple à maintenir.
3. **Données personnelles.** `name` et `cl_clanid` (ID de groupe Steam) identifient ton compte : retire-les avant de publier le fichier sur GitHub.

### `1v1.cfg` : duel 1v1

À charger **en local** (serveur privé, map workshop 1v1 ou serveur de test) :

```
exec 1v1
```

Ce fichier transforme une partie locale en **duel AK47 vs M4 sans achat**, au meilleur des 30 rounds, avec changement de côté à la mi-temps. Le round se termine dès qu'un joueur est éliminé.

Contenu du fichier :

```
mp_round_restart_delay 5;
mp_maxrounds 30;
mp_roundtime 50000;
mp_match_can_clinch 1;
mp_overtime_enable 1;
bot_kick;
mp_freezetime 2;
mp_ignore_round_win_conditions 0;
mp_limitteams 1;
mp_weapons_allow_map_placed 0;
mp_death_drop_gun 0;
sv_infinite_ammo 2;
mp_free_armor 1;
mp_t_default_secondary weapon_glock;
mp_ct_default_secondary weapon_usp_silencer;
mp_t_default_primary weapon_ak47;
mp_ct_default_primary weapon_m4a1;
mp_halftime 1;
mp_halftime_duration 5;
mp_warmup_end;
mp_restartgame 1;
```

#### Déroulement de la partie

| Commande | Effet |
|---|---|
| `mp_maxrounds 30` | 30 rounds maximum (15 par côté) |
| `mp_match_can_clinch 1` | Le match s'arrête dès qu'un joueur a la majorité des rounds (16) |
| `mp_overtime_enable 1` | Prolongations en cas d'égalité |
| `mp_halftime 1` | Changement de côté T/CT à la mi-temps |
| `mp_halftime_duration 5` | La mi-temps dure 5 secondes |
| `mp_round_restart_delay 5` | 5 secondes entre deux rounds |
| `mp_freezetime 2` | 2 secondes de gel au début du round |
| `mp_roundtime 50000` | Durée du round en minutes : volontairement énorme pour qu'il ne s'arrête jamais par le temps |
| `mp_ignore_round_win_conditions 0` | Les conditions de victoire normales restent actives : le round finit quand un joueur meurt |

#### Équipes et bots

| Commande | Effet |
|---|---|
| `bot_kick` | Retire tous les bots pour ne garder que les vrais joueurs |
| `mp_limitteams 1` | Limite l'écart de joueurs entre les deux équipes à 1 |

#### Équipement

| Commande | Effet |
|---|---|
| `mp_t_default_primary weapon_ak47` | Les T démarrent avec une AK-47 |
| `mp_ct_default_primary weapon_m4a1` | Les CT démarrent avec une M4A4 (pour la M4A1-S, utiliser `weapon_m4a1_silencer`) |
| `mp_t_default_secondary weapon_glock` | Pistolet des T : Glock-18 |
| `mp_ct_default_secondary weapon_usp_silencer` | Pistolet des CT : USP-S |
| `mp_free_armor 1` | Armure offerte à chaque round |
| `sv_infinite_ammo 2` | Munitions de réserve infinies (il faut quand même recharger) |
| `mp_weapons_allow_map_placed 0` | Supprime les armes posées sur la map |
| `mp_death_drop_gun 0` | Les armes ne tombent pas à la mort, ce qui empêche de ramasser celle de l'adversaire |

#### Lancement de la partie

| Commande | Effet |
|---|---|
| `mp_warmup_end` | Termine l'échauffement |
| `mp_restartgame 1` | Relance la partie après 1 seconde avec tous ces réglages |

#### Utilisation

À lancer **en local** (serveur privé, map workshop 1v1 ou serveur de test) : ces commandes serveur ne fonctionnent que si tu es hôte de la partie. Ne l'utilise pas en matchmaking.

```
exec 1v1
```

Si `sv_infinite_ammo` est refusé par la console, active d'abord `sv_cheats 1` (et remets-le à `0` ensuite).

#### Pistes d'amélioration

- Ajouter `mp_buytime 0` (ou `mp_startmoney 0`) pour empêcher tout achat, puisque les armes sont déjà données.
- Ajouter `mp_autoteambalance 0` pour éviter qu'un joueur soit déplacé automatiquement d'équipe.
- Ajouter `mp_t_default_grenades` / `mp_ct_default_grenades` si tu veux donner des grenades de départ.

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
