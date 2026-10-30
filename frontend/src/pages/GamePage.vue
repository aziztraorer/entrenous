<template>
  <div class="game-container">
    <header class="game-header">
      <div class="logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Entre Nous
      </div>

      <div class="header-info">
        <div class="stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span class="stat-label">Temps:</span>
          <span class="stat-value">{{ currentTime }}</span>
        </div>
        <div class="stat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><line x1="1" y1="3" x2="23" y2="3"></line><path d="M10 5v3m4 -3v3"></path></svg>
          <span class="stat-label">Défi:</span>
          <span class="stat-value">{{ currentTurn + 1 }} / {{ currentTotal }}</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="challenge-card">
        <div class="challenge-header">
          <div class="category-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            {{ currentCategory }}
          </div>
          <span class="challenge-number">Défi {{ currentTurn + 1 }} sur {{ currentTotal }}</span>
          <span class="turn-indicator" :class="isMyTurn ? 'my-turn' : 'their-turn'">
            {{ isMyTurn ? 'À vous de répondre' : activePlayerId ? 'Tour de l\'autre joueur' : 'En attente...' }}
          </span>
        </div>

        <h1>{{ challenge }}</h1>

        <div class="response-area">
          <textarea v-model="response" placeholder="Écris ta réponse ici..."></textarea>
        </div>

        <div class="button-group">
          <button
            @click="submitResponse"
            :disabled="!isMyTurn || gameStatus === 'ended' || isSubmitting || !response.trim()"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            {{ isSubmitting ? 'Envoi...' : 'Soumettre' }}
          </button>
          <button class="button-secondary"
            @click="skipQuestion"
            :disabled="!isMyTurn || gameStatus === 'ended' || isSubmitting"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            Passer
          </button>
        </div>
      </div>

      <!-- Historique des questions et réponses déjà posées -->
      <div v-if="responses.length > 0" class="responses-section">
        <h2 class="responses-title">Vos réponses</h2>
        <div class="responses-list">
          <div
            v-for="r in responses"
            :key="r.id"
            class="response-item"
            :class="r.playerId === myPlayerId ? 'mine' : 'theirs'"
          >
            <div class="response-meta">
              <span class="response-player">{{ r.playerName }}</span>
              <span class="response-role">{{ r.kind === 'answer' ? 'Réponse' : 'Passé' }}</span>
            </div>
            <div class="response-question">{{ r.text || '(question passée)' }}</div>
          </div>
        </div>
      </div>

      <div class="chat-section">
        <h2 class="chat-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          Chat
        </h2>
        <div class="messages">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="chat-bubble"
            :class="msg.playerId === myPlayerId ? 'mine' : 'theirs'"
          >
            <div class="bubble-meta">
              <span class="message-player">{{ msg.firstName }}</span>
              <span class="message-time">{{ formatTime(msg.createdAt) }}</span>
            </div>
            <div class="message-text">{{ msg.content }}</div>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="chatDraft"
            maxlength="500"
            placeholder="Écris un message… (500 max)"
            @keydown.enter="sendChat"
          />
          <button @click="sendChat" :disabled="!chatDraft.trim()">Envoyer</button>
        </div>
        <div v-if="chatError" class="chat-error">{{ chatError }}</div>
      </div>
      <div v-if="gameError" class="chat-error" style="margin-top: 0.5rem;">{{ gameError }}</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiService } from '@/services/api'
import { socketService } from '@/services/socketService'

const route = useRoute()
const router = useRouter()

const response = ref('')
const currentTime = ref('2:45')
const currentCategory = ref('Profond')
const challenge = ref('Qu\'est-ce qui te rend vraiment heureux?')

const myPlayerId = localStorage.getItem('playerId') ?? ''
const currentQuestionId = ref<string>('')
const currentTurn = ref(0)
const currentTotal = ref(0)
const activePlayerId = ref<string | null>(null)
const gameStatus = ref<'active' | 'ended'>('active')
const isMyTurn = ref(false)
const isSubmitting = ref(false)
const socketConnected = ref(false)
const gameError = ref<string | null>(null)
interface ChatMsg {
  id: string
  playerId: string
  firstName: string
  content: string
  createdAt: string
}
const messages = ref<ChatMsg[]>([])
const chatDraft = ref('')
const chatError = ref<string | null>(null)
interface ResponseItem {
  id: string
  questionId: string
  playerId: string
  playerName: string
  playerRole: number
  kind: string
  text: string
  createdAt: string
}
const responses = ref<ResponseItem[]>([])

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function sendChat() {
  const content = chatDraft.value.trim()
  if (!content || content.length > 500) return
  socketService.sendChat(content)
  chatDraft.value = ''
}

