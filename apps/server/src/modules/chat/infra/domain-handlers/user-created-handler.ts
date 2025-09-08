import { OnUserCreated } from '../../application/subscriber/on-user-created'
import { CreateChatUserUseCase } from '../../application/use-cases/create-user'
import { DrizzleChatUsersReposiroty } from '../repositories/drizzle/drizzle-chat-users-repository'

export function userCreatedHandler() {
  const chatUsersRepository = new DrizzleChatUsersReposiroty()
  const createChatUserUseCase = new CreateChatUserUseCase(chatUsersRepository)

  new OnUserCreated(createChatUserUseCase)
}
