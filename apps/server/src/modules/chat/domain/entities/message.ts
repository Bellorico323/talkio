import { Entity } from '@/shared/domain/entities/entity'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'

export interface MessageProps {
  conversationId: UniqueEntityID
  senderId: UniqueEntityID
  content: string
  createdAt: Date
}

export class Message extends Entity<MessageProps> {
  get conversationId() {
    return this.props.conversationId
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

  static create(
    props: Optional<MessageProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new Message(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }
}
