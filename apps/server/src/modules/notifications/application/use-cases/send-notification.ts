import { Either, right } from '@/shared/domain/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../domain/entities/notification'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

interface SendNotificationUseCaseRequest {
  senderId: string
  recipientId: string
  content: string
  type: 'new_message' | 'friend_request'
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    senderId,
    recipientId,
    content,
    type,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
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
