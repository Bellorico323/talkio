import { DrizzleUsersRepository } from '@/modules/identity/infra/repositories/drizzle/drizzle-users-repository'
import { MakeDrizzleSendNotification } from '../factories/drizzle/make-send-notification'
import { FastifyInstance } from 'fastify'
import { OnFriendshipRequestSent } from '../../application/subscriber/on-friendship-request-sent'

export function friendshipRequestSentHandler(app: FastifyInstance) {
  const sendNotificationUseCase = MakeDrizzleSendNotification.make()
  const usersRepository = new DrizzleUsersRepository()

  const wsGateway = app.wsGateway

  new OnFriendshipRequestSent(
    sendNotificationUseCase,
    wsGateway,
    usersRepository
  )
}
