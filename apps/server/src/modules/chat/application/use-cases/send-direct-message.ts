import { Either, left, right } from '@/shared/domain/either'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Conversation } from '../../domain/entities/conversation'
import { ConversationsRepository } from '../repositories/conversations-repository'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

interface SendDirectMessageUserCaseRequest {
  conversationId?: string
  senderId: string
  recipientId: string
  content: string
}

type SendDirectMessageUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    conversation: Conversation
  }
>

export class SendDirectMessageUseCase {
  constructor(private conversationsRepository: ConversationsRepository) {}

  async execute({
    content,
    recipientId,
    senderId,
    conversationId,
  }: SendDirectMessageUserCaseRequest): Promise<SendDirectMessageUseCaseResponse> {
    let conversation: Conversation | null = null
    let isNewConversation = false

    if (conversationId) {
      conversation = await this.conversationsRepository.findById(conversationId)
      if (!conversation) {
        return left(new ResourceNotFoundError())
      }
    } else {
      conversation =
        await this.conversationsRepository.findPrivateConversationBetweenUsers(
          senderId,
          recipientId
        )

      if (!conversation) {
        isNewConversation = true
        conversation = Conversation.create({
          isGroup: false,
          participantsIds: [
            new UniqueEntityID(senderId),
            new UniqueEntityID(recipientId),
          ],
        })
      }
    }

    conversation.addMessage(new UniqueEntityID(senderId), content)

    if (isNewConversation) {
      await this.conversationsRepository.create(conversation)
    } else {
      await this.conversationsRepository.save(conversation)
    }

    DomainEvents.dispatchEventsForAggregate(conversation.id)

    return right({
      conversation,
    })
  }
}
