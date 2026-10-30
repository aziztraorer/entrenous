<template>
  <div class="end-container">
    <header>
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Partie Terminée</h1>
      <p class="subtitle">Vous avez répondu à toutes les questions disponibles.</p>
    </header>

    <main class="main-content">
      <div class="end-message">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
        <p class="end-text">Aucune question ne reste à poser. Cette partie est complète.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><line x1="1" y1="3" x2="23" y2="3"></line><path d="M10 5v3m4 -3v3"></path></svg>
          </div>
          <div class="stat-value">{{ totalQuestions }}</div>
          <div class="stat-label">Questions utilisées</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div class="stat-value">{{ totalMessages }}</div>
          <div class="stat-label">Messages échangés</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-value">{{ duration }}</div>
          <div class="stat-label">Durée</div>
        </div>
      </div>

      <div class="data-notice">
        <p><strong>Vos données</strong> — Toutes les réponses et messages de cette partie seront définitivement supprimés après 24 heures, conformément à notre politique de confidentialité.</p>
      </div>

      <div class="button-group">
        <button @click="createNewGame">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0114.85-3.36 10 10 0 01.69 11.26M21.49 15a9 9 0 01-14.85 3.36 10 10 0 01-.69-11.26"></path></svg>
          Créer une nouvelle partie
        </button>
        <button class="button-secondary" @click="goHome">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Accueil
        </button>
      </div>

      <p class="footer-text">Entre Nous © 2026 — Vos conversations restent éphémères par conception.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const totalQuestions = route.query.totalQuestions ? Number(route.query.totalQuestions) : 0
const totalMessages = route.query.totalMessages ? Number(route.query.totalMessages) : 0
const duration = route.query.duration ? route.query.duration : '—'

const createNewGame = () => {
  router.push('/create')
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
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

.end-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem;
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
  font-size: 2.2rem;
  color: var(--text-primary);
  margin: 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.main-content {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 3rem 2rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.end-message {
  text-align: center;
  margin-bottom: 2.5rem;
}

.end-message svg {
  color: var(--accent-rose);
  margin-bottom: 1rem;
}

.end-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: var(--bg-light);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.stat-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 0.75rem;
  color: var(--accent-rose);
}

.stat-value {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-burgundy);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-notice {
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.data-notice p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 2rem;
}

button {
  padding: 1rem;
  border: 2px solid var(--accent-rose);
  background: var(--accent-rose);
  color: white;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button:hover {
  background: var(--accent-burgundy);
  border-color: var(--accent-burgundy);
  transform: translateY(-1px);
}

.button-secondary {
  background: transparent;
  color: var(--accent-rose);
  border-color: var(--accent-rose);
}

.button-secondary:hover {
  background: var(--accent-rose);
  color: white;
}

.footer-text {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-size: 0.95rem;
}

@media (max-width: 600px) {
  .main-content {
    padding: 2rem 1.5rem;
  }

  h1 {
    font-size: 1.6rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .button-group {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .main-content {
    animation: fadeIn 0.6s ease-out;
  }

  @keyframes fadeIn {
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
