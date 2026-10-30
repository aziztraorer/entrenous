# Architecture - Entre Nous

## 1. Vue d'ensemble architecturale

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│                    Vue 3 + TypeScript + PWA                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Components │ Pages │ Stores (Pinia) │ Services        │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│           HTTP (REST) + WebSocket (Socket.IO)                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   Server (Backend)                           │
│              Fastify + Node.js + TypeScript                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Routes │ Socket Handlers │ Services │ Middleware     │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓                                   │
│                 Prisma ORM + PostgreSQL                      │
└─────────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture

### 2.1 Structure des dossiers

```
frontend/src/
├── pages/                  # Pages (routed)
│   ├── HomePage.vue       # Page d'accueil
│   ├── CreateGamePage.vue # Création de partie
│   ├── WaitPage.vue       # Attente du second joueur
│   ├── GamePage.vue       # Interface de jeu
│   └── EndGamePage.vue    # Fin de partie
│
├── components/             # Composants réutilisables
│   ├── GameChallenge.vue  # Affichage du défi
│   ├── ResponseForm.vue   # Formulaire de réponse
│   ├── ResponseDisplay.vue # Affichage côte à côte
│   ├── GameHeader.vue     # En-tête de la partie
│   ├── PlayerIndicator.vue # Indicateur du joueur actif
│   └── ErrorBoundary.vue  # Gestion des erreurs
│
├── stores/                 # Pinia stores
│   ├── gameStore.ts       # État du jeu
│   ├── uiStore.ts         # État UI (modal, notifications)
│   └── playerStore.ts     # Données du joueur local
│
├── services/               # Services (API, Socket.IO)
│   ├── api.ts             # Client Axios
│   ├── socketService.ts   # Gestion Socket.IO
│   ├── gameService.ts     # Logique métier du jeu
│   └── storageService.ts  # LocalStorage
│
├── types/                  # Types TypeScript
│   ├── game.ts            # Types Game, Challenge, Response
│   ├── player.ts          # Types Player
│   └── events.ts          # Types Socket.IO events
│
├── utils/                  # Utilitaires
│   ├── validators.ts      # Validations
│   ├── formatters.ts      # Formatage (dates, textes)
│   └── constants.ts       # Constantes (timeouts, limites)
│
├── router/
│   └── index.ts           # Configuration Vue Router
│
├── styles/
│   └── globals.css        # Styles globaux + Tailwind
│
├── App.vue                # Composant root
└── main.ts                # Point d'entrée
```

### 2.2 Flux de données (Pinia)

```
Component
   ↓
Dispatch Action (gameStore)
   ↓
Mutation (Update State)
   ↓
Computed (Selector)
   ↓
Component (Re-render)
```

### 2.3 Communication Socket.IO

**Événements Client → Server** :
- `game:create` - Créer une partie
- `game:join` - Rejoindre une partie
- `response:submit` - Soumettre une réponse
- `challenge:ready` - Prêt pour le défi suivant
- `game:leave` - Quitter la partie

