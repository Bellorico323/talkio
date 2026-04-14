import {
	SearchUsersParams,
	SearchUsersResult,
	UsersRepository,
} from '@/modules/identity/application/repositories/users-repository'
import { User } from '@/modules/identity/domain/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = []

	async findById(userId: string): Promise<User | null> {
		const user = this.items.find((u) => u.id.toString() === userId)

		if (!user) return null

		return user
	}

	async searchByUsername({
		username,
		page,
		limit,
	}: SearchUsersParams): Promise<SearchUsersResult> {
		const filtered = username
			? this.items.filter((u) =>
				u.username.toLowerCase().includes(username.toLowerCase())
			)
			: [...this.items]

		const total = filtered.length
		const users = filtered.slice((page - 1) * limit, page * limit)

		return { users, total }
	}
}
