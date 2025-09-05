import { ChatUsersRepository } from '@/modules/chat/application/repositories/chat-users-repository'
import { ChatUser } from '@/modules/chat/domain/entities/chat-user'

export class InMemoryChatUsersRepository implements ChatUsersRepository {
  public items: ChatUser[] = []

  async create(chatUser: ChatUser): Promise<void> {
    this.items.push(chatUser)
  }

  async findById(chatUserId: string): Promise<ChatUser | null> {
    const user = this.items.find((item) => item.id.toString() === chatUserId)

    if (!user) return null

    return user
  }

  async findByUserId(userId: string): Promise<ChatUser | null> {
    const user = this.items.find((item) => item.userId.toString() === userId)

    if (!user) return null

    return user
  }
}
