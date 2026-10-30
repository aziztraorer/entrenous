/**
 * Socket.IO Service
 * Real-time communication with backend
 */

import { io, type Socket } from 'socket.io-client'
import type { Challenge, Response } from '@/types'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

export interface SocketEvents {
  // Realtime game state (PROMPT 9) : même état pour les deux joueurs
  'game:state': (data: {
    status: 'active' | 'ended';
    question: { id: string; prompt: string } | null;
    turn: number;
    total: number;
    activePlayerId: string | null;
  }) => void
  'game:action': (data: { questionId: string; kind: 'answer' | 'skip'; content?: string }) => void
  'game:error': (data: { status: number; message: string }) => void

  // Chat (PROMPT 9)
  'chat:send': (data: { content: string }) => void
  'chat:history': (data: Array<{ id: string; playerId: string; firstName: string; content: string; createdAt: string }>) => void
  'chat:message': (data: { id: string; playerId: string; firstName: string; content: string; createdAt: string }) => void
  'chat:error': (data: { status: number; message: string }) => void

  // Game events
  'game:created': (data: { gameId: string; code: string; token: string; playerId: string }) => void
  'game:joined': (data: { gameId: string; token: string; playerId: string; role: 1 | 2 }) => void
  'game:playerJoined': (data: { playerId: string; role: 1 | 2; totalPlayers: number }) => void
  'game:started': (data: { gameId: string; firstChallenge: Challenge }) => void
  'game:playerLeft': (data: { playerId: string; reason: string }) => void
  'game:ended': (data: { gameId: string; reason: string; endedAt: string }) => void

  // Challenge events
  'challenge:new': (data: { challengeId: string; type: string; prompt: string; category: string; timeLimit: number | null }) => void
  'challenge:next': (data: { challengeId: string; responses: Response[] }) => void

  // Response events
  'response:submitted': (data: { status: 'ok'; challengeId: string }) => void
  'response:received': (data: { playerRole: 1 | 2; hasResponded: boolean }) => void

  // Error events
  error: (data: { code: string; message: string }) => void
  connect: () => void
  disconnect: () => void
  connect_error: (error: Error) => void
}

class SocketService {
  private socket: Socket | null = null
  private listeners: Map<keyof SocketEvents, Set<Function>> = new Map()

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          auth: token ? { token } : undefined,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        })

        this.socket.on('connect', () => {
          console.log('Socket connected')
          this.emitLocal('connect')
          resolve()
        })

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error)
          this.emitLocal('connect_error', error)
          reject(error)
        })

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected')
          this.emitLocal('disconnect')
        })

        // Setup event forwarding
        this.setupEventForwarding()
      } catch (error) {
        reject(error)
      }
    })
  }

  private setupEventForwarding(): void {
    if (!this.socket) return

    const events: Array<keyof SocketEvents> = [
      'game:state',
      'game:error',
      'chat:history',
      'chat:message',
      'chat:error',
      'game:created',
      'game:joined',
      'game:playerJoined',
      'game:started',
      'game:playerLeft',
      'game:ended',
      'challenge:new',
      'challenge:next',
      'response:submitted',
      'response:received',
      'error',
    ]

    events.forEach((event) => {
      this.socket?.on(event, (data: unknown) => {
        this.emit(event as keyof SocketEvents, data)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /** Événements réservés de Socket.IO côté client — jamais envoyés via socket.emit() */
  private readonly reservedEvents = new Set([
    'connect', 'disconnect', 'connect_error', 'connect_timeout',
    'reconnect', 'reconnect_attempt', 'reconnecting', 'reconnect_error',
    'reconnect_failed', 'ping', 'pong', 'error',
  ])

  emit(event: keyof SocketEvents, ...args: unknown[]): void {
    // Ne jamais envoyer d'événements réservés via le socket (erreur Socket.IO)
    if (!this.reservedEvents.has(event as string) && this.socket) {
      this.socket.emit(event, ...args)
    }
    // Déclencher toujours les listeners locaux
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(...args))
    }
  }

  /** Émet uniquement auprès des listeners locaux (pas de socket) */
  emitLocal(event: keyof SocketEvents, ...args: unknown[]): void {
    const listeners = this.listeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(...args))
    }
  }

  on<K extends keyof SocketEvents>(event: K, callback: SocketEvents[K]): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback as Function)

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback as Function)
    }
  }

  off<K extends keyof SocketEvents>(event: K, callback?: SocketEvents[K]): void {
    if (callback) {
      this.listeners.get(event)?.delete(callback as Function)
    } else {
      this.listeners.delete(event)
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /** Reconnexion après coupure : rejoint la salle avec le token de session */
  reconnect(token: string): Promise<void> {
    this.disconnect()
    return this.connect(token)
  }

  /** Chat — envoi (validation longueur côté client, serveur revalide) */
  sendChat(content: string): void {
    const trimmed = content.trim()
    if (!trimmed || trimmed.length > 500) return
    this.socket?.emit('chat:send', { content: trimmed })
  }

  /** Action de jeu temps réel (répondre / passer) */
  sendGameAction(questionId: string, kind: 'answer' | 'skip', content?: string): void {
    this.socket?.emit('game:action', { questionId, kind, content })
  }

  // Game actions
  createGame(): void {
    this.emit('game:create' as keyof SocketEvents, {})
  }

  joinGame(code: string): void {
    this.emit('game:join' as keyof SocketEvents, { code })
  }

  leaveGame(): void {
    this.emit('game:leave' as keyof SocketEvents, {})
  }

  // Response actions
  submitResponse(challengeId: string, content: string): void {
    this.emit('response:submit' as keyof SocketEvents, { challengeId, content })
  }

  readyForNextChallenge(challengeId: string): void {
    this.emit('challenge:ready' as keyof SocketEvents, { challengeId })
  }
}

export const socketService = new SocketService()
