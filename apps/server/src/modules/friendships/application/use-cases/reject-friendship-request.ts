import { Either, left, right } from '@/shared/domain/either'
import { FriendshipsRepository } from '../repositories/friendships-repository'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { NotAllowedError } from '@/shared/domain/errors/not-allowed-error'
import { DomainEvents } from '@/shared/domain/events/domain-events-dispatcher'
import { Friendship } from '../../domain/entities/friendship'

interface RejectFriendshipRequestUseCaseRequest {
  userId: string
  friendshipId: string
}

type RejectFriendshipRequestUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    friendship: Friendship
  }
>

export class RejectFriendshipRequestUseCase {
  constructor(private friendshipsRepository: FriendshipsRepository) {}

  async execute({
    userId,
    friendshipId,
  }: RejectFriendshipRequestUseCaseRequest): Promise<RejectFriendshipRequestUseCaseResponse> {
    const friendship = await this.friendshipsRepository.findById(friendshipId)

    if (!friendship) {
      return left(new ResourceNotFoundError())
    }

    if (friendship.addresseeId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    friendship.reject()

    await this.friendshipsRepository.remove(friendship.id.toString())

    DomainEvents.dispatchEventsForAggregate(friendship.id)

    return right({
      friendship,
    })
  }
}
