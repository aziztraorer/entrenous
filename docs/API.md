# API Documentation - Entre Nous

## Base URL

```
Production: https://api.entrenous.app
Development: http://localhost:3000
```

## Authentication

**Schema** : Bearer Token (JWT)

```
Authorization: Bearer <token>
```

Tokens are generated automatically when creating/joining a game.

---

## HTTP REST Endpoints

### 1. Health Check

#### `GET /health`

Verify server is running.

**Response** (200 OK) :
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T11:30:00Z"
}
```

---

### 2. Games

#### `POST /games`

Create a new game.

**Request Body** :
```json
{}
```

**Response** (201 Created) :
```json
{
  "id": "game_abc123",
  "code": "ABC123",
  "status": "waiting",
  "createdAt": "2025-10-26T11:30:00Z",
  "expiresAt": "2025-10-27T11:30:00Z",
  "players": [],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors** :
- `500` : Server error

---

#### `GET /games/:gameId`

Get game information.

**Path Parameters** :
- `gameId` (string) : Game ID

**Headers** :
```
Authorization: Bearer <token>
```

**Response** (200 OK) :
```json
{
  "id": "game_abc123",
  "code": "ABC123",
  "status": "active",
  "createdAt": "2025-10-26T11:30:00Z",
  "players": [
    {
      "id": "player_1",
      "role": 1,
      "joinedAt": "2025-10-26T11:30:00Z"
    },
    {
      "id": "player_2",
      "role": 2,
      "joinedAt": "2025-10-26T11:32:00Z"
    }
  ],
  "currentChallenge": {
    "id": "ch_001",
    "type": "open_question",
    "prompt": "Describe your best memory...",
    "category": "personal"
  }
}
```

**Errors** :
- `401` : Unauthorized
- `404` : Game not found
- `410` : Game expired

---

#### `POST /games/:gameId/join`

Join an existing game.

**Path Parameters** :
- `gameId` (string) : Game ID or code

**Request Body** :
```json
{}
```

**Response** (200 OK) :
```json
{
  "id": "game_abc123",
  "code": "ABC123",
  "status": "active",
  "players": [
    { "id": "player_1", "role": 1 },
    { "id": "player_2", "role": 2 }
  ],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors** :
- `400` : Invalid code
- `404` : Game not found
- `409` : Game full (2 players already)
- `410` : Game expired

---

## WebSocket (Socket.IO) Events

### Connection

#### Client → Server: `connect`

Establish a WebSocket connection.

**Payload** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Game Management

#### Client → Server: `game:create`

Create a new game.

**Payload** :
```json
{}
```

**Server → Client: `game:created`**
```json
{
  "gameId": "game_abc123",
  "code": "ABC123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "playerId": "player_1"
}
```

---

#### Client → Server: `game:join`

Join a game.

**Payload** :
```json
{
  "code": "ABC123"
}
```

**Server → Client: `game:joined`**
```json
{
  "gameId": "game_abc123",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "playerId": "player_2",
  "role": 2
}
```

**Server → All: `game:playerJoined`** (broadcast to all sockets in this game)
```json
{
  "playerId": "player_2",
  "role": 2,
  "totalPlayers": 2
}
```

---

#### Server → Client: `game:started`

Game is ready to start (2 players connected).

**Payload** :
```json
{
  "gameId": "game_abc123",
  "firstChallenge": {
    "id": "ch_001",
    "type": "open_question",
    "prompt": "Describe your best memory in 3 sentences"
  }
}
```

---

#### Client → Server: `game:leave`

Leave the game (voluntarily).

**Payload** :
```json
{}
```

**Server → All: `game:playerLeft`** (broadcast)
```json
{
  "playerId": "player_1",
  "reason": "user_left"
}
```

---

#### Server → Client: `game:ended`

Game is terminated.

**Payload** :
```json
{
  "gameId": "game_abc123",
  "reason": "player_disconnected",
  "endedAt": "2025-10-26T11:45:00Z"
}
```

---

### Challenges & Responses

#### Server → Client: `challenge:new`

New challenge presented.

**Payload** :
```json
{
  "challengeId": "ch_002",
  "type": "open_question",
  "prompt": "What is your biggest dream?",
  "category": "personal",
  "timeLimit": null
}
```

---

#### Client → Server: `response:submit`

Submit a response to a challenge.

**Payload** :
```json
{
  "challengeId": "ch_002",
  "content": "My biggest dream is to travel the world."
}
```

**Server-side validation** :
- `content` : 1 to 5000 characters
- No HTML/JavaScript
- Rate limit: max 1 submission per 3 seconds

**Server → Client: `response:submitted`**
```json
{
  "status": "ok",
  "challengeId": "ch_002"
}
```

**Server → Other Player: `response:received`** (broadcast to other player)
```json
{
  "playerRole": 1,
  "hasResponded": true
}
```

**Errors** :
- `400` : Validation failed
- `429` : Rate limited

---

#### Client → Server: `challenge:ready`

Signal ready for next challenge.

**Payload** :
```json
{
  "challengeId": "ch_002"
}
```

**Server → All: `challenge:next`** (broadcast once both players ready)
```json
{
  "challengeId": "ch_003",
  "type": "mirror_question",
  "prompt": "List 3 qualities of your partner (guest)",
  "responses": [
    {
      "playerRole": 1,
      "content": "My dream is to explore..."
    },
    {
      "playerRole": 2,
      "content": "I want to become..."
    }
  ]
}
```

---

### Error Handling

#### Server → Client: `error`

General game error.

**Payload** :
```json
{
  "code": "GAME_ERROR",
  "message": "Error processing your response",
  "timestamp": "2025-10-26T11:45:00Z"
}
```

**Error Codes** :
| Code | Meaning |
|------|---------|
| `AUTH_FAILED` | Invalid token |
| `GAME_NOT_FOUND` | Game not found |
| `GAME_FULL` | Game full |
| `INVALID_CHALLENGE` | Invalid challenge |
| `VALIDATION_ERROR` | Invalid data |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Response Formats

### Challenge Object

```json
{
  "id": "ch_001",
  "type": "open_question|creative|quick|mirror",
  "prompt": "Describe your best memory...",
  "category": "social|personal|fun|deep",
  "timeLimit": 300000,
  "active": true
}
```

### Player Object

```json
{
  "id": "player_abc",
  "role": 1|2,
  "joinedAt": "2025-10-26T11:30:00Z",
  "lastActivity": "2025-10-26T11:35:00Z"
}
```

### Response Object

```json
{
  "id": "res_001",
  "challengeId": "ch_001",
  "playerRole": 1,
  "content": "My best memory is...",
  "createdAt": "2025-10-26T11:35:00Z"
}
```

### Game Object

```json
{
  "id": "game_abc123",
  "code": "ABC123",
  "status": "waiting|active|ended",
  "createdAt": "2025-10-26T11:30:00Z",
  "expiresAt": "2025-10-27T11:30:00Z",
  "players": [Player, Player],
  "currentChallenge": Challenge,
  "responses": [Response]
}
```

---

## Rate Limiting

Per-player limits :
- **Create game** : 10 per hour
- **Submit response** : 1 per 3 seconds
- **Global events** : 1000 per minute

**Response** (429 Too Many Requests) :
```json
{
  "error": "rate_limited",
  "retryAfter": 60
}
```

---

## CORS Policy

```
Allowed Origins:
  - http://localhost:3000
  - http://localhost:5173
  - https://entrenous.app
  - https://www.entrenous.app

Allowed Methods:
  - GET
  - POST
  - OPTIONS

Allowed Headers:
  - Content-Type
  - Authorization

Credentials: true
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request |
| `401` | Unauthorized |
| `404` | Not Found |
| `409` | Conflict |
| `410` | Gone (game expired) |
| `429` | Too Many Requests |
| `500` | Internal Server Error |
| `503` | Service Unavailable |

---

## Versioning

API Version: **v1**

Future versions will be prefixed: `/api/v2/...`
