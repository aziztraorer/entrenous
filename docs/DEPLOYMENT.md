# Déploiement en production — Entre Nous

Ce document décrit la procédure de déploiement du projet Entre Nous en environnement de production. Aucun domaine ni hébergeur n'est présélectionné : adaptez les valeurs à votre infrastructure.

## 1. Prérequis

| Outil | Version minimale | Rôle |
|-------|------------------|------|
| Node.js | 18.x ou 20.x | Runtime backend et build frontend |
| npm | inclus avec Node | Gestion des dépendances |
| PostgreSQL | 14.x ou 15.x | Base de données |

## 2. Installation des dépendances

Le projet se divise en deux parties : le backend (Fastify) et le frontend (Vite + Vue).

### Backend

```bash
cd backend
npm ci
```

### Frontend

```bash
cd frontend
npm ci
```

Utilisez `npm ci` (et non `npm install`) pour garantir une résolution déterministe des dépendances à partir de `package-lock.json`.

## 3. Configuration de PostgreSQL

### Création de la base de données

Connectez-vous à votre instance PostgreSQL et créez une base dédiée :

```sql
CREATE DATABASE entre_nous;
CREATE USER entre_nous_app WITH PASSWORD '<mot_de_passe_fort>';
GRANT ALL PRIVILEGES ON DATABASE entre_nous TO entre_nous_app;
```

Remplacez `<mot_de_passe_fort>` par une valeur générée de manière sécurisée. N'utilisez jamais de mot de passe par défaut en production.

### Schéma Prisma

Le schéma se trouve dans `backend/prisma/schema.prisma`. Il définit les modèles `Game`, `Player`, `Response`, `ChatMessage` et `Challenge`.

## 4. Variables d'environnement

### Backend (`backend/.env`)

Créez un fichier `.env` à la racine du dossier `backend` à partir de `backend/.env.example`. Remplacez chaque valeur par une valeur adaptée à votre environnement.

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NODE_ENV` | Environnement d'exécution | `production` |
| `PORT` | Port d'écoute du serveur | `3000` |
| `HOST` | Adresse d'écoute | `0.0.0.0` |
| `DATABASE_URL` | Chaîne de connexion PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `CORS_ORIGIN` | Origine(s) autorisée(s) pour le CORS | `https://votre-domaine.com` |
| `JWT_SECRET` | Secret pour signer les jetons de session (min. 32 caractères) | générer une chaîne aléatoire |
| `JWT_EXPIRY` | Durée de validité des jetons JWT | `24h` |
| `GAME_INACTIVE_TIMEOUT_HOURS` | Délai d'inactivité avant expiration d'une partie (heures) | `24` |
| `GAME_EXPIRY_HOURS` | Durée de vie maximale d'une partie (heures) | `24` |
| `GAME_SESSION_TIMEOUT` | Délai de session en millisecondes | `3600000` |
| `CHALLENGES_PER_GAME` | Nombre de questions par partie | `10` |
| `LOG_LEVEL` | Niveau de journalisation | `info` |

**Important** : ne commitez jamais le fichier `.env`. Il doit rester hors du contrôle de version.

### Frontend (`frontend/.env`)

Créez un fichier `.env` à la racine du dossier `frontend` :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de l'API backend | `https://api.votre-domaine.com` |
| `VITE_SOCKET_URL` | URL du serveur Socket.IO | `wss://api.votre-domaine.com` |

## 5. Migrations Prisma

En développement :

```bash
cd backend
npx prisma migrate dev
```

En production, appliquez les migrations sans attendre d'entrée interactive :

```bash
cd backend
npx prisma migrate deploy
```

### Génération du client Prisma

```bash
cd backend
npx prisma generate
```

## 6. Commandes de build et de démarrage

### Backend

| Commande | Rôle |
|----------|------|
| `npm run build` | Compile TypeScript vers `dist/` |
| `npm start` | Lance le serveur en production (`node dist/main.js`) |
| `npm run type-check` | Vérifie les types sans émettre de fichiers |
| `npm test` | Lance la suite de tests |
| `npm run lint` | Vérification et correction du code (ESLint) |

### Frontend

| Commande | Rôle |
|----------|------|
| `npm run build` | Type-check + build Vite (dossier `dist/`) |
| `npm run preview` | Prévisualisation locale du build |
| `npm run type-check` | Vérification des types Vue/TypeScript |
| `npm test` | Lance la suite de tests |
| `npm run lint` | Vérification du code (ESLint) |

### Ordre recommandé

1. Backend : `npm ci` → `npx prisma generate` → `npx prisma migrate deploy` → `npm run build` → `npm start`
2. Frontend : `npm ci` → `npm run build` → servir le contenu de `dist/` via un serveur web statique (Nginx, Apache, etc.)

## 7. Configuration des URL frontend/backend

Le frontend doit connaître l'adresse du backend pour les appels HTTP (API REST) et les connexions WebSocket (Socket.IO).

Dans `frontend/.env` :

```env
VITE_API_URL=https://api.votre-domaine.com
VITE_SOCKET_URL=wss://api.votre-domaine.com
```

Ces valeurs sont injectées à la construction via `import.meta.env`. Elles ne doivent pas contenir de credentials.

## 8. CORS

Le backend utilise `@fastify/cors`. L'origine autorisée est contrôlée par la variable d'environnement `CORS_ORIGIN`.

