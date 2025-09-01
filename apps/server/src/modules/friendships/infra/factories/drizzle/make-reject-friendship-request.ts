import { DrizzleFriendshipsRepository } from '../../repositories/drizzle/drizzle-friendships-repository'
import { RejectFriendshipRequestUseCase } from '@/modules/friendships/application/use-cases/reject-friendship-request'

export class MakeDrizzleRejectFriendshipRequest {
  static make() {
    const drizzleFriendshipsrepository = new DrizzleFriendshipsRepository()
    const rejecttFriendshipUseCase = new RejectFriendshipRequestUseCase(
      drizzleFriendshipsrepository
    )

    return rejecttFriendshipUseCase
  }
}
