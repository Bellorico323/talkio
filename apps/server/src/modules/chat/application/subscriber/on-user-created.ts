import { EventHandler } from '@/shared/domain/events/event-handler'
import { UserCreatedEvent } from '@/modules/identity/domain/events/user-created-event'
import { CreateChatUserUseCase } from '../use-cases/create-user'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'

export class OnUserCreated implements EventHandler {
  constructor(private createChatUserUseCase: CreateChatUserUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.subscribe(UserCreatedEvent.name, this.handle.bind(this))
  }

  private async handle({ user }: UserCreatedEvent) {
    await this.createChatUserUseCase.execute({
      userId: user.id.toString(),
    })
  }
}
