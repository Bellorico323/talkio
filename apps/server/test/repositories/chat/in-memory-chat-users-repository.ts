import { ChatUsersRepository } from '@/modules/chat/application/repositories/chat-users-repository'
import { ChatUser } from '@/modules/chat/domain/entities/chat-user'

export class InMemoryChatUsersRepository implements ChatUsersRepository {
  public items: ChatUser[] = []

  async create(chatUser: ChatUser): Promise<void> {
    this.items.push(chatUser)
    console.log(chatUser)
  }
}
