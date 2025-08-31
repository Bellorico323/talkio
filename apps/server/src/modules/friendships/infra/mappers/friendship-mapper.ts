import {
  FriendShip,
  FriendshipProps,
} from '@/modules/friendships/domain/entities/friendship'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

type DrizzleFriendship = {
  id: string
  requesterId: string
  addresseeId: string
  status: 'pending' | 'accepted'
  createdAt: Date
  acceptedAt: Date | null
}

export class FriendshipMapper {
  public static toDomain(raw: DrizzleFriendship): FriendShip {
    const props: FriendshipProps = {
      requesterId: new UniqueEntityID(raw.requesterId),
      addresseeId: new UniqueEntityID(raw.addresseeId),
      status: raw.status,
      createdAt: raw.createdAt,
      acceptedAt: raw.acceptedAt ?? undefined,
    }
    return FriendShip.create(props, new UniqueEntityID(raw.id))
  }

  public static toPersistence(friendship: FriendShip) {
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
