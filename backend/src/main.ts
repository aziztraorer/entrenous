import Fastify from 'fastify';
import { Server as SocketIOServer } from 'socket.io';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';

import { env } from '@/config/env';
import { cors } from '@/config/cors';
import { helmet } from '@/config/helmet';
import { errorHandler } from '@/middleware/errorHandler';
import { healthRoutes } from '@/routes/health';
import { gameRoutes } from '@/routes/game';
import { GameService } from '@/services/GameService';
import { setupRealtime } from '@/services/realtime';

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
  trustProxy: true,
}) as any;

// Create Socket.IO server
let io: SocketIOServer | null = null;

// Attach io to fastify instance
fastify.io = io;

// Register plugins
async function registerPlugins() {
  // Security
  await fastify.register(fastifyHelmet, helmet);

  // CORS
  await fastify.register(fastifyCors, cors);

  // Rate limiting
  // Audit : 100/15 min par IP saturait une partie à 2 joueurs légitime
  // (state + responses + confirm × 2 joueurs). On monte le global et on
  // ajoute un Retry-After lisible côté client.
  await fastify.register(fastifyRateLimit, {
    global: true,
    max: 400,
    timeWindow: '15 minutes',
    errorResponseBuilder: function (_request: unknown, context: { after: number }) {
      return {
        message: `Trop de requêtes, réessaie dans ${Math.ceil(context.after / 1000)} secondes.`,
      };
    },
  });
}

// Socket.IO event handlers
function setupSocketIOHandlers() {
  setupRealtime(io as any);
}

// Setup routes
async function setupRoutes() {
  await healthRoutes(fastify);
  await gameRoutes(fastify);
}

// Error handling
fastify.setErrorHandler(errorHandler);

// Start server
async function start() {
  try {
    // Register plugins
    await registerPlugins();

    // Setup routes
    await setupRoutes();

    // Listen
    await fastify.listen({ port: env.PORT, host: env.HOST });

    // Initialize Socket.IO after listening
    io = new SocketIOServer(fastify.server, {
      cors: {
        origin: (env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()).filter(Boolean),
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });

    fastify.io = io;

    // Setup Socket.IO
    setupSocketIOHandlers();

    // Cleanup expired/inactive games every hour
    setInterval(() => {
      GameService.cleanupExpiredGames();
    }, 3600000);

    fastify.log.info(`✅ Server running at http://${env.HOST}:${env.PORT}`);
    fastify.log.info(`🔡 Socket.IO ready for connections`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();