/**
 * Routes de partie — PROMPT 7
 *  POST /api/games          → créer une partie (joueur 1)
 *  GET  /api/games/code/:code → valider un lien d'invitation
 *  GET  /api/games/:gameId/lobby → état de la salle d'attente
 *  POST /api/games/join     → rejoindre (joueur 2, max 2, 3e rejeté)
 */

import type { FastifyInstance } from 'fastify';
import { GameService } from '@/services/GameService';
import { prisma } from '@/database/prisma';

import { normalizeCategories } from '@/data/questions';
import { EngineError, QuestionEngine } from '@/services/QuestionEngine';

interface NameBody {
  firstName?: unknown;
  lastName?: unknown;
  categories?: unknown;
  adultConfirmed?: unknown;
  consentAccepted?: unknown;
}

/** Validation légère et messages d'erreur compréhensibles */
function validateBody(body: NameBody) {
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
  const categories = Array.isArray(body.categories)
    ? normalizeCategories(body.categories.filter((c): c is string => typeof c === 'string'))
    : [];

  if (!firstName || !lastName) {
    return { error: 'Merci d\'indiquer ton prénom et ton nom.' };
  }
  if (firstName.length > 100 || lastName.length > 100) {
    return { error: 'Le prénom et le nom ne doivent pas dépasser 100 caractères.' };
  }
  if (categories.length === 0) {
    return { error: 'Choisis au moins une catégorie de questions.' };
  }
  const adultConsent = body.adultConfirmed === true && body.consentAccepted === true;
  if (categories.includes('intimacy') && !adultConsent) {
    return { error: 'Cette catégorie nécessite une déclaration de majorité et ton consentement explicite.' };
  }
  return { firstName, lastName, categories, adultConsent };
}

