import { Notification } from '@/modules/notifications/domain/entities/notification'
import { notifications } from '../../database/schemas/notification'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

type DrizzleNotification = typeof notifications.$inferInsert

export class NotificationMapper {
  static toDomain(drizzleNotification: DrizzleNotification): Notification {
    return Notification.create(
      {
        senderId: new UniqueEntityID(drizzleNotification.senderId),
        recipientId: new UniqueEntityID(drizzleNotification.recipientId),
        content: drizzleNotification.content,
        type: drizzleNotification.type,
        readAt: drizzleNotification.readAt,
        createdAt: drizzleNotification.createdAt,
      },
      new UniqueEntityID(drizzleNotification.id)
    )
  }

  static toPersistence(notification: Notification): DrizzleNotification {
    return {
      id: notification.id.toString(),
      senderId: notification.senderId.toString(),
      recipientId: notification.recipientId.toString(),
      content: notification.content,
      type: notification.type,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
    }
  }
}
