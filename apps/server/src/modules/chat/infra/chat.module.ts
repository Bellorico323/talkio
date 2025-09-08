import { OnUserCreated } from '../application/subscriber/on-user-created'
import { CreateChatUserUseCase } from '../application/use-cases/create-user'
import { AppModule } from '@/infra/contracts/app-module'
import { DrizzleChatUsersReposiroty } from './repositories/drizzle/drizzle-chat-users-repository'
import { FastifyInstance } from 'fastify'
import { sendDirectMessageHandler } from './ws-handlers/send-direct-message'

class ChatModule implements AppModule {
  registerDomainHandlers() {
    const chatUsersRepository = new DrizzleChatUsersReposiroty()
    const createChatUserRepository = new CreateChatUserUseCase(
      chatUsersRepository
    )

    new OnUserCreated(createChatUserRepository)
  }

  registerWsHandlers(app: FastifyInstance): void | Promise<void> {
    sendDirectMessageHandler(app)
  }
}

export const chatModule = new ChatModule()
