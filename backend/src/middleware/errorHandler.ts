import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  reply.status(status).send({
    error: true,
    statusCode: status,
    message,
    timestamp: new Date().toISOString(),
    path: request.url,
  });
}
