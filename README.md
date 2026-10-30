# Entre Nous

Un jeu de conversation en temps réel entre deux personnes qui se rejoignent via un lien d'invitation unique.

## Présentation du projet

**Entre Nous** est une application web permettant à deux utilisateurs de participer à un jeu de conversation sans créer de compte. Les joueurs se rejoignent via un lien d'invitation unique et engagent une conversation basée sur des défis, des questions ou des thèmes proposés par le système.

### Caractéristiques principales

- ✅ Jeu de conversation 1v1 sans inscription
- ✅ Rejoindre via lien d'invitation
- ✅ Communication en temps réel (Socket.IO)
- ✅ Pas de comptes persistants
- ✅ Pas de paiement
- ✅ Pas de classement
- ✅ Progressive Web App (PWA)
- ✅ Responsive design (mobile & desktop)

## Stack technologique

### Frontend
- **Vue 3** avec TypeScript strict
- **Vite** (bundler)
- **Tailwind CSS** (styles)
- **Vue Router** (navigation)
- **Pinia** (state management)
- **Axios** (HTTP client)
- **Socket.IO Client** (temps réel)
- **PWA** (Progressive Web App)

### Backend
- **Node.js** avec TypeScript
- **Fastify** (framework web)
- **Socket.IO** (WebSocket)
- **PostgreSQL** (base de données)
- **Prisma** (ORM)

### Tests & Qualité
- **Vitest** (tests unitaires et intégration)
- **ESLint & Prettier** (linting & formatting)
- **Git** (versionnement)

## Structure du projet

```
entre-nous/
├── frontend/                 # Application Vue 3
│   ├── src/
│   │   ├── components/      # Composants Vue
│   │   ├── pages/           # Pages (vues)
│   │   ├── stores/          # Pinia stores
│   │   ├── services/        # Services (API, Socket.IO)
│   │   ├── types/           # Types TypeScript
│   │   ├── utils/           # Fonctions utilitaires
│   │   └── App.vue          # Composant principal
│   ├── public/              # Fichiers statiques
│   ├── vite.config.ts       # Configuration Vite
│   ├── tsconfig.json        # Configuration TypeScript
│   └── package.json
│
├── backend/                  # Serveur Fastify + Socket.IO
│   ├── src/
│   │   ├── routes/          # Routes API
│   │   ├── handlers/        # Handlers Socket.IO
│   │   ├── services/        # Logique métier
│   │   ├── types/           # Types TypeScript
│   │   ├── middleware/      # Middlewares Fastify
│   │   ├── config/          # Configuration
│   │   └── main.ts          # Point d'entrée
│   ├── prisma/
│   │   └── schema.prisma    # Schéma de la base de données
│   ├── .env.example         # Variables d'environnement exemple
│   └── package.json
│
├── docs/                     # Documentation
│   ├── CAHIER_DES_CHARGES.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── PROJECT_STATUS.md
│
├── README.md
├── .gitignore
└── .env.example
```

## Mise en route

### Prérequis
- **Node.js** 18+ ou 20+
- **PostgreSQL** 14+
- **Git**

### Installation (à venir)

Documentation complète dans `docs/PROJECT_STATUS.md`

## Documentation

- **[Cahier des charges](docs/CAHIER_DES_CHARGES.md)** - Fonctionnalités et règles du jeu
- **[Architecture](docs/ARCHITECTURE.md)** - Structure technique et patterns
- **[API](docs/API.md)** - Routes et endpoints
- **[Status du projet](docs/PROJECT_STATUS.md)** - Progression et tâches

## Conventions de code

- ✅ TypeScript strict obligatoire
- ✅ Pas de JavaScript dans le code applicatif
- ✅ Noms explicites (français autorisé dans les commentaires)
- ✅ Tests pour les fonctionnalités critiques
- ✅ Aucun secret dans le dépôt (.env dans .gitignore)

## Contributions

Ce projet est développé par un développeur full-stack débutant sur Windows pour optimiser l'utilisation des crédits Claude.

**Principe** : Développer étape par étape, valider chaque étape avant de continuer.

## Licence

À définir
