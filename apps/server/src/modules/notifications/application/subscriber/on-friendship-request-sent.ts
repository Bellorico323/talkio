import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { FriendshipRequestSentEvent } from '@/modules/friendships/domain/events/friendship-request-sent-event'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

export class OnFriendshipRequestSent implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {}

  setupSubscriptions(): void {
    DomainEvents.subscribe(
      FriendshipRequestSentEvent.name,
      this.handle.bind(this)
    )
  }

  private async handle({ friendship }: FriendshipRequestSentEvent) {
    await this.sendNotification.execute({
      senderId: friendship.addresseeId.toString(),
      recipientId: friendship.requesterId.toString(),
      content: 'Novo pedido de amizade recebido!',
      type: 'friend_request',
    })
  }
}
