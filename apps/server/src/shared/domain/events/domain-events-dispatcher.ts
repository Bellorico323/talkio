import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { EventPublisher } from './event-publisher'
import { DomainEventCallback, EventSubscriber } from './event-subscriber'
import { DomainEvent } from './domain-event'

// Classe "morta" para segurança caso a inicialização não ocorra
class NullImplementation implements EventPublisher, EventSubscriber {
  subscribe() {}
  publish() {}
}

export class DomainEvents {
  private static markedAggregates: AggregateRoot<unknown>[] = []

  private static publisher: EventPublisher = new NullImplementation()
  private static subscriber: EventSubscriber = new NullImplementation()

  public static initialize(
    publisher: EventPublisher,
    subscriber: EventSubscriber
  ): void {
    this.publisher = publisher
    this.subscriber = subscriber
  }

  public static markAggregateForDispatch(
    aggregate: AggregateRoot<unknown>
  ): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)
    if (!aggregateFound) {
      this.markedAggregates.push(aggregate)
    }
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id)
    if (aggregate) {
      aggregate.domainEvents.forEach((event) => this.publisher.publish(event))

      aggregate.clearEvents()

      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  public static subscribe<T extends DomainEvent>(
    eventName: string,
    callback: DomainEventCallback<T>
  ): void {
    this.subscriber.subscribe(eventName, callback)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>
  ): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))
    this.markedAggregates.splice(index, 1)
  }
}
