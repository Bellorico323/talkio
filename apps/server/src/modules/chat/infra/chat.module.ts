import { InMemoryChatUsersRepository } from 'test/repositories/chat/in-memory-chat-users-repository'
import { OnUserCreated } from '../application/subscriber/on-user-created'
import { CreateChatUserUseCase } from '../application/use-cases/create-user'
import { AppModule } from '@/infra/contracts/app-module'
import { InMemoryEventBus } from '@/shared/domain/events/in-memory-event-bus'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

class ChatModule implements AppModule {
  execute() {
    const chatUsersRepository = new InMemoryChatUsersRepository()
    const createChatUserRepository = new CreateChatUserUseCase(
      chatUsersRepository
    )

    const inMemoryEventBus = new InMemoryEventBus()
    DomainEvents.initialize(inMemoryEventBus, inMemoryEventBus)

    new OnUserCreated(createChatUserRepository)
  }
}

export const chatModule = new ChatModule()
