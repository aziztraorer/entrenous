/**
 * Game routes
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { CreateGameResponse, JoinGameResponse } from '@/types'

export async function setupGameRoutes(app: FastifyInstance): Promise<void> {
  // POST /games - Create a new game
  app.post<{ Reply: CreateGameResponse }>('/games', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(201).send({
      id: 'game_' + Math.random().toString(36).substring(7),
      code: 'ABC123',
      token: 'jwt_token_here',
      status: 'waiting',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  })

  // GET /games/:gameId - Get game details
  app.get<{ Params: { gameId: string } }>('/games/:gameId', async (request: FastifyRequest, reply: FastifyReply) => {
    const { gameId } = request.params as { gameId: string }

    return reply.send({
      id: gameId,
      code: 'ABC123',
      status: 'waiting',
      players: [],
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  })

  // POST /games/:gameId/join - Join an existing game
  app.post<{ Params: { gameId: string }; Reply: JoinGameResponse }>(
    '/games/:gameId/join',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { gameId } = request.params as { gameId: string }

      return reply.send({
        id: gameId,
        code: 'ABC123',
        status: 'waiting',
        players: [
          { id: 'player_1', role: 1 },
          { id: 'player_2', role: 2 },
        ],
        token: 'jwt_token_here',
      })
    }
  )
}
