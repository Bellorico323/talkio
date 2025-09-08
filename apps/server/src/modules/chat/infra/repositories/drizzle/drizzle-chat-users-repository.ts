import { db } from '@/infra/database/client'
import { ChatUsersRepository } from '@/modules/chat/application/repositories/chat-users-repository'
import { ChatUser } from '@/modules/chat/domain/entities/chat-user'
import { chatUsers } from '../../database/schemas/chat-user'
import { ChatUserMapper } from '../../mappers/chat-user-mapper'
import { eq } from 'drizzle-orm'

export class DrizzleChatUsersRepository implements ChatUsersRepository {
  async create(chatUser: ChatUser): Promise<void> {
    const data = ChatUserMapper.toPersistence(chatUser)

    await db.insert(chatUsers).values(data)
  }

  async findById(chatUserId: string): Promise<ChatUser | null> {
    const chatUser = await db.query.chatUsers.findFirst({
      where: eq(chatUsers.id, chatUserId),
    })

    if (!chatUser) return null

    return ChatUserMapper.toDomain(chatUser)
  }

  async findByUserId(userId: string): Promise<ChatUser | null> {
    const chatUser = await db.query.chatUsers.findFirst({
      where: eq(chatUsers.userId, userId),
    })

    if (!chatUser) return null

    return ChatUserMapper.toDomain(chatUser)
  }
}
