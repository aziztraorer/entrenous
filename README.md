# Entre Nous — Jeu de conversation 1v1 anonyme

Entre Nous est une application de conversation anonyme en temps réel entre deux personnes, sans inscription, sans email, sans mot de passe. Chaque partie génère un code d'invitation à 6 caractères que le premier joueur partage avec le second. Les joueurs répondent tour à tour à des questions choisies par catégorie, avec confirmation mutuelle avant de passer à la question suivante.

## Démarrage rapide (Windows)

Consultez `docs/INSTALL_WINDOWS_GUIDE.md` pour une procédure pas à pas : installation, base de données PostgreSQL, variables d'environnement, tests, export/import de sauvegarde, et préparation à la mise en ligne.

## Structure du projet

```
entre-nous/
├── backend/              # API Fastify + Socket.IO + Prisma + PostgreSQL
│   ├── src/
│   │   ├── main.ts             # Point d'entrée serveur
│   │   ├── config/             # Configuration (env, CORS, helmet, logger)
│   │   ├── routes/             # Routes API REST
│   │   ├── services/           # Logique métier (jeu, questions, chat, temps réel)
│   │   ├── middleware/         # Gestionnaire d'erreurs
│   │   ├── database/           # Connexion Prisma
│   │   ├── data/               # Banque de questions
│   │   ├── types/              # Types TypeScript
│   │   └── utils/              # Utilitaires
│   ├── prisma/
│   │   └── schema.prisma       # Schéma base de données
│   ├── tests/                  # Tests automatisés
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── frontend/               # Application Vue 3 + Vite + PWA
│   ├── src/
│   │   ├── pages/              # Pages de l'application
│   │   ├── services/           # Appels API et Socket.IO
│   │   ├── stores/             # Gestion d'état (Pinia)
│   │   ├── router/             # Navigation
│   │   ├── types/              # Types TypeScript
│   │   ├── utils/              # Utilitaires
│   │   ├── App.vue
│   │   └── main.ts
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   └── tsconfig.json
└── docs/                     # Documentation
    ├── API.md
    ├── ARCHITECTURE.md
    ├── CAHIER_DES_CHARGES.md
    ├── DEPLOYMENT.md
    ├── PRIVACY.md
    ├── PROJECT_STATUS.md
    └── INSTALL_WINDOWS_GUIDE.md
```

## Fonctionnalités

### ✅ Terminées et testées
- Création et participation à une partie (code d'invitation à 6 caractères)
- Sélection indépendante des catégories par chaque joueur
- Union des catégories choisies par les deux joueurs
- Déduplication des questions (jamais répétées)
- Alternance des tours avec confirmation mutuelle (bouton "OK")
- Refus d'une action du mauvais joueur (autorisation côté serveur)
- Protection contre les doubles clics (rate limiting par socket)
- Chat temps réel avec historique
- Reconnexion à une partie en cours
- Expiration et suppression des parties inactives (défaut : 24 heures)
- Écran de fin de partie avec statistiques
- Page de règles, politique de confidentialité, conditions d'utilisation, contact
- Pied de page avec liens vers toutes les pages légales
- Rate limiting sur les routes API et les événements Socket.IO
- Validation des données côté serveur (schéma Zod)
- Journalisation structurée (Pino)
- Gestionnaire d'erreurs centralisé
- Politique de suppression des données (cascade Prisma)

### ⚠️ Partiellement testées (dépendent d'une base PostgreSQL)
- Connexion à la base de données PostgreSQL
- Migrations Prisma
- Purge automatique des messages de chat > 24h
- Nettoyage automatique des parties expirées

### 🔄 À faire avant mise en production
- Choisir et configurer un nom de domaine
- Obtenir un certificat SSL/TLS (Let's Encrypt ou autre)
- Configurer un proxy inversé (Nginx, Caddy, Traefik, etc.)
- Définir les variables d'environnement de production (JWT_SECRET fort, DATABASE_URL, CORS_ORIGIN, etc.)
- Tester le parcours complet avec deux joueurs sur la même instance
- Configurer les sauvegardes automatiques de la base de données
- Valider les documents juridiques (confidentialité, conditions d'utilisation, contact) avec une personne compétente en droit

## Documentation

| Document | Contenu |
|----------|---------|
| `docs/INSTALL_WINDOWS_GUIDE.md` | Guide complet Windows : installer, tester, exporter/importer DB, préparer la production |
| `docs/API.md` | Référence complète des endpoints API REST |
| `docs/ARCHITECTURE.md` | Architecture technique, choix de stack, diagrammes |
| `docs/CAHIER_DES_CHARGES.md` | Spécifications fonctionnelles et non fonctionnelles |
| `docs/PROJECT_STATUS.md` | État d'avancement, fonctionnalités testées, reste à faire |
| `docs/DEPLOYMENT.md` | Procédure de déploiement en production |
| `docs/PRIVACY.md` | Politique de confidentialité et durée de conservation des données |

## Licence

MIT
