import { WebsocketGateway } from '../websocket/websocket-gateway'

declare module 'fastify' {
  export interface FastifyInstance {
    wsGateway: WebsocketGateway
  }
}
