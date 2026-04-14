import { User, UserProps } from '@/modules/identity/domain/entities/user'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeUser(
	override: Partial<UserProps> = {},
	id?: UniqueEntityID
) {
	const user = User.create(
		{
			name: faker.person.fullName(),
			username: faker.internet.username(),
			email: faker.internet.email(),
			emailVerifield: false,
			image: faker.image.avatar(),
			...override,
		},
		id
	)

	return user
}
