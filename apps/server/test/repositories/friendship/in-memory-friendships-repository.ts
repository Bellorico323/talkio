import { FriendshipsRepository } from '@/modules/friendships/application/repositories/friendships-repository'
import { FriendShip } from '@/modules/friendships/domain/entities/friendship'

export class InMemoryFriendshipsRepository implements FriendshipsRepository {
  public items: FriendShip[] = []

  async findBetweenUsers(
    requesterId: string,
    addresseeId: string
  ): Promise<FriendShip | null> {
    const friendship = this.items.find((item) => {
      const isDirectMatch =
        item.requesterId.toString() === requesterId &&
        item.addresseeId.toString() === addresseeId

      const isInverseMatch =
        item.requesterId.toString() === addresseeId &&
        item.addresseeId.toString() === requesterId

      return isDirectMatch || isInverseMatch
    })

    return friendship || null
  }

  async create(friendship: FriendShip): Promise<void> {
    this.items.push(friendship)
  }

  async findById(friendshipId: string): Promise<FriendShip | null> {
    const friendship = this.items.find(
      (item) => item.id.toString() === friendshipId
    )

    return friendship || null
  }

  async save(friendship: FriendShip): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(friendship.id))

    if (index >= 0) {
      this.items[index] = friendship
    }
  }

  async remove(friendshipId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.id.toString() !== friendshipId
    )
  }
}
