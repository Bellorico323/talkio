import { DomainEvent } from './domain-event'
import { EventPublisher } from './event-publisher'
import { DomainEventCallback, EventSubscriber } from './event-subscriber'

export class InMemoryEventBus implements EventPublisher, EventSubscriber {
  private readonly handlersMap: Record<string, DomainEventCallback<any>[]> = {}

  public subscribe<T extends DomainEvent>(
    eventName: string,
    callback: DomainEventCallback<T>
  ): void {
    if (!this.handlersMap[eventName]) {
      this.handlersMap[eventName] = []
    }
    this.handlersMap[eventName].push(callback)
  }

  public publish(event: DomainEvent): void {
    const eventName = event.constructor.name
    const handlers = this.handlersMap[eventName]

    if (handlers) {
      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
