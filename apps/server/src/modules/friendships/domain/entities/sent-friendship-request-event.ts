import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { DomainEvent } from '@/shared/domain/events/domain-event'
import { FriendShip } from './friendship'

export class SentFriendshipRequestEvent implements DomainEvent {
  ocurredAt: Date
  friendship: FriendShip

  constructor(friendship: FriendShip) {
    this.ocurredAt = new Date()
    this.friendship = friendship
  }

  getAggregateId(): UniqueEntityID {
    return this.friendship.id
  }
}
