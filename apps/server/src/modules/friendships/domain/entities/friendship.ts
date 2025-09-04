import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'
import { FriendshipRequestSentEvent } from '../events/friendship-request-sent-event'
import { FriendshipRequestAcceptedEvent } from '../events/friendship-request-accepted-event'
import { FriendshipRequestRejectedEvent } from '../events/friendship-request-rejected-event'

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected'

export interface FriendshipProps {
  requesterId: UniqueEntityID
  addresseeId: UniqueEntityID
  status: FriendshipStatus
  createdAt: Date
  acceptedAt?: Date | undefined
}

export class Friendship extends AggregateRoot<FriendshipProps> {
  get status() {
    return this.props.status
  }

  get requesterId() {
    return this.props.requesterId
  }

  get addresseeId() {
    return this.props.addresseeId
  }

  get createdAt() {
    return this.props.createdAt
  }
  get acceptedAt() {
    return this.props.acceptedAt
  }

  public accept() {
    if (this.props.status !== 'pending') {
      return
    }

    this.props.status = 'accepted'
    this.props.acceptedAt = new Date()

    this.addDomainEvent(new FriendshipRequestAcceptedEvent(this))
  }

  public reject() {
    this.props.status = 'rejected'

    this.addDomainEvent(new FriendshipRequestRejectedEvent(this))
  }

  static create(
    props: Optional<FriendshipProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const friendship = new Friendship(
      {
        ...props,
        status: 'pending',
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    friendship.addDomainEvent(new FriendshipRequestSentEvent(friendship))

    return friendship
  }
}
