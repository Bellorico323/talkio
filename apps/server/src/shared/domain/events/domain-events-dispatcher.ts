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
  // Mantemos a lógica de "Unit of Work" aqui
  private static markedAggregates: AggregateRoot<unknown>[] = []

  // Guardamos as instâncias das implementações concretas
  private static publisher: EventPublisher = new NullImplementation()
  private static subscriber: EventSubscriber = new NullImplementation()

  /**
   * Método de inicialização. Deve ser chamado no entrypoint da aplicação.
   */
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
      // 1. Dispara os eventos do agregado
      aggregate.domainEvents.forEach((event) => this.publisher.publish(event))
      // 2. Limpa os eventos do agregado
      aggregate.clearEvents()
      // 3. Remove o agregado da lista
      this.removeAggregateFromMarkedDispatchList(aggregate)
    }
  }

  /**
   * Renomeado de 'register' para 'subscribe'.
   * Delega a inscrição para a implementação concreta.
   */
  public static subscribe<T extends DomainEvent>(
    eventName: string,
    callback: DomainEventCallback<T>
  ): void {
    this.subscriber.subscribe(eventName, callback)
  }

  // Métodos privados para gerenciar 'markedAggregates' continuam os mesmos...
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