onMounted(() => {
  // Update time every second
  setInterval(() => {
    const now = new Date()
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    currentTime.value = `${minutes}:${seconds}`
  }, 1000)

  // Chat temps réel (PROMPT 9) : reconnexion gérée par socketService
  const token = localStorage.getItem('sessionToken') ?? ''
  socketService.connect(token).catch(() => {})

  // Suivi de l'état de connexion socket
  socketService.on('connect', () => {
    socketConnected.value = true
    gameError.value = null
  })
  socketService.on('disconnect', () => {
    socketConnected.value = false
  })
  socketService.on('connect_error', (err) => {
    socketConnected.value = false
    gameError.value = err instanceof Error ? err.message : 'Erreur de connexion socket.'
  })

  socketService.on('chat:history', (history) => {
    messages.value = history as ChatMsg[]
  })
  socketService.on('chat:message', (msg) => {
    messages.value.push(msg as ChatMsg)
    chatError.value = null
  })
  socketService.on('chat:error', (e) => {
    chatError.value = (e as { message: string }).message
  })
  // Erreurs d'action de jeu (403, 409, 410, 429...)
  socketService.on('game:error', (e) => {
    const err = e as { status?: number; message?: string }
    gameError.value = err?.message || 'Erreur lors de l\'action de jeu.'
    setTimeout(() => { gameError.value = null }, 5000)
  })
  // Mise à jour temps réel de la question courante (diffusée aux deux joueurs)
  socketService.on('game:state', (state) => {
    const s = state as {
      status: 'active' | 'ended';
      question: { id: string; prompt: string } | null;
      turn: number;
      total: number;
      activePlayerId: string | null;
    }
    if (s.question?.prompt) {
      challenge.value = s.question.prompt
      currentQuestionId.value = s.question.id
    }
    currentTurn.value = s.turn
    currentTotal.value = s.total
    activePlayerId.value = s.activePlayerId
    gameStatus.value = s.status
    isMyTurn.value = s.activePlayerId === myPlayerId
    if (s.status === 'ended') {
      response.value = ''
      const gameId = route.params.gameId as string
      router.push(`/end/${gameId}?totalQuestions=${s.total}`)
    }
  })
})

// Récupère la question actuelle depuis le moteur côté serveur
async function loadCurrentQuestion() {
  try {
    const gameId = route.params.gameId as string
    const state = await apiService.get<{
      status: 'active' | 'ended';
      question: { id: string; prompt: string } | null;
      turn: number;
      total: number;
      activePlayerId: string | null;
    }>(`/api/games/${gameId}/state`)
    if (state.question?.prompt) {
      challenge.value = state.question.prompt
      currentQuestionId.value = state.question.id
    }
    currentTurn.value = state.turn
    currentTotal.value = state.total
    activePlayerId.value = state.activePlayerId
    gameStatus.value = state.status
    isMyTurn.value = state.activePlayerId === myPlayerId
    if (state.status === 'ended') {
      router.push(`/end/${gameId}?totalQuestions=${state.total}`)
    }
    await loadResponses()
  } catch {
    // En cas d'erreur, on garde la valeur par défaut — silencieux pour ne pas casser la page
  }
}

// Récupère l'historique des questions et réponses (passées uniquement)
async function loadResponses() {
  try {
    const gameId = route.params.gameId as string
    const data = await apiService.get<ResponseItem[]>(`/api/games/${gameId}/responses`)
    responses.value = Array.isArray(data) ? data : []
  } catch {
    // silencieux
  }
}

onMounted(loadCurrentQuestion)

const submitResponse = async () => {
  gameError.value = null
  if (!response.value.trim()) {
    alert('Écris quelque chose avant de soumettre!')
    return
  }
  if (!currentQuestionId.value) {
    await loadCurrentQuestion()
    if (!currentQuestionId.value) {
      gameError.value = 'Impossible de récupérer la question actuelle.'
      return
    }
  }
  if (!isMyTurn.value) {
    gameError.value = "Ce n'est pas votre tour."
    return
  }
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const gameId = route.params.gameId as string
    await apiService.post<{
      status: 'active' | 'ended';
      question: { id: string; prompt: string } | null;
      turn: number;
      total: number;
      activePlayerId: string | null;
    }>(`/api/games/${gameId}/action`, {
      kind: 'answer',
      questionId: currentQuestionId.value,
      content: response.value.trim(),
    })
    response.value = ''
  } catch (err: any) {
    gameError.value = err?.response?.data?.message || err?.message || 'Impossible de soumettre la réponse. Réessayez.'
  } finally {
    isSubmitting.value = false
  }
}

