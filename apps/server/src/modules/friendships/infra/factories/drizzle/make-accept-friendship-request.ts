import { DrizzleFriendshipsRepository } from '../../repositories/drizzle/drizzle-friendships-repository'
import { AcceptFriendshipRequestUseCase } from '@/modules/friendships/application/use-cases/accept-friendship-request'

export class MakeDrizzleAccepFriendshipRequest {
  static make() {
    const drizzleFriendshipsrepository = new DrizzleFriendshipsRepository()
    const acceptFriendshipUseCase = new AcceptFriendshipRequestUseCase(
      drizzleFriendshipsrepository
    )

    return acceptFriendshipUseCase
  }
}
