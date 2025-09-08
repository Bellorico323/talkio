import { AppModule } from '@/infra/contracts/app-module'
import { FastifyInstance } from 'fastify'
import { sendDirectMessageHandler } from './ws-handlers/send-direct-message'
import { userCreatedHandler } from './domain-handlers/user-created-handler'

class ChatModule implements AppModule {
  registerDomainHandlers() {
    userCreatedHandler()
  }

  registerWsHandlers(app: FastifyInstance): void | Promise<void> {
    sendDirectMessageHandler(app)
  }
}

export const chatModule = new ChatModule()
