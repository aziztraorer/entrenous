/**
 * PROMPT 8 — Tests du moteur de questions (QuestionEngine)
 *  - Pioche : ~50 questions par catégorie, déduplication inter-catégories
 *  - Union des catégories des deux joueurs (pas seulement l'intersection)
 *  - Catégorie intime réservée aux adultes consentants
 *  - Mélange aléatoire, jamais de doublon dans une partie
 *  - Premier joueur aléatoire puis alternance stricte
 *  - Seul le joueur actif peut répondre/passer ; clics répétés rejetés
 *  - publicState ne révèle jamais les questions futures ni les catégories
 *
 * Tests purs (sans base) pour la logique, + tests d'intégration HTTP
 * sur la vraie base de dev, avec nettoyage.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import {
  buildDeck,
  initialize,
  publicState,
  advance,
  EngineError,
  QuestionEngine,
} from '@/services/QuestionEngine'
import { QUESTIONS, CATEGORY_LABELS } from '@/data/questions'
import { gameRoutes } from '@/routes/game'
import { prisma } from '@/database/prisma'

const norm = (s: string) =>
  s.normalize('NFKC').toLocaleLowerCase('fr').replace(/[\p{P}\s]/gu, '')

describe('Catalogue de questions (PROMPT 8)', () => {
  it('couvre les 8 catégories attendues', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(8)
    expect(Object.keys(CATEGORY_LABELS)).toEqual([
      'love', 'friendship', 'childhood', 'dreams',
      'fun', 'personality', 'deep', 'intimacy',
    ])
  })

  it('contient environ 50 questions par catégorie, sans doublons (nombre réel, pas inventé)', () => {
    const counts: Record<string, number> = {}
    for (const [category, list] of Object.entries(QUESTIONS)) {
      expect(list.length, category).toBeGreaterThanOrEqual(45)
      expect(list.length, category).toBeLessThanOrEqual(50)
      expect(new Set(list.map(norm)).size, category).toBe(list.length)
      counts[category] = list.length
    }
    // Journal explicite : le test affiche les vrais effectifs.
    console.log('Effectifs réels par catégorie :', counts)
  })
})

describe('buildDeck (PROMPT 8)', () => {
  it('fusionne les questions des catégories demandées', () => {
    const deck = buildDeck(['love', 'fun'])
    expect(deck).toHaveLength(QUESTIONS.love.length + QUESTIONS.fun.length)
  })

  it('déduplique une question présente dans plusieurs catégories', () => {
    const source = {
      love: ['Même question ?'],
      fun: ['Même question ?', 'Autre question.'],
    }
    const deck = buildDeck(['love', 'fun'], source as any)
    expect(deck.map((q) => norm(q.prompt))).toEqual(['mêmequestion', 'autrequestion'])
  })

  it('identifie chaque carte de façon unique', () => {
    const deck = buildDeck(['deep'])
    const ids = new Set(deck.map((q) => q.id))
    expect(ids.size).toBe(deck.length)
  })
})

describe('initialize (PROMPT 8)', () => {
  const players = [
    { id: 'A', categories: JSON.stringify(['love', 'fun']), adultConsent: false },
    { id: 'B', categories: JSON.stringify(['deep']), adultConsent: false },
  ]

  it('utilise l’UNION des catégories choisies par au moins un des deux joueurs', () => {
    const state = initialize(players)
    const expected = QUESTIONS.love.length + QUESTIONS.fun.length + QUESTIONS.deep.length
    expect(state.deck).toHaveLength(expected)
  })

  it('mélange la pioche (ordre différent des catégories triées, avec tolérance statistique)', () => {
    const a = initialize(players)
    const b = initialize(players)
    // Deux tirages différents ont une proba quasi nulle d'être identiques (398! ordres).
    const same =
      a.deck.map((q) => q.prompt).join('|') === b.deck.map((q) => q.prompt).join('|')
    expect(same).toBe(false)
  })

  it('ne contient jamais deux fois la même question', () => {
    const state = initialize(players)
    const keys = new Set(state.deck.map((q) => norm(q.prompt)))
    expect(keys.size).toBe(state.deck.length)
  })

  it('choisit le premier joueur parmi les deux, aléatoirement', () => {
    const choices = new Set(
      Array.from({ length: 30 }, () => initialize(players).firstPlayer),
    )
    expect(choices.has('A')).toBe(true)
    expect(choices.has('B')).toBe(true)
    expect([...choices].every((id) => id === 'A' || id === 'B')).toBe(true)
  })

  it('exclut la catégorie intime si un joueur n’a pas consenti', () => {
    const withIntimacy = [
      { id: 'A', categories: JSON.stringify(['intimacy']), adultConsent: true },
      { id: 'B', categories: JSON.stringify(['fun']), adultConsent: false },
    ]
    const state = initialize(withIntimacy)
    expect(state.deck).toHaveLength(QUESTIONS.fun.length)
  })

  it('inclut la catégorie intime si les DEUX joueurs ont consenti', () => {
    const both = [
      { id: 'A', categories: JSON.stringify(['intimacy']), adultConsent: true },
      { id: 'B', categories: JSON.stringify(['fun']), adultConsent: true },
    ]
    const state = initialize(both)
    expect(state.deck).toHaveLength(QUESTIONS.intimacy.length + QUESTIONS.fun.length)
  })
})

describe('publicState et advance (PROMPT 8)', () => {
  function setup() {
    return initialize([
      { id: 'A', categories: JSON.stringify(['fun']), adultConsent: false },
      { id: 'B', categories: JSON.stringify(['fun']), adultConsent: false },
    ])
  }

  it('n’expose que la question courante : jamais les questions futures ni les catégories', () => {
    const state = setup()
    const view: any = publicState(state)
    expect(view.question).toEqual({ id: '0', prompt: state.deck[0].prompt })
    // Pas de tableau de questions, pas de champ categories/catégories secrètes.
    expect(view.deck).toBeUndefined()
    expect(view.categories).toBeUndefined()
    expect(Object.keys(view)).toEqual(
      expect.arrayContaining(['status', 'question', 'turn', 'total', 'activePlayerId']),
    )
  })

  it('désigne le premier joueur comme actif, puis alterne strictement', () => {
    let state = setup()
    const first = publicState(state).activePlayerId
    const second = first === 'A' ? 'B' : 'A'
    state = advance(state, first!, '0')
    expect(publicState(state).activePlayerId).toBe(second)
    state = advance(state, second!, '1')
    expect(publicState(state).activePlayerId).toBe(first)
  })

  it('refuse une réponse du joueur non actif (403)', () => {
    const state = setup()
    const view = publicState(state)
    const inactive = view.activePlayerId === 'A' ? 'B' : 'A'
    expect(() => advance(state, inactive!, '0')).toThrow(EngineError)
    try {
      advance(state, inactive!, '0')
    } catch (e) {
      expect((e as EngineError).status).toBe(403)
    }
  })

  it('refuse d’avancer deux fois sur la même question (clics répétés → 409)', () => {
    let state = setup()
    const view = publicState(state)
    const active = view.activePlayerId!
    state = advance(state, active, '0')
    // Rejouer la question déjà utilisée sur l'état persisté → 409
    expect(() => advance(state, active, '0')).toThrow(/déjà été utilisée/)
    try {
      advance(state, active, '0')
    } catch (e) {
      expect((e as EngineError).status).toBe(409)
    }
    // Le tour n'a avancé que d'une seule question malgré la tentative répétée
    expect(publicState(state).turn).toBe(1)
  })

  it('marque les questions passées comme utilisées', () => {
    let state = setup()
    const active = publicState(state).activePlayerId!
    state = advance(state, active, '0')
    expect(state.used).toHaveLength(1)
    expect(state.used[0]).toBe(state.deck[0].id)
    state = advance(state, publicState(state).activePlayerId!, '1')
    expect(state.used).toEqual([state.deck[0].id, state.deck[1].id])
  })

  it('passe en statut "ended" quand la pioche est épuisée (écran de fin)', () => {
    const source = { fun: ['Q1', 'Q2'] }
    let state = initialize([
      { id: 'A', categories: JSON.stringify(['fun']), adultConsent: false },
      { id: 'B', categories: JSON.stringify(['fun']), adultConsent: false },
    ])
    // Pioche courte injectée pour le test de fin
    state = { ...state, deck: buildDeck(['fun'], source as any) }
    let view = publicState(state)
    expect(view.status).toBe('active')
    state = advance(state, view.activePlayerId!, '0')
    view = publicState(state)
    expect(view.status).toBe('active')
    state = advance(state, view.activePlayerId!, '1')
    view = publicState(state)
    expect(view.status).toBe('ended')
    expect(view.question).toBeNull()
    expect(view.activePlayerId).toBeNull()
  })
})

/**
 * Intégration HTTP — vraie base de dev, nettoyage après tests.
 */
