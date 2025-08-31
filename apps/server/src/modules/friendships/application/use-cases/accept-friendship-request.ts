import { Either, left, right } from '@/shared/domain/either'
import { FriendshipsRepository } from '../repositories/friendships-repository'
import { FriendShip } from '../../domain/entities/friendship'
import { ResourceNotFoundError } from '@/shared/domain/errors/resource-not-found-error'
import { NotAllowedError } from '@/shared/domain/errors/not-allowed-error'

interface AcceptFriendshipRequestUseCaseRequest {
  userId: string
  friendshipId: string
}

type AcceptFriendshipRequestUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    friendship: FriendShip
  }
>

export class AcceptFriendshipRequestUseCase {
  constructor(private friendshipsRepository: FriendshipsRepository) {}

  async execute({
    userId,
    friendshipId,
  }: AcceptFriendshipRequestUseCaseRequest): Promise<AcceptFriendshipRequestUseCaseResponse> {
    const friendship = await this.friendshipsRepository.findById(friendshipId)

    if (!friendship) {
      return left(new ResourceNotFoundError())
    }

    if (friendship.addresseeId.toString() !== userId) {
      return left(new NotAllowedError())
    }

    friendship.accept()

    await this.friendshipsRepository.save(friendship)

    return right({
      friendship,
    })
  }
}
