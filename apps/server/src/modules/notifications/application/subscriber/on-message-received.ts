import { MessageReceivedEvent } from '@/modules/chat/domain/events/message-received'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { MessageGateway } from '@/infra/contracts/messages-gateway'

export class OnMessageReceived implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private messageGateway: MessageGateway
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.subscribe(MessageReceivedEvent.name, this.handle.bind(this))
  }

  private async handle({
    message,
    conversationParticipants,
  }: MessageReceivedEvent) {
    const { content, senderId, conversationId } = message

    const recepientsIds = conversationParticipants.filter(
      (participantId) => !participantId.equals(senderId)
    )

    for (const recipientId of recepientsIds) {
      await this.sendNotification.execute({
        content,
        senderId: senderId.toString(),
        recipientId: recipientId.toString(),
        type: 'new_message',
      })

      this.messageGateway.sendToUser(recipientId.toString(), {
        type: 'notification.messageReceived',
        payload: {
          body: {
            content: content,
            conversationId: conversationId.toString(),
            senderId: senderId.toString(),
          },
        },
      })
    }
  }
}
