import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { OnFriendshipRequestSent } from '../application/subscriber/on-friendship-request-sent'
import { MakeDrizzleSendNotification } from './factories/drizzle/make-send-notification'
import { wsGateway } from '@/infra/websocket/websocket-gateway'
import { DrizzleUsersRepository } from '@/modules/identity/infra/repositories/drizzle/drizzle-users-repository'

export class NotificationModule implements AppModule {
  async routes(app: FastifyInstance) {}

  registerDomainHandlers(): void | Promise<void> {
    const sendNotificationUseCase = MakeDrizzleSendNotification.make()
    const usersRepository = new DrizzleUsersRepository()

    new OnFriendshipRequestSent(
      sendNotificationUseCase,
      wsGateway,
      usersRepository
    )
  }

  registerWsHandlers(): void {}
}

export const notificationModule = new NotificationModule()
