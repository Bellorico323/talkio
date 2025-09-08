import { Friendship } from '@/modules/friendships/domain/entities/friendship'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { friendships } from '@/modules/friendships/infra/database/schema/friendships'

type DrizzleFriendship = typeof friendships.$inferInsert

export class FriendshipMapper {
  public static toDomain(raw: DrizzleFriendship): Friendship {
    return Friendship.create(
      {
        requesterId: new UniqueEntityID(raw.requesterId),
        addresseeId: new UniqueEntityID(raw.addresseeId),
        status: raw.status,
        createdAt: raw.createdAt,
        acceptedAt: raw.acceptedAt ?? undefined,
      },
      new UniqueEntityID(raw.id)
    )
  }

  public static toPersistence(friendship: Friendship) {
    return {
      id: friendship.id.toString(),
      requesterId: friendship.requesterId.toString(),
      addresseeId: friendship.addresseeId.toString(),
      status: friendship.status,
      createdAt: friendship.createdAt,
      acceptedAt: friendship.acceptedAt ?? null,
    }
  }
}
