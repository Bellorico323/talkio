import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { FriendshipRequestAcceptedEvent } from '@/modules/friendships/domain/events/friendship-request-accepted-event'

export class OnFriendshipRequestAccepted implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {}

  setupSubscriptions(): void {
    DomainEvents.subscribe(
      FriendshipRequestAcceptedEvent.name,
      this.handle.bind(this)
    )
  }

  private async handle({ friendship }: FriendshipRequestAcceptedEvent) {
    await this.sendNotification.execute({
      senderId: friendship.addresseeId.toString(),
      recipientId: friendship.requesterId.toString(),
      content: 'Seu pedido de amizade foi aceito!',
      type: 'friend_request',
    })
  }
}
