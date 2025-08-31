import { SendFriendshipRequestUseCase } from '@/modules/friendships/application/use-cases/send-friendship-request'
import { DrizzleFriendshipsRepository } from '../../repositories/drizzle/drizzle-friendships-repository'

export class MakeDrizzleSendFriendshipRequest {
  static make() {
    const drizzleFriendshipsrepository = new DrizzleFriendshipsRepository()
    const sendFriendshipUseCase = new SendFriendshipRequestUseCase(
      drizzleFriendshipsrepository
    )

    return sendFriendshipUseCase
  }
}
