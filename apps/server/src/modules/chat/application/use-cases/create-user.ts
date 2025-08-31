import { Either, right } from '@/shared/domain/either'
import { ChatUser } from '../../domain/entities/chat-user'
import { ChatUsersRepository } from '../repositories/chat-users-repository'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

interface CreateChatUserUserCaseRequest {
  userId: string
}

type CreateChatUserUseCaseResponse = Either<
  null,
  {
    chatUser: ChatUser
  }
>

export class CreateChatUserUseCase {
  constructor(private chatUsersRepository: ChatUsersRepository) {}

  async execute({
    userId,
  }: CreateChatUserUserCaseRequest): Promise<CreateChatUserUseCaseResponse> {
    const chatUser = ChatUser.create({
      userId: new UniqueEntityID(userId),
    })

    await this.chatUsersRepository.create(chatUser)

    return right({ chatUser })
  }
}
