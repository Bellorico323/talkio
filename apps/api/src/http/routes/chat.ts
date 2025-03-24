import { randomUUIDv7 } from 'bun'
import { Elysia, t } from 'elysia'
import { ElysiaWS } from 'elysia/ws'

const clients: Set<ElysiaWS> = new Set()

export const chat = new Elysia().ws('/chat', {
  body: t.Object({
    userId: t.String(),
    content: t.String(),
  }),

  open(ws) {
    clients.add(ws)
    console.log(`client ${ws.id} connected`)
  },
  message(ws, message) {
    const parsedMessage = {
      ...message,
      messageId: randomUUIDv7(),
    }

    console.log(message)

    for (const client of clients) {
      client.send(JSON.stringify(parsedMessage))
    }
  },
  close(ws) {
    console.log(`client ${ws.id} disconnected`)
  },
})
