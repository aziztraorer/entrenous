# Cahier des charges — Entre Nous

## 1. Présentation du projet

Entre Nous est un jeu de conversation anonyme en temps réel entre deux personnes, conçu pour favoriser des échanges authentiques et profonds. Aucune inscription, aucun email, aucun mot de passe n'est requis. Une partie se joue à deux, avec un code d'invitation à 6 caractères partagé par le premier joueur.

## 2. Objectifs

- Permettre à deux personnes de converser de manière anonyme et éphémère
- Proposer des questions par catégorie, choisies par chaque joueur
- Garantir l'absence de répétition des questions pendant une partie
- Offrir un chat temps réel avec historique éphémère
- Assurer la suppression automatique des données après un délai configurable

## 3. Fonctionnalités

### 3.1 Gestion des parties

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| F1 | Création d'une partie par le premier joueur | Terminé | Oui |
| F2 | Génération d'un code d'invitation à 6 caractères | Terminé | Oui |
| F3 | Rejoindre une partie avec le code d'invitation | Terminé | Oui |
| F4 | Rejet d'un troisième joueur (partie complète) | Terminé | Oui |
| F5 | Expiration des parties inactives (24h par défaut) | Terminé | Oui |
| F6 | Suppression réelle des données expirées (cascade) | Terminé | Oui |

### 3.2 Questions et catégories

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| Q1 | Sélection indépendante des catégories par chaque joueur | Terminé | Oui |
| Q2 | Union des catégories choisies par les deux joueurs | Terminé | Oui |
| Q3 | Déduplication des questions (jamais répétées) | Terminé | Oui |
| Q4 | Absence de questions futures dans les réponses API | Terminé | Oui |
| Q5 | Alternance des tours | Terminé | Oui |
| Q6 | Confirmation mutuelle avant la question suivante | Terminé | Oui |
| Q7 | Refus d'une action du mauvais joueur | Terminé | Oui |

### 3.3 Catégories secrètes

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| S1 | Catégorie "intimité/érotique" réservée aux adultes (18+) | Terminé | Oui |
| S2 | Consentement explicite requis pour les catégories secrètes | Terminé | Oui |
| S3 | Exclusion de la catégorie si l'un des deux joueurs n'a pas consenti | Terminé | Oui |

### 3.4 Chat temps réel

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| C1 | Envoi et réception de messages en temps réel | Terminé | Oui |
| C2 | Historique des messages à la (re)connexion | Terminé | Oui |
| C3 | Purge automatique des messages > 24h | Planifié | Non |

### 3.5 Protection et limites

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| L1 | Protection contre les doubles clics (rate limiting socket) | Terminé | Oui |
| L2 | Rate limiting sur les routes API (par IP) | Terminé | Oui |
| L3 | Limite de longueur des réponses (5000 caractères max) | Terminé | Oui |
| L4 | Limite de longueur des messages de chat | Terminé | Oui |

### 3.6 Reconnexion

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| R1 | Rejoindre une partie en cours après déconnexion | Terminé | Oui |
| R2 | Récupération de l'état de la partie et de l'historique | Terminé | Oui |

### 3.7 Pages légales et navigation

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| P1 | Écran de fin de partie avec statistiques | Terminé | Oui |
| P2 | Page de règles du jeu | Terminé | Oui |
| P3 | Politique de confidentialité | Terminé | Oui |
| P4 | Conditions d'utilisation (page contact) | Terminé | Oui |
| P5 | Page de contact avec email à compléter | Terminé | Oui |
| P6 | Pied de page avec liens vers toutes les pages légales | Terminé | Oui |

### 3.8 PWA

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| W1 | Manifeste d'application web | Terminé | Oui |
| W2 | Service worker pour le cache hors ligne | Terminé | Oui |
| W3 | Installation sur écran d'accueil | Terminé | Oui |

### 3.9 Sécurité et confidentialité

| ID | Fonctionnalité | Statut | Testée |
|----|---------------|--------|--------|
| S1 | Validation des données côté serveur (Zod) | Terminé | Oui |
| S2 | Autorisation pour chaque route et événement Socket.IO | Terminé | Oui |
| S3 | Jetons d'invitation et sessions temporaires (JWT) | Terminé | Oui |
| S4 | CORS restrictif, HTTPS/WSS en production | Terminé | Oui |
| S5 | Variables d'environnement validées | Terminé | Oui |
| S6 | Gestionnaire d'erreurs centralisé, journaux structurés | Terminé | Oui |
| S7 | Politique de suppression des données documentée | Terminé | Oui |
| S8 | Absence de promesse de confidentialité absolue | Terminé | Oui |

## 4. Contraintes techniques

- Stack : Node.js, Fastify, Socket.IO, PostgreSQL, Prisma, Vue 3, Vite
- Aucun compte utilisateur, aucun email, aucun mot de passe
- Données stockées en base PostgreSQL, supprimées automatiquement après expiration
- Pas de tracking tiers
- Pas de promesse de confidentialité absolue

## 5. Non-fonctionnel

- **Performance** : temps de réponse API < 200ms, latence WebSocket < 100ms
- **Disponibilité** : le service doit être accessible 24/7 en production
- **Sécurité** : HTTPS/WSS obligatoires en production, CORS restrictif
- **Évolutivité** : architecture monorepo, séparation claire backend/frontend
- **Maintenabilité** : code typé TypeScript, documentation complète, tests automatisés

## 6. État d'avancement

Voir `docs/PROJECT_STATUS.md`.

## 7. Reste à faire avant mise en production

1. Choisir un nom de domaine et obtenir un certificat SSL/TLS
2. Configurer un proxy inversé (Nginx, Caddy, Traefik)
3. Définir les variables d'environnement de production
4. Tester le parcours complet à deux joueurs sur la même instance
5. Configurer les sauvegardes automatiques de la base de données
6. Valider les documents juridiques avec une personne compétente en droit
7. Configurer le monitoring et les alertes
