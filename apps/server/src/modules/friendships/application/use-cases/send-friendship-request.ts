import { Either, left, right } from '@/shared/domain/either'
import { FriendshipsRepository } from '../repositories/friendships-repository'
import { FriendShip } from '../../domain/entities/friendship'
import { FriendshipToYourselfError } from './errors/friendship-to-yourself-error'
import { FriendShipAlreadyExistsError } from './errors/friendship-already-exists-error'
import { UniqueEntityID } from '@/shared/domain/entities/unique-entity-id'

interface SendFriendshipRequestUseCaseRequest {
  requesterId: string
  addresseeId: string
}

type SendFriendshipRequestUseCaseResponse = Either<
  FriendshipToYourselfError | FriendShipAlreadyExistsError,
  {
    friendship: FriendShip
  }
>

export class SendFriendshipRequestUseCase {
  constructor(private friendshipsRepository: FriendshipsRepository) {}

  async execute({
    requesterId,
    addresseeId,
  }: SendFriendshipRequestUseCaseRequest): Promise<SendFriendshipRequestUseCaseResponse> {
    if (requesterId === addresseeId) {
      return left(new FriendshipToYourselfError())
    }

    const existingFriendship =
      await this.friendshipsRepository.findBetweenUsers(
        requesterId,
        addresseeId
      )

    if (existingFriendship) {
      left(new FriendShipAlreadyExistsError())
    }

    const friendship = FriendShip.create({
      requesterId: new UniqueEntityID(requesterId),
      addresseeId: new UniqueEntityID(addresseeId),
    })

    await this.friendshipsRepository.create(friendship)

    return right({
      friendship,
    })
  }
}
