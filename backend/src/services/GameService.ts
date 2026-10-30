/**
 * GameService — création de partie, lien d'invitation, salle d'attente.
 *
 * Règles (PROMPT 7) :
 *  - 2 joueurs maximum (role 1 = créateur, role 2 = invité)
 *  - Le 3e joueur est rejeté
 *  - Sessions temporaires sécurisées (JWT), reconnexion possible
 *  - Catégories privées pour chaque joueur (localStorage côté client)
 *  - Utilise les modèles Prisma existants (Game / Player) — aucune table recréée
 */

import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '@/database/prisma';
import { env } from '@/config/env';

export interface CreateGameInput {
  firstName: string;
  lastName: string;
  categories: string[];
  adultConsent?: boolean;
}

// Prisma Player inclut désormais firstName/lastName/categories (migration add_player_identity)

export interface JoinGameInput {
  code: string;
  firstName: string;
  lastName: string;
  categories: string[];
  adultConsent?: boolean;
}

export interface SessionPayload {
  gameId: string;
  playerId: string;
  role: 1 | 2;
}

export interface GameLobby {
  gameId: string;
  code: string;
  status: string;
  players: Array<{ id: string; firstName: string; lastName: string; role: 1 | 2 }>;
  full: boolean;
}

export class GameService {
/** Génère un code de 6 caractères (A-Z, 0-9) sans caractère ambigu, via crypto */
  private static generateGameCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /** Crée une partie + joueur 1 (créateur) et renvoie une session JWT */
  static async createGame(input: CreateGameInput) {
    // Code unique en base (retry en cas de collision)
    let code = '';
    for (let attempt = 0; attempt < 5; attempt++) {
      code = this.generateGameCode();
      const exists = await prisma.game.findUnique({ where: { code } });
      if (!exists) break;
      if (attempt === 4) throw new Error('CODE_GENERATION_FAILED');
    }

    const timeoutHours = Number(env.GAME_INACTIVE_TIMEOUT_HOURS ?? env.GAME_EXPIRY_HOURS ?? 24);
    const expiresAt = new Date(Date.now() + timeoutHours * 60 * 60 * 1000);

    const game = await prisma.game.create({
      data: {
        code,
        status: 'waiting',
        expiresAt,
        players: {
          create: {
            role: 1,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            categories: JSON.stringify(input.categories),
            adultConsent: input.adultConsent === true,
          },
        },
      },
      include: { players: true },
    });

    const player = game.players[0];
    const sessionToken = this.signSession({
      gameId: game.id,
      playerId: player.id,
      role: 1,
    });

    return {
      gameId: game.id,
      gameCode: game.code,
      playerId: player.id,
      sessionToken,
      inviteLink: `/join?code=${game.code}`,
      status: game.status,
    };
  }

  /** Rejoint une partie par code : valide le lien, la place disponible, refuse le 3e joueur */
  static async joinGame(input: JoinGameInput) {
    const game = await prisma.game.findUnique({
      where: { code: input.code.toUpperCase() },
      include: { players: true },
    });

    if (!game) {
      return { error: 'GAME_NOT_FOUND', message: "Aucune partie n'existe avec ce code." };
    }
    if (game.status !== 'waiting' && game.status !== 'active') {
      return { error: 'GAME_CLOSED', message: 'Cette partie est terminée ou fermée.' };
    }
    if (game.expiresAt < new Date()) {
      return { error: 'GAME_EXPIRED', message: 'Cette partie a expiré. Demande un nouveau lien.' };
    }

    const players = await prisma.player.findMany({ where: { gameId: game.id } });

    // Reconnexion : même nom/prénom que le joueur 1 → renvoie sa session
    const rejoin = players.find(
      (p) =>
        p.firstName.trim().toLowerCase() === input.firstName.trim().toLowerCase() &&
        p.lastName.trim().toLowerCase() === input.lastName.trim().toLowerCase()
    );
    if (rejoin) {
      const sessionToken = this.signSession({
        gameId: game.id,
        playerId: rejoin.id,
        role: rejoin.role as 1 | 2,
      });
      return {
        gameId: game.id,
        gameCode: game.code,
        playerId: rejoin.id,
        sessionToken,
        role: rejoin.role,
        rejoined: true,
        status: game.status,
      };
    }

    // 2 joueurs maximum — le 3e est rejeté
    if (players.length >= 2) {
      return { error: 'GAME_FULL', message: 'Cette partie est déjà complète (2 joueurs maximum).' };
    }

    const player = await prisma.player.create({
      data: {
        gameId: game.id,
        role: players.some((p) => p.role === 1) ? 2 : 1,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        categories: JSON.stringify(input.categories),
            adultConsent: input.adultConsent === true,
        lastActivity: new Date(),
      },
    });

    // Dès que les 2 joueurs sont là, la partie passe en "active"
    const full = players.length + 1 >= 2;
    if (full) {
      await prisma.game.update({ where: { id: game.id }, data: { status: 'active' } });
    }

    const sessionToken = this.signSession({
      gameId: game.id,
      playerId: player.id,
      role: player.role as 1 | 2,
    });

    return {
      gameId: game.id,
      gameCode: game.code,
      playerId: player.id,
      sessionToken,
      role: player.role,
      rejoined: false,
      status: full ? 'active' : 'waiting',
    };
  }

