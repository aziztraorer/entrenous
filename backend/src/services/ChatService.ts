/**
 * ChatService — chat temps réel (PROMPT 9)
 *
 * Règles :
 *  - Un message : 1 à 500 caractères, trimming, contenu obligatoire
 *  - Anti-abus : max 10 messages / 30 s par joueur (fenêtre glissante en mémoire)
 *  - Doublons : un message identique envoyé < 1 s après le précédent est rejeté
 *  - Persistance en base (ChatMessage) + purge réelle des messages > 24 h
 *  - Ne révèle jamais de jeton, de catégories ou de questions futures
 */

import { prisma } from '@/database/prisma';

export class ChatError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export interface PublicChatMessage {
  id: string;
  playerId: string;
  firstName: string;
  content: string;
  createdAt: string;
}

const MAX_LENGTH = 500;
const RATE_WINDOW_MS = 30_000;
const RATE_MAX = 10;
const DEDUPE_WINDOW_MS = 1_000;
const MESSAGE_TTL_MS = 24 * 60 * 60 * 1000;

// Anti-abus en mémoire (par instance de serveur) ; la partie reste sérialisée par la base.
const rateBuckets = new Map<string, number[]>();

function checkRate(playerId: string): void {
  const now = Date.now();
  const bucket = (rateBuckets.get(playerId) ?? []).filter(t => now - t < RATE_WINDOW_MS);
  if (bucket.length >= RATE_MAX) {
    throw new ChatError(429, 'Trop de messages — ralentis un peu.');
  }
  bucket.push(now);
  rateBuckets.set(playerId, bucket);
  // Ménage léger des joueurs inactifs
  if (rateBuckets.size > 10_000) {
    for (const [key, times] of rateBuckets) {
      if (times.every(t => now - t >= RATE_WINDOW_MS)) rateBuckets.delete(key);
    }
  }
}

export class ChatService {
  /** Valide et persiste un message, renvoie la version publique */
  static async send(gameId: string, playerId: string, rawContent: unknown): Promise<PublicChatMessage> {
    const content = typeof rawContent === 'string' ? rawContent.trim() : '';
    if (!content) throw new ChatError(400, 'Le message ne peut pas être vide.');
    if (content.length > MAX_LENGTH) throw new ChatError(400, `Le message ne doit pas dépasser ${MAX_LENGTH} caractères.`);

    checkRate(playerId);

    // Doublon immédiat (double-clic / retry réseau)
    const last = await prisma.chatMessage.findFirst({
      where: { gameId, playerId, createdAt: { gte: new Date(Date.now() - DEDUPE_WINDOW_MS) } },
      orderBy: { createdAt: 'desc' },
    });
    if (last && last.content === content) {
      throw new ChatError(409, 'Message déjà envoyé.');
    }

    // Le joueur doit appartenir à la partie (autorisation)
    const player = await prisma.player.findFirst({ where: { id: playerId, gameId } });
    if (!player) throw new ChatError(403, 'Session non autorisée pour cette partie.');

    // Mettre à jour l'activité du joueur
    await prisma.player.update({ where: { id: playerId }, data: { lastActivity: new Date() } });

    const saved = await prisma.chatMessage.create({
      data: { gameId, playerId, content },
      include: { player: { select: { firstName: true } } },
    });

    return {
      id: saved.id,
      playerId: saved.playerId,
      firstName: saved.player.firstName,
      content: saved.content,
      createdAt: saved.createdAt.toISOString(),
    };
  }

  /** Historique d'une partie (30 derniers messages, ordre chronologique) */
  static async history(gameId: string, playerId: string): Promise<PublicChatMessage[]> {
    const player = await prisma.player.findFirst({ where: { id: playerId, gameId } });
    if (!player) throw new ChatError(403, 'Session non autorisée pour cette partie.');
    const rows = await prisma.chatMessage.findMany({
      where: { gameId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: { player: { select: { firstName: true } } },
    });
    return rows.reverse().map(r => ({
      id: r.id,
      playerId: r.playerId,
      firstName: r.player.firstName,
      content: r.content,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  /** Purge réelle des messages de plus de 24 h — appelé périodiquement et au démarrage */
  static async purgeOld(): Promise<number> {
    const res = await prisma.chatMessage.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - MESSAGE_TTL_MS) } },
    });
    return res.count;
  }
}
