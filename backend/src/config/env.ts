
import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRY: z.string().default('24h'),

  // Game settings
  GAME_SESSION_TIMEOUT: z.coerce.number().default(3600000),
  GAME_INACTIVE_TIMEOUT_HOURS: z.coerce.number().default(24),
  GAME_EXPIRY_HOURS: z.coerce.number().default(24),
  CHALLENGES_PER_GAME: z.coerce.number().default(10),

  LOG_LEVEL: z.enum([
    'fatal',
    'error',
    'warn',
    'info',
    'debug',
    'trace'
  ]).default('info'),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const parsedEnv = envSchema.safeParse(process.env);

  if (!parsedEnv.success) {
    console.error('Environment variable validation failed:');

    parsedEnv.error.errors.forEach((error) => {
      console.error(
        `- ${error.path.join('.')}: ${error.message}`
      );
    });

    process.exit(1);
  }

  cachedEnv = parsedEnv.data;
  return cachedEnv;
}

export const env = getEnv();
