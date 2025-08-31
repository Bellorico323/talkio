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
