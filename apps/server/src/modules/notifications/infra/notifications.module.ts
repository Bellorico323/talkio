import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { OnFriendshipRequestSent } from '../application/subscriber/on-friendship-request-sent'
import { MakeDrizzleSendNotification } from './factories/drizzle/make-send-notification'
import { DrizzleUsersRepository } from '@/modules/identity/infra/repositories/drizzle/drizzle-users-repository'

export class NotificationModule implements AppModule {
  async routes(app: FastifyInstance) {}

  registerDomainHandlers(app: FastifyInstance): void | Promise<void> {
    const sendNotificationUseCase = MakeDrizzleSendNotification.make()
    const usersRepository = new DrizzleUsersRepository()

    const wsGateway = app.wsGateway

    new OnFriendshipRequestSent(
      sendNotificationUseCase,
      wsGateway,
      usersRepository
    )
  }

  registerWsHandlers(): void {}
}

export const notificationModule = new NotificationModule()
