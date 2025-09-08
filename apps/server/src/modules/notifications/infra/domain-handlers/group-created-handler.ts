import { FastifyInstance } from 'fastify'
import { MakeDrizzleSendNotification } from '../factories/drizzle/make-send-notification'
import { OnGroupCreated } from '../../application/subscriber/on-group-created'

export function groupCreatedHandler(app: FastifyInstance) {
  const sendNotificationUseCase = MakeDrizzleSendNotification.make()
  const wsGateway = app.wsGateway

  new OnGroupCreated(sendNotificationUseCase, wsGateway)
}
