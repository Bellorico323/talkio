import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { UserCreatedEvent } from '../events/user-created-event'
import { Optional } from '@/shared/domain/types/optional'

export interface UserProps {
  name: string
  email: string
  emailVerifield: boolean
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export class User extends AggregateRoot<UserProps> {
  get name(): string {
    return this.props.name
  }

  get email(): string {
    return this.props.email
  }

  get emailVerifield(): boolean {
    return this.props.emailVerifield
  }

  get image(): string | null {
    return this.props.image
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    user.addDomainEvent(new UserCreatedEvent(user))

    return user
  }
}
