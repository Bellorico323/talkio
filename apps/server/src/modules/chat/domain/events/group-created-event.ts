import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { DomainEvent } from '@/shared/domain/events/domain-event'
import { Conversation } from '../entities/conversation'

export class GroupCreatedEvent implements DomainEvent {
  ocurredAt: Date
  conversation: Conversation

  constructor(conversation: Conversation) {
    this.ocurredAt = new Date()
    this.conversation = conversation
  }

  getAggregateId(): UniqueEntityID {
    return this.conversation.id
  }
}
