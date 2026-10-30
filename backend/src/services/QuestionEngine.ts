import { randomInt } from 'node:crypto';
import { prisma } from '@/database/prisma';
import { QUESTIONS, normalizeCategories, type Category } from '@/data/questions';

export class EngineError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export interface EngineState {
  deck: Array<{ id: string; prompt: string }>;
  index: number;
  firstPlayer: string;
  players: string[];
  used: string[];
}
export function buildDeck(categories: Category[], source = QUESTIONS) {
  const seen = new Set<string>();
  return categories.flatMap(category => source[category].map((prompt, index) => ({
    id: `${category}-${index}`, prompt,
  }))).filter(q => {
    const key = q.prompt.normalize('NFKC').toLocaleLowerCase('fr').replace(/[\p{P}\s]/gu, '');
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}
export function initialize(players: Array<{ id: string; categories: string; adultConsent: boolean }>): EngineState {
  const categories = normalizeCategories(players.flatMap(p => JSON.parse(p.categories)));
  const allowed = categories.filter(c => c !== 'intimacy' || players.every(p => p.adultConsent));
  const deck = buildDeck(allowed);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);[deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return { deck, index: 0, firstPlayer: players[randomInt(2)].id, players: players.map(p => p.id), used: [] };
}
export function publicState(state: EngineState) {
  const ended = state.index >= state.deck.length;
  const first = state.players.indexOf(state.firstPlayer);
  const question = ended ? null : { id: String(state.index), prompt: state.deck[state.index].prompt };
  return {
    status: ended ? 'ended' : 'active', question, turn: state.index,
    total: state.deck.length, activePlayerId: ended ? null : state.players[(first + state.index) % 2]
  };
}
export function advance(state: EngineState, playerId: string, questionId: string): EngineState {
  const view = publicState(state);
  if (!view.question || view.question.id !== questionId) throw new EngineError(409, 'Cette question a déjà été utilisée.');
  if (view.activePlayerId !== playerId) throw new EngineError(403, 'Ce n’est pas ton tour.');
  return { ...state, index: state.index + 1, used: [...state.used, state.deck[state.index].id] };
}
export class QuestionEngine {
  static async execute(gameId: string, playerId: string, action?: { questionId: string; kind: 'answer' | 'skip'; content?: string }) {
    return prisma.$transaction(async tx => {
      // Verrou PostgreSQL par partie : sérialise initialisation et clics concurrents, même sur plusieurs serveurs.
      await tx.$queryRaw`SELECT id FROM "Game" WHERE id = ${gameId} FOR UPDATE`;
      const game = await tx.game.findUnique({ where: { id: gameId }, include: { players: true } });
      if (!game || !game.players.some(p => p.id === playerId)) throw new EngineError(403, 'Session non autorisée pour cette partie.');
      if (game.expiresAt <= new Date()) throw new EngineError(410, 'Cette partie a expiré.');
      if (game.players.length !== 2) throw new EngineError(409, 'Attends le deuxième joueur.');
      if (game.status === 'ended' && !game.engineState) throw new EngineError(410, 'Cette partie est terminée.');
      // Mettre à jour l'activité du joueur
      await tx.player.update({ where: { id: playerId }, data: { lastActivity: new Date() } });
      let state = game.engineState as unknown as EngineState | null;
      if (!state) state = initialize(game.players);
      if (action) {
        const next = advance(state, playerId, action.questionId);
        if (action.kind === 'answer' && (!action.content?.trim() || action.content.length > 5000)) {
          throw new EngineError(400, 'Écris une réponse de 1 à 5 000 caractères.');
        }
        await tx.response.create({
          data: {
            gameId, playerId, challengeId: state.deck[state.index].id,
            content: JSON.stringify({ kind: action.kind, text: action.kind === 'answer' ? action.content!.trim() : '' })
          }
        });
        state = next;
      }
      const view = publicState(state);
      await tx.game.update({ where: { id: gameId }, data: { engineState: JSON.parse(JSON.stringify(state)), status: view.status } });
      return view;
    });
  }
}
