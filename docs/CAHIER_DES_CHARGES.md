# Cahier des Charges - Entre Nous

## 1. Vue d'ensemble

**Entre Nous** est un jeu de conversation en temps réel permettant à deux joueurs de se rencontrer anonymement via un lien d'invitation unique et de participer à des défis conversationnels.

### Objectif
Créer une plateforme légère, intuitive et engageante pour des conversations guidées entre deux personnes, sans création de compte ni données persistantes.

## 2. Fonctionnalités principales

### 2.1 Démarrage d'une partie
- **Créer une partie** : Un joueur clique sur "Commencer un jeu" → système génère un lien d'invitation unique
- **Rejoindre une partie** : Un second joueur accède au lien → rejoint automatiquement la partie
- **Attente** : Le premier joueur voit un écran d'attente jusqu'à l'arrivée du second joueur
- **Démarrage automatique** : Une fois les deux joueurs connectés, la partie commence

### 2.2 Gameplay
- **Défis conversationnels** : Le système propose des questions/défis alternatifs aux deux joueurs
- **Saisie de réponses** : Chaque joueur rentre sa réponse dans un champ texte
- **Affichage des réponses** : Après validation, les deux réponses sont affichées côte à côte
- **Notation (optionnel)** : Les joueurs peuvent évaluer les réponses (emoji, likes, etc.)
- **Progression** : Bouton "Défi suivant" pour passer au défis suivant

### 2.3 Communication en temps réel
- **Socket.IO** pour la synchronisation bidirectionnelle
- **Événements temps réel** : Les actions d'un joueur sont visibles instantanément chez l'autre
- **Typing indicator (optionnel)** : Afficher quand l'autre joueur tape
- **Notifications** : Alerte quand un joueur répond, vient de rejoindre, etc.

### 2.4 Gestion de session
- **Anonymité** : Aucun compte utilisateur, aucune identification personnelle requise
- **Durée de vie** : Une partie existe tant que les deux joueurs sont connectés
- **Déconnexion** : Si un joueur quitte, la partie est annulée
- **Historique** : Pas de sauvegarde de l'historique (données éphémères)
- **Cookies/Session** : Utiliser des sessions côté serveur (basées sur JWT ou session tokens)

### 2.5 Interface utilisateur
- **Mobile-first** : Design responsive, optimisé pour les petits écrans
- **Dark mode** : Support du thème sombre
- **Accessibilité** : WCAG 2.1 niveau AA minimum
- **PWA** : Installer comme application sur mobile/desktop
- **Offline ready** : Affichage d'un message si la connexion est perdue

## 3. Règles du jeu

### Règles de base
1. Deux joueurs seulement par partie
2. Les défis alternent entre les joueurs (Joueur 1 → Joueur 2 → Joueur 1, etc.)
3. Chaque réponse doit être validée avant de voir la prochaine étape
4. Temps limite optionnel par réponse (ex: 5 min)
5. Aucun retour en arrière (pas de relecture des réponses précédentes)

### Types de défis
- **Questions ouvertes** : "Décrivez votre plus beau souvenir en 3 phrases"
- **Défis créatifs** : "Inventer une histoire basée sur ces 3 mots..."
- **Défis rapides** : "Choisissez entre A ou B et justifiez en 1 phrase"
- **Défis mirroir** : Les deux joueurs répondent à la même question, puis comparent

### Modération
- **Signalement** : Bouton pour signaler un contenu inapproprié
- **Filtrage basique** : Détection de contenu explicite (listes noires de mots clés)
- **Pas de suppression automatique** : Simple alerte visuelle

## 4. Expérience utilisateur

### Flux utilisateur

#### Phase 1 : Démarrage
```
Visiteur → Cliquer "Commencer" → Créer partie → Afficher lien + écran d'attente
```

#### Phase 2 : Rejoindre
```
Visiteur avec lien → Accès direct → Rejoindre partie → Écran de connexion établie
```

#### Phase 3 : Jeu
```
Les deux joueurs → Voir défi → Saisir réponse → Valider → Voir réponses côte à côte → "Défi suivant"
```

