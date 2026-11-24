# Dossier `.agents`

Le dossier `.agents` contient les instructions et références utilisées par les assistants IA lorsqu'ils travaillent sur ce projet.

## Contenu

```text
.agents/
└─ skills/
   ├─ prisma-cli/
   ├─ prisma-client-api/
   ├─ prisma-compute/
   ├─ prisma-database-setup/
   ├─ prisma-driver-adapter-implementation/
   ├─ prisma-mongodb-upgrade/
   ├─ prisma-orm-setup/
   ├─ prisma-postgres/
   ├─ prisma-postgres-setup/
   ├─ prisma-postgres-upgrade/
   └─ prisma-upgrade-v7/
```

Chaque skill possède un fichier `SKILL.md` et, selon le sujet, des références complémentaires dans un dossier `references/`.

## Rôle

Ces fichiers documentent notamment :

- les commandes Prisma ORM 7 ;
- la génération du client Prisma ;
- les migrations et opérations de base de données ;
- la configuration PostgreSQL et Neon ;
- les mises à niveau de Prisma ;
- les règles de sécurité pour les commandes potentiellement destructives.

Ils ne sont pas importés par Next.js et ne sont pas nécessaires à l'exécution de l'application. Ils servent à fournir un contexte cohérent aux agents IA qui modifient le projet.

## Versionnement

Contrairement à `.next`, le dossier `.agents` est suivi par Git. Il peut donc être partagé avec les autres contributeurs et assistants du projet.

Si ces instructions ne sont plus utilisées, le dossier peut être supprimé, mais cela supprimera la documentation Prisma versionnée du projet.
