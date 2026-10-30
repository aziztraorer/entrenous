<template>
  <div class="legal-page">
    <header class="page-header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Règles du jeu</h1>
    </header>

    <main class="content">
      <section class="section">
        <h2>Comment jouer</h2>
        <ol class="steps">
          <li>
            <strong>Créer une partie :</strong> l’un de vous saisit son prénom et nom, choisit au moins une catégorie de questions et lance une nouvelle partie. Vous recevez un code unique à partager.
          </li>
          <li>
            <strong>Rejoindre :</strong> l’autre personne entre le code d’invitation, son prénom et son nom, choisit ses catégories, puis rejoint la partie.
          </li>
          <li>
            <strong>Jouer :</strong> une question apparaît, à tour de rôle. Chacun y répond ou passe. Les réponses sont affichées à tour de rôle, jamais les questions à venir.
          </li>
          <li>
            <strong>Fin :</strong> quand toutes les questions de la pioche ont été utilisées, la partie se termine. Vous pouvez alors en créer une nouvelle.
          </li>
        </ol>
      </section>

      <section class="section">
        <h2>Catégories de questions</h2>
        <p>Chaque joueur choisit les catégories qui l’intéressent. Les questions posées sont issues de l’<strong>union</strong> des catégories choisies par les deux joueurs, sans répétition.</p>
        <ul class="category-list">
          <li><strong>Social :</strong> Relations et interactions</li>
          <li><strong>Personnel :</strong> Rêves et valeurs</li>
          <li><strong>Amusant :</strong> Moments légers</li>
          <li><strong>Profond :</strong> Questions existentielles</li>
          <li><strong>Créatif :</strong> Imaginez ensemble</li>
        </ul>
        <div class="notice-box">
          <p><strong>Catégorie « Intimité » :</strong> réservée aux joueurs majeurs (18+) ayant déclaré leur majorité et donné un consentement explicite. Si l’un des deux joueurs n’a pas consenti, cette catégorie est exclue.</p>
        </div>
      </section>

      <section class="section">
        <h2>Conduite et respect</h2>
        <ul>
          <li>Aucun compte, aucun email, aucun mot de passe n’est requis.</li>
          <li>Les prénoms et noms sont affichés uniquement aux deux participants de la partie.</li>
          <li>Les messages de chat et les réponses restent dans la partie ; ils sont supprimés automatiquement après 24 heures.</li>
          <li>Merci de rester respectueux et bienveillant envers l’autre joueur.</li>
        </ul>
      </section>

      <section class="section legal-disclaimer">
        <h2>Information importante</h2>
        <p>
          Cette page décrit le fonctionnement du jeu tel qu’implémenté dans cette version du projet. Elle n’est <strong>pas un document juridique</strong> et ne garantit aucune conformité légale. Les informations peuvent être incomplètes ou nécessiter une validation humaine avant mise en production.
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

.steps {
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps li {
  margin-bottom: 1.25rem;
  padding-left: 2rem;
  position: relative;
  color: var(--text-secondary);
}

.steps li::before {
  content: counter(step-counter);
  counter-increment: step-counter;
  position: absolute;
  left: 0;
  top: 0.1rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--accent-rose);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--text-secondary);
}

.category-list li {
  margin-bottom: 0.75rem;
  padding-left: 1.5rem;
  position: relative;
}

.category-list li::before {
  content: '•';
  color: var(--accent-rose);
  position: absolute;
  left: 0;
  font-weight: 700;
  font-size: 1.2rem;
}

.notice-box {
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
  padding: 1rem 1.5rem;
  margin-top: 1rem;
}

.notice-box p {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.legal-disclaimer {
  background: var(--bg-light);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
}

.legal-disclaimer h2 {
  border-bottom: none;
  margin-top: 0;
}

.legal-disclaimer p {
  margin: 0;
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
