import { Either, left, right } from '@/shared/domain/either'
import { ChatUsersRepository } from '../repositories/chat-users-repository'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'
import { Conversation } from '../../domain/entities/conversation'
import { ConversationsRepository } from '../repositories/conversations-repository'
import { OwnerNotInformedError } from './errors/owner-not-informed-error'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'

interface CreateGroupUserCaseRequest {
  groupImage?: string
  groupDescription?: string | undefined
  ownerId: string
  participantsIds: string[]
  title: string
}

type CreateGroupUseCaseResponse = Either<
  OwnerNotInformedError | ResourceNotFoundError,
  {
    conversation: Conversation
  }
>

export class CreateGroupUseCase {
  constructor(
    private conversationsRepository: ConversationsRepository,
    private chatUsersRepository: ChatUsersRepository
  ) {}

  async execute({
    groupImage,
    groupDescription,
    ownerId,
    participantsIds,
    title,
  }: CreateGroupUserCaseRequest): Promise<CreateGroupUseCaseResponse> {
    const chatUser = await this.chatUsersRepository.findById(ownerId)

    if (!chatUser) {
      return left(new ResourceNotFoundError())
    }

    const conversation = Conversation.createGroup({
      ownerId: new UniqueEntityID(ownerId),
      participantsIds: participantsIds.map((id) => new UniqueEntityID(id)),
      title,
      groupDescription,
      groupImage,
    })

    if (!conversation) {
      return left(new OwnerNotInformedError())
    }

    await this.conversationsRepository.create(conversation)

    return right({ conversation })
  }
}
