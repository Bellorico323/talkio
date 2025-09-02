import {
  Conversation,
  ConversationProps,
} from '@/modules/chat/domain/entities/conversation'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeConversation(
  override: Partial<ConversationProps> = {},
  id?: UniqueEntityID
) {
  const conversation = Conversation.create(
    {
      isGroup: false,
      participantsIds: [new UniqueEntityID(), new UniqueEntityID()],
      ...override,
    },
    id
  )

  return conversation
}
