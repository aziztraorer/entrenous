/**
 * Application constants
 */

export const ROUTES = {
  HOME: '/',
  CREATE: '/create',
  WAIT: '/wait/:gameId',
  GAME: '/game/:gameId',
  END: '/end/:gameId',
}

export const TIMEOUTS = {
  RESPONSE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
  SOCKET_TIMEOUT: 10000, // 10 seconds
  DEBOUNCE: 300, // 300ms
}

export const LIMITS = {
  MAX_RESPONSE_LENGTH: 5000,
  MAX_CHALLENGE_RESPONSE_TIME: 5 * 60, // 5 minutes in seconds
  GAME_EXPIRY_HOURS: 24,
}

export const MESSAGES = {
  GAME_CREATED: 'Game created! Share the code with your friend.',
  GAME_JOINED: 'Welcome! Waiting for the game to start...',
  PLAYER_JOINED: 'Your partner has joined!',
  GAME_STARTED: 'Game started! Good luck.',
  RESPONSE_SUBMITTED: 'Your response has been submitted.',
  GAME_ENDED: 'Game ended.',
  CONNECTION_LOST: 'Connection lost. Trying to reconnect...',
  CONNECTION_ERROR: 'Failed to connect to the server.',
  INVALID_CODE: 'Invalid game code. Please check and try again.',
  PLAYER_DISCONNECTED: 'Your partner disconnected. Game ended.',
}

export const ERRORS = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  VALIDATION: 'Invalid input. Please check and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Game not found. Please check the code.',
  GAME_FULL: 'This game is full. Please create a new one.',
}
