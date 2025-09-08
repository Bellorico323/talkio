import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { MessageGateway } from '@/infra/contracts/messages-gateway'
import { GroupCreatedEvent } from '@/modules/chat/domain/events/group-created-event'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

export class OnGroupCreated implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private messageGateway: MessageGateway
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.subscribe(GroupCreatedEvent.name, this.handle.bind(this))
  }

  private async handle({ conversation }: GroupCreatedEvent) {
    const participantsIds = conversation.participantsIds

    if (!conversation.ownerId || !conversation.title) {
      console.error(
        `Conversation: ${conversation.id.toValue()} has no title ors owner declared.`
      )
      return
    }

    for (const participantId of participantsIds) {
      await this.sendNotification.execute({
        content: `Você foi adicionado no grupo: ${conversation.title}`,
        recipientId: participantId.toString(),
        senderId: conversation.ownerId.toString(),
        type: 'group_created',
      })

      this.messageGateway.sendToUser(participantId.toString(), {
        type: 'notification.groupCreated',
        payload: {
          body: {
            groupName: conversation.title,
          },
        },
      })
    }
  }
}
