<template>
  <div class="page-container">
    <header>
      <div class="logo">
        <span>❤️</span> Entre Nous
      </div>
      <h1>Rejoindre une partie</h1>
    </header>

    <div class="main-content">
      <!-- Form Section -->
      <div class="form-container">
        <p>Entrez le code de la partie</p>

        <!-- Game Code Input -->
        <div class="form-group">
          <label for="gameCode">Code de la partie</label>
          <input
            id="gameCode"
            v-model="gameCode"
            type="text"
            placeholder="ABC123"
            maxlength="6"
            class="input-field code-input"
            @input="formatGameCode"
          />
          <div class="code-info">6 caractères</div>
        </div>

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

        <!-- Categories (catégories privées du joueur 2) -->
        <div class="form-group">
          <label>Tes catégories * (privées, l'autre joueur ne les voit pas)</label>
          <div class="category-chips">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="chip"
              :class="{ selected: selectedCategories.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <!-- Join Button -->
        <button
          @click="joinGame"
          :disabled="isLoading || gameCode.length !== 6 || !firstName.trim() || !lastName.trim() || selectedCategories.length === 0"
          class="join-button"
        >
          <span>🎯</span> {{ isLoading ? 'Connexion...' : 'Rejoindre' }}
        </button>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
          <span>⚠️</span> {{ errorMessage }}
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-container">
        <h2>Comment rejoindre?</h2>
        <ol class="steps-list">
          <li><strong>Recevoir</strong> - Demandez le code à votre ami</li>
          <li><strong>Entrer</strong> - Collez le code à 6 caractères</li>
          <li><strong>Confirmer</strong> - Cliquez sur Rejoindre</li>
          <li><strong>Jouer</strong> - Répondez aux questions ensemble!</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gameCode = ref('')
const firstName = ref('')
const lastName = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Pré-remplir le code depuis le lien d'invitation ?code=XXXXXX
const urlParams = new URLSearchParams(window.location.search)
const urlCode = urlParams.get('code')
if (urlCode && /^[A-Z0-9]{6}$/i.test(urlCode)) {
  gameCode.value = urlCode.toUpperCase()
}

const categories = [
  { id: 'social', name: 'Social' },
  { id: 'personal', name: 'Personnel' },
  { id: 'fun', name: 'Amusant' },
  { id: 'deep', name: 'Profond' },
  { id: 'creative', name: 'Créatif' },
]
const selectedCategories = ref<string[]>([])

const toggleCategory = (id: string) => {
  const i = selectedCategories.value.indexOf(id)
  if (i > -1) selectedCategories.value.splice(i, 1)
  else selectedCategories.value.push(id)
}

const formatGameCode = () => {
  // Convert to uppercase and remove non-alphanumeric characters
  gameCode.value = gameCode.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

const joinGame = async () => {
  if (!gameCode.value || gameCode.value.length !== 6) {
    errorMessage.value = 'Le code doit faire 6 caractères'
    return
  }

  if (isLoading.value) return

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Appel API au backend pour rejoindre la partie
    const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/games/join`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: gameCode.value,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        categories: selectedCategories.value,
      })
    })

    if (!response.ok) {
      // Réponse HTTP d'erreur (ex: 404 partie introuvable)
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Code invalide ou partie fermée')
    }

    const data = await response.json()
    const { gameId, sessionToken, playerId } = data

    // Stocker les infos en session (localStorage + sessionStorage pour l'API)
    localStorage.setItem('gameId', gameId)
    localStorage.setItem('gameCode', gameCode.value)
    localStorage.setItem('sessionToken', sessionToken)
    localStorage.setItem('playerId', playerId)
    localStorage.setItem('playerRole', 'participant')
    localStorage.setItem('myCategories', JSON.stringify(selectedCategories.value))

    sessionStorage.setItem('entre-nous-token', sessionToken)

    // Rediriger vers la page de jeu
    router.push(`/game/${gameId}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Impossible de rejoindre la partie'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
}

.chip.selected {
  background: var(--accent-rose);
  border-color: var(--accent-rose);
  color: #fff;
}

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

.form-container > p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
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

.code-input {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  font-size: 1.25rem;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.code-info {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.join-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--accent-rose);
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
  transition: background 0.2s;
}

.join-button:hover:not(:disabled) {
  background: #a86868;
}

.join-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: var(--error-color);
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  font-size: 1.25rem;
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

.steps-list strong {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}
</style>
