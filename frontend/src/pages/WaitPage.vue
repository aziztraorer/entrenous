<template>
  <div class="wait-container">
    <header>
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
          </path>
        </svg>
        Entre Nous
      </div>
      <h1>En attente...</h1>
    </header>

    <main class="main-content">
      <p>Partage ce code ou ce lien avec quelqu'un pour qu'il te rejoigne!</p>

      <div class="code-display">
        <div class="code-label">Code de partie</div>
        <div class="code">{{ gameCode }}</div>
        <button class="copy-button" @click="copyCode">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          Copier le code
        </button>
      </div>

      <div class="link-display">
        <div class="code-label">Lien d'invitation</div>
        <div class="invite-link">{{ inviteLink }}</div>
        <div class="link-buttons">
          <button class="copy-button" @click="copyLink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Copier le lien
          </button>
          <button class="share-button" @click="shareNative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Partager
          </button>
        </div>
      </div>

      <div class="waiting-indicator">
        <template v-if="!isFull">
          <div class="spinner"></div>
          <p class="status-text">En attente du deuxième joueur...</p>
        </template>
        <template v-else>
          <p class="status-text ready">✅ {{ otherPlayerName }} a rejoint la partie !</p>
          <button class="start-button" @click="startGame">Commencer la partie</button>
        </template>
      </div>

      <button class="back-button" @click="goHome">← Retour à l'accueil</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { io, type Socket } from 'socket.io-client'
import { SOCKET_URL, apiUrl } from '@/config/env'

const router = useRouter()

const gameId = localStorage.getItem('gameId') || ''
const gameCode = ref(localStorage.getItem('gameCode') || '------')
const isFull = ref(false)
const otherPlayerName = ref('')

const inviteLink = ref(`${window.location.origin}/join?code=${gameCode.value}`)

let socket: Socket | null = null
let pollTimer: number | null = null

interface LobbyPlayer { id: string; firstName: string; lastName: string; role: number }
interface Lobby {
  gameId: string
  code: string
  status: string
  players: LobbyPlayer[]
  full: boolean
}

const applyLobby = (lobby: Lobby) => {
  gameCode.value = lobby.code || gameCode.value
  isFull.value = lobby.full || lobby.status === 'active'
  const myId = localStorage.getItem('playerId')
  const other = lobby.players.find((p) => p.id !== myId)
  if (other) otherPlayerName.value = `${other.firstName} ${other.lastName}`
  if (lobby.full && lobby.status === 'active') {
    // Redirection automatique possible, mais on laisse le créateur cliquer
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  }
}

const pollLobby = async () => {
  if (!gameId) return
  try {
    const res = await fetch(apiUrl(`/api/games/${gameId}/lobby`))
    if (!res.ok) return
    applyLobby(await res.json())
  } catch {
    // erreur réseau : on retentera au prochain tour de polling
  }
}

const connectSocket = () => {
  try {
    socket = io(SOCKET_URL, { reconnectionAttempts: 3 })
    socket.on('connect', () => {
      socket?.emit('game:join', { gameId })
    })
    socket.on('lobby:state', (lobby: Lobby) => applyLobby(lobby))
  } catch {
    // socket indisponible → le polling prend le relais
  }
}

const copyCode = () => {
  navigator.clipboard.writeText(gameCode.value)
    .then(() => alert('Code copié! 📋'))
    .catch(() => alert(`Code: ${gameCode.value}`))
}

const copyLink = () => {
  navigator.clipboard.writeText(inviteLink.value)
    .then(() => alert('Lien copié! 🔗'))
    .catch(() => alert(`Lien: ${inviteLink.value}`))
}

const shareNative = () => {
  if (navigator.share) {
    navigator.share({ title: 'Entre Nous', text: `Rejoins ma partie avec le code ${gameCode.value}`, url: inviteLink.value })
      .catch(() => { })
  } else {
    copyLink()
  }
}

const startGame = () => {
  router.push(`/game/${gameId}`)
}

const goHome = () => {
  router.push('/')
}

onMounted(() => {
  connectSocket()
  pollLobby()
  // Polling de secours si le socket ne fonctionne pas
  pollTimer = window.setInterval(() => {
    if (!isFull.value) pollLobby()
  }, 3000)
})

onUnmounted(() => {
  socket?.disconnect()
  if (pollTimer) clearInterval(pollTimer)
})
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
}

.wait-container {
  min-height: 100vh;
  background: var(--bg-light);
  color: var(--text-primary);
}

header {
  text-align: center;
  padding: 2rem 1rem 1rem;
}

.logo {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.3rem;
  color: var(--accent-burgundy);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.main-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
  text-align: center;
}

.code-display,
.link-display {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.25rem 0;
  box-shadow: 0 2px 8px rgba(44, 36, 32, 0.08);
}

.code-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.code {
  font-family: 'Courier New', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: var(--accent-burgundy);
  margin-bottom: 1rem;
}

.invite-link {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--text-secondary);
  word-break: break-all;
  margin-bottom: 1rem;
}

.copy-button,
.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--bg-light);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.9rem;
  margin: 0 0.25rem;
}

.copy-button:hover,
.share-button:hover {
  border-color: var(--accent-rose);
  color: var(--accent-burgundy);
}

.link-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.waiting-indicator {
  margin: 2rem 0;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--accent-rose);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  color: var(--text-secondary);
}

.status-text.ready {
  color: #16803C;
  font-weight: 600;
  font-size: 1.1rem;
}

.start-button {
  margin-top: 1rem;
  padding: 0.8rem 2rem;
  background: var(--accent-burgundy);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.start-button:hover {
  background: var(--accent-rose);
}

.back-button {
  margin-top: 1rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
}

.back-button:hover {
  color: var(--accent-burgundy);
}

@media (max-width: 480px) {
  .code {
    font-size: 2rem;
  }
}
</style>
