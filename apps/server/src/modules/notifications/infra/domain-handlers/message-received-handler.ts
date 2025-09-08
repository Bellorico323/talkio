import { FastifyInstance } from 'fastify'
import { MakeDrizzleSendNotification } from '../factories/drizzle/make-send-notification'
import { OnMessageReceived } from '../../application/subscriber/on-message-received'

export function messageReceivedHandler(app: FastifyInstance) {
  const sendNotificationUseCase = MakeDrizzleSendNotification.make()
  const wsGateway = app.wsGateway

  new OnMessageReceived(sendNotificationUseCase, wsGateway)
}