Configuration (déjà en place dans `backend/src/main.ts`) :

- Origine restrictive : uniquement l'URL du frontend en production.
- Aucun caractère générique (`*`) en production.
- Les méthodes et en-têtes nécessaires sont autorisés.

Exemple de valeur pour `CORS_ORIGIN` :

```env
CORS_ORIGIN=https://votre-domaine.com
```

Si plusieurs origines doivent être autorisées, adaptez la configuration CORS dans le code backend pour accepter une liste.

## 9. HTTPS et WSS

En production, le trafic doit être chiffré :

- **HTTPS** pour les appels HTTP (`VITE_API_URL` commence par `https://`).
- **WSS** pour les connexions WebSocket Socket.IO (`VITE_SOCKET_URL` commence par `wss://`).

### Proxy inversé recommandé

Placez un proxy inversé (Nginx, Caddy, Traefik, etc.) devant le backend Node.js :

- Terminaison TLS (certificat SSL/TLS via Let's Encrypt ou votre autorité de certification).
- Redirection HTTP → HTTPS.
- Proxy des requêtes HTTP vers `http://localhost:3000` (ou le port configuré par `PORT`).
- Proxy des connexions WebSocket vers le même backend (Socket.IO gère l'upgrade automatique).

Exemple conceptuel (Nginx) :

```nginx
server {
    listen 443 ssl;
    server_name api.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/api.votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

N'exposez pas le port du backend Node.js directement sur Internet ; exposez uniquement le port 443 du proxy inversé.

## 10. Configuration PWA

Le frontend est configuré en tant que Progressive Web App via `vite-plugin-pwa` (voir `frontend/vite.config.ts`).

Éléments générés lors du build :

- `dist/manifest.webmanifest` — manifeste de l'application.
- `dist/sw.js` — service worker pour la mise en cache hors ligne.
- Icônes PWA dans `dist/`.

Le service worker précache les ressources statiques et intercepte les requêtes API selon la configuration du manifeste. Aucun endpoint sensible n'est mis en cache par le service worker.

## 11. Sauvegarde et restauration de la base de données

### Sauvegarde

Utilisez `pg_dump` pour exporter la base de données :

```bash
pg_dump -h <host> -p <port> -U <utilisateur> entre_nous > backup_$(date +%F).sql
```

Automatisez cette commande via un cron ou un outil de sauvegarde de votre hébergeur. Conservez les sauvegardes hors site.

### Restauration

```bash
pg_restore -h <host> -p <port> -U <utilisateur> -d entre_nous backup_$(date +%F).sql
```

Ou, pour un dump texte :

```bash
psql -h <host> -p <port> -U <utilisateur> -d entre_nous -f backup_$(date +%F).sql
```

### Politique de suppression des données

Conformément à `docs/PRIVACY.md` :

- Les parties inactives expirées sont supprimées automatiquement après le délai configuré (`GAME_INACTIVE_TIMEOUT_HOURS`, défaut 24h).
- Les messages de chat de plus de 24h sont purgés toutes les 30 minutes.
- Les parties actives ne sont jamais supprimées par une tâche de nettoyage.

## 12. Vérification après déploiement

Une fois le déploiement terminé, effectuez les vérifications suivantes :

1. **Santé du backend** : `GET https://api.votre-domaine.com/health` doit retourner `200 OK`.
2. **Création de partie** : un utilisateur peut créer une partie et reçoit un code d'invitation.
3. **Rejoindre une partie** : un second utilisateur peut rejoindre avec le code.
4. **Jeu en temps réel** : les deux joueurs voient la question, répondent, et la question suivante s'affiche après confirmation mutuelle.
5. **Chat** : les messages échangés apparaissent en temps réel pour les deux joueurs.
6. **Expiration** : une partie inactives dépasse le délai configuré et n'est plus accessible.
7. **Tests automatisés** : exécutez `npm test` dans `backend` et `frontend` pour confirmer qu'aucune régression n'a été introduite.
8. **Logs** : vérifiez qu'aucune erreur critique n'apparaît dans les journaux du serveur (niveau `error` ou `fatal`).

## 13. Sécurité — Rappels

- Ne commitez jamais de fichiers `.env` contenant des secrets réels.
- `JWT_SECRET` doit contenir au moins 32 caractères et être unique par déploiement.
- `DATABASE_URL` ne doit pas être exposée dans le frontend.
- Utilisez des mots de passe forts pour la base de données.
- Maintenez Node.js et les dépendances à jour pour corriger les vulnérabilités connues.
- Le frontend ne stocke aucune donnée sensible de manière persistante au-delà du `localStorage`/`sessionStorage` nécessaires au fonctionnement du jeu.

## 14. Informations à compléter avant mise en production

Les éléments suivants dépendent de votre infrastructure et doivent être validés manuellement :

- Nom de domaine et certificat SSL/TLS.
- Adresse IP ou nom d'hôte du serveur PostgreSQL.
- Valeurs réelles de `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `VITE_API_URL`, `VITE_SOCKET_URL`.
- Stratégie et fréquence de sauvegarde de la base de données.
- Politique de conservation des logs serveur.
- Processus de mise à jour et de redémarrage du service (systemd, Docker, PM2, etc.).

Ces éléments relèvent de la responsabilité opérationnelle de l'équipe de déploiement et ne sont pas des garanties de conformité légale.
