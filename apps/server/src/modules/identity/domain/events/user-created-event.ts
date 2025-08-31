import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { DomainEvent } from '@/shared/domain/events/domain-event'
import { User } from '../entities/user'

export class UserCreatedEvent implements DomainEvent {
  ocurredAt: Date
  user: User

  constructor(user: User) {
    this.ocurredAt = new Date()
    this.user = user
  }

  getAggregateId(): UniqueEntityID {
    return this.user.id
  }
}
