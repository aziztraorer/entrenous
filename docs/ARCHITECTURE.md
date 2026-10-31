# Architecture — Entre Nous

## Vue d'ensemble

Entre Nous est une application monorepo divisée en deux parties indépendantes :

- **Backend** : API REST Fastify + serveur Socket.IO, base de données PostgreSQL via Prisma ORM.
- **Frontend** : Application monopage Vue 3 + Vite, PWA, gestion d'état Pinia, routage Vue Router.

Les deux parties communiquent via HTTP (API REST) et WebSocket (Socket.IO pour le temps réel).

## Stack technique

### Backend

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Runtime | Node.js 18/20 | Exécution du serveur |
| Framework web | Fastify | API REST + middleware |
| Temps réel | Socket.IO | WebSocket pour le chat et l'état du jeu |
| Base de données | PostgreSQL 14/15 | Stockage des parties, joueurs, réponses, messages |
| ORM | Prisma | Accès typé à la base de données |
| Validation | Zod | Schéma d'entrée côté serveur |
| JWT | jsonwebtoken | Jetons de session temporaires |
| Logs | Pino | Journalisation structurée |
| Sécurité | @fastify/helmet, @fastify/cors, @fastify/rate-limit | En-têtes de sécurité, CORS, rate limiting |
| TypeScript | 5.3 | Typage statique |
| Tests | Vitest | Tests unitaires et d'intégration |

### Frontend

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Framework | Vue 3 | Interface utilisateur |
| Build tool | Vite | Compilation, serveur dev, build production |
| Routage | Vue Router 4 | Navigation entre pages |
| État global | Pinia 2 | Store de partie et d'interface |
| HTTP client | Axios | Appels API REST |
| WebSocket client | socket.io-client | Connexion temps réel |
| Styling | Tailwind CSS | CSS utilitaire |
| PWA | vite-plugin-pwa | Service worker, manifeste, précache |
| TypeScript | 5.3 | Typage statique |
| Tests | Vitest + Vue Test Utils | Tests unitaires |

## Schéma de base de données (Prisma)

Modèles principaux :

- **Game** : id, code, statut, dates de création/expiration, état du moteur de questions (JSON)
- **Player** : id, gameId, role (1 ou 2), prénom, nom, catégories choisies (JSON), dernière activité
- **Response** : id, gameId, playerId, challengeId, contenu (JSON avec kind et text), date de création
- **ChatMessage** : id, gameId, playerId, contenu, date de création
- **Challenge** : banque de questions par catégorie

Contraintes importantes :

- `Game` → `Player`, `Response`, `ChatMessage` : suppression en cascade (`onDelete: Cascade`)
- Un code de partie à 6 caractères (alphanumérique, majuscules)
- Maximum 2 joueurs par partie

## Flux de données

### Création et jonction de partie

1. Joueur 1 appelle `POST /api/games` → reçoit `gameCode`, `sessionToken`, `playerId`, `playerRole`
2. Joueur 1 partage le `gameCode` avec le joueur 2
3. Joueur 2 appelle `POST /api/games/join` avec le code → reçoit ses propres `sessionToken`, `playerId`, `playerRole`
4. Les deux joueurs se connectent au WebSocket et rejoignent la salle `game:<gameId>`

### Tour de jeu (alternance)

1. Le joueur dont c'est le tour voit la question et répond ou passe
2. L'appel `POST /api/games/:gameId/action` met à jour l'état côté serveur
3. Le serveur diffuse `game:state` aux deux joueurs via Socket.IO
4. Le joueur qui n'a pas répondu voit la réponse de l'autre + bouton "OK — Continuer"
5. Ce joueur clique OK → `POST /api/games/:gameId/confirm` → le serveur recharge et diffuse le nouvel état
6. Si c'est maintenant son tour, il voit sa question ; sinon il attend à nouveau

### Chat temps réel

1. Un joueur envoie `chat:send` avec le contenu du message
2. Le serveur valide, stocke en base, et diffuse `chat:message` aux deux joueurs
3. L'historique est récupéré via `chat:history` à la connexion

## Sécurité

- **CORS** : origine restrictive configurable (`CORS_ORIGIN`), pas de joker en production.
- **Rate limiting** : par IP sur les routes API, par socket sur les événements WebSocket.
- **JWT** : secret requis (≥ 32 caractères), expiration courte (24h recommandé).
- **Validation** : toutes les entrées validées avec Zod.
- **Autorisation** : chaque action vérifie que le joueur appartient à la partie et que c'est son tour.
- **HTTPS/WSS** : requis en production via proxy inversé (Nginx, Caddy, etc.).
- **Pas de données sensibles** : aucun email, mot de passe, ou identifiant persistant.

## PWA

- Manifeste d'application web (`manifest.webmanifest`)
- Service worker pour la mise en cache hors ligne
- Précache des ressources statiques
- Aucun endpoint API mis en cache par le service worker

## Déploiement

Voir `docs/DEPLOYMENT.md` pour la procédure complète.
