import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { conversations } from '../database/schemas/conversation'
import { Conversation } from '../../domain/entities/conversation'

type DrizzleConversation = typeof conversations.$inferInsert

export class ConversationMapper {
  static toDomain(drizzleConversation: DrizzleConversation): Conversation {
    return Conversation.create(
      {
        title: drizzleConversation.title ?? undefined,
        isGroup: drizzleConversation.isGroup,
        groupDescription: drizzleConversation.groupDescription ?? undefined,
        groupImage: drizzleConversation.groupImage ?? undefined,
        ownerId: drizzleConversation.ownerId
          ? new UniqueEntityID(drizzleConversation.ownerId)
          : undefined,
        createdAt: drizzleConversation.createdAt,
        participantsIds: [],
      },
      new UniqueEntityID(drizzleConversation.id)
    )
  }

  static toPersistence(conversation: Conversation): DrizzleConversation {
    return {
      id: conversation.id.toString(),
      isGroup: conversation.isGroup,
      title: conversation.title,
      ownerId: conversation.ownerId?.toString(),
      groupDescription: conversation.groupDescription,
      createdAt: conversation.createdAt,
      groupImage: conversation.groupImage,
    }
  }
}
