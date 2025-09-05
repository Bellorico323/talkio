import { EventHandler } from '@/shared/domain/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { FriendshipRequestSentEvent } from '@/modules/friendships/domain/events/friendship-request-sent-event'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { MessageGateway } from '@/infra/contracts/messages-gateway'
import { UsersRepository } from '@/modules/identity/application/repositories/users-repository'

export class OnFriendshipRequestSent implements EventHandler {
  constructor(
    private sendNotification: SendNotificationUseCase,
    private messageGateway: MessageGateway,
    private usersRepository: UsersRepository
  ) {}

  setupSubscriptions(): void {
    DomainEvents.subscribe(
      FriendshipRequestSentEvent.name,
      this.handle.bind(this)
    )
  }

  private async handle({ friendship }: FriendshipRequestSentEvent) {
    const { requesterId, addresseeId } = friendship
    const content = 'Novo pedido de amizade recebido!'
    const type = 'friend_request'

    await this.sendNotification.execute({
      senderId: addresseeId.toString(),
      recipientId: requesterId.toString(),
      content,
      type,
    })

    const sender = await this.usersRepository.findById(requesterId.toString())

    console.log('NOTIFICATION SENT', {
      type: 'friendship.sendRequest',
      payload: {
        body: {
          sender: sender?.name ?? 'Unknown',
          content,
        },
      },
    })

    this.messageGateway.sendToUser(addresseeId.toString(), {
      type: 'friendship.sendRequest',
      payload: {
        body: {
          sender: sender?.name ?? 'Unknown',
          content,
        },
      },
    })
  }
}
