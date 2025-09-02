import { ConversationsRepository } from '@/modules/chat/application/repositories/conversations-repository'
import { Conversation } from '@/modules/chat/domain/entities/conversation'

export class InMemoryConversationsRepository
  implements ConversationsRepository
{
  public items: Conversation[] = []

  async create(conversation: Conversation): Promise<void> {
    this.items.push(conversation)
  }

  async save(conversation: Conversation): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.id.equals(conversation.id)
    )

    if (index >= 0) {
      this.items[index] = conversation
    }
  }

  async findManyByParticipantId(
    participantId: string
  ): Promise<Conversation[]> {
    return this.items.filter((conversation) =>
      conversation.participantsIds.some((id) => id.toString() === participantId)
    )
  }

  async findById(conversationId: string): Promise<Conversation | null> {
    const conversation = this.items.find(
      (item) => item.id.toString() === conversationId
    )

    if (!conversation) return null

    return conversation
  }

  async findPrivateConversationBetweenUsers(
    userId1: string,
    userId2: string
  ): Promise<Conversation | null> {
    const conversation = this.items.find((conv) => {
      const isPrivate = !conv.isGroup

      const hasTwoParticipants = conv.participantsIds.length === 2

      const hasUser1 = conv.participantsIds.some(
        (id) => id.toString() === userId1
      )
      const hasUser2 = conv.participantsIds.some(
        (id) => id.toString() === userId2
      )

      return isPrivate && hasTwoParticipants && hasUser1 && hasUser2
    })

    return conversation || null
  }
}
