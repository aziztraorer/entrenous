/**
 * Socket.IO temps réel — PROMPT 9
 * Événements :
 *  client → serveur : game:join, chat:send
 *  serveur → client : game:state, chat:message, chat:error
 * Sécurité :
 *  - auth par JWT de session (gameId + playerId) à la connexion
 *  - chaque envoi revalide l'appartenance à la partie et le rate-limit
 *  - aucune donnée sensible (jetons, catégories, questions futures) n'est diffusée
 */

import type { Server as SocketIOServer, Socket } from 'socket.io';
import { GameService } from '@/services/GameService';
import { ChatService, ChatError, type PublicChatMessage } from '@/services/ChatService';
import { QuestionEngine, EngineError } from '@/services/QuestionEngine';

interface SessionPayload {
  gameId: string;
  playerId: string;
  role: 1 | 2;
}

function socketSession(socket: Socket & { data?: { session?: SessionPayload } }): SessionPayload | null {
  return socket.data?.session ?? null;
}

// Simple rate limiting per socket
const socketRateBuckets = new Map<string, number[]>();
function checkSocketRate(socketId: string, max = 20, windowMs = 10000): boolean {
  const now = Date.now();
  const bucket = (socketRateBuckets.get(socketId) ?? []).filter(t => now - t < windowMs);
  if (bucket.length >= max) {
    return false;
  }
  bucket.push(now);
  socketRateBuckets.set(socketId, bucket);
  return true;
}

export function setupRealtime(io: SocketIOServer): void {
  // Authentification à la connexion par JWT de session (handshake.auth.token)
  io.use((socket, next) => {
    const token = (socket.handshake.auth?.token as string) ?? '';
    const session = GameService.verifySession(token.replace(/^Bearer /, ''));
    if (!session) return next(new Error('Session invalide ou expirée.'));
    (socket.data as any).session = session;
    next();
  });

  io.on('connection', (socket) => {
    const session = (socket.data as any).session as SessionPayload;
    socket.join(`game:${session.gameId}`);

    // Envoie immédiatement l'état moteur + l'historique du chat
    QuestionEngine.execute(session.gameId, session.playerId)
      .then((view) => socket.emit('game:state', view))
      .catch(() => { });
    ChatService.history(session.gameId, session.playerId)
      .then((messages) => socket.emit('chat:history', messages))
      .catch(() => { });

    // Envoi de message chat
    socket.on('chat:send', async (data: { content?: unknown }) => {
      if (!checkSocketRate(socket.id, 10, 30000)) {
        socket.emit('chat:error', { status: 429, message: 'Trop de messages — ralentis un peu.' });
        return;
      }
      try {
        const msg: PublicChatMessage = await ChatService.send(session.gameId, session.playerId, data?.content);
        io.to(`game:${session.gameId}`).emit('chat:message', msg);
      } catch (error) {
        const status = error instanceof ChatError ? error.status : 400;
        const message = error instanceof Error ? error.message : 'Message invalide.';
        socket.emit('chat:error', { status, message });
      }
    });

    // Action de jeu (répondre / passer) — revalide identité, appartenance et tour
    socket.on('game:action', async (data: { questionId?: unknown; kind?: unknown; content?: unknown }) => {
      if (!checkSocketRate(socket.id, 30, 60000)) {
        socket.emit('game:error', { status: 429, message: 'Trop de requêtes.' });
        return;
      }
      const kind = data?.kind;
      const questionId = data?.questionId;
      if ((kind !== 'answer' && kind !== 'skip') || typeof questionId !== 'string' || (data.content !== undefined && typeof data.content !== 'string')) {
        socket.emit('game:error', { status: 400, message: 'Action invalide.' });
        return;
      }
      try {
        const view = await QuestionEngine.execute(session.gameId, session.playerId, {
          questionId: questionId,
          kind: kind,
          content: typeof data.content === 'string' ? data.content : undefined,
        });
        io.to(`game:${session.gameId}`).emit('game:state', view);
      } catch (error) {
        const status = error instanceof EngineError ? error.status : 400;
        const message = error instanceof Error ? error.message : 'Action impossible.';
        socket.emit('game:error', { status, message });
      }
    });

    socket.on('disconnect', () => {
      // Socket.IO gère la reconnexion ; au retour, le client rejoint la salle
      // et reçoit immédiatement game:state + chat:history.
    });
  });

  // Reconnexion : le client rejoint la même room via game:join (compat avec l'ancien événement)
  io.on('connection', (socket) => {
    socket.on('game:join', (data: { gameId?: unknown; token?: unknown }) => {
      if (!checkSocketRate(socket.id, 10, 60000)) {
        socket.emit('error', { code: 'RATE_LIMITED', message: 'Trop de requêtes.' });
        return;
      }
      const token = typeof data?.token === 'string' ? data.token : '';
      const session = GameService.verifySession(token.replace(/^Bearer /, ''));
      if (!session) {
        socket.emit('error', { code: 'UNAUTHORIZED', message: 'Session invalide ou expirée.' });
        return;
      }
      // Autorisation : le token doit correspondre à la session authentifiée ou être valide pour cette partie
      // Vérifier que la session correspond bien si on a déjà authentifié
      const currentSession = (socket.data as any).session as SessionPayload | undefined;
      if (currentSession && (currentSession.playerId !== session.playerId || currentSession.gameId !== session.gameId)) {
        socket.emit('error', { code: 'UNAUTHORIZED', message: 'Session non autorisée.' });
        return;
      }
      socket.join(`game:${session.gameId}`);
      GameService.getLobby(session.gameId).then((lobby) => {
        if (lobby) socket.emit('lobby:state', lobby);
      });
    });
  });

  // Purge réelle des messages > 24 h : au démarrage puis toutes les 30 minutes
  const purge = () => ChatService.purgeOld().catch(() => { });
  purge();
  setInterval(purge, 30 * 60 * 1000);
}
