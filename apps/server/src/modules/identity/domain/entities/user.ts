import { AggregateRoot } from '@/shared/domain/entities/aggregate-root'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { UserCreatedEvent } from '../events/user-created-event'
import { Optional } from '@/shared/domain/types/optional'

export interface UserProps {
	name: string
	username: string
	email: string
	emailVerifield: boolean
	image?: string | null | undefined
	createdAt: Date
	updatedAt: Date
}

export class User extends AggregateRoot<UserProps> {
	get name(): string {
		return this.props.name
	}

	get username(): string {
		return this.props.username
	}

	get email(): string {
		return this.props.email
	}

	get emailVerifield(): boolean {
		return this.props.emailVerifield
	}

	get image(): string | null | undefined {
		return this.props.image
	}

	get createdAt(): Date {
		return this.props.createdAt
	}

	get updatedAt(): Date {
		return this.props.updatedAt
	}

	static create(props: Optional<UserProps, 'createdAt' | 'updatedAt'>, id?: UniqueEntityID) {
		const now = new Date()
		const user = new User(
			{
				...props,
				createdAt: props.createdAt ?? now,
				updatedAt: props.updatedAt ?? now,
			},
			id
		)

		user.addDomainEvent(new UserCreatedEvent(user))

		return user
	}
}
