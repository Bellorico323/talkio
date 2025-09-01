import { DomainEvent } from './domain-event'

export type DomainEventCallback<T extends DomainEvent> = (event: T) => void

export interface EventSubscriber {
  subscribe<T extends DomainEvent>(
    eventName: string,
    callback: DomainEventCallback<T>
  ): void
}
