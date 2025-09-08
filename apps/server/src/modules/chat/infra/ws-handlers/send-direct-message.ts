import { FastifyInstance } from 'fastify'
import { MakeDrizzleSendDirectMessage } from '../factories/drizzle/make-send-direct-message'

export function sendDirectMessageHandler(app: FastifyInstance) {
  app.wsGateway.onMessage('chat.directMessage', async (userId, { body }) => {
    const { recipientId, senderId, content, conversationId } = body

    const sendDirectMessageUseCase = MakeDrizzleSendDirectMessage.make()

    await sendDirectMessageUseCase.execute({
      content,
      recipientId,
      senderId,
      conversationId,
    })
  })
}
