# MarketFlow Backend

MarketFlow Backend est le cœur du Système de gestion de point de vente (POS). Il s'agit d'une API robuste et scalable développée pour gérer efficacement les opérations de caisse, les stocks, les utilisateurs, et les ventes.

## Stack Technique

- **Framework principal :** [NestJS](https://nestjs.com/) (Node.js / TypeScript)
- **ORM :** [Prisma](https://www.prisma.io/) (Gestion de base de données performante)
- **Base de données :** PostgreSQL
- **Cache & Queues :** Redis
- **Conteneurisation :** Docker & Docker Compose

## Structure du Projet

Le projet est structuré pour séparer la configuration globale de l'application NestJS :

```
MARKETFLOW-BACKEND/
├── app/                      # Code source de l'API (NestJS)
│   ├── prisma/
│   │   ├── models/           # Modèles Prisma découpés par entité (User, Product, Sale...)
│   │   ├── base.prisma       # Configuration de connexion à la BDD
│   │   └── schema.prisma     # Schéma auto-généré (Ne pas modifier manuellement)
│   ├── src/                  # Contrôleurs, Services et Modules NestJS
│   └── package.json          # Dépendances internes de l'app
├── docker-compose.yml        # Orchestration Docker (API, DB, Redis)
├── Dockerfile                # Image Docker pour le déploiement
└── package.json              # Scripts centraux du projet
```

## Installation & Démarrage

### 1. Prérequis
- [Node.js](https://nodejs.org/) (v22+)
- [Docker](https://www.docker.com/) & Docker Compose

### 2. Configuration initiale
Clonez le dépôt et installez les dépendances via le script central :

```bash
# Installe les dépendances du dossier /app
npm run install:app
```

Ensuite, configurez vos variables d'environnement. Copiez le fichier d'exemple et remplissez-le :
```bash
cp .env.example .env
```
Assurez-vous que la variable `DATABASE_URL` est bien définie dans votre fichier `.env`.

### 3. Gestion de la Base de Données (Prisma)

Ce projet utilise `prisma-import` pour fusionner plusieurs fichiers de modèles (`app/prisma/models/*.prisma`) en un seul fichier de schéma. **Utilisez toujours les scripts suivants** depuis la racine :

- **Compiler le schéma :** (Combine `base.prisma` et le dossier `models/`)
  ```bash
  npm run prisma:format
  ```
- **Créer et appliquer une migration :** (Met à jour la base de données)
  ```bash
  npm run prisma:migrate
  ```
- **Générer le client Prisma :** (Pour l'auto-complétion TypeScript)
  ```bash
  npm run prisma:generate
  ```
- **Visualiser les données :** (Ouvre Prisma Studio sur le port 5555)
  ```bash
  npm run prisma:studio
  ```

### 4. Lancer l'application

#### Option A : Via Docker (Recommandé)
Lancez l'ensemble des services (API, PostgreSQL, Redis) en arrière-plan :
```bash
# Construire et démarrer
npm run dc:build

# Démarrer uniquement (si déjà construit)
npm run dc:up

# Arrêter les conteneurs
npm run dc:stop
```
L'API sera accessible sur `http://localhost:3000`.

#### Option B : En local (Mode Développement)
Si vous souhaitez développer sans l'API dans Docker (assurez-vous d'avoir coupé l'API Docker avec `npm run dc:stop`), lancez :
```bash
# Mode développement avec rechargement automatique
npm run start:dev
```

## Entités Principales

- **Users & Roles :** Propriétaires, Managers, Caissiers.
- **Stores :** Gestion multi-boutiques.
- **Products & Categories :** Gestion du catalogue, des codes-barres et des prix.
- **Stock Movements :** Traçabilité complète des entrées et sorties de stock.
- **Cash Sessions :** Suivi des ouvertures et fermetures de caisse (fonds de roulement, écarts).
- **Sales & SaleItems :** Historique détaillé des transactions.
- **Mobile Devices & Sync Queue :** Support des appareils mobiles et file d'attente pour la synchronisation hors-ligne.

## Licence
Ce projet est privé et sous licence **UNLICENSED**.
