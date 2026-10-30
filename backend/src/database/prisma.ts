
/**
 * Prisma client singleton
 */

import { PrismaClient } from '@prisma/client'
import { logger } from '@/config/logger'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect()
    logger.info('Database connected')
  } catch (error) {
    logger.error({ err: error }, 'Database connection failed')
    process.exit(1)
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect()
  logger.info('Database disconnected')
}
