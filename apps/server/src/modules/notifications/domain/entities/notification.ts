import { Entity } from '@/shared/domain/entities/entity'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'

export type NotificationType =
  | 'new_message'
  | 'friend_request'
  | 'group_created'

export interface NotificationProps {
  content: string
  senderId: UniqueEntityID
  recipientId: UniqueEntityID
  readAt?: Date | null
  createdAt: Date
  type: NotificationType
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get senderId() {
    return this.props.senderId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }

  get type() {
    return this.props.type
  }

  public read() {
    this.props.readAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt' | 'readAt'>,
    id?: UniqueEntityID
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        readAt: props.readAt ?? null,
      },
      id
    )

    return notification
  }
}
