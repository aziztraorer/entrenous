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
          <div class="category-grid-join">
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              class="chip"
              :class="{ selected: selectedCategories.includes(cat.id) }"
              @click="toggleCategory(cat.id)"
            >
              <span class="chip-icon" v-html="getCategoryIcon(cat.id)"></span>
              <span class="chip-name">{{ cat.name }}</span>
              <span class="chip-count">{{ cat.count }} questions</span>
            </button>
          </div>
        </div>

        <!-- Garde 18+ : visible uniquement si la catégorie érotique est sélectionnée -->
        <div v-if="eroticSelected" class="adult-consent">
          <p><strong>Catégorie réservée aux adultes (18+)</strong></p>
          <label class="consent-line">
            <input type="checkbox" v-model="adultConfirmed" />
            Je confirme être majeur(e) (18 ans ou plus).
          </label>
          <label class="consent-line">
            <input type="checkbox" v-model="consentAccepted" />
            J'accepte de voir des contenus érotiques avec mon/ma partenaire.
          </label>
        </div>

        <!-- Join Button -->
        <button
          @click="joinGame"
          :disabled="isLoading || gameCode.length !== 6 || !firstName.trim() || !lastName.trim() || selectedCategories.length === 0 || (eroticSelected && (!adultConfirmed || !consentAccepted))"
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiUrl } from '@/config/env'

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
  { id: 'social', name: 'Social', icon: 'users', count: 50 },
  { id: 'personal', name: 'Personnel', icon: 'target', count: 50 },
  { id: 'fun', name: 'Amusant', icon: 'message-circle', count: 50 },
  { id: 'deep', name: 'Profond', icon: 'smile', count: 50 },
  { id: 'creative', name: 'Créatif', icon: 'plus-circle', count: 50 },
  { id: 'erotic', name: 'Érotique (18+)', icon: 'heart-flame', count: 100 },
]

const getCategoryIcon = (categoryId: string): string => {
  const icons: Record<string, string> = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="9"></circle></svg>',
    'message-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    smile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>',
    'plus-circle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
    'heart-flame': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path><path d="M12 8v4"></path><path d="M12 15h.01"></path></svg>',
  }
  return icons[categoryId] || ''
}
const selectedCategories = ref<string[]>([])
// Consentement 18+ requis pour la catégorie érotique
const adultConfirmed = ref(false)
const consentAccepted = ref(false)
const eroticSelected = computed(() => selectedCategories.value.includes('erotic'))

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
    const response = await fetch(apiUrl('/api/games/join'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: gameCode.value,
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        categories: selectedCategories.value,
        adultConfirmed: eroticSelected.value ? adultConfirmed.value : undefined,
        consentAccepted: eroticSelected.value ? consentAccepted.value : undefined,
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
/* Grille de cartes catégorie : icône au-dessus du nom, compteur en dessous */
.category-grid-join {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 0.6rem;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
}

.chip-icon {
  width: 32px;
  height: 32px;
  color: var(--accent-rose);
}

/* :deep() requis : le SVG est injecté via v-html et n'a pas l'attribut scoped */
.chip-icon :deep(svg) {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.chip-name {
  font-weight: 600;
}

.chip-count {
  font-size: 0.72rem;
  opacity: 0.65;
}

.chip.selected {
  background: var(--accent-rose);
  border-color: var(--accent-rose);
  color: #fff;
}

.chip.selected .chip-icon {
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

.adult-consent {
  background: rgba(192, 122, 122, 0.12);
  border: 1px solid var(--accent-rose);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.adult-consent p {
  margin: 0 0 0.5rem 0;
  color: var(--accent-burgundy);
}

.consent-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
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
