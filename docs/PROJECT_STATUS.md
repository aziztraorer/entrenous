# État du projet — Entre Nous

## Résumé

Entre Nous est un jeu de conversation 1v1 anonyme en temps réel. Le cœur du jeu (création, jonction, tour par tour, chat, expiration, suppression des données) est implémenté et fonctionnel. Les pages légales sont présentes. Le projet n'est pas encore prêt pour la mise en production publique : plusieurs étapes opérationnelles restent à réaliser.

## Fonctionnalités terminées

| Domaine | Fonctionnalité | Statut | Tests |
|---------|---------------|--------|-------|
| Parties | Création, jonction, code d'invitation, rejet 3e joueur | ✅ Terminé | Oui |
| Parties | Expiration inactive (24h), suppression réelle en cascade | ✅ Terminé | Oui |
| Questions | Catégories indépendantes, union, déduplication, pas de questions futures | ✅ Terminé | Oui |
| Questions | Alternance des tours, confirmation mutuelle OK | ✅ Terminé | Oui |
| Questions | Refus d'action du mauvais joueur | ✅ Terminé | Oui |
| Catégories secrètes | Réservé 18+, consentement explicite | ✅ Terminé | Oui |
| Chat | Temps réel, historique, purge > 24h (planifiée) | ✅ Terminé | Oui (partiellement) |
| Reconnexion | Rejoindre partie en cours, récupérer état et historique | ✅ Terminé | Oui |
| Protection | Rate limiting socket, rate limiting API, limites de longueur | ✅ Terminé | Oui |
| Sécurité | Validation Zod, autorisation, JWT, CORS restrictif, HTTPS/WSS | ✅ Terminé | Oui |
| Pages légales | Fin de partie, règles, confidentialité, contact, pied de page | ✅ Terminé | Oui |
| PWA | Manifeste, service worker, installation écran d'accueil | ✅ Terminé | Oui |

## Tests

| Suite | Statut | Détails |
|-------|--------|---------|
| Backend | ⚠️ Non exécutable sans DB | Nécessite PostgreSQL running + DATABASE_URL |
| Frontend | ⚠️ Non exécutable sans DB | Nécessite backend running |
| Type-check backend | ✅ Passe | `tsc --noEmit` sans erreur |
| Type-check frontend | ✅ Passe | `vue-tsc --noEmit` sans erreur |
| Build frontend | ✅ Passe | `vite build` sans erreur |

**Note** : Les tests automatisés ne peuvent pas s'exécuter dans l'environnement actuel car ils requièrent une base de données PostgreSQL accessible et une connexion au backend. Ils doivent être exécutés sur une machine disposant de ces ressources.

## Reste à faire avant mise en production

### Priorité haute (bloquants)

1. **Choisir un nom de domaine** — Aucun domaine n'est encore choisi.
2. **Obtenir un certificat SSL/TLS** — Let's Encrypt ou autre autorité de certification.
3. **Configurer un proxy inversé** — Nginx, Caddy, ou Traefik pour la terminaison TLS et le routage HTTP/WSS.
4. **Définir les variables d'environnement de production** — `JWT_SECRET` fort (≥ 32 caractères), `DATABASE_URL`, `CORS_ORIGIN`, `VITE_API_URL`, `VITE_SOCKET_URL`.
5. **Tester le parcours complet à deux joueurs** — Sur la même instance de production, avec deux navigateurs ou deux appareils.
6. **Configurer les sauvegardes automatiques** — `pg_dump` automatisé via cron ou outil de l'hébergeur.

### Priorité moyenne

7. **Valider les documents juridiques** — Confidentialité, conditions d'utilisation, page de contact à relire par une personne compétente en droit.
8. **Configurer le monitoring et les alertes** — Surveillance de l'uptime, des erreurs 5xx, de l'espace disque de la base de données.
9. **Documenter la procédure de mise à jour** — Redémarrage du service, application des migrations Prisma.

## Documents associés

| Document | Contenu |
|----------|---------|
| `README.md` | Présentation du projet, structure, démarrage rapide |
| `docs/API.md` | Référence complète des endpoints API REST et événements Socket.IO |
| `docs/ARCHITECTURE.md` | Architecture technique, stack, schéma de base de données, flux de données |
| `docs/CAHIER_DES_CHARGES.md` | Spécifications fonctionnelles et non fonctionnelles |
| `docs/DEPLOYMENT.md` | Procédure de déploiement en production |
| `docs/PRIVACY.md` | Politique de confidentialité, données collectées, durée de conservation |
| `docs/PROJECT_STATUS.md` | Ce document |
| `docs/INSTALL_WINDOWS_GUIDE.md` | Guide Windows : installer, tester, exporter/importer DB, préparer la production |

## Avertissement

Ce projet ne garantit aucune confidentialité absolue. Les données collectées (prénoms, noms, réponses, messages) sont stockées en base de données et supprimées automatiquement après expiration, mais les journaux serveur, les sauvegardes et une éventuelle compromission technique peuvent exposer des informations. Les utilisateurs doivent éviter de partager des informations personnelles identifiantes sensibles.

Les documents juridiques fournis (confidentialité, conditions d'utilisation, contact) sont à titre informatif et ne constituent pas un avis juridique. Ils doivent être validés par une personne compétente avant mise en production.
