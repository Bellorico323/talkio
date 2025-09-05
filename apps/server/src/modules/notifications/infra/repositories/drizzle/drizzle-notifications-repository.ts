import { db } from '@/infra/database/client'
import { NotificationsRepository } from '@/modules/notifications/application/repositories/notifications-repository'
import { Notification } from '@/modules/notifications/domain/entities/notification'
import { notifications } from '../../database/schemas/notification'
import { NotificationMapper } from '../../mappers/drizzle/notification-mapper'

export class DrizzleNotificationsRepository implements NotificationsRepository {
  async create(notification: Notification): Promise<void> {
    const data = NotificationMapper.toPersistence(notification)

    await db.insert(notifications).values(data)
  }
}
