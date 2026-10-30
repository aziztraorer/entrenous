<template>
  <div class="legal-page">
    <header class="page-header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Contact</h1>
    </header>

    <main class="content">
      <section class="section">
        <h2>Nous contacter</h2>
        <p>
          Pour toute question, suggestion ou problème technique concernant Entre Nous, vous pouvez nous contacter à l’adresse suivante :
        </p>
        <div class="contact-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <a :href="mailtoLink" class="email-link">{{ contactEmail }}</a>
          <p class="email-note">{{ emailNote }}</p>
        </div>
      </section>

      <section class="section">
        <h2>Informations à compléter</h2>
        <div class="notice-box">
          <p><strong>Cette page est une ébauche.</strong> Les informations de contact ci-dessous doivent être complétées et validées avant mise en production :</p>
          <ul>
            <li>Adresse email de contact réelle (actuellement : <code>{{ contactEmail }}</code>)</li>
            <li>Délai de réponse attendu (à préciser)</li>
            <li>Éventuellement un formulaire de contact ou une adresse postale</li>
          </ul>
          <p>
            Cette page n’est <strong>pas un document juridique</strong> et ne garantit aucune conformité légale. Certains éléments peuvent nécessiter une validation humaine.
          </p>
        </div>
      </section>

      <section class="section">
        <h2>Pour les questions de confidentialité</h2>
        <p>
          Pour toute question concernant la politique de confidentialité, les données collectées ou leur suppression, consultez la
          <router-link to="/confidentialite">page de confidentialité</router-link> ou contactez-nous à l’adresse ci-dessus.
        </p>
      </section>

      <div class="back-link">
        <router-link to="/">← Retour à l’accueil</router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const contactEmail = 'entre.nous.game@example.com'
const emailNote = 'Adresse à remplacer par une adresse réelle avant mise en production.'
const mailtoLink = `mailto:${contactEmail}`
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

.contact-card {
  background: var(--bg-light);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;
}

.contact-card svg {
  color: var(--accent-rose);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.email-link {
  color: var(--accent-rose);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  word-break: break-all;
}

.email-link:hover {
  color: var(--accent-burgundy);
  text-decoration: underline;
}

.email-note {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-style: italic;
}

.notice-box {
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
  padding: 1rem 1.5rem;
  margin-top: 1rem;
}

.notice-box p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.notice-box ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
}

.notice-box li {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

code {
  background: rgba(192, 122, 122, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
  color: var(--accent-burgundy);
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
