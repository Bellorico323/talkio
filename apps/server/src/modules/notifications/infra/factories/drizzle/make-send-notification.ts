import { SendNotificationUseCase } from '@/modules/notifications/application/use-cases/send-notification'
import { DrizzleNotificationsRepository } from '../../repositories/drizzle/drizzle-notifications-repository'

export class MakeDrizzleSendNotification {
  static make() {
    const notificationsRepository = new DrizzleNotificationsRepository()
    const sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository
    )

    return sendNotificationUseCase
  }
}
