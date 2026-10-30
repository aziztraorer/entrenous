/**
 * Logger configuration using Pino
 */

import pino from 'pino'
import { env } from './env'

const isDev = env.NODE_ENV === 'development'
const isTest = env.NODE_ENV === 'test'

export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL,
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
          singleLine: false,
          messageFormat: '[{levelLabel}] {msg}',
        },
      }
    : undefined,
})

export function createChildLogger(name: string) {
  return logger.child({ module: name })
}