const skipQuestion = async () => {
  gameError.value = null
  if (!currentQuestionId.value) {
    await loadCurrentQuestion()
    if (!currentQuestionId.value) {
      gameError.value = 'Impossible de récupérer la question actuelle.'
      return
    }
  }
  if (!isMyTurn.value) {
    gameError.value = "Ce n'est pas votre tour."
    return
  }
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    const gameId = route.params.gameId as string
    await apiService.post<{
      status: 'active' | 'ended';
      question: { id: string; prompt: string } | null;
      turn: number;
      total: number;
      activePlayerId: string | null;
    }>(`/api/games/${gameId}/action`, {
      kind: 'skip',
      questionId: currentQuestionId.value,
    })
    response.value = ''
  } catch (err: any) {
    gameError.value = err?.response?.data?.message || err?.message || 'Impossible de passer cette question. Réessayez.'
  } finally {
    isSubmitting.value = false
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
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1rem;
  color: var(--accent-burgundy);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.header-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  font-weight: 700;
  color: var(--accent-rose);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.challenge-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.challenge-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(192, 122, 122, 0.15);
  color: var(--accent-rose);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.challenge-number {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.turn-indicator {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 1rem;
}

.turn-indicator.my-turn {
  color: #16803C;
}

.turn-indicator.their-turn {
  color: var(--accent-rose);
}

h1 {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  line-height: 1.3;
}

.response-area {
  margin: 2rem 0;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  background: var(--bg-light);
  color: var(--text-primary);
  line-height: 1.6;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-rose);
  box-shadow: 0 0 0 3px rgba(192, 122, 122, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  flex: 1;
  padding: 0.875rem 1.5rem;
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
}

button:active {
  transform: scale(0.98);
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

.responses-section {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.responses-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.response-item {
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid var(--accent-rose);
}

.response-item.mine {
  background: rgba(192, 122, 122, 0.1);
  border-left-color: var(--accent-burgundy);
  align-self: flex-end;
  max-width: 80%;
}

.response-item.theirs {
  background: var(--bg-light);
  align-self: flex-start;
  max-width: 80%;
}

.response-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.response-player {
  font-weight: 600;
  color: var(--accent-rose);
}

.response-item.mine .response-player {
  color: var(--accent-burgundy);
}

.response-role {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.response-question {
  color: var(--text-primary);
  line-height: 1.5;
}

.chat-section {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 16px var(--shadow-soft);
}

.chat-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Bulles distinctes : mes messages à droite, ceux de l'autre à gauche */
.chat-bubble {
  max-width: 80%;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  margin-bottom: 0.25rem;
}

.chat-bubble.mine {
  align-self: flex-end;
  background: var(--accent-rose);
  color: white;
  border-bottom-right-radius: 3px;
}

.chat-bubble.theirs {
  align-self: flex-start;
  background: var(--bg-light);
  color: var(--text-primary);
  border: 1px solid var(--border-subtle);
  border-bottom-left-radius: 3px;
}

.bubble-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
}

.chat-bubble.mine .message-player {
  color: rgba(255, 255, 255, 0.85);
}

.chat-bubble.theirs .message-player {
  color: var(--accent-rose);
}

.message-time {
  opacity: 0.7;
}

.chat-bubble .message-text {
  color: inherit;
  word-break: break-word;
}

.chat-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  font-family: inherit;
  font-size: 0.95rem;
  background: var(--bg-light);
  color: var(--text-primary);
}

.chat-input input:focus {
  outline: none;
  border-color: var(--accent-rose);
}

.chat-input button {
  flex: 0 0 auto;
  padding: 0.5rem 1.1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-error {
  color: #B3403A;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.message {
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-light);
  border-left: 3px solid var(--accent-rose);
  border-radius: 4px;
}

.message:last-child {
  margin-bottom: 0;
}

.message-player {
  font-size: 0.85rem;
  color: var(--accent-rose);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.message-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.4rem;
  }

  .challenge-card {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .header-info {
    gap: 1rem;
  }

  .stat {
    font-size: 0.85rem;
  }
}
</style>