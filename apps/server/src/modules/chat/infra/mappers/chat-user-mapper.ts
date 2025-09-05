import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { ChatUser } from '../../domain/entities/chat-user'
import { chatUsers } from '../database/schemas/chat-user'

type DrizzleUser = typeof chatUsers.$inferInsert

export class ChatUserMapper {
  static toDomain(drizzleUser: DrizzleUser): ChatUser {
    return ChatUser.create(
      {
        userId: new UniqueEntityID(drizzleUser.userId),
        bio: drizzleUser.bio ?? undefined,
        status: drizzleUser.status,
      },
      new UniqueEntityID(drizzleUser.id)
    )
  }

  static toPersistence(chatUser: ChatUser): DrizzleUser {
    return {
      id: chatUser.id.toString(),
      userId: chatUser.userId.toString(),
      bio: chatUser.bio,
      status: chatUser.status,
    }
  }
}
