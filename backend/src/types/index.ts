export interface GameSession {
  gameId: string;
  sessionToken: string;
  playerId: string;
}

export interface Player {
  id: string;
  name: string;
  gameId: string;
  joinedAt: Date;
}

export interface Challenge {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  gameId: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Player[];
  currentChallenge?: Challenge;
  responses: Map<string, string>;
}

export interface CreateGameResponse {
  id: string;
  code: string;
  token: string;
  status: 'waiting' | 'playing' | 'finished';
  createdAt: string;
  expiresAt: string;
}

export interface JoinGameResponse {
  id: string;
  code: string;
  status: 'waiting' | 'playing' | 'finished';
  players: { id: string; role: number }[];
  token: string;
}

export interface SocketEvents {
  'game:join': (data: { gameId: string; playerName: string }) => void;
  'response:submit': (data: { response: string; challengeId: string }) => void;
  'game:ended': () => void;
  'player:joined': (data: Player) => void;
  'response:received': (data: { playerId: string; response: string }) => void;
}
