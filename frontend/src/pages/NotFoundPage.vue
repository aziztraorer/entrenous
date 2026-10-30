<template>
  <div class="not-found-container">
    <div class="content">
      <div class="icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>

      <h1>Page Non Trouvée</h1>
      <p>Oups! La page que vous cherchez n'existe pas.</p>

      <div class="actions">
        <router-link to="/" class="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No logic needed for 404 page
</script>

<style scoped>
:root {
  --bg-light: #FBF7F3;
  --text-primary: #2C2420;
  --text-secondary: #6B6158;
  --accent-rose: #C07A7A;
  --accent-burgundy: #6B3B3B;
  --border-subtle: #E8DFD6;
}

.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.content {
  max-width: 400px;
}

.icon {
  margin-bottom: 2rem;
  color: var(--accent-rose);
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

p {
  font-size: 1.05rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--accent-rose);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.button:hover {
  background: var(--accent-burgundy);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }

  .button {
    width: 100%;
  }
}
</style>