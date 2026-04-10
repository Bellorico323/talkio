import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { User } from '../../domain/entities/user'

type RawUserFromAuth = {
	id: string
	name: string
	username: string
	email: string
	image?: string | null | undefined
	createdAt: Date
	updatedAt: Date
}

export class UserMapper {
	public static toDomain(raw: RawUserFromAuth): User {
		const user = User.create(
			{
				email: raw.email,
				name: raw.name ?? 'Nome Padrão',
				username: raw.name,
				emailVerifield: false,
				image: raw.image,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityID(raw.id)
		)
		return user
	}
}
