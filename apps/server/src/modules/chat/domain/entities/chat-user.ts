import { Entity } from '@/shared/domain/entities/entity'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

export interface ChatUserProps {
  userId: UniqueEntityID
  status?: string
  bio?: string
}

export class ChatUser extends Entity<ChatUserProps> {
  static create(props: ChatUserProps, id?: UniqueEntityID) {
    return new ChatUser(
      {
        ...props,
      },
      id
    )
  }
}
