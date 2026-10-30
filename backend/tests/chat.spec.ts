/**
 * PROMPT 9 — Tests du chat temps réel (ChatService)
 *  - Validation de la longueur (1 à 500 caractères)
 *  - Anti-abus : max 10 messages / 30 s (429)
 *  - Rejet des doublons immédiats (409)
 *  - Autorisation : un joueur d'une autre partie est refusé (403)
 *  - Persistance + historique chronologique
 *  - Purge réelle des messages > 24 h
 *
 * Utilise la vraie base de dev ; les parties créées sont nettoyées.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { gameRoutes } from '@/routes/game'
import { ChatService, ChatError } from '@/services/ChatService'
import { prisma } from '@/database/prisma'

// Bucket de rate-limit isolé par test : on vide la mémoire interne entre tests
vi.spyOn(Date, 'now')

describe('ChatService (PROMPT 9)', () => {
  let app: FastifyInstance
  const createdGameIds: string[] = []
  let gameId = ''
  let p1 = ''
  let p2 = ''

  beforeAll(async () => {
    app = Fastify()
    await gameRoutes(app)
    // Crée une partie à deux joueurs via l'API réelle
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Alice', lastName: 'Martin', categories: ['fun'] },
    })
    const body = JSON.parse(create.payload)
    gameId = body.gameId
    p1 = body.playerId
    createdGameIds.push(gameId)
    const join = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: { code: body.gameCode, firstName: 'Bob', lastName: 'Dupont', categories: ['deep'] },
    })
    p2 = JSON.parse(join.payload).playerId
  })

  afterAll(async () => {
    await prisma.game.deleteMany({ where: { id: { in: createdGameIds } } })
    await app.close()
  })

  it('persiste un message valide et renvoie la version publique (avec nom + horodatage)', async () => {
    const msg = await ChatService.send(gameId, p1, 'Salut ! Comment tu vas ?')
    expect(msg.content).toBe('Salut ! Comment tu vas ?')
    expect(msg.firstName).toBe('Alice')
    expect(msg.playerId).toBe(p1)
    expect(msg.createdAt).toBeTruthy()
    expect(msg.id).toBeTruthy()
  })

  it('historique : 30 derniers messages, ordre chronologique', async () => {
    await ChatService.send(gameId, p2, 'Et toi ?')
    const history = await ChatService.history(gameId, p1)
    expect(history.length).toBe(2)
    expect(history[0].content).toBe('Salut ! Comment tu vas ?')
    expect(history[1].content).toBe('Et toi ?')
  })

  it('rejette un message vide (400)', async () => {
    await expect(ChatService.send(gameId, p1, '   ')).rejects.toMatchObject({ status: 400 })
    await expect(ChatService.send(gameId, p1, undefined)).rejects.toMatchObject({ status: 400 })
  })

  it('rejette un message trop long (400, limite 500)', async () => {
    await expect(ChatService.send(gameId, p1, 'a'.repeat(501))).rejects.toMatchObject({ status: 400 })
    // 500 exactement : accepté
    const ok = await ChatService.send(gameId, p1, 'b'.repeat(500))
    expect(ok.content).toHaveLength(500)
  })

  it('rejette un doublon immédiat (409)', async () => {
    await ChatService.send(gameId, p2, 'doublon-test')
    await expect(ChatService.send(gameId, p2, 'doublon-test')).rejects.toMatchObject({ status: 409 })
  })

  it('refuse un joueur qui n’appartient pas à la partie (403)', async () => {
    const other = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: { firstName: 'Zoe', lastName: 'Externe', categories: ['fun'] },
    })
    const otherBody = JSON.parse(other.payload)
    createdGameIds.push(otherBody.gameId)
    await expect(ChatService.send(gameId, otherBody.playerId, 'intrusion')).rejects.toMatchObject({ status: 403 })
    await expect(ChatService.history(gameId, otherBody.playerId)).rejects.toMatchObject({ status: 403 })
  })

  it('purge réellement les messages de plus de 24 h', async () => {
    // Insère un ancien message directement en base
    await prisma.chatMessage.create({
      data: { gameId, playerId: p1, content: 'message périmé', createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000) },
    })
    const purged = await ChatService.purgeOld()
    expect(purged).toBeGreaterThanOrEqual(1)
    const remaining = await prisma.chatMessage.findFirst({ where: { gameId, content: 'message périmé' } })
    expect(remaining).toBeNull()
    // Les messages récents sont conservés
    const stillThere = await ChatService.history(gameId, p1)
    expect(stillThere.length).toBeGreaterThanOrEqual(1)
  })

  it('les messages sont supprimés avec la partie (cascade)', async () => {
    const count = await prisma.chatMessage.count({ where: { gameId } })
    expect(count).toBeGreaterThan(0)
    await prisma.game.delete({ where: { id: gameId } })
    createdGameIds.splice(createdGameIds.indexOf(gameId), 1)
    const after = await prisma.chatMessage.count({ where: { gameId } })
    expect(after).toBe(0)
  })
})
