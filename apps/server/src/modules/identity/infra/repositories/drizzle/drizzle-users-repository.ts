import { db } from '@/infra/database/client'
import { user } from '@/infra/database/schema/auth-schema'
import { UsersRepository } from '@/modules/identity/application/repositories/users-repository'
import { User } from '@/modules/identity/domain/entities/user'
import { eq } from 'drizzle-orm'
import { UserMapper } from '../../mappers/better-auth-user-mapper'

export class DrizzleUsersRepository implements UsersRepository {
  async findById(userId: string): Promise<User | null> {
    const drizzleUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    })

    if (!drizzleUser) return null

    return UserMapper.toDomain(drizzleUser)
  }
}
