import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'

export type FriendshipStatus = 'pending' | 'accepted'

export interface FriendshipProps {
  requesterId: UniqueEntityID
  addresseeId: UniqueEntityID
  status: FriendshipStatus
  createdAt: Date
  acceptedAt?: Date | undefined
}

export class FriendShip extends AggregateRoot<FriendshipProps> {
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
  }

  static create(
    props: Optional<FriendshipProps, 'status' | 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const friendship = new FriendShip({
      ...props,
      status: 'pending',
      createdAt: props.createdAt ?? new Date(),
    })

    return friendship
  }
}
