import { Conversation } from '../../domain/entities/conversation'

export interface ConversationsRepository {
  create(conversation: Conversation): Promise<void>
  save(conversation: Conversation): Promise<void>
  findManyByParticipantId(participantId: string): Promise<Conversation[]>
  findById(conversationId: string): Promise<Conversation | null>
  findPrivateConversationBetweenUsers(
    senderId: string,
    recipientId: string
  ): Promise<Conversation | null>
}
