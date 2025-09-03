import { Either, right } from '@/shared/domain/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../domain/entities/notification'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

interface CreateChatUserUserCaseRequest {
  senderId: string
  recipientId: string
  content: string
  type: 'new_message' | 'friend_request'
}

type CreateChatUserUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class CreateChatUserUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    senderId,
    recipientId,
    content,
    type,
  }: CreateChatUserUserCaseRequest): Promise<CreateChatUserUseCaseResponse> {
    const notification = Notification.create({
      senderId: new UniqueEntityID(senderId),
      recipientId: new UniqueEntityID(recipientId),
      content,
      type,
    })

    await this.notificationsRepository.create(notification)

    return right({ notification })
  }
}
