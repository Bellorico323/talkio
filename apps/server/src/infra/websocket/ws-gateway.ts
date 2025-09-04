import { auth } from '@/modules/identity/infra/lib/auth'
import { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

interface Connection {
  userId: string
  socket: WebSocket
}

export class WebsocketGateway {
  public connections: Map<string, Connection> = new Map()

  constructor(private app: FastifyInstance) {
    this.setupConnectionHandler()
  }

  private setupConnectionHandler(): void {
    const self = this

    this.app.get('/ws', { websocket: true }, async function (socket, request) {
      try {
        const headers = new Headers(request.headers as HeadersInit)
        const session = await auth.api.getSession({ headers })

        if (!session || !session.user.id) {
          console.error('[WS Gateway] Erro na autenticação')
          return socket.close(1008, 'Authentication failed')
        }

        const { id: userId } = session.user
        console.log(`[WS Gateway] Usuário conectado: ${userId}`)

        self.connections.set(userId, { userId, socket })

        socket.on('close', () => {
          console.log(`[WS Gateway] Usuário desconectado: ${userId}`)
          self.connections.delete(userId)
        })

        socket.on('message', (message) => {
          console.log(
            `[Gateway] Mensagem recebida de ${userId}: ${message.toString()}`
          )
        })
      } catch (error) {
        console.error('[WS Gateway] Erro na autenticação', error)

        socket.close(1011, 'Internal server error')
      }
    })
  }
}
