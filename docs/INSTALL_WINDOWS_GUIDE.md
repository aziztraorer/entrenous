# Guide d'installation et de déploiement Windows — Entre Nous

Ce guide vous accompagne pas à pas, depuis l'installation des prérequis jusqu'à la préparation de la mise en ligne, sur un poste Windows.

## Sommaire

1. [Prérequis](#1-prérequis)
2. [Installation du backend](#2-installation-du-backend)
3. [Installation du frontend](#3-installation-du-frontend)
4. [Configuration PostgreSQL](#4-configuration-postgresql)
5. [Variables d'environnement](#5-variables-denvironnement)
6. [Lancement des services](#6-lancement-des-services)
7. [Tests et vérification](#7-tests-et-vérification)
8. [Export et sauvegarde de la base de données](#8-export-et-sauvegarde-de-la-base-de-données)
9. [Import et restauration d'une sauvegarde](#9-import-et-restauration-dune-sauvegarde)
10. [Préparation à la mise en ligne](#10-préparation-à-la-mise-en-ligne)

---

## 1. Prérequis

Assurez-vous d'avoir installé :

| Outil | Version | Téléchargement |
|-------|---------|----------------|
| Node.js | 18.x ou 20.x (LTS) | https://nodejs.org/ |
| PostgreSQL | 14 ou 15 | https://www.postgresql.org/download/windows/ |
| Git | Dernière version | https://git-scm.com/ |

Vérifiez l'installation :

```cmd
node --version
npm --version
psql --version
git --version
```

---

## 2. Installation du backend

Ouvrez une invite de commandes (CMD) ou PowerShell :

```cmd
cd G:\entre-nous\backend
```

### 2.1 Installer les dépendances

```cmd
npm install
```

### 2.2 Générer le client Prisma

```cmd
npm run db:generate
```

### 2.3 Configurer la base de données

Créez une base `entre_nous` dans PostgreSQL, puis appliquez le schéma :

```cmd
npm run db:push
```

### 2.4 Vérifier l'installation

```cmd
npm run type-check
```

Aucune erreur ne doit s'afficher.

---

## 3. Installation du frontend

Dans une nouvelle invite de commandes :

```cmd
cd G:\entre-nous\frontend
npm install
```

Vérifiez :

```cmd
npm run type-check
```

---

## 4. Configuration PostgreSQL

### 4.1 Créer la base de données

Via pgAdmin (interface graphique) :

1. Ouvrez pgAdmin
2. Clic droit sur "Databases" → Create → Database
3. Nom : `entre_nous`
4. Cliquez sur Save

Ou en ligne de commande :

```cmd
psql -U postgres
CREATE DATABASE entre_nous;
\q
```

### 4.2 Créer un utilisateur dédié (recommandé)

```sql
CREATE USER entre_nous_app WITH PASSWORD '<mot_de_passe_fort>';
GRANT ALL PRIVILEGES ON DATABASE entre_nous TO entre_nous_app;
```

---

## 5. Variables d'environnement

### 5.1 Backend (`backend\.env`)

Créez le fichier à la racine du dossier `backend` :

```env
NODE_ENV=development
PORT=3000
HOST=localhost

DATABASE_URL=postgresql://entre_nous_app:<mot_de_passe>@localhost:5432/entre_nous

JWT_SECRET=changez-moi-par-au-moins-32-caracteres-aleatoires
JWT_EXPIRY=24h

GAME_INACTIVE_TIMEOUT_HOURS=24
GAME_EXPIRY_HOURS=24
CHALLENGES_PER_GAME=10

LOG_LEVEL=info

CORS_ORIGIN=http://localhost:5173
```

### 5.2 Frontend (`frontend\.env`)

Créez le fichier à la racine du dossier `frontend` :

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
VITE_ENV=development
VITE_APP_TITLE=Entre Nous
```

**Important** : ne commitez jamais ces fichiers. Remplacez `<mot_de_passe>` par un mot de passe fort et `JWT_SECRET` par une chaîne aléatoire d'au moins 32 caractères.

---

## 6. Lancement des services

### Terminal 1 — Backend

```cmd
cd G:\entre-nous\backend
npm run dev
```

Vous devriez voir :
```
🚀 Server running at http://localhost:3000
📡 Socket.IO ready for connections
```

### Terminal 2 — Frontend

```cmd
cd G:\entre-nous\frontend
npm run dev
```

Vous devriez voir :
```
  VITE v5.0.7  ready in 234 ms
  ➜  Local:   http://localhost:5173/
```

Ouvrez votre navigateur à http://localhost:5173/

---

## 7. Tests et vérification

### 7.1 Vérifications manuelles

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Ouvrez http://localhost:5173/ | Page d'accueil s'affiche |
| 2 | Cliquez "Créer une partie" | Formulaire de création s'affiche |
| 3 | Saisissez prénom, nom, catégories | Une partie est créée, code à 6 caractères affiché |
| 4 | Partagez le code avec un second joueur | Le second joueur peut rejoindre |
| 5 | Les deux joueurs répondent à tour de rôle | Les questions s'affichent en alternance |
| 6 | Testez le chat | Les messages apparaissent en temps réel |
| 7 | Testez la reconnexion | Rechargez la page, l'état de la partie est restauré |

### 7.2 Tests automatisés

Les tests nécessitent une base de données PostgreSQL accessible et le backend en cours d'exécution.

```cmd
cd G:\entre-nous\backend
npm run test

cd G:\entre-nous\frontend
npm run test
```

**Note** : Si les tests échouent ou se bloquent, vérifiez que PostgreSQL est démarré et que `DATABASE_URL` est correct.

### 7.3 Type-check et build

```cmd
cd G:\entre-nous\backend
npm run type-check

cd G:\entre-nous\frontend
npm run type-check
npm run build
```

Le dossier `frontend\dist\` doit être généré sans erreur.

---

## 8. Export et sauvegarde de la base de données

### 8.1 Sauvegarde complète (recommandé)

```cmd
cd G:\entre-nous\backend
pg_dump -h localhost -p 5432 -U entre_nous_app entre_nous > backup_entre_nous_20251030.sql
```

### 8.2 Sauvegarde uniquement des données (sans schéma)

```cmd
pg_dump -h localhost -p 5432 -U entre_nous_app --data-only entre_nous > backup_data_20251030.sql
```

### 8.3 Automatisation (Windows Task Scheduler)

Créez une tâche planifiée qui exécute quotidiennement :

```cmd
pg_dump -h localhost -p 5432 -U entre_nous_app entre_nous > "C:\sauvegardes\entre-nous\backup_%date:~-4,4%%date:~-7,2%%date:~-10,2%.sql"
```

Stockez les sauvegardes hors de la machine hôte (disque externe, cloud, etc.).

---

## 9. Import et restauration d'une sauvegarde

### 9.1 Restauration complète

```cmd
psql -h localhost -p 5432 -U entre_nous_app -d entre_nous -f backup_entre_nous_20251030.sql
```

### 9.2 Restauration sur une nouvelle base

1. Créez la base : `CREATE DATABASE entre_nous;`
2. Restaurez : `psql -h localhost -p 5432 -U entre_nous_app -d entre_nous -f backup_entre_nous_20251030.sql`
3. Régénérez le client Prisma : `npm run db:generate`

---

## 10. Préparation à la mise en ligne

### 10.1 Checklist avant production

- [ ] Nom de domaine choisi et DNS configuré
- [ ] Certificat SSL/TLS obtenu (Let's Encrypt ou autre)
- [ ] Proxy inversé configuré (Nginx, Caddy, Traefik)
- [ ] `JWT_SECRET` défini (min. 32 caractères, unique)
- [ ] `DATABASE_URL` pointe vers la base de production
- [ ] `CORS_ORIGIN` limité au domaine de production (pas de joker)
- [ ] `VITE_API_URL` et `VITE_SOCKET_URL` en `https://` / `wss://`
- [ ] Parcours complet testé à deux joueurs sur l'instance de production
- [ ] Sauvegardes automatiques configurées
- [ ] Documents juridiques validés (confidentialité, conditions, contact)

### 10.2 Configuration HTTPS/WSS

Le trafic doit être chiffré en production :

- **HTTPS** pour l'API REST (`VITE_API_URL` commence par `https://`)
- **WSS** pour Socket.IO (`VITE_SOCKET_URL` commence par `wss://`)

Configurez votre proxy inversé pour :
1. Terminer le TLS (certificat SSL)
2. Rediriger HTTP → HTTPS
3. Proxier les requêtes HTTP vers `http://localhost:3000`
4. Proxier les connexions WebSocket vers le même backend

### 10.3 Commandes de démarrage en production

```cmd
cd G:\entre-nous\backend
npm run build
npm start
```

Le backend écoute sur le port configuré par `PORT` (défaut : 3000).

Pour le frontend, servez le contenu de `frontend\dist\` via un serveur web statique (Nginx, Apache, IIS, etc.).

### 10.4 Avertissements

- Ne commitez jamais le fichier `.env` contenant des secrets réels.
- N'exposez pas le port du backend Node.js directement sur Internet ; utilisez un proxy inversé sur le port 443.
- Ce projet ne garantit aucune confidentialité absolue. Consultez `docs/PRIVACY.md`.
- Les documents juridiques fournis sont à titre informatif et doivent être validés par une personne compétente en droit avant mise en production.
