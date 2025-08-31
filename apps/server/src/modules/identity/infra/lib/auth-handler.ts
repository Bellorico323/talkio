import { FastifyInstance } from 'fastify'
import { auth } from './auth'

export async function authModule(fastify: FastifyInstance) {
  fastify.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    async handler(request, reply) {
      try {
        const url = new URL(request.url, `http://${request.headers.host}`)
        const headers = new Headers()
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value)
            headers.append(
              key,
              Array.isArray(value) ? value.join(',') : value.toString()
            )
        })
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: request.body ? JSON.stringify(request.body) : undefined,
        })

        const response = await auth.handler(req)

        reply.status(response.status)
        response.headers.forEach((value, key) => reply.header(key, value))

        const body = await response.text()

        try {
          reply.send(JSON.parse(body))
        } catch {
          reply.send(body)
        }
      } catch (error) {
        fastify.log.error(error, 'Authentication Error:')
        reply.status(500).send({
          error: 'Internal authentication error',
          code: 'AUTH_FAILURE',
        })
      }
    },
  })
}
