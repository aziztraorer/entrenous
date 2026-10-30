/**
 * PROMPT 7 — Tests du parcours de création/participation à une partie
 *  1. Création de partie (joueur 1)
 *  2. Validation du lien d'invitation
 *  3. Deuxième joueur rejoint (place disponible)
 *  4. Rejet d'un troisième joueur
 *  5. Reconnexion possible
 *
 * Utilise la vraie base (DATABASE_URL du .env) — les parties créées sont nettoyées.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { gameRoutes } from '@/routes/game'
import { prisma } from '@/database/prisma'

describe('Game Flow (PROMPT 7)', () => {
  let app: FastifyInstance
  const createdGameIds: string[] = []

  beforeAll(async () => {
    app = Fastify()
    // Socket.IO n'est pas initialisé en test : (fastify as any).io est undefined — le code le gère.
    await gameRoutes(app)
  })

  afterAll(async () => {
    // Nettoyage
    if (createdGameIds.length > 0) {
      await prisma.game.deleteMany({ where: { id: { in: createdGameIds } } })
    }
    await app.close()
  })

  it('1. Crée une partie avec prénom, nom et catégories', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: {
        firstName: 'Alice',
        lastName: 'Martin',
        categories: ['social', 'deep'],
      },
    })

    expect(res.statusCode).toBe(201)
    const body = JSON.parse(res.payload)
    expect(body.gameCode).toMatch(/^[A-Z0-9]{6}$/)
    expect(body.gameId).toBeDefined()
    expect(body.sessionToken).toBeDefined()
    expect(body.playerId).toBeDefined()
    expect(body.inviteLink).toContain(body.gameCode)
    createdGameIds.push(body.gameId)
  })

  it('1b. Rejette une création sans nom', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: '', lastName: '', categories: ['social'] },
    })
    expect(res.statusCode).toBe(400)
  })

  it('2. Valide un lien d\u2019invitation (code valide, place disponible)', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    const { gameId, gameCode } = JSON.parse(create.payload)
    createdGameIds.push(gameId)

    const res = await app.inject({
      method: 'GET',
      url: `/api/games/code/${gameCode}`,
    })
    expect(res.statusCode).toBe(200)
    const lobby = JSON.parse(res.payload)
    expect(lobby.code).toBe(gameCode)
    expect(lobby.full).toBe(false)
  })

  it('2b. Rejette un lien avec un code inexistant', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/games/code/ZZZZZZ',
    })
    expect(res.statusCode).toBe(404)
  })

  it('2c. Rejette un code de format invalide', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/games/code/ABC',
    })
    expect(res.statusCode).toBe(400)
  })

  it('3. Le deuxième joueur rejoint la partie', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    const { gameId, gameCode } = JSON.parse(create.payload)
    createdGameIds.push(gameId)

    const res = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: {
        code: gameCode,
        firstName: 'Bob',
        lastName: 'Dupont',
        categories: ['deep'],
      },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.gameId).toBe(gameId)
    expect(body.role).toBe(2)
    expect(body.rejoined).toBe(false)

    // La partie est maintenant pleine et active
    const lobbyRes = await app.inject({ method: 'GET', url: `/api/games/${gameId}/lobby` })
    const lobby = JSON.parse(lobbyRes.payload)
    expect(lobby.full).toBe(true)
    expect(lobby.players).toHaveLength(2)
  })

  it('4. Un troisième joueur est rejeté (409 GAME_FULL)', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    const { gameId, gameCode } = JSON.parse(create.payload)
    createdGameIds.push(gameId)

    // Joueur 2
    const join2 = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: { code: gameCode, firstName: 'Bob', lastName: 'Dupont', categories: ['deep'] },
    })
    expect(join2.statusCode).toBe(200)

    // Joueur 3 → rejeté
    const join3 = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: { code: gameCode, firstName: 'Charlie', lastName: 'Petit', categories: ['social'] },
    })
    expect(join3.statusCode).toBe(409)
    const body = JSON.parse(join3.payload)
    expect(body.message).toContain('déjà complète')
  })

  it('5. Reconnexion : le même joueur récupère sa session', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    const { gameId, gameCode, playerId } = JSON.parse(create.payload)
    createdGameIds.push(gameId)

    const res = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: { code: gameCode, firstName: 'alice', lastName: 'martin', categories: ['social'] },
    })

    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.payload)
    expect(body.rejoined).toBe(true)
    expect(body.playerId).toBe(playerId)
  })

  it('6. Rejette une participation sans catégorie', async () => {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    let gameCode = ''
    if (create.statusCode === 201) {
      const body = JSON.parse(create.payload)
      gameCode = body.gameCode
      const created = await prisma.game.findUnique({ where: { code: gameCode } })
      if (created) createdGameIds.push(created.id)
    }

    const res = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: { code: gameCode, firstName: 'Bob', lastName: 'Dupont', categories: [] },
    })
    expect(res.statusCode).toBe(400)
  })
})
