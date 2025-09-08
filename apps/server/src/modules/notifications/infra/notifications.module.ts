import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { friendshipRequestSentHandler } from './domain-handlers/friendship-request-sent-handler'
import { messageReceivedHandler } from './domain-handlers/message-received-handler'
import { groupCreatedHandler } from './domain-handlers/group-created-handler'

export class NotificationModule implements AppModule {
  async routes(app: FastifyInstance) {}

  registerDomainHandlers(app: FastifyInstance): void | Promise<void> {
    friendshipRequestSentHandler(app)
    messageReceivedHandler(app)
    groupCreatedHandler(app)
  }

  registerWsHandlers(): void {}
}

export const notificationModule = new NotificationModule()
