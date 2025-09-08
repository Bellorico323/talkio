import { CreateGroupUseCase } from '@/modules/chat/application/use-cases/create-group'
import { DrizzleChatUsersRepository } from '../../repositories/drizzle/drizzle-chat-users-repository'
import { DrizzleConversationsRepository } from '../../repositories/drizzle/drizzle-conversations-repository'

export class MakeDrizzleCreateGroup {
  static make() {
    const chatUsersRepository = new DrizzleChatUsersRepository()
    const conversationsRepository = new DrizzleConversationsRepository()

    const createGroupUseCase = new CreateGroupUseCase(
      conversationsRepository,
      chatUsersRepository
    )
    return createGroupUseCase
  }
}
