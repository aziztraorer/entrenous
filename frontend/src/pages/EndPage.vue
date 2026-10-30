<template>
  <div class="end-container">
    <header>
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>
      <h1>Partie Terminée!</h1>
      <p class="subtitle">Merci d'avoir joué ensemble 🎉</p>
    </header>

    <main class="main-content">
      <div class="celebration">
        <div class="celebration-emoji">✨</div>
        <p style="margin: 0; color: var(--text-secondary); font-size: 1.05rem;">Vous vous êtes découvert authentiquement</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><line x1="1" y1="3" x2="23" y2="3"></line><path d="M10 5v3m4 -3v3"></path></svg>
          </div>
          <div class="stat-value">8</div>
          <div class="stat-label">Défis</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div class="stat-value">12</div>
          <div class="stat-label">Messages</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-value">18m</div>
          <div class="stat-label">Durée</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <div class="stat-value">100%</div>
          <div class="stat-label">Connexion</div>
        </div>
      </div>

      <div class="highlights">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
          Moments clés
        </h3>
        <div v-for="(highlight, idx) in highlights" :key="idx" class="highlight-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>{{ highlight }}</span>
        </div>
      </div>

      <div class="button-group">
        <button @click="playAgain">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0114.85-3.36 10 10 0 01.69 11.26M21.49 15a9 9 0 01-14.85 3.36 10 10 0 01-.69-11.26"></path></svg>
          Rejouer
        </button>
        <button class="button-secondary" @click="goHome">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Accueil
        </button>
      </div>

      <p class="footer-text">Toutes vos données de partie seront supprimées après 24 heures pour votre confidentialité.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const highlights = ref([
  'Vous avez découvert une passion commune : les voyages',
  'Une conversation profonde sur vos rêves respectifs',
  'Beaucoup de rires et de moments légers ensemble'
])

const playAgain = () => {
  alert('Nouvelle partie créée!')
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

.celebration {
  text-align: center;
  margin-bottom: 2.5rem;
}

.celebration-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
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

.highlights {
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.highlights h3 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.highlight-item {
  margin: 0.5rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.highlight-item svg {
  flex-shrink: 0;
  margin-top: 2px;
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

  .celebration-emoji {
    font-size: 3rem;
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