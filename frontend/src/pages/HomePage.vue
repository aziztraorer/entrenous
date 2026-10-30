<template>
  <div class="page-container">
    <header>
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Et si vous appreniez à mieux vous connaître?</h1>
      <p style="color: var(--text-secondary); margin: 1rem 0 0 0;">Une expérience de conversation intime en temps réel.</p>
    </header>

    <section class="hero">
      <p>Connectez-vous anonymement avec quelqu'un pour une conversation profonde et authentique. Pas d'inscriptions, pas de profils, juste deux personnes qui se découvrent vraiment.</p>

      <div class="button-group">
        <router-link to="/create" class="button">Créer une partie</router-link>
        <router-link to="/join" class="button button-secondary">Rejoindre une partie</router-link>
      </div>
    </section>

    <section class="process">
      <div class="process-step">
        <div class="step-number">1</div>
        <h3>Créer</h3>
        <p>Lance une nouvelle partie et reçois un code unique à partager avec quelqu'un.</p>
      </div>

      <div class="process-step">
        <div class="step-number">2</div>
        <h3>Inviter</h3>
        <p>Partage le code avec un ami ou quelqu'un qui veut une vraie conversation.</p>
      </div>

      <div class="process-step">
        <div class="step-number">3</div>
        <h3>Jouer</h3>
        <p>Répondez ensemble à des défis profonds et découvrez des facettes cachées l'une de l'autre.</p>
      </div>
    </section>

    <section class="categories">
      <h2>Types de défis</h2>
      <p>Chaque partie vous présente des défis dans différentes catégories pour une expérience variée et enrichissante.</p>

      <div class="category-grid">
        <div class="category-card">
          <div class="category-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3>Social</h3>
          <p>Relations et interactions</p>
        </div>

        <div class="category-card">
          <div class="category-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><path d="M12 1v6m8 4h-6m-8 0H1m11 11v-6"></path></svg>
          </div>
          <h3>Personnel</h3>
          <p>Rêves et valeurs</p>
        </div>

        <div class="category-card">
          <div class="category-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3>Amusant</h3>
          <p>Moments légers</p>
        </div>

        <div class="category-card">
          <div class="category-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </div>
          <h3>Profond</h3>
          <p>Questions existentielles</p>
        </div>

        <div class="category-card">
          <div class="category-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"></path><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
          <h3>Créatif</h3>
          <p>Imaginez ensemble</p>
        </div>
      </div>
    </section>

    <section class="privacy">
      <h2>Confidentialité & Sécurité</h2>
      <p>Votre vie privée est notre priorité. Entre Nous a été conçu pour respecter votre anonymat complet.</p>

      <div class="privacy-highlights">
        <div class="privacy-item">
          <p><strong>❌ Pas de compte</strong> — Aucune inscription ni profil. Chaque partie est éphémère.</p>
        </div>

        <div class="privacy-item">
          <p><strong>🔒 Anonyme</strong> — Aucune donnée personnelle n'est collectée ou stockée.</p>
        </div>

        <div class="privacy-item">
          <p><strong>⏰ Données supprimées</strong> — Toutes les conversations sont supprimées après 24 heures.</p>
        </div>

        <div class="privacy-item">
          <p><strong>🔗 Directe</strong> — Communiquez uniquement avec la personne de votre partie.</p>
        </div>
      </div>
    </section>

    <footer>
      <div class="footer-links">
        <router-link to="/regles">Règles</router-link>
        <router-link to="/confidentialite">Confidentialité</router-link>
        <router-link to="/contact">Contact</router-link>
      </div>

      <p class="footer-credit">Entre Nous © 2026 — Créer des connexions authentiques, une conversation à la fois.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for homepage
declare const globalThis: { alert: (msg: string) => void };
</script>

<style scoped>
/* Design System */
:root {
  --bg-light: #FBF7F3;
  --bg-card: #FEFDFB;
  --text-primary: #2C2420;
  --text-secondary: #6B6158;
  --accent-rose: #C07A7A;
  --accent-burgundy: #6B3B3B;
  --border-subtle: #E8DFD6;
  --shadow-soft: rgba(44, 36, 32, 0.08);
}

.page-container {
  color: var(--text-primary);
  max-width: 1000px;
  margin: 0 auto;
}

/* Typography */
h1, h2, h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  text-wrap: balance;
  margin: 0;
  color: var(--text-primary);
}

h1 {
  font-size: 2.5rem;
  letter-spacing: -0.02em;
}

h2 {
  font-size: 1.8rem;
  letter-spacing: -0.01em;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

h3 {
  font-size: 1.2rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

p {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  line-height: 1.75;
}

a {
  color: var(--accent-rose);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--accent-burgundy);
  text-decoration: underline;
}

/* Header & Logo */
header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.5rem;
  color: var(--accent-burgundy);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

/* Hero Section */
.hero {
  text-align: center;
  margin-bottom: 3rem;
}

.hero p {
  font-size: 1.1rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-secondary);
}

/* Buttons */
.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.button {
  padding: 0.875rem 1.75rem;
  border: 2px solid var(--accent-rose);
  background: var(--accent-rose);
  color: white;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.button:hover {
  background: var(--accent-burgundy);
  border-color: var(--accent-burgundy);
  transform: translateY(-1px);
}

.button-secondary {
  background: transparent;
  color: var(--accent-rose);
}

.button-secondary:hover {
  background: var(--accent-rose);
  color: white;
  border-color: var(--accent-burgundy);
}

/* Process Section */
.process {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.process-step {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--shadow-soft);
  transition: all 0.3s ease;
}

.process-step:hover {
  border-color: var(--accent-rose);
  box-shadow: 0 4px 12px var(--shadow-soft);
  transform: translateY(-2px);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--accent-rose);
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Categories */
.categories {
  margin: 3rem 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.category-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: default;
}

.category-card:hover {
  border-color: var(--accent-rose);
  box-shadow: 0 4px 12px var(--shadow-soft);
  transform: translateY(-2px);
}

.category-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: var(--accent-rose);
}

.category-card p {
  font-size: 0.9rem;
  margin: 0;
}

/* Privacy Section */
.privacy {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 2rem;
  margin: 3rem 0;
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.privacy-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.privacy-item {
  padding: 1rem;
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
}

.privacy-item p {
  margin: 0;
  font-size: 0.95rem;
}

/* Footer */
footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  text-align: center;
}

.footer-links {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.footer-links a {
  color: var(--accent-rose);
  font-size: 0.95rem;
}

.footer-credit {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Responsive */
@media (max-width: 600px) {
  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.3rem;
    margin-top: 2rem;
  }

  .button-group {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .process {
    grid-template-columns: 1fr;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .footer-links {
    gap: 1rem;
  }
}

@media (prefers-reduced-motion: no-preference) {
  header {
    animation: fadeIn 0.6s ease-out;
  }

  .hero {
    animation: fadeInUp 0.7s ease-out 0.1s both;
  }

  .process-step {
    animation: fadeInUp 0.7s ease-out both;
  }

  .process-step:nth-child(2) {
    animation-delay: 0.2s;
  }

  .process-step:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>