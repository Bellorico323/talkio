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
