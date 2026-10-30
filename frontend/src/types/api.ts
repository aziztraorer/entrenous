/**
 * API response types
 */

export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error'
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface CreateGameResponse {
  id: string
  code: string
  token: string
  status: string
  createdAt: string
  expiresAt: string
}

export interface JoinGameResponse {
  id: string
  code: string
  status: string
  players: Array<{ id: string; role: 1 | 2 }>
  token: string
}

export interface HealthResponse {
  status: 'ok'
  timestamp: string
}
