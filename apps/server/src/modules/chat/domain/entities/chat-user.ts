import { Entity } from '@/shared/domain/entities/entity'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

export interface ChatUserProps {
  userId: UniqueEntityID
  status?: ChatUserStatus
  bio?: string
}

export type ChatUserStatus = 'offline' | 'online'

export class ChatUser extends Entity<ChatUserProps> {
  get userId() {
    return this.props.userId
  }

  get status() {
    return this.props.status
  }

  get bio() {
    return this.props.bio
  }

  static create(props: ChatUserProps, id?: UniqueEntityID) {
    return new ChatUser(
      {
        status: props.status ?? 'offline',
        ...props,
      },
      id
    )
  }
}