export async function gameRoutes(fastify: FastifyInstance) {
  // Rate limiting per IP — seaux séparés par endpoint pour éviter les interférences
  const createRateBuckets = new Map<string, number[]>();
  const joinRateBuckets = new Map<string, number[]>();
  const actionRateBuckets = new Map<string, number[]>();

  const checkRate = (buckets: Map<string, number[]>, ip: string, max: number, windowMs: number): boolean => {
    const now = Date.now();
    const bucket = (buckets.get(ip) ?? []).filter(t => now - t < windowMs);
    if (bucket.length >= max) return false;
    bucket.push(now);
    buckets.set(ip, bucket);
    return true;
  };

  for (const method of ['GET', 'POST'] as const) {
    fastify.route<{ Params: { gameId: string } }>({
      method, url: method === 'GET' ? '/api/games/:gameId/state' : '/api/games/:gameId/action',
      handler: async (request, reply) => {
        const ip = request.ip || 'unknown';
        if (!checkRate(actionRateBuckets, ip, 120, 60000)) return reply.status(429).send({ message: 'Trop de requêtes.' });
        const token = request.headers.authorization?.replace(/^Bearer /, '') ?? '';
        const session = GameService.verifySession(token);
        if (!session || session.gameId !== request.params.gameId) return reply.status(401).send({ message: 'Session invalide ou expirée.' });
        try {
          const body = request.body as any;
          if (method === 'POST' && (!body || !['answer', 'skip'].includes(body.kind) || typeof body.questionId !== 'string' || (body.content !== undefined && typeof body.content !== 'string'))) {
            return reply.status(400).send({ message: 'Action invalide.' });
          }
          const state = await QuestionEngine.execute(session.gameId, session.playerId, method === 'POST' ? body : undefined);
          // Diffusion temps réel aux deux joueurs (même si l'appel est HTTP)
          const io = (fastify as any).io;
          if (io) io.to(`game:${session.gameId}`).emit('game:state', state);
          return reply.send(state);
        } catch (error) {
          if (error instanceof EngineError) return reply.status(error.status).send({ message: error.message });
          fastify.log.error(error);
          return reply.status(500).send({ message: 'Impossible de mettre la partie à jour.' });
        }
      },
    });
  }
  /**
   * POST /api/games — Créer une partie (premier joueur)
   */
  fastify.post('/api/games', async (request, reply) => {
    const ip = request.ip || 'unknown';
    if (!checkRate(createRateBuckets, ip, 10, 3600000)) return reply.status(429).send({ message: 'Trop de requêtes. Réessaie plus tard.' });
    const v = validateBody((request.body ?? {}) as NameBody);
    if ('error' in v) return reply.status(400).send({ message: v.error });

    try {
      const result = await GameService.createGame({
        firstName: v.firstName!,
        lastName: v.lastName!,
        categories: v.categories!,
        adultConsent: v.adultConsent,
      });
      return reply.status(201).send(result);
    } catch (error) {
      fastify.log.error(error);
      if ((error as Error).message === 'CODE_GENERATION_FAILED') {
        return reply.status(500).send({ message: 'Impossible de générer un code unique. Réessaie.' });
      }
      return reply.status(500).send({ message: 'Erreur interne du serveur.' });
    }
  });

  /**
   * POST /api/games/join — Rejoindre une partie (deuxième joueur)
   */
  fastify.post('/api/games/join', async (request, reply) => {
    const ip = request.ip || 'unknown';
    if (!checkRate(joinRateBuckets, ip, 30, 60000)) return reply.status(429).send({ message: 'Trop de requêtes.' });
    const body = (request.body ?? {}) as NameBody & { code?: unknown };
    const v = validateBody(body);
    if ('error' in v) return reply.status(400).send({ message: v.error });

    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      return reply.status(400).send({ message: 'Le code de partie doit contenir 6 caractères.' });
    }

    try {
      const result = await GameService.joinGame({
        code,
        firstName: v.firstName!,
        lastName: v.lastName!,
        categories: v.categories!,
        adultConsent: v.adultConsent,
      });

      if ('error' in result) {
        const status = result.error === 'GAME_NOT_FOUND' ? 404 : result.error === 'GAME_FULL' ? 409 : 410;
        return reply.status(status).send({ message: result.message });
      }

      // Diffusion temps réel : prévenir le joueur 1 que quelqu'un a rejoint
      const lobby = await GameService.getLobby(result.gameId);
      if (lobby) {
        const io = (fastify as any).io;
        if (io) io.to(`game:${result.gameId}`).emit('lobby:state', lobby);
      }

      return reply.status(200).send(result);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erreur interne du serveur.' });
    }
  });

  /**
   * GET /api/games/code/:code — Valider un lien d'invitation (avant de rejoindre)
   */
  fastify.get<{ Params: { code: string } }>('/api/games/code/:code', async (request, reply) => {
    const code = request.params.code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      return reply.status(400).send({ message: 'Code invalide.' });
    }

    try {
      const lobby = await GameService.getLobbyByCode(code);
      if (!lobby) {
        return reply.status(404).send({ message: "Aucune partie n'existe avec ce code." });
      }
      if (lobby.status === 'ended') {
        return reply.status(410).send({ message: 'Cette partie est terminée.' });
      }
      if (lobby.full) {
        return reply.status(409).send({ message: 'Cette partie est déjà complète (2 joueurs maximum).' });
      }
      return reply.send(lobby);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erreur interne du serveur.' });
    }
  });

  /**
   * GET /api/games/:gameId/lobby — Salle d'attente (polling de secours)
   */
  fastify.get<{ Params: { gameId: string } }>('/api/games/:gameId/lobby', async (request, reply) => {
    try {
      const lobby = await GameService.getLobby(request.params.gameId);
      if (!lobby) {
        return reply.status(404).send({ message: 'Partie introuvable.' });
      }
      return reply.send(lobby);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Erreur interne du serveur.' });
    }
  });

  /**
   * GET /api/games/:gameId/responses — Historique des questions et réponses (affichage uniquement, pas les questions futures)
   */
  fastify.get<{ Params: { gameId: string } }>('/api/games/:gameId/responses', async (request, reply) => {
    const ip = request.ip || 'unknown';
    if (!checkRate(actionRateBuckets, ip, 120, 60000)) return reply.status(429).send({ message: 'Trop de requêtes.' });
    const token = request.headers.authorization?.replace(/^Bearer /, '') ?? '';
    const session = GameService.verifySession(token);
    if (!session || session.gameId !== request.params.gameId) return reply.status(401).send({ message: 'Session invalide ou expirée.' });
    try {
      const rows = await prisma.response.findMany({
        where: { gameId: request.params.gameId },
        orderBy: { createdAt: 'asc' },
        include: { player: { select: { firstName: true, role: true } } },
      });
      return reply.send(rows.map((r: any) => ({
        id: r.id,
        questionId: r.challengeId,
        playerId: r.playerId,
        playerName: r.player.firstName,
        playerRole: r.player.role,
        kind: (JSON.parse(r.content) as { kind: string; text: string }).kind,
        text: (JSON.parse(r.content) as { kind: string; text: string }).text,
        createdAt: r.createdAt.toISOString(),
      })));
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Impossible de récupérer l\'historique.' });
    }
  });

  /**
   * POST /api/games/:gameId/confirm — Confirme avoir vu la réponse de l'autre joueur
   * Recharge l'état et le diffuse aux deux joueurs pour passer au tour suivant
   */
  fastify.post<{ Params: { gameId: string } }>('/api/games/:gameId/confirm', async (request, reply) => {
    const ip = request.ip || 'unknown';
    if (!checkRate(actionRateBuckets, ip, 120, 60000)) return reply.status(429).send({ message: 'Trop de requêtes.' });
    const token = request.headers.authorization?.replace(/^Bearer /, '') ?? '';
    const session = GameService.verifySession(token);
    if (!session || session.gameId !== request.params.gameId) return reply.status(401).send({ message: 'Session invalide ou expirée.' });
    try {
      const state = await QuestionEngine.execute(session.gameId, session.playerId);
      const io = (fastify as any).io;
      if (io) io.to(`game:${session.gameId}`).emit('game:state', state);
      return reply.send(state);
    } catch (error) {
      if (error instanceof EngineError) return reply.status(error.status).send({ message: error.message });
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Impossible de confirmer.' });
    }
  });
}
