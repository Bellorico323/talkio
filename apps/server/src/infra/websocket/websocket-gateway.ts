import { auth } from '@/modules/identity/infra/lib/auth'
import { FastifyInstance } from 'fastify'
import WebSocket from 'ws'
import { MessageGateway } from '../contracts/messages-gateway'
import { MessageOptions, MessagePayloads } from './payloads'

interface Connection {
  userId: string
  socket: WebSocket
}

type IncomingMessage<K extends keyof MessagePayloads = keyof MessagePayloads> =
  {
    type: K
    payload: MessagePayloads[K]
  }

class WebsocketGateway implements MessageGateway {
  private connections: Map<string, Connection> = new Map()

  private messageHandlers: {
    [K in keyof MessagePayloads]?: (
      userId: string,
      payload: MessagePayloads[K]
    ) => void
  } = {}

  constructor(private app: FastifyInstance) {
    this.setupConnectionHandler()

    this.messageHandlers['ping'] = (userId, payload) => {
      this.sendToUser(userId, { type: 'pong', payload })
    }
  }

  private setupConnectionHandler(): void {
    this.app.get('/ws', { websocket: true }, async (socket, request) => {
      try {
        const headers = new Headers(request.headers as HeadersInit)
        const session = await auth.api.getSession({ headers })

        if (!session || !session.user.id) {
          console.error('[WS Gateway] Erro na autenticação')
          return socket.close(1008, 'Authentication failed')
        }

        const { id: userId } = session.user
        console.log(`[WS Gateway] Usuário conectado: ${userId}`)

        this.connections.set(userId, { userId, socket })

        socket.on('close', () => {
          console.log(`[WS Gateway] Usuário desconectado: ${userId}`)
          this.connections.delete(userId)
        })

        socket.on('message', (raw) => {
          try {
            const msg = JSON.parse(raw.toString()) as IncomingMessage
            const handler = this.messageHandlers[msg.type]

            if (handler) {
              handler(userId, msg.payload as any)
            } else {
              console.warn(`[WS Gateway] Nenhum handler para ${msg.type}`)
            }
          } catch (err) {
            console.error('[WS Gateway] Erro ao processar mensagem', err)
          }
        })
      } catch (error) {
        console.error('[WS Gateway] Erro na autenticação', error)
        socket.close(1011, 'Internal server error')
      }
    })
  }

  public sendToUser<P extends keyof MessagePayloads>(
    userId: string,
    message: MessageOptions
  ) {
    const connection = this.connections.get(userId)
    if (connection) {
      connection.socket.send(JSON.stringify(message))
    }
  }

  public broadcast<P extends keyof MessagePayloads>(
    message: MessagePayloads[P]
  ) {
    const serialized = JSON.stringify(message)
    for (const { socket } of this.connections.values()) {
      socket.send(serialized)
    }
  }

  public onMessage<P extends keyof MessagePayloads>(
    type: P,
    handler: (userId: string, payload: MessagePayloads[P]) => void
  ) {
    this.messageHandlers[type] = handler as any
  }
}

export let wsGateway: WebsocketGateway
export function instanciateGateway(app: FastifyInstance) {
  if (!wsGateway) wsGateway = new WebsocketGateway(app)
}
