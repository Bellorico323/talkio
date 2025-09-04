import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { DomainEvent } from '@/shared/domain/events/domain-event'
import { Friendship } from '../entities/friendship'

export class FriendshipRequestSentEvent implements DomainEvent {
  ocurredAt: Date
  friendship: Friendship

  constructor(friendship: Friendship) {
    this.ocurredAt = new Date()
    this.friendship = friendship
  }

  getAggregateId(): UniqueEntityID {
    return this.friendship.id
  }
}
