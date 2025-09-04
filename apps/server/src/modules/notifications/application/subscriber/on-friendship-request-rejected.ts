import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { FriendshipRequestRejectedEvent } from '@/modules/friendships/domain/events/friendship-request-rejected-event'

export class OnFriendshipRequestRejected implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {}

  setupSubscriptions(): void {
    DomainEvents.subscribe(
      FriendshipRequestRejectedEvent.name,
      this.handle.bind(this)
    )
  }

  private async handle({ friendship }: FriendshipRequestRejectedEvent) {
    await this.sendNotification.execute({
      senderId: friendship.addresseeId.toString(),
      recipientId: friendship.requesterId.toString(),
      content: 'Seu pedido de amizade foi recusado!',
      type: 'friend_request',
    })
  }
}
