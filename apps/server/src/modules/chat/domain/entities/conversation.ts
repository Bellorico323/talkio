import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Optional } from '@/shared/domain/types/optional'

export interface ConversationProps {
  title?: string
  isGroup: boolean
  participantsIds: UniqueEntityID[]
  createdAt: Date
}

export class Conversation extends AggregateRoot<ConversationProps> {
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
}
