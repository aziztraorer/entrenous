/**
 * Health endpoint tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Fastify, { FastifyInstance } from 'fastify'
import { healthRoutes as setupHealthRoutes } from '@/routes/health'

describe('Health Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = Fastify()
    await setupHealthRoutes(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /health returns 200 with health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.payload)
    expect(body.status).toBe('ok')
    expect(body.timestamp).toBeDefined()
    expect(body.uptime).toBeDefined()
  })

  it('GET /api/health also returns 200', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.payload)
    expect(body.status).toBe('ok')
  })
})
