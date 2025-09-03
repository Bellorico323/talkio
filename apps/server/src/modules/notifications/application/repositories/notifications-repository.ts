import { Notification } from '../../domain/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
}
