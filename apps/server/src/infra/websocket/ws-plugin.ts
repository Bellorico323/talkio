import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { WebsocketGateway } from './websocket-gateway'

export const websocketPlugin = fp(async function (app: FastifyInstance) {
  const gateway = new WebsocketGateway(app)

  app.decorate('wsGateway', gateway)
})
