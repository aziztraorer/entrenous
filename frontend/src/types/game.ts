/**
 * Game-related types
 */

export type GameStatus = 'waiting' | 'active' | 'ended'
export type ChallengeType = 'open_question' | 'creative' | 'quick' | 'mirror'
export type ChallengeCategory = 'social' | 'personal' | 'fun' | 'deep'

export interface Challenge {
  id: string
  type: ChallengeType
  prompt: string
  category: ChallengeCategory
  timeLimit: number | null
  active: boolean
}

export interface Response {
  id: string
  challengeId: string
  playerRole: 1 | 2
  content: string
  createdAt: string
}

export interface Player {
  id: string
  role: 1 | 2
  joinedAt: string
  lastActivity?: string
}

export interface Game {
  id: string
  code: string
  status: GameStatus
  createdAt: string
  expiresAt: string
  players: Player[]
  currentChallenge?: Challenge
  responses: Response[]
  token?: string
}

export interface GameState {
  gameId: string | null
  gameCode: string | null
  game: Game | null
  status: GameStatus | null
  currentPlayerRole: 1 | 2 | null
  token: string | null
  loading: boolean
  error: string | null
}
