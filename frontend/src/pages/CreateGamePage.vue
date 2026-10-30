<template>
  <div class="page-container">
    <header>
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        Entre Nous
      </div>
      <h1>Créer une partie</h1>
    </header>

    <div class="main-content">
      <!-- Form Section -->
      <div class="form-container">
        <p>Configurez votre partie</p>

        <!-- Player Name -->
        <div class="form-group">
          <label for="firstName">Prénom *</label>
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            placeholder="Ton prénom"
            maxlength="100"
            class="input-field"
          />
        </div>
        <div class="form-group">
          <label for="lastName">Nom *</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            placeholder="Ton nom"
            maxlength="100"
            class="input-field"
          />
        </div>

        <!-- Difficulty Level -->
        <div class="form-group">
          <label for="difficulty">Niveau de profondeur</label>
          <select
            id="difficulty"
            v-model="difficulty"
            class="input-field"
          >
            <option value="easy">Léger</option>
            <option value="medium">Moyen</option>
            <option value="hard">Profond</option>
          </select>
        </div>

        <!-- Create Button -->
        <button
          @click="goToCategories"
          :disabled="isLoading || !firstName.trim() || !lastName.trim()"
          class="create-button"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Continuer
        </button>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-indicator">Chargement...</div>
      </div>

      <!-- Info Section -->
      <div class="info-container">
        <h2>Comment ça marche?</h2>
        <ol class="steps-list">
          <li><strong>Créer</strong> - Lancez une nouvelle partie</li>
          <li><strong>Choisir</strong> - Sélectionnez vos catégories</li>
          <li><strong>Partager</strong> - Donnez le code à votre ami</li>
          <li><strong>Jouer</strong> - Répondez ensemble aux questions</li>
        </ol>
      </div>
    </div>

    <!-- Category Selection Modal -->
    <div v-if="showCategoryModal" class="modal-overlay" @click="closeCategoryModal">
      <div class="modal-content" @click.stop>
        <h2>Choisir vos catégories</h2>
        <p class="modal-subtitle">Sélectionnez au moins une catégorie</p>

        <!-- Error Message in Modal -->
        <div v-if="apiError" class="error-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {{ apiError }}
        </div>

        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            :class="{ selected: selectedCategories.includes(category.id) }"
            @click="toggleCategory(category.id)"
          >
            <div class="category-icon" v-html="getCategoryIcon(category.id)"></div>
            <div class="category-name">{{ category.name }}</div>
            <div class="category-count">{{ category.challengeCount }} questions</div>
          </div>
        </div>

        <div class="modal-buttons">
          <button @click="closeCategoryModal" class="btn-cancel">
            Annuler
          </button>
          <button
            @click="createGame"
            :disabled="selectedCategories.length === 0 || isLoading"
            class="btn-confirm"
          >
            {{ isLoading ? 'Création...' : 'Créer la partie' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const difficulty = ref('medium')
const isLoading = ref(false)
const showCategoryModal = ref(false)
const selectedCategories = ref<string[]>([])
const apiError = ref('')

const categories = ref([
  { id: 'social', name: 'Social', icon: 'users', challengeCount: 7 },
  { id: 'personal', name: 'Personnel', icon: 'target', challengeCount: 7 },
  { id: 'fun', name: 'Amusant', icon: 'message-circle', challengeCount: 7 },
  { id: 'deep', name: 'Profond', icon: 'smile', challengeCount: 7 },
  { id: 'creative', name: 'Créatif', icon: 'plus-circle', challengeCount: 5 },
])

const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="9"></circle></svg>',
    'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
    'plus-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
  }
  return icons[categoryId] || ''
}

const goToCategories = () => {
  apiError.value = ''
  if (!firstName.value.trim() || !lastName.value.trim()) {
    apiError.value = "Merci d'indiquer ton prénom et ton nom."
    return
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  apiError.value = ''
}

const toggleCategory = (categoryId: string) => {
  const index = selectedCategories.value.indexOf(categoryId)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(categoryId)
  }
}

const createGame = async () => {
  if (isLoading.value || selectedCategories.value.length === 0) return

  isLoading.value = true
  apiError.value = ''

  try {
    // Essayer différentes URLs
    const apiUrls = [
      'http://localhost:3000/api/games',
      '/api/games',
      'http://127.0.0.1:3000/api/games',
    ]

    let response: Response | null = null

    for (const url of apiUrls) {
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            categories: selectedCategories.value,
          })
        })
        
        if (response.ok) break
      } catch {
        continue
      }
    }

    if (!response || !response.ok) {
      const errorData = await response?.json().catch(() => ({}))
      throw new Error(errorData.message || 'Impossible de créer la partie. Vérifiez que le backend est en cours d\'exécution sur http://localhost:3000')
    }

    const data = await response.json()
    const { gameId, gameCode, sessionToken, playerId } = data

    // Stocker les infos
    localStorage.setItem('gameId', gameId)
    localStorage.setItem('gameCode', gameCode)
    localStorage.setItem('sessionToken', sessionToken)
    localStorage.setItem('playerId', playerId)
    localStorage.setItem('playerRole', 'creator')
    localStorage.setItem('myCategories', JSON.stringify(selectedCategories.value))

    sessionStorage.setItem('entre-nous-token', sessionToken)

    // Rediriger
    router.push(`/wait/${gameId}`)
  } catch (error) {
    apiError.value = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('Create game error:', error)
  } finally {
    isLoading.value = false
  }
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
  --error-color: #DC2626;
}

.page-container {
  color: var(--text-primary);
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

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

.logo-icon {
  width: 24px;
  height: 24px;
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2rem;
  margin: 0;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.form-container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
  color: var(--text-primary);
  background: white;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-rose);
  box-shadow: 0 0 0 3px rgba(192, 122, 122, 0.1);
}

.create-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent-burgundy);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.create-button svg {
  width: 20px;
  height: 20px;
  stroke: white;
}

.create-button:hover:not(:disabled) {
  background: #5a3333;
}

.create-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-indicator {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 1rem;
}

.info-container {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px var(--shadow-soft);
}

.info-container h2 {
  margin-top: 0;
  color: var(--accent-burgundy);
  font-family: 'Playfair Display', Georgia, serif;
}

.steps-list {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.steps-list li {
  margin-bottom: 0.75rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--bg-light);
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--accent-burgundy);
  margin-top: 0;
}

.modal-subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.error-box {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: var(--error-color);
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.error-box svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-card {
  background: white;
  border: 2px solid var(--border-subtle);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card:hover {
  border-color: var(--accent-rose);
}

.category-card.selected {
  background: var(--accent-rose);
  color: white;
  border-color: var(--accent-burgundy);
}

.category-icon {
  width: 40px;
  height: 40px;
  margin: 0 auto 0.5rem;
}

.category-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.category-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.category-count {
  font-size: 0.8rem;
  opacity: 0.7;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
}

.btn-cancel {
  background: var(--border-subtle);
  color: var(--text-primary);
}

.btn-cancel:hover {
  background: #ddd;
}

.btn-confirm {
  background: var(--accent-burgundy);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background: #5a3333;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>