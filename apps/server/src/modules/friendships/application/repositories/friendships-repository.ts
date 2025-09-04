import { Friendship } from '../../domain/entities/friendship'

export interface FriendshipsRepository {
  findBetweenUsers(
    requesterId: string,
    addresseeId: string
  ): Promise<Friendship | null>
  create(friendship: Friendship): Promise<void>
  findById(friendshipId: string): Promise<Friendship | null>
  save(friendship: Friendship): Promise<void>
  remove(friendshipId: string): Promise<void>
}
