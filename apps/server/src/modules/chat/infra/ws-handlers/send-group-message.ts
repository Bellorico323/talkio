import { FastifyInstance } from 'fastify'
import { MakeDrizzleSendDirectMessage } from '../factories/drizzle/make-send-direct-message'

export function sendGroupMessageHandler(app: FastifyInstance) {
  app.wsGateway.onMessage('chat.groupMessage', async (userId, { body }) => {
    const { content, conversationId, recipientId } = body

    const sendDirectMessageUseCase = MakeDrizzleSendDirectMessage.make()

    await sendDirectMessageUseCase.execute({
      content,
      recipientId,
      senderId: userId,
      conversationId,
    })
  })
}
