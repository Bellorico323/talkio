import { InMemoryChatUsersRepository } from 'test/repositories/chat/in-memory-chat-users-repository'
import { OnUserCreated } from '../application/subscriber/on-user-created'
import { CreateChatUserUseCase } from '../application/use-cases/create-user'
import { AppModule } from '@/shared/infra/contracts/app-module'

class ChatModule implements AppModule {
  execute() {
    const chatUsersRepository = new InMemoryChatUsersRepository()
    const createChatUserRepository = new CreateChatUserUseCase(
      chatUsersRepository
    )

    new OnUserCreated(createChatUserRepository)
  }
}

export const chatModule = new ChatModule()
