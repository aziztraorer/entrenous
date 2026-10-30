# Politique de confidentialité - Entre Nous

**Dernière mise à jour** : 30 octobre 2026

## Principe

Entre Nous est un jeu de conversation anonyme entre deux personnes, sans inscription. **Aucune promesse de confidentialité absolue n'est faite.** Cette politique décrit les données collectées, leur durée de conservation et leur suppression.

## Données collectées

### Données saisies par les joueurs
- **Prénoms et noms** : Saisis à la création/rejoindre d'une partie (stockés dans `Player` avec `firstName`, `lastName`). Ces données sont visibles uniquement aux deux participants de la partie pendant celle-ci.
- **Catégories de questions choisies** : Stockées par joueur (`Player.categories` au format JSON). Catégories "intimité/érotique" nécessitent une déclaration d'âge (18+) et un consentement explicite (`adultConsent`).
- **Réponses aux questions** : Stockées dans `Response` (contenu JSON avec `kind` et `text`). 
- **Messages de chat** : Stockés dans `ChatMessage` avec contenu, horodatage et lien vers joueur/partie.

### Données techniques
- **Identifiants de session** : Jetons JWT temporaires (`sessionToken`) pour authentifier les joueurs aux parties. 
- **Codes d'invitation** : Codes à 6 caractères générés de manière cryptographiquement aléatoire.
- **Métadonnées de partie** : `Game` (statut, dates de création/expiration, état du moteur de questions).
- **Adresses IP / logs serveur** : Les journaux du serveur (pino) peuvent contenir des adresses IP, URLs, codes HTTP et erreurs. Ces logs ne doivent pas contenir de contenu de messages/réponses complets quand évitable.

## Durée de conservation

| Donnée | Durée de conservation | Suppression |
|--------|----------------------|-------------|
| **Parties expirées/inactives** | Configurable via `GAME_INACTIVE_TIMEOUT_HOURS` (défaut : 24 heures). L'expiration est basée sur **l'inactivité** (dernière activité du joueur/partie). | Suppression **réelle** automatique via tâche de nettoyage. Les parties **actives** ne sont **pas** supprimées uniquement parce qu'une tâche de nettoyage s'exécute. |
| **Messages de chat** | 24 heures maximum. | Purge automatique toutes les 30 minutes des messages créés il y a plus de 24h. |
| **Réponses aux questions** | Liées à la partie. Supprimées en cascade lors de la suppression de la partie. | Suppression en cascade. |
| **Sessions JWT** | Configurables via `JWT_EXPIRY` (recommandé : court, ex. 24h). | Expirent automatiquement selon la durée du jeton. |
| **Codes d'invitation** | Valides jusqu'à expiration de la partie. | Supprimés avec la partie. |

## Suppression des données

- **Suppression en cascade** : `Game` a `onDelete: Cascade` vers `Player`, `Response`, `ChatMessage`. La suppression d'une partie supprime réellement toutes les données associées.
- **Nettoyage périodique** : 
  - `ChatService.purgeOld()` s'exécute au démarrage et toutes les 30 minutes pour supprimer les messages > 24h
  - `GameService.cleanupExpiredGames()` s'exécute toutes les heures pour supprimer les parties inactives expirées selon la politique d'inactivité
- **Pas de suppression des parties actives** : Une partie en cours (`status: active` avec joueurs connectés) n'est supprimée que si elle est considérée comme **inactive** selon le délai d'inactivité configuré ET ne répond pas aux critères d'activité. La logique de nettoyage doit explicitement vérifier l'inactivité (dernière activité) et ne pas supprimer des parties actives uniquement sur un déclenchement de tâche.

## Sécurité

- **Pas de comptes** : Aucune adresse email, mot de passe ou identifiant persistant.
- **Données minimales** : Seuls prénom/nom, catégories choisies, réponses et messages sont stockés.
- **Catégories sensibles** : La catégorie "intimité/érotique" est réservée aux adultes ayant déclaré être majeurs et avoir donné un consentement explicite.
- **Pas de partage** : Les données ne sont pas partagées avec des tiers (pas de tracking tiers identifié dans le code).
- **Transmission** : En production, HTTPS/WSS doivent être utilisés. CORS est configuré de manière restrictive.
- **Limites** : Rate limiting sur les routes API et limites sur les messages de chat.

## Absence de confidentialité absolue

**Malgré les mesures ci-dessus, aucune garantie de confidentialité absolue ne peut être donnée.** Les journaux serveur, la configuration d'hébergement, d'éventuelles sauvegardes de base de données ou une compromission technique peuvent exposer des données. Les utilisateurs doivent éviter de partager d'informations personnelles identifiantes sensibles dans les réponses ou messages.

## Contact / Questions

Pour toute question concernant cette politique, se référer à la documentation du projet.
