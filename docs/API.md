# API Reference — Entre Nous

Base URL : `https://api.votre-domaine.com` (production) ou `http://localhost:3000` (développement)

Toutes les routes nécessitent un jeton d'authentification JWT, transmis dans l'en-tête `Authorization: Bearer <token>`, sauf indication contraire.

## Authentification

Le jeton JWT est obtenu lors de la création ou de la jonction d'une partie. Il expire selon la configuration `JWT_EXPIRY` (défaut : 24 heures).

## Endpoints

### POST /api/games

Crée une nouvelle partie (premier joueur).

**Corps de la requête**
```json
{
  "firstName": "Alice",
  "lastName": "Martin",
  "categories": ["social", "personnel"],
  "adultConfirmed": false,
  "consentAccepted": false
}
```

**Réponse (201)**
```json
{
  "gameId": "abc123",
  "gameCode": "XK9M2P",
  "playerId": "p1",
  "playerRole": 1,
  "sessionToken": "eyJhbG...",
  "expiresAt": "2025-10-28T02:40:00.000Z"
}
```

### POST /api/games/join

Rejoint une partie existante (deuxième joueur).

**Corps de la requête**
```json
{
  "code": "XK9M2P",
  "firstName": "Bob",
  "lastName": "Dupont",
  "categories": ["profond", "amusant"],
  "adultConfirmed": false,
  "consentAccepted": false
}
```

**Réponse (200)**
```json
{
  "gameId": "abc123",
  "gameCode": "XK9M2P",
  "playerId": "p2",
  "playerRole": 2,
  "sessionToken": "eyJhbG...",
  "expiresAt": "2025-10-28T02:40:00.000Z"
}
```

### GET /api/games/:gameId/state

Récupère l'état actuel de la partie (question courante, tour, statut, joueurs).

**Réponse (200)**
```json
{
  "status": "active",
  "question": { "id": "q1", "prompt": "Quel est votre plus grand rêve ?" },
  "turn": 1,
  "total": 10,
  "activePlayerId": "p1"
}
```

### POST /api/games/:gameId/action

Soumet une réponse ou passe une question.

**Corps de la requête**
```json
{
  "kind": "answer",
  "questionId": "q1",
  "content": "Voyager autour du monde"
}
```
ou
```json
{
  "kind": "skip",
  "questionId": "q1"
}
```

**Réponse (200)** : même structure que `GET /state`.

### POST /api/games/:gameId/confirm

Confirme avoir vu la réponse de l'autre joueur. Recharge l'état et le diffuse aux deux joueurs via Socket.IO.

**Réponse (200)** : même structure que `GET /state`.

### GET /api/games/:gameId/responses

Récupère l'historique des questions et réponses déjà posées (jamais les questions futures).

**Réponse (200)**
```json
[
  {
    "id": "r1",
    "questionId": "q1",
    "playerId": "p1",
    "playerName": "Alice",
    "playerRole": 1,
    "kind": "answer",
    "text": "Voyager autour du monde",
    "createdAt": "2025-10-27T02:40:00.000Z"
  }
]
```

### GET /api/games/:gameId/lobby

Récupère l'état de la salle d'attente (polling de secours).

### GET /api/health

Vérifie la santé du serveur.

**Réponse (200)**
```json
{
  "status": "ok",
  "timestamp": "2025-10-27T02:40:00.000Z",
  "uptime": 12
}
```

## Événements Socket.IO

Le serveur expose un namespace Socket.IO sur la même URL que l'API.

### Connexion

Lors de la connexion, envoyer le jeton via `auth` :
```javascript
const socket = io(SOCKET_URL, { auth: { token: sessionToken } });
```

### Événements côté client → serveur

| Événement | Description |
|-----------|-------------|
| `game:join` | Rejoint la salle de la partie (nécessite un token valide) |
| `chat:send` | Envoie un message de chat (`{ content: "..." }`) |
| `game:action` | Soumet une réponse ou passe une question |

### Événements côté serveur → client

| Événement | Description |
|-----------|-------------|
| `game:state` | État actuel de la partie (diffusé aux deux joueurs) |
| `chat:history` | Historique des messages de la partie |
| `chat:message` | Nouveau message de chat |
| `chat:error` | Erreur d'envoi de message |
| `game:error` | Erreur d'action de jeu (403, 409, 410, 429, etc.) |
| `connect` / `disconnect` | État de la connexion socket |

## Codes d'erreur

| Code | Signification |
|------|---------------|
| 400 | Requête invalide (données manquantes ou malformées) |
| 401 | Session invalide ou expirée |
| 403 | Non autorisé pour cette partie/action |
| 409 | Conflit (partie déjà complète, mauvais tour, etc.) |
| 410 | Partie expirée ou terminée |
| 429 | Trop de requêtes (rate limiting) |
| 500 | Erreur interne du serveur |

## Sécurité

- **CORS** : configuré de manière restrictive via `CORS_ORIGIN`.
- **Rate limiting** : appliqué par IP sur les routes API et par socket sur les événements Socket.IO.
- **JWT** : secret requis (min. 32 caractères), expiration configurable.
- **Validation** : toutes les entrées sont validées avec Zod avant traitement.
