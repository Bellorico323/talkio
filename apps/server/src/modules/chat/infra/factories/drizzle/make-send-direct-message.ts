import { SendDirectMessageUseCase } from '@/modules/chat/application/use-cases/send-direct-message'
import { DrizzleConversationsRepository } from '../../repositories/drizzle/drizzle-conversations-repository'

export class MakeDrizzleSendDirectMessage {
  static make() {
    const conversationsRepository = new DrizzleConversationsRepository()
    const sendDirectMessageUseCase = new SendDirectMessageUseCase(
      conversationsRepository
    )

    return sendDirectMessageUseCase
  }
}
