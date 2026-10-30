/**
 * Vitest setup file
 */

import { vi } from 'vitest'
import { config } from 'dotenv'

// Charger le vrai .env du backend (base de données locale de dev)
config({ path: process.cwd() + '/.env', override: true })

// Mock environment if not set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long'
}

// Suppress logs during tests
vi.spyOn(console, 'log').mockImplementation(() => {})
vi.spyOn(console, 'error').mockImplementation(() => {})
