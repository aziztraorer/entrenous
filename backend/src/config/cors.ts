import { FastifyCorsOptions } from '@fastify/cors';

export const cors: FastifyCorsOptions = {
  // CORS_ORIGIN peut contenir plusieurs origines séparées par des virgules
  // (@fastify/cors accepte un tableau de chaînes, pas une chaîne avec virgules)
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
  optionsSuccessStatus: 204,  // ✅ AJOUTER CETTE LIGNE
  preflightContinue: false,   // ✅ AJOUTER CETTE LIGNE
};