describe('QuestionEngine.execute via HTTP (PROMPT 8)', () => {
  let app: FastifyInstance
  const createdGameIds: string[] = []

  beforeAll(async () => {
    app = Fastify()
    await gameRoutes(app)
  })

  afterAll(async () => {
    const validIds = createdGameIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    if (validIds.length > 0) {
      await prisma.game.deleteMany({ where: { id: { in: validIds } } })
    }
    await app.close()
  })

  async function createTwoPlayerGame(adult = false) {
    const create = await app.inject({
      method: 'POST',
      url: '/api/games',
      payload: {
        firstName: 'Alice',
        lastName: 'Martin',
        categories: ['fun', ...(adult ? ['intimacy'] : [])],
        adultConfirmed: adult,
        consentAccepted: adult,
      },
    })
    if (create.statusCode !== 201) {
      throw new Error(`Game creation failed: ${create.statusCode} ${create.payload}`)
    }
    const { gameId, gameCode, playerId: p1, sessionToken: t1 } = JSON.parse(create.payload)
    createdGameIds.push(gameId)
    const join = await app.inject({
      method: 'POST',
      url: '/api/games/join',
      payload: {
        code: gameCode,
        firstName: 'Bob',
        lastName: 'Dupont',
        categories: ['deep'],
        adultConfirmed: adult,
        consentAccepted: adult,
      },
    })
    if (join.statusCode !== 200) {
      throw new Error(`Game join failed: ${join.statusCode} ${join.payload}`)
    }
    const { playerId: p2, sessionToken: t2 } = JSON.parse(join.payload)
    return { gameId, p1, p2, t1, t2 }
  }

  it('initialise la partie à la première consultation : union des catégories, un seul joueur actif', async () => {
    const { gameId, t1, t2 } = await createTwoPlayerGame()
    const r1 = await app.inject({
      method: 'GET',
      url: `/api/games/${gameId}/state`,
      headers: { authorization: `Bearer ${t1}` },
    })
    expect(r1.statusCode).toBe(200)
    const v1 = JSON.parse(r1.payload)
    expect(v1.status).toBe('active')
    expect(v1.question).toBeTruthy()
    expect(v1.activePlayerId).toBeTruthy()
    // Le deck est l'union fun + deep (pas seulement l'intersection qui serait vide)
    expect(v1.total).toBe(QUESTIONS.fun.length + QUESTIONS.deep.length)

    // Les deux joueurs voient le même état (même question courante, même actif)
    const r2 = await app.inject({
      method: 'GET',
      url: `/api/games/${gameId}/state`,
      headers: { authorization: `Bearer ${t2}` },
    })
    const v2 = JSON.parse(r2.payload)
    expect(v2.question.prompt).toBe(v1.question.prompt)
    expect(v2.activePlayerId).toBe(v1.activePlayerId)
  })

  it('le joueur inactif ne peut pas répondre (403)', async () => {
    const { gameId, t1, t2, p1, p2 } = await createTwoPlayerGame()
    const state = JSON.parse(
      (
        await app.inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization: `Bearer ${t1}` },
        })
      ).payload,
    )
    // Le joueur inactif est identifié par comparaison avec activePlayerId.
    const inactiveToken = state.activePlayerId === p1 ? t2 : t1
    const r = await app.inject({
      method: 'POST',
      url: `/api/games/${gameId}/action`,
      headers: { authorization: `Bearer ${inactiveToken}` },
      payload: { kind: 'answer', questionId: state.question.id, content: 'Ma réponse.' },
    })
    expect(r.statusCode).toBe(403)
    expect(JSON.parse(r.payload).message).toContain('tour')

    // L'état n'a pas bougé après le refus.
    const after = JSON.parse(
      (
        await app.inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization: `Bearer ${t1}` },
        })
      ).payload,
    )
    expect(after.turn).toBe(state.turn)
  })

  it('un clic répété (même questionId) est rejeté (409) et n’avance pas deux fois', async () => {
    const { gameId, t1, t2 } = await createTwoPlayerGame()
    const s0 = JSON.parse(
      (
        await app.inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization: `Bearer ${t1}` },
        })
      ).payload,
    )
    // Identifie le token du joueur actif en testant chaque token.
    let activeAuthorization = ''
    for (const authorization of [`Bearer ${t1}`, `Bearer ${t2}`]) {
      const probe = await app.inject({
        method: 'POST',
        url: `/api/games/${gameId}/action`,
        headers: { authorization },
        payload: { kind: 'skip', questionId: s0.question.id },
      })
      if (probe.statusCode === 200) {
        activeAuthorization = authorization
        break
      }
    }
    expect(activeAuthorization).toBeTruthy()

    // Le joueur ACTIF tente de rejouer la même question → 409, le tour n'a pas bougé.
    const replay = await app.inject({
      method: 'POST',
      url: `/api/games/${gameId}/action`,
      headers: { authorization: activeAuthorization },
      payload: { kind: 'skip', questionId: s0.question.id },
    })
    expect(replay.statusCode).toBe(409)

    // L'état a bien avancé d'exactement une question malgré les deux tentatives.
    const s1 = JSON.parse(
      (
        await app.inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization: `Bearer ${t1}` },
        })
      ).payload,
    )
    expect(s1.turn).toBe(s0.turn + 1)
    expect(s1.question.id).toBe(String(s0.turn + 1))
  })

  it('les réponses alternent entre les deux joueurs', async () => {
    const { gameId, t1, t2 } = await createTwoPlayerGame()
    const stateOf = (authorization: string) =>
      app
        .inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization },
        })
        .then((r) => JSON.parse(r.payload))

    let s = await stateOf(`Bearer ${t1}`)
    const active = [s.activePlayerId, null]
    // Premier actionneur = joueur actif
    let firstToken = ''
    for (const authorization of [`Bearer ${t1}`, `Bearer ${t2}`]) {
      const probe = await app.inject({
        method: 'POST',
        url: `/api/games/${gameId}/action`,
        headers: { authorization },
        payload: { kind: 'answer', questionId: s.question.id, content: 'Réponse 1.' },
      })
      if (probe.statusCode === 200) {
        firstToken = authorization
        break
      }
    }
    expect(firstToken).toBeTruthy()
    const secondToken = firstToken === `Bearer ${t1}` ? `Bearer ${t2}` : `Bearer ${t1}`

    s = await stateOf(firstToken)
    const r2 = await app.inject({
      method: 'POST',
      url: `/api/games/${gameId}/action`,
      headers: { authorization: secondToken },
      payload: { kind: 'answer', questionId: s.question.id, content: 'Réponse 2.' },
    })
    expect(r2.statusCode).toBe(200)
    const after = JSON.parse(r2.payload)
    expect(after.turn).toBe(2)
    expect(after.activePlayerId).toBe(active[0]) // retour au premier joueur

    // Chaque réponse a été enregistrée en base
    const stored = await prisma.response.findMany({
      where: { gameId },
      orderBy: { createdAt: 'asc' },
    })
    expect(stored).toHaveLength(2)
  })

  it('une réponse vide est rejetée (400)', async () => {
    const { gameId, t1, t2 } = await createTwoPlayerGame()
    const s0 = JSON.parse(
      (
        await app.inject({
          method: 'GET',
          url: `/api/games/${gameId}/state`,
          headers: { authorization: `Bearer ${t1}` },
        })
      ).payload,
    )
    const codes: number[] = []
    for (const authorization of [`Bearer ${t1}`, `Bearer ${t2}`]) {
      const r = await app.inject({
        method: 'POST',
        url: `/api/games/${gameId}/action`,
        headers: { authorization },
        payload: { kind: 'answer', questionId: s0.question.id, content: '   ' },
      })
      codes.push(r.statusCode)
    }
    expect(codes).toContain(400)
    expect(codes).toContain(403) // le non-actif reste refusé avant même la validation
  })

  it('sans session valide : 401, sans aucune fuite d’état', async () => {
    const { gameId } = await createTwoPlayerGame()
    const r = await app.inject({
      method: 'GET',
      url: `/api/games/${gameId}/state`,
      headers: { authorization: 'Bearer invalide' },
    })
    expect(r.statusCode).toBe(401)
  })
})
