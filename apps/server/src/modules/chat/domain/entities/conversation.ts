import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'
import { Message } from './message'

export interface ConversationProps {
  title?: string
  isGroup: boolean
  participantsIds: UniqueEntityID[]
  groupImage?: string | undefined
  groupDescription?: string | undefined
  ownerId?: UniqueEntityID
  createdAt: Date
}

export class Conversation extends AggregateRoot<ConversationProps> {
  private _messages: Message[] = []

  get title() {
    return this.props.title
  }

  get isGroup() {
    return this.props.isGroup
  }

  get participantsIds() {
    return this.props.participantsIds
  }

  get createdAt() {
    return this.props.createdAt
  }

  get messages() {
    return this._messages
  }

  get ownerId() {
    return this.props.ownerId
  }

  public addMessage(senderId: UniqueEntityID, content: string) {
    const isParticipant = this.props.participantsIds.some((id) =>
      id.equals(senderId)
    )

    if (!isParticipant) {
      throw new Error('Sender is not a participant of this conversation.')
    }

    const message = Message.create({
      conversationId: this.id,
      senderId: senderId,
      content: content,
    })

    this._messages.push(message)
  }

  addParticipant(participantId: UniqueEntityID) {
    if (this.props.participantsIds.some((id) => id.equals(participantId)))
      return

    if (!this.props.isGroup && this.props.participantsIds.length >= 2) {
      throw new Error('Direct conversations can only have 2 participants.')
    }

    this.props.participantsIds.push(participantId)
  }

  static create(
    props: Optional<ConversationProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    return new Conversation(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
  }

  static createGroup(
    props: Optional<
      ConversationProps,
      'createdAt' | 'groupDescription' | 'groupImage' | 'isGroup'
    >,
    id?: UniqueEntityID
  ) {
    if (!props.ownerId) {
      return null
    }

    const participants = new Set([props.ownerId, ...props.participantsIds])

    const groupConversation = new Conversation(
      {
        isGroup: true,
        ownerId: props.ownerId,
        participantsIds: Array.from(participants),
        title: props.title,
        groupDescription: props.groupDescription,
        groupImage: props.groupImage,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return groupConversation
  }
}