#### Phase 4 : Fin
```
Fin de partie (déconnexion ou limite atteinte) → Récapitulatif optionnel → Proposer nouveau jeu
```

### Pages principales
1. **Accueil** (`/`) - Bouton "Commencer" + Accès par code
2. **Création** (`/create`) - Génération du lien
3. **Attente** (`/wait/:gameId`) - Écran d'attente avant le démarrage
4. **Jeu** (`/game/:gameId`) - Interface principale de gameplay
5. **Fin** (`/end/:gameId`) - Résumé optionnel

## 5. Architecture technique

### 5.1 Frontend
- **Vue 3 + TypeScript** : Composants réactifs
- **Vite** : Bundling ultra-rapide
- **Pinia** : Gestion d'état simple (game store, ui store)
- **Socket.IO Client** : Synchronisation en temps réel
- **Tailwind CSS** : Styles utilitaires
- **Vue Router** : Navigation entre pages

### 5.2 Backend
- **Fastify** : Serveur HTTP performant et léger
- **Socket.IO** : Gestion des connexions WebSocket
- **Prisma** : ORM avec migrations de schéma
- **PostgreSQL** : Base de données relationnelle
- **JWT/Sessions** : Authentification sans compte permanent

### 5.3 Base de données
Schéma minimaliste :
```
- games (id, gameCode, status, createdAt, expiresAt)
- players (id, gameId, joinedAt, lastActivity)
- responses (id, gameId, playerId, challengeId, content, createdAt)
- challenges (id, type, prompt, category, active)
```

## 6. Sécurité

### 6.1 Validations
- **Longueur des entrées** : Max 5000 caractères par réponse
- **Rate limiting** : Max 1 réponse par 3 secondes par joueur
- **Validation côté serveur** : Toutes les entrées validées

### 6.2 Privacité
- **Aucun stockage persistant** : Les parties sont effacées après 24h
- **Pas de tracking** : Aucun cookie de suivi (sauf session)
- **Pas de partage de données** : Les données restent entre les deux joueurs
- **HTTPS obligatoire** : Chiffrement des communications

### 6.3 Protection
- **CORS** : Configurer strictement les origines autorisées
- **Sanitization** : Nettoyer les entrées HTML/JS
- **SQL Injection** : Prisma + parameterized queries
- **DDoS basique** : Rate limiting global

## 7. Performance

### Cibles
- **Temps de chargement** : < 3 secondes (Mobile 4G)
- **Time to Interactive** : < 5 secondes
- **Bundle size** : < 500 KB (gzippé)
- **Latence Socket.IO** : < 200 ms

### Optimisations
- Lazy loading des composants
- Compression Gzip/Brotli
- Caching des assets statiques
- Pagination des défis
- Connection pooling PostgreSQL

## 8. Accessibilité (WCAG 2.1 AA)

- [ ] Contrastes suffisants (4.5:1 pour texte)
- [ ] Navigation au clavier complète
- [ ] Labels explicites pour les inputs
- [ ] Textes alternatifs pour les images
- [ ] Support des lecteurs d'écran
- [ ] Notifications accessibles

## 9. Limitations et non-fonctionnalités

❌ **Pas de** :
- Comptes utilisateurs permanents
- Historique de parties sauvegardé
- Système de points/classement
- Personnalisation d'avatar/pseudonyme
- Partage direct de contenu
- Notifications push
- Modes multi-joueurs (> 2)
- Monétisation / Paiements

## 10. Itérations futures (Scope 2)

- [ ] Défis personnalisés (créer vos propres questions)
- [ ] Choix de catégories avant de démarrer
- [ ] Thème coloré de la partie
- [ ] Export de la conversation (PDF)
- [ ] Partage anonyme d'un résumé
- [ ] Intégration avec réseaux sociaux (partager le lien)
- [ ] Notifications push de rejoindre

## 11. Définition de terminé (DoD)

Une étape est "terminée" quand :
- [ ] Code écrit et commité
- [ ] Tests passent (unitaires + intégration)
- [ ] Documentation mise à jour
- [ ] Pas d'erreurs dans la console (browser & server)
- [ ] `PROJECT_STATUS.md` mis à jour
- [ ] La fonctionnalité peut être démontrée
