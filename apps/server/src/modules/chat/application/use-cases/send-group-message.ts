import { Either, left, right } from '@/shared/domain/either'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Conversation } from '../../domain/entities/conversation'
import { ConversationsRepository } from '../repositories/conversations-repository'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { NotAllowedError } from '@/shared/domain/errors/not-allowed-error'
import { ConversatinIsNotGroupError } from './errors/conversation-is-not-group-error'
import { NotParticipantError } from './errors/not-participant-error'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

interface SendGroupMessageUseCaseRequest {
  senderId: string
  conversationId: string
  content: string
}

type SendGroupMessageUseCaseResponse = Either<
  | ResourceNotFoundError
  | NotAllowedError
  | ConversatinIsNotGroupError
  | NotParticipantError,
  {
    conversation: Conversation
  }
>

export class SendGroupMessageUseCase {
  constructor(private conversationsRepository: ConversationsRepository) {}

  async execute({
    content,
    senderId,
    conversationId,
  }: SendGroupMessageUseCaseRequest): Promise<SendGroupMessageUseCaseResponse> {
    const conversation =
      await this.conversationsRepository.findById(conversationId)

    if (!conversation) {
      return left(new ResourceNotFoundError())
    }

    if (!conversation.isGroup) {
      return left(new ConversatinIsNotGroupError())
    }

    try {
      conversation.addMessage(new UniqueEntityID(senderId), content)
    } catch (error) {
      if (error instanceof NotParticipantError) {
        return left(error)
      }
    }

    await this.conversationsRepository.save(conversation)

    DomainEvents.dispatchEventsForAggregate(conversation.id)

    return right({ conversation })
  }
}
