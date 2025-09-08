import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { DomainEvent } from '@/shared/domain/events/domain-event'
import { Message } from '../entities/message'

export class MessageReceivedEvent implements DomainEvent {
  ocurredAt: Date
  message: Message
  conversationParticipants: UniqueEntityID[]

  constructor(message: Message, conversationParticipants: UniqueEntityID[]) {
    this.ocurredAt = new Date()
    this.message = message
    this.conversationParticipants = conversationParticipants
  }

  getAggregateId(): UniqueEntityID {
    return this.message.conversationId
  }
}