**Événements Server → Client** :
- `game:created` - Partie créée (envoyer le code)
- `game:playerJoined` - Joueur a rejoint
- `game:started` - Partie commencée
- `challenge:new` - Nouveau défi envoyé
- `response:received` - Réponse reçue (de l'autre joueur)
- `game:ended` - Partie terminée
- `game:error` - Erreur dans la partie

## 3. Backend Architecture

### 3.1 Structure des dossiers

```
backend/src/
├── routes/                 # Routes HTTP (Fastify)
│   ├── game.routes.ts     # POST /games, GET /games/:id
│   ├── health.routes.ts   # GET /health (liveness check)
│   └── index.ts           # Enregistrement des routes
│
├── handlers/               # Handlers Socket.IO
│   ├── gameHandlers.ts    # Création, rejoindre, quitter
│   ├── responseHandlers.ts # Soumission de réponses
│   ├── challengeHandlers.ts # Défis suivants
│   └── index.ts           # Enregistrement des handlers
│
├── services/               # Logique métier
│   ├── GameService.ts     # Gestion des parties
│   ├── PlayerService.ts   # Gestion des joueurs
│   ├── ChallengeService.ts # Sélection des défis
│   ├── ResponseService.ts # Validation des réponses
│   └── CodeGenerator.ts   # Génération codes 6 chiffres
│
├── middleware/             # Middlewares Fastify
│   ├── auth.middleware.ts  # Vérification JWT/session
│   ├── validation.middleware.ts # Validation requêtes
│   ├── cors.middleware.ts  # CORS config
│   └── error.middleware.ts # Gestion erreurs
│
├── database/
│   ├── prisma.ts          # Instance Prisma
│   └── seed.ts            # Données initiales (challenges)
│
├── types/                  # Types TypeScript
│   ├── game.ts
│   ├── player.ts
│   ├── challenge.ts
│   └── response.ts
│
├── utils/                  # Utilitaires
│   ├── validators.ts
│   ├── logger.ts
│   └── constants.ts
│
├── config/
│   ├── env.ts             # Variables d'environnement
│   └── cors.ts            # Configuration CORS
│
└── main.ts                # Point d'entrée (Fastify + Socket.IO)
```

### 3.2 Pattern : Service Layer

Chaque Service gère une entité métier :

```typescript
// GameService
class GameService {
  async createGame(): Promise<Game>
  async getGame(gameId: string): Promise<Game>
  async joinGame(gameId: string, playerId: string): Promise<Game>
  async endGame(gameId: string): Promise<void>
  async getExpiredGames(): Promise<Game[]>
  async deleteGame(gameId: string): Promise<void>
}
```

### 3.3 Architecture Socket.IO

```
Server (Fastify)
    ↓
Socket.IO Instance
    ↓
Rooms (one per game)
    ↓
Event Handlers (registered in /handlers)
    ↓
Services (business logic)
    ↓
Prisma (database)
```

## 4. Database Schema (Prisma)

```prisma
model Game {
  id        String    @id @default(cuid())
  code      String    @unique @db.Char(6)
  status    String    // 'waiting' | 'active' | 'ended'
  createdAt DateTime  @default(now())
  expiresAt DateTime  // 24 hours from creation
  players   Player[]
  responses Response[]
}

model Player {
  id        String   @id @default(cuid())
  gameId    String
  game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  role      Int      // 1 ou 2
  joinedAt  DateTime @default(now())
  responses Response[]
  @@unique([gameId, role])
}

model Response {
  id          String    @id @default(cuid())
  gameId      String
  game        Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  playerId    String
  player      Player    @relation(fields: [playerId], references: [id], onDelete: Cascade)
  challengeId String
  content     String    @db.VarChar(5000)
  createdAt   DateTime  @default(now())
}

model Challenge {
  id       String @id @default(cuid())
  type     String // 'open_question' | 'creative' | 'quick' | 'mirror'
  prompt   String
  category String // 'social' | 'personal' | 'fun' | 'deep'
  active   Boolean @default(true)
}
```

## 5. Communication Frontend ↔ Backend

### 5.1 REST Endpoints

```
POST   /games                 → Créer une partie
GET    /games/:gameId         → Récupérer info partie
POST   /games/:gameId/join    → Rejoindre une partie
GET    /health                → Vérifier santé serveur
```

### 5.2 Socket.IO Events

Voir section 2.3 Frontend

## 6. Sécurité

### 6.1 Authentication Flow

```
1. Client se connecte via Socket.IO (pas d'auth au démarrage)
2. Après création/rejoindre, Server envoie JWT (token)
3. Client stocke en sessionStorage (pas localStorage = pas de leak)
4. Client envoie token dans les subsequent emissions
5. Middleware vérifie token avant de traiter l'événement
```

### 6.2 Validation

**Côté Client** :
- Max 5000 caractères
- Non-vide
- Pas de HTML/JS

**Côté Serveur** (toujours) :
- Valider longueur
- Sanitizer HTML
- Vérifier game ID
- Vérifier player ID
- Rate limiting par player

## 7. Testing Strategy

### Frontend (Vitest + Vue Test Utils)

```typescript
// GamePage.spec.ts
import { mount } from '@vue/test-utils'
import GamePage from '@/pages/GamePage.vue'

it('displays challenge', async () => {
  const wrapper = mount(GamePage)
  expect(wrapper.find('.challenge').exists()).toBe(true)
})
```

### Backend (Vitest + Supertest)

```typescript
// game.routes.spec.ts
import request from 'supertest'
import { app } from '@/main'

it('POST /games creates a game', async () => {
  const res = await request(app)
    .post('/games')
    .expect(201)
  expect(res.body).toHaveProperty('code')
})
```

## 8. Performance Targets

- **Temps de chargement** : < 3 secondes (Mobile 4G)
- **Time to Interactive** : < 5 secondes
- **Bundle size** : < 500 KB (gzippé)
- **Latence Socket.IO** : < 200 ms

## 9. Deployment Architecture

```
┌──────────────────┐
│   GitHub Repo    │
│  (Code + Docs)   │
└────────┬─────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  CI/CD Pipeline (GitHub Actions)         │
│  - Run tests                             │
│  - Build frontend                        │
│  - Build backend                         │
│  - Push to registry                      │
└────────┬─────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  Docker Containers                       │
│  - Frontend (nginx)                      │
│  - Backend (node)                        │
│  - PostgreSQL                            │
└────────┬─────────────────────────────────┘
         │
         ↓
┌──────────────────────────────────────────┐
│  Hosting (Heroku / AWS / VPS)            │
└──────────────────────────────────────────┘
```
