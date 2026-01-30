import { Friendship, FriendshipProps } from '@/modules/friendships/domain/entities/friendship'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

export function makeFriendship(
  override: Partial<FriendshipProps> = {},
  id?: UniqueEntityID
) {
  const friendship = Friendship.create(
    {
      requesterId: new UniqueEntityID(),
      addresseeId: new UniqueEntityID(),
      status: 'pending',
      ...override,
    },
    id
  )

  return friendship
}
