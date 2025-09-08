import { Friendship } from '@/modules/friendships/domain/entities/friendship'
import { FriendshipsRepository } from '../../../application/repositories/friendships-repository'
import { db } from '@/infra/database/client'
import { and, eq, or } from 'drizzle-orm'
import { FriendshipMapper } from '../../mappers/friendship-mapper'
import { friendships } from '@/modules/friendships/infra/database/schema/friendships'

export class DrizzleFriendshipsRepository implements FriendshipsRepository {
  async findById(friendshipId: string): Promise<Friendship | null> {
    const result = await db.query.friendships.findFirst({
      where: eq(friendships.id, friendshipId),
    })

    if (!result) return null

    return FriendshipMapper.toDomain(result)
  }

  async findBetweenUsers(
    requesterId: string,
    addresseeId: string
  ): Promise<Friendship | null> {
    const result = await db.query.friendships.findFirst({
      where: or(
        and(
          eq(friendships.requesterId, requesterId),
          eq(friendships.addresseeId, addresseeId)
        ),
        and(
          eq(friendships.requesterId, addresseeId),
          eq(friendships.addresseeId, requesterId)
        )
      ),
    })

    if (!result) return null

    return FriendshipMapper.toDomain(result)
  }

  async create(friendship: Friendship): Promise<void> {
    const data = FriendshipMapper.toPersistence(friendship)
    await db.insert(friendships).values(data)
  }

  async save(friendship: Friendship): Promise<void> {
    const data = FriendshipMapper.toPersistence(friendship)
    await db
      .update(friendships)
      .set(data)
      .where(eq(friendships.id, friendship.id.toString()))
  }

  async remove(friendshipId: string): Promise<void> {
    await db.delete(friendships).where(eq(friendships.id, friendshipId))
  }
}
