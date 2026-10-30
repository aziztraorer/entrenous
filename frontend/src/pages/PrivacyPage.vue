<template>
  <div class="legal-page">
    <header class="page-header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Politique de confidentialité</h1>
      <p class="last-updated">Dernière mise à jour : 30 octobre 2026</p>
    </header>

    <main class="content">
      <section class="section principle">
        <h2>Principe</h2>
        <p>
          Entre Nous est un jeu de conversation anonyme entre deux personnes, <strong>sans inscription</strong>.
          <strong>Aucune promesse de confidentialité absolue n’est faite.</strong> Cette page décrit les données collectées, leur durée de conservation et leur suppression. Elle n’est pas un document juridique et peut nécessiter une validation humaine avant mise en production.
        </p>
      </section>

      <section class="section">
        <h2>Données collectées</h2>
        <h3>Saisies par les joueurs</h3>
        <ul>
          <li><strong>Prénoms et noms :</strong> saisis à la création ou à la joindre d’une partie. Visibles uniquement aux deux participants pendant celle-ci.</li>
          <li><strong>Catégories de questions choisies :</strong> stockées par joueur. La catégorie « intimité/érotique » nécessite une déclaration d’âge (18+) et un consentement explicite.</li>
          <li><strong>Réponses aux questions :</strong> stockées avec leur contenu.</li>
          <li><strong>Messages de chat :</strong> stockés avec contenu, horodatage et lien vers le joueur et la partie.</li>
        </ul>
        <h3>Données techniques</h3>
        <ul>
          <li><strong>Jetons de session :</strong> jetons JWT temporaires pour authentifier les joueurs.</li>
          <li><strong>Codes d’invitation :</strong> codes à 6 caractères générés de manière aléatoire.</li>
          <li><strong>Métadonnées de partie :</strong> statut, dates de création et d’expiration, état du moteur de questions.</li>
          <li><strong>Adresses IP / logs serveur :</strong> les journaux du serveur peuvent contenir des adresses IP, URLs, codes HTTP et erreurs. Le contenu des messages et réponses n’est pas journalisé quand cela est évitable.</li>
        </ul>
      </section>

      <section class="section">
        <h2>Durée de conservation</h2>
        <table class="retention-table">
          <thead>
            <tr><th>Donnée</th><th>Durée</th><th>Suppression</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Parties expirées / inactives</td>
              <td>Configurable (défaut : 24 heures d’inactivité)</td>
              <td>Suppression automatique par tâche de nettoyage. Les parties actives ne sont pas supprimées uniquement parce qu’une tâche s’exécute.</td>
            </tr>
            <tr>
              <td>Messages de chat</td>
              <td>24 heures maximum</td>
              <td>Purge automatique toutes les 30 minutes des messages de plus de 24h.</td>
            </tr>
            <tr>
              <td>Réponses aux questions</td>
              <td>Liées à la partie</td>
              <td>Supprimées en cascade avec la partie.</td>
            </tr>
            <tr>
              <td>Sessions JWT</td>
              <td>Configurable (recommandé : court, ex. 24h)</td>
              <td>Expirent automatiquement selon la durée du jeton.</td>
            </tr>
            <tr>
              <td>Codes d’invitation</td>
              <td>Jusqu’à expiration de la partie</td>
              <td>Supprimés avec la partie.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="section">
        <h2>Suppression des données</h2>
        <ul>
          <li><strong>Suppression en cascade :</strong> la suppression d’une partie supprime réellement toutes les données associées (joueurs, réponses, messages).</li>
          <li><strong>Nettoyage périodique :</strong> les parties inactives expirées et les messages de plus de 24h sont supprimés automatiquement.</li>
          <li><strong>Pas de suppression des parties actives :</strong> une partie en cours n’est supprimée que si elle est considérée comme inactive selon le délai configuré.</li>
        </ul>
      </section>

      <section class="section">
        <h2>Sécurité</h2>
        <ul>
          <li><strong>Pas de comptes :</strong> aucune adresse email, mot de passe ou identifiant persistant.</li>
          <li><strong>Données minimales :</strong> seulement prénom/nom, catégories choisies, réponses et messages sont stockés.</li>
          <li><strong>Catégories sensibles :</strong> la catégorie « intimité/érotique » est réservée aux adultes ayant donné un consentement explicite.</li>
          <li><strong>Pas de partage :</strong> les données ne sont pas partagées avec des tiers (aucun tracking tiers identifié dans le code).</li>
          <li><strong>Transmission :</strong> en production, HTTPS/WSS doivent être utilisés. CORS est configuré de manière restrictive.</li>
          <li><strong>Limites :</strong> rate limiting sur les routes API et limites sur les messages de chat.</li>
        </ul>
      </section>

      <section class="section legal-disclaimer">
        <h2>Absence de confidentialité absolue</h2>
        <p>
          Malgré les mesures ci-dessus, <strong>aucune garantie de confidentialité absolue ne peut être donnée.</strong> Les journaux serveur, la configuration d’hébergement, d’éventuelles sauvegardes de base de données ou une compromission technique peuvent exposer des données. Les utilisateurs doivent éviter de partager des informations personnelles identifiantes sensibles dans les réponses ou messages.
        </p>
        <p>
          Cette page est fournie à titre informatif. Elle <strong>ne constitue pas un avis juridique</strong> et ne garantit aucune conformité légale (RGPD ou autre). Certaines informations peuvent nécessiter une validation humaine ou être complétées avant mise en production.
        </p>
      </section>

      <div class="back-link">
        <router-link to="/">← Retour à l’accueil</router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Page d'information — aucune logique métier requise
</script>

<style scoped>
.legal-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: var(--text-primary);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: var(--accent-burgundy);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.5rem;
  color: var(--text-primary);
  margin: 0;
}

.last-updated {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.content {
  line-height: 1.7;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border-subtle);
  padding-bottom: 0.5rem;
}

.section h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.section ul, .section ol {
  margin: 0.5rem 0 1rem 0;
  padding-left: 1.5rem;
}

.section li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.retention-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.retention-table th, .retention-table td {
  text-align: left;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.retention-table th {
  color: var(--text-primary);
  font-weight: 700;
  background: var(--bg-light);
}

.legal-disclaimer {
  background: var(--bg-light);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.legal-disclaimer h2 {
  border-bottom: none;
  margin-top: 0;
}

.legal-disclaimer p {
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.back-link {
  text-align: center;
  margin-top: 3rem;
}

.back-link router-link {
  color: var(--accent-rose);
  text-decoration: none;
  font-weight: 600;
}

.back-link router-link:hover {
  color: var(--accent-burgundy);
  text-decoration: underline;
}
</style>
