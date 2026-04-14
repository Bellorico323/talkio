import { db } from '@/infra/database/client'
import { user } from '@/infra/database/schema/auth-schema'
import {
	SearchUsersParams,
	SearchUsersResult,
	UsersRepository,
} from '@/modules/identity/application/repositories/users-repository'
import { User } from '@/modules/identity/domain/entities/user'
import { count, eq, ilike } from 'drizzle-orm'
import { UserMapper } from '../../mappers/better-auth-user-mapper'

export class DrizzleUsersRepository implements UsersRepository {
	async findById(userId: string): Promise<User | null> {
		const drizzleUser = await db.query.user.findFirst({
			where: eq(user.id, userId),
		})

		if (!drizzleUser) return null

		return UserMapper.toDomain(drizzleUser)
	}

	async searchByUsername({
		username,
		page,
		limit,
	}: SearchUsersParams): Promise<SearchUsersResult> {
		const where = username ? ilike(user.username, `%${username}%`) : undefined

		const [drizzleUsers, [{ value: total }]] = await Promise.all([
			db
				.select()
				.from(user)
				.where(where)
				.limit(limit)
				.offset((page - 1) * limit),
			db.select({ value: count() }).from(user).where(where),
		])

		return {
			users: drizzleUsers.map(UserMapper.toDomain),
			total,
		}
	}
}
