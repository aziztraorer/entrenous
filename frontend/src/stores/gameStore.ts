/**
 * Game State Management (Pinia)
 * Manages game state, players, challenges, and responses
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Game, GameStatus } from '@/types'

export const useGameStore = defineStore('game', () => {
  // State
  const gameId = ref<string | null>(null)
  const gameCode = ref<string | null>(null)
  const game = ref<Game | null>(null)
  const status = ref<GameStatus | null>(null)
  const currentPlayerRole = ref<1 | 2 | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isGameActive = computed(() => status.value === 'active')
  const isGameWaiting = computed(() => status.value === 'waiting')
  const isGameEnded = computed(() => status.value === 'ended')

  const playersCount = computed(() => game.value?.players.length ?? 0)
  const otherPlayer = computed(() => {
    if (!game.value || !currentPlayerRole.value) return null
    const otherRole = currentPlayerRole.value === 1 ? 2 : 1
    return game.value.players.find((p) => p.role === otherRole)
  })

  const currentChallenge = computed(() => game.value?.currentChallenge)
  const lastResponse = computed(() => {
    if (!currentChallenge.value) return null
    return game.value?.responses?.find((r) => r.challengeId === currentChallenge.value?.id)
  })

  // Actions
  const setGameData = (data: Partial<Game>): void => {
    game.value = { ...game.value, ...data } as Game
  }

  const setGameId = (id: string): void => {
    gameId.value = id
  }

  const setGameCode = (code: string): void => {
    gameCode.value = code
  }

  const setStatus = (newStatus: GameStatus): void => {
    status.value = newStatus
  }

  const setCurrentPlayerRole = (role: 1 | 2): void => {
    currentPlayerRole.value = role
  }

  const setToken = (newToken: string): void => {
    token.value = newToken
    // Store in sessionStorage for PWA support
    sessionStorage.setItem('entre-nous-token', newToken)
  }

  const setLoading = (isLoading: boolean): void => {
    loading.value = isLoading
  }

  const setError = (errorMessage: string | null): void => {
    error.value = errorMessage
  }

  const resetGame = (): void => {
    gameId.value = null
    gameCode.value = null
    game.value = null
    status.value = null
    currentPlayerRole.value = null
    token.value = null
    error.value = null
    sessionStorage.removeItem('entre-nous-token')
  }

  // Restore token from session
  const restoreToken = (): void => {
    const storedToken = sessionStorage.getItem('entre-nous-token')
    if (storedToken) {
      token.value = storedToken
    }
  }

  return {
    // State
    gameId,
    gameCode,
    game,
    status,
    currentPlayerRole,
    token,
    loading,
    error,

    // Computed
    isGameActive,
    isGameWaiting,
    isGameEnded,
    playersCount,
    otherPlayer,
    currentChallenge,
    lastResponse,

    // Actions
    setGameData,
    setGameId,
    setGameCode,
    setStatus,
    setCurrentPlayerRole,
    setToken,
    setLoading,
    setError,
    resetGame,
    restoreToken,
  }
})
