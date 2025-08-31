import { FriendShip } from '../../domain/entities/friendship'

export interface FriendshipsRepository {
  findBetweenUsers(
    requesterId: string,
    addresseeId: string
  ): Promise<FriendShip | null>
  create(friendship: FriendShip): Promise<void>
  findById(friendshipId: string): Promise<FriendShip | null>
  save(friendship: FriendShip): Promise<void>
  remove(friendshipId: string): Promise<void>
}