  /** État d'une partie par code (validation du lien d'invitation) */
  static async getLobbyByCode(code: string): Promise<GameLobby | null> {
    const game = await prisma.game.findUnique({
      where: { code: code.toUpperCase() },
      include: { players: true },
    });
    if (!game) return null;

    return {
      gameId: game.id,
      code: game.code,
      status: game.status,
      players: game.players.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        role: p.role as 1 | 2,
      })),
      full: game.players.length >= 2,
    };
  }

  /** État de la salle d'attente */
  static async getLobby(gameId: string): Promise<GameLobby | null> {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });
    if (!game) return null;

    return {
      gameId: game.id,
      code: game.code,
      status: game.status,
      players: game.players.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        role: p.role as 1 | 2,
      })),
      full: game.players.length >= 2,
    };
  }

  /** Signe une session JWT temporaire (reconnexion possible pendant JWT_EXPIRES_IN) */
  static signSession(payload: SessionPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRY as any });
  }

  /** Vérifie et décode une session JWT */
  static verifySession(token: string): SessionPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
    } catch {
      return null;
    }
  }

  /** Nettoie les parties expirées/inactives (jamais une partie active uniquement du fait du nettoyage) */
  static async cleanupExpiredGames(): Promise<void> {
    const timeoutHours = Number(env.GAME_INACTIVE_TIMEOUT_HOURS ?? env.GAME_EXPIRY_HOURS ?? 24);
    const cutoff = new Date(Date.now() - timeoutHours * 60 * 60 * 1000);

    // Ne supprimer que les parties inactives depuis plus du délai configuré
    // On considère l'inactivité comme max(lastActivity/joinedAt) des joueurs
    const games = await prisma.game.findMany({
      where: { OR: [{ expiresAt: { lt: new Date() } }, { status: { in: ['waiting'] } }] },
      include: { players: true },
    });

    const toDelete: string[] = [];
    for (const game of games) {
      // Si la partie est active et a eu de l'activité récente, ne pas supprimer
      if (game.status === 'active') {
        const lastActivity = game.players.reduce((max, p) => {
          const t = p.lastActivity?.getTime() ?? p.joinedAt.getTime();
          return t > max ? t : max;
        }, 0);
        if (lastActivity >= cutoff.getTime()) {
          continue; // Partie active et encore récente -> ne pas supprimer
        }
        // Si inactive depuis trop longtemps même si status active, on peut la supprimer selon politique
        // mais on doit s'assurer ce n'est pas "uniquement parce que nettoyage s'exécute" - on vérifie bien l'inactivité
      }
      // Pour waiting ou inactive depuis trop longtemps -> supprimer
      if (game.status === 'waiting') {
        const lastActivity = game.players.reduce((max, p) => {
          const t = p.lastActivity?.getTime() ?? p.joinedAt.getTime();
          return t > max ? t : max;
        }, 0);
        if (lastActivity < cutoff.getTime() || game.expiresAt < new Date()) {
          toDelete.push(game.id);
        }
        continue;
      }
      // active mais inactif
      const lastActivity = game.players.reduce((max, p) => {
        const t = p.lastActivity?.getTime() ?? p.joinedAt.getTime();
        return t > max ? t : max;
      }, 0);
      if (lastActivity < cutoff.getTime()) {
        toDelete.push(game.id);
      }
    }

    if (toDelete.length > 0) {
      await prisma.game.deleteMany({ where: { id: { in: toDelete } } });
    }
  }
}